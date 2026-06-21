const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. تحميل المتغيرات المخفية
dotenv.config();

// 2. الاتصال بقاعدة البيانات
connectDB();

// 3. تهيئة تطبيق Express
const app = express();

// 4. تفعيل الـ Middlewares الأساسية
app.use(cors()); // عشان يسمح للويب والموبايل يكلموا السيرفر
app.use(express.json()); // عشان السيرفر يفهم البيانات اللي جاية بصيغة JSON

// 5. مسار تجريبي (Test Route) عشان نتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.send('Maktabti API is running...');
});

// 6. تشغيل السيرفر على البورت المحدد
JavaScript
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});