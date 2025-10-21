// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Lấy token ra khỏi header (loại bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 2. Giải mã token để lấy ID người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Lấy thông tin người dùng từ database (trừ mật khẩu) và gắn vào request
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Đi tiếp đến xử lý tiếp theo
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không được ủy quyền, token thất bại' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không được ủy quyền, không có token' });
  }
};

module.exports = { protect };