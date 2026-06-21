const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // الاتصال بـ MongoDB باستخدام الرابط المخفي في ملف .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`>>MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`>>Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // إيقاف السيرفر لو حصل مشكلة في الاتصال
  }
};

module.exports = connectDB;