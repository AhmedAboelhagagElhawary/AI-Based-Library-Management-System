const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');

// استدعاء المتغيرات البيئية
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Database for Seeding...');

    const adminEmail = 'ugs.14587@ci.suez.edu.eg'; // إيميل الأدمن الافتراضي

    // التأكد إن الأدمن مش موجود قبل كده
    const existingAdmin = await User.findOne({ academicEmail: adminEmail });
    if (existingAdmin) {
      console.log('⚠️ Super Admin already exists in the database.');
      process.exit();
    }

    // تشفير كلمة المرور الافتراضية
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@2026', salt);

    // إنشاء حساب الأدمن
    await User.create({
      fullName: 'Super Admin',
      academicEmail: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true, // متفعل جاهز عشان ميبعتش OTP لنفسه في أول مرة
      academicYear: 'Fourth', 
      department: 'General'
    });

    console.log('🎉 Super Admin created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: Admin@2026');
    process.exit();

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();