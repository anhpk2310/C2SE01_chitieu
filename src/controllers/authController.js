const jwt = require('jsonwebtoken');

// --- ĐỊNH NGHĨA CÁC HÀM DƯỚI DẠNG HẰNG SỐ ---

// Xử lý sau khi đăng nhập Google thành công
const googleCallback = (req, res) => {
  const user = req.user;
  const payload = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    photo: user.photo,
  };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  console.log('✅ Token được tạo:', token);

  const userJsonString = JSON.stringify(payload);
  const encodedUser = encodeURIComponent(userJsonString);

  // Chuyển hướng về app Flutter với "địa chỉ bí mật" là 'chitieu'
  res.redirect(`chitieu://auth-callback?token=${token}&user=${encodedUser}`);
};


// Lấy thông tin người dùng (sẽ cần token để truy cập sau này)
const getProfile = (req, res) => {
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
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  });
};


// --- "ĐÓNG GÓI" VÀ GỬI ĐI MỘT LẦN DUY NHẤT Ở CUỐI FILE ---
module.exports = {
  googleCallback,
  getProfile,
  logout,
};

