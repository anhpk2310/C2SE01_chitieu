// cap2_chitieu/src/controllers/authController.js (Đã sửa)

const jwt = require('jsonwebtoken');

// Xử lý sau khi đăng nhập Google thành công
exports.googleCallback = (req, res) => {
  // Passport đã xác thực thành công và gắn thông tin user vào req.user
  const user = req.user;

  // 1. Tạo Payload cho JWT (thông tin muốn lưu trong token)
  const payload = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    photo: user.photo,
  };

  // 2. Ký và tạo Token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  // 3. Chuẩn bị dữ liệu người dùng để gửi đi
  // Chúng ta cần biến object thành một chuỗi JSON, sau đó mã hóa để an toàn khi gửi qua URL
  const userJsonString = JSON.stringify(payload);
  const encodedUser = encodeURIComponent(userJsonString);

  // 4. CHUYỂN HƯỚNG VỀ APP FLUTTER
  // Đây là bước quan trọng nhất. Server sẽ chuyển hướng về "địa chỉ bí mật"
  // của app, gửi kèm cả token và thông tin người dùng.
  res.redirect(`chitieu://auth-callback?token=${token}&user=${encodedUser}`);
};


// Lấy thông tin người dùng (sẽ cần token để truy cập sau này)
exports.getProfile = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      user: req.user
    });
  } else {
    res.status(401).json({ message: 'Chưa đăng nhập' });
  }
};


// Xử lý đăng xuất
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  });
};

// Xuất các hàm để authRoutes có thể sử dụng
module.exports = {
  googleCallback,
  getProfile,
  logout,
};