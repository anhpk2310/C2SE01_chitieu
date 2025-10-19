const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

// 👈 1. Kích hoạt dotenv ngay tại đây để tải biến môi trường
dotenv.config();

// Import các file cấu hình và routes
const connectDB = require('./src/config/db');
const authRoutes = require('./src/api/authRoutes');

// 👈 2. Yêu cầu app chạy file cấu hình passport (sau khi đã có biến môi trường)
require('./src/config/passport')(passport);

// Kết nối tới MongoDB
connectDB();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware của Express để đọc được dữ liệu JSON từ các request
app.use(express.json());

// --- Cấu hình Passport ---
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// --- Kết thúc cấu hình Passport ---

// Sử dụng authRoutes
app.use('/api/auth', authRoutes);

// Route thử nghiệm
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Chào mừng đến với API của ứng dụng Chi Tiêu!',
  });
});

// Lấy cổng (PORT)
const PORT = process.env.PORT || 3000;

// Lắng nghe các kết nối đến server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});