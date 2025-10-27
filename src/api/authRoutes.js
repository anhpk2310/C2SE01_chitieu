// src/api/authRoutes.js (Phiên bản CHUẨN - Phải dùng bản này)

const express = require('express');
const passport = require('passport');
const router = express.Router();
// Import đầy đủ các hàm từ controller
const { googleCallback, getProfile, logout, googleMobileSignIn } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware bảo vệ



// === HÀM MỚI CHO FLUTTER ===
// @desc    Endpoint cho Flutter gửi idToken lên
// @route   POST /api/auth/google/mobile
router.post('/google/mobile', googleMobileSignIn);



// @desc    Bắt đầu quá trình xác thực với Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false // Không dùng session
}));

// @desc    Google gọi lại sau khi xác thực thành công
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed', // Địa chỉ nếu thất bại
    session: false // Không dùng session
  }),
  googleCallback // *** GỌI HÀM XỬ LÝ ĐÚNG TỪ CONTROLLER ***
);

// @desc    Lấy thông tin profile của người dùng đã đăng nhập
// @route   GET /api/auth/profile
// @access  Private (Cần JWT Token)
router.get('/profile', protect, getProfile); // Thêm middleware 'protect'

// @desc    Đăng xuất người dùng
// @route   GET /api/auth/logout
router.get('/logout', logout);

module.exports = router;

  // // @desc    Bắt đầu quá trình xác thực với Google
  // // @route   GET /api/auth/google
  // router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // // @desc    Google gọi lại sau khi xác thực thành công
  // // @route   GET /api/auth/google/callback
  // router.get(
  //   '/google/callback',
  //   passport.authenticate('google', { failureRedirect: '/login-failed' }), // Nếu thất bại, chuyển hướng đến một trang lỗi (tạm)
  //   (req, res) => {
  //     // Đăng nhập thành công, chuyển hướng người dùng đến trang profile để xem kết quả
  //     res.redirect('/api/auth/profile');
  //   }
  // );

  // // @desc    Lấy thông tin profile của người dùng đã đăng nhập
  // // @route   GET /api/auth/profile
  // router.get('/profile', getProfile);

  // // @desc    Đăng xuất người dùng
  // // @route   GET /api/auth/logout
  // router.get('/logout', logout);

  // module.exports = router;

