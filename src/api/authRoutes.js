const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getProfile, logout } = require('../controllers/authController');

// @desc    Bắt đầu quá trình xác thực với Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google gọi lại sau khi xác thực thành công
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }), // Nếu thất bại, chuyển hướng đến một trang lỗi (tạm)
  (req, res) => {
    // Đăng nhập thành công, chuyển hướng người dùng đến trang profile để xem kết quả
    res.redirect('/api/auth/profile');
  }
);

// @desc    Lấy thông tin profile của người dùng đã đăng nhập
// @route   GET /api/auth/profile
router.get('/profile', getProfile);

// @desc    Đăng xuất người dùng
// @route   GET /api/auth/logout
router.get('/logout', logout);

module.exports = router;

