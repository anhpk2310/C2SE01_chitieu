// src/controllers/userController.js

const User = require('../models/userModel');

// @desc   Cập nhật thông tin profile của người dùng
// @route  PUT /api/users/profile
// @access Private (cần đăng nhập)
const updateUserProfile = async (req, res) => {
  // Middleware đã lấy thông tin user và gắn vào req.user
  const user = await User.findById(req.user._id);

  if (user) {
    user.displayName = req.body.displayName || user.displayName;
    user.profession = req.body.profession || user.profession;
    user.usageReason = req.body.usageReason || user.usageReason;
    user.isProfileComplete = true; // Đánh dấu là đã hoàn tất thiết lập

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      profession: updatedUser.profession,
      usageReason: updatedUser.usageReason,
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};

module.exports = { updateUserProfile };