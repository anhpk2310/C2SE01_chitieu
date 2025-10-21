// src/api/userRoutes.js

const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Áp dụng "người bảo vệ" cho route này
// Bất kỳ ai muốn truy cập '/profile' đều phải gửi token hợp lệ
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;