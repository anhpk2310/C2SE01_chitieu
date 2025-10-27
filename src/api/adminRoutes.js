// src/api/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/adminController'); // Import từ adminController
const { protect } = require('../middleware/authMiddleware'); // Vẫn cần middleware bảo vệ

// @desc    Lấy danh sách tất cả người dùng
// @route   GET /api/admin/users
// @access  Private (Sau này thêm check Admin)
router.route('/users').get(protect, getAllUsers);

// Thêm các route quản trị khác vào đây sau này

module.exports = router;