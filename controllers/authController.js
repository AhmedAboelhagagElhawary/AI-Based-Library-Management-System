const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../utils/responseHandler');

const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../services/emailService');

// 1. مسار إنشاء حساب طالب جديد
exports.registerUser = async (req, res) => {
  try {
    const { 
      fullName, 
      academicEmail, 
      personalEmail, 
      phoneNumber,   
      password, 
      academicYear, 
      department 
    } = req.body;

    // التأكد من عدم تكرار الحساب
    const userExists = await User.findOne({ academicEmail });
    if (userExists) {
      return sendResponse(res, 400, false, 'هذا البريد الأكاديمي مسجل بالفعل');
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    // توليد بيانات الـ OTP
    const otpCode = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 15);

    // تجهيز بيانات المستخدم في الذاكرة المؤقتة (بدون حفظ في الداتابيز حتى الآن)
    const newUser = new User({
      fullName,
      academicEmail,
      personalEmail,
      phoneNumber,
      password: hashedPassword,
      academicYear,
      department,
      role: 'student', // إجبار الدور لحماية المنظومة
      otpCode: otpCode,
      otpExpires: otpExpires
    });

    // محاولة إرسال الإيميل أولاً
    await sendOTPEmail(academicEmail, otpCode);

    // إذا نجح الإيميل، يتم الحفظ الفعلي في الداتابيز
    await newUser.save();

    // إخفاء البيانات الحساسة قبل إرجاع الرد للواجهة
    newUser.password = undefined; 
    newUser.otpCode = undefined;    
    newUser.otpExpires = undefined; 

    return sendResponse(res, 201, true, 'تم التسجيل بنجاح، يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب باستخدام الـ OTP', newUser);

  } catch (error) {
    // في حال فشل الإيميل، لن يتم حفظ المستخدم وتظل قاعدة البيانات نظيفة
    return sendResponse(res, 500, false, 'حدث خطأ أثناء التسجيل لم يتم إرسال كود التفعيل', error.message);
  }
};

// 2. مسار تفعيل الحساب باستخدام الـ OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { academicEmail, otpCode } = req.body;

    const user = await User.findOne({ academicEmail });
    if (!user) {
      return sendResponse(res, 404, false, 'المستخدم غير موجود');
    }

    if (user.isVerified) {
      return sendResponse(res, 400, false, 'الحساب مفعل بالفعل');
    }

    if (user.otpCode !== otpCode) {
      return sendResponse(res, 400, false, 'رمز التحقق غير صحيح');
    }

    if (user.otpExpires < new Date()) {
      return sendResponse(res, 400, false, 'رمز التحقق منتهي الصلاحية، يرجى طلب رمز جديد');
    }

    // تفعيل الحساب وتنظيف حقول التحقق
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save(); 

    return sendResponse(res, 200, true, 'تم تفعيل الحساب بنجاح');

  } catch (error) {
    return sendResponse(res, 500, false, 'حدث خطأ أثناء تفعيل الحساب', error.message);
  }
};