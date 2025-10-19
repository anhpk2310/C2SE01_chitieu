// ...existing code...
const mongoose = require('mongoose');

const connectDB = async () => {
  let conn;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in env');
    process.exit(1);
  }

  try {
    conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Đã kết nối thành công tới MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Lỗi kết nối MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
// ...existing code...

