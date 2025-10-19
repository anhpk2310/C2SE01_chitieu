// Import các thư viện cần thiết
const jwt = require('jsonwebtoken');

// @desc    Xử lý sau khi Google xác thực thành công và tạo JWT
// @logic   Được gọi bởi route /google/callback
const googleCallback = (req, res) => {
  // Passport đã xác thực thành công và gắn thông tin user vào req.user
  // req.user chính là người dùng đã được tìm thấy hoặc tạo mới từ database

  // 1. Tạo Payload cho JWT (thông tin muốn lưu trong token)
  const payload = {
    id: req.user.id,
    displayName: req.user.displayName,
    email: req.user.email,
  };

  // 2. Ký và tạo Token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // Lấy chìa khóa bí mật từ file .env
    { expiresIn: '30d' }    // Token hết hạn sau 30 ngày
  );

  // 3. TODO: Chuyển hướng người dùng về ứng dụng Flutter với token
  // Ở giai đoạn này, chúng ta sẽ tạm thời gửi token về dạng JSON để kiểm tra
  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công, nhận token!",
    token: token,
    user: payload
  });
};


// @desc    Lấy thông tin người dùng đã đăng nhập (cần được bảo vệ bằng JWT sau này)
// @route   GET /api/auth/profile
const getProfile = (req, res) => {
  // Hiện tại, req.user vẫn được lấy từ session để kiểm tra luồng cơ bản.
  // Sau này, chúng ta sẽ lấy thông tin từ token đã được giải mã.
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Chưa được xác thực. Vui lòng đăng nhập.',
    });
  }
};

// @desc    Đăng xuất người dùng
// @route   GET /api/auth/logout
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); // Chuyển lỗi cho Express xử lý
    }
    // Trong hệ thống JWT, logout chủ yếu xử lý ở client (xóa token)
    // Server chỉ cần báo thành công.
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  });
};

// Xuất khẩu tất cả các hàm để authRoutes có thể sử dụng
module.exports = {
  googleCallback,
  getProfile,
  logout,
};

