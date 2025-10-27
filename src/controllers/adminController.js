// src/controllers/adminController.js

const User = require('../models/userModel');

// @desc   Lấy danh sách tất cả người dùng
// @route  GET /api/admin/users
// @access Private (Sau này nên thêm kiểm tra quyền Admin)
const getAllUsers = async (req, res) => {
  try {
    // Sử dụng User model để tìm tất cả user trong database
    const users = await User.find({}); 
    res.status(200).json(users); // Gửi danh sách user về dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng (Admin):', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// --- "ĐÓNG GÓI" VÀ GỬI ĐI ---
module.exports = {
  getAllUsers,
  // Thêm các hàm quản trị khác vào đây sau này
};