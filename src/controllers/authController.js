

// const jwt = require('jsonwebtoken');

// // --- ĐỊNH NGHĨA CÁC HÀM DƯỚI DẠNG HẰNG SỐ ---

// // Xử lý sau khi đăng nhập Google thành công
// const googleCallback = (req, res) => {
//   const user = req.user;
//   const payload = {
//     id: user.id,
//     displayName: user.displayName,
//     email: user.email,
//     photo: user.photo,
//   };
//   const token = jwt.sign(
//     payload,
//     process.env.JWT_SECRET,
//     { expiresIn: '30d' }
//   );
  
//   console.log('✅ Token được tạo:', token , );

//   const userJsonString = JSON.stringify(payload);
//   const encodedUser = encodeURIComponent(userJsonString);

//   console.log('✅ name :', encodedUser , );

//   // Chuyển hướng về app Flutter với "địa chỉ bí mật" là 'chitieu'
//   res.redirect(`chitieu://auth-callback?token=${token}&user=${encodedUser}`);
// };


// // Lấy thông tin người dùng (sẽ cần token để truy cập sau này)
// const getProfile = (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "Lấy thông tin người dùng thành công",
//       user: req.user
//     });
//   } else {
//     res.status(401).json({ message: 'Chưa đăng nhập' });
//   }
// };


// // Xử lý đăng xuất
// const logout = (req, res, next) => {
//   req.logout((err) => {
//     if (err) { return next(err); }
//     res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
//   });
// };


// // --- "ĐÓNG GÓI" VÀ GỬI ĐI MỘT LẦN DUY NHẤT Ở CUỐI FILE ---
// module.exports = {
//   googleCallback,
//   getProfile,
//   logout,
// };

// src/controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library'); // <-- THÊM MỚI

// Khởi tạo client cho Google Auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Hàm tạo Token (Tái sử dụng)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Bạn có thể thay đổi thời gian
  });
};

// ==========================================================
// HÀM MỚI CHO FLUTTER (Quan trọng nhất)
// ==========================================================
// @desc    Xác thực người dùng từ Google ID Token (Flutter gửi lên)
// @route   POST /api/auth/google/mobile
const googleMobileSignIn = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Không có ID token' });
  }

  try {
    // 1. Xác thực idToken với Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Đảm bảo token này dành cho app của bạn
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name: displayName, picture: photo } = payload;

    // 2. Tái sử dụng logic tìm/tạo user từ file passport-setup.js của bạn
    let user = await User.findOne({ googleId: googleId });

    if (!user) {
      // Nếu không có googleId, tìm bằng email
      user = await User.findOne({ email: email });

      if (user) {
        // Link tài khoản: tìm thấy email, cập nhật googleId
        user.googleId = googleId;
        if (!user.photo && photo) user.photo = photo;
        await user.save();
      } else {
        // Không tìm thấy user -> tạo mới
        user = await User.create({
          googleId: googleId,
          email: email,
          displayName: displayName,
          photo: photo,
          // isProfileComplete mặc định là false (từ Model)
        });
      }
    }

    // 3. Tạo JWT và trả về cho Flutter
    const token = generateToken(user._id);

    // Trả về đầy đủ thông tin user để Flutter biết có cần setup profile không
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        photo: user.photo,
        isProfileComplete: user.isProfileComplete, // <-- Cờ quan trọng
        profession: user.profession,
        usageReason: user.usageReason
      },
    });

  } catch (error) {
    console.error('Lỗi xác thực Google Mobile:', error);
    res.status(401).json({ message: 'Xác thực thất bại', error: error.message });
  }
};

// ==========================================================
// CÁC HÀM CŨ CỦA BẠN (Dành cho Web)
// ==========================================================

// @desc    Xử lý callback từ Google (cho luồng Web)
// @route   GET /api/auth/google/callback
const googleCallback = (req, res) => {
  // Hàm này được gọi sau khi passport.authenticate thành công
  const token = generateToken(req.user._id);
  
  // *** THAY DÒNG REDIRECT BẰNG DÒNG NÀY ***
  // Gửi thẳng token về trình duyệt dưới dạng JSON
  res.status(200).json({
    message: "Đăng nhập WEB thành công. Bạn có thể dùng token này để test API:",
    token: token,
    user: req.user 
  });
};

// @desc    Lấy thông tin profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  // req.user đã được middleware 'protect' gắn vào
  if (req.user) {
    res.json({
        _id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        photo: req.user.photo,
        isProfileComplete: req.user.isProfileComplete,
        profession: req.user.profession,
        usageReason: req.user.usageReason
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};

// @desc    Đăng xuất (cho web, nếu dùng cookie/session)
// @route   GET /api/auth/logout
const logout = (req, res) => {
  // Nếu dùng session/cookie
  // req.logout(); 
  // res.redirect('/');
  
  // Nếu chỉ dùng JWT, client (Flutter) chỉ cần xoá token là xong
  res.json({ message: 'Client cần xoá token để đăng xuất' });
};


module.exports = {
  googleCallback,
  getProfile,
  logout,
  googleMobileSignIn, // <-- XUẤT HÀM MỚI
};  