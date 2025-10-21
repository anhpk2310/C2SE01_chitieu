// src/models/userModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  // THÊM CÁC TRƯỜNG MỚI
  profession: { // Nghề nghiệp
    type: String,
  },
  usageReason: { // Lý do sử dụng
    type: String,
  },
  isProfileComplete: { // Cờ để biết người dùng đã hoàn tất thiết lập chưa
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

module.exports = User;