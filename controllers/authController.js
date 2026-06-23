const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../utils/responseHandler');

// استدعاء دوال الـ OTP والإيميل
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../services/emailService');

exports.registerUser = async (req, res) => {
  try {
    // 1. استلام البيانات المسموح بيها بس من الواجهة
    const { 
      fullName, 
      academicEmail, 
      personalEmail, // تمت الإضافة بناءً على واجهة الموبايل
      phoneNumber,   // تمت الإضافة بناءً على واجهة الموبايل
      password, 
      academicYear, 
      department 
    } = req.body;

    const userExists = await User.findOne({ academicEmail });
    if (userExists) {
      return sendResponse(res, 400, false, 'هذا البريد الأكاديمي مسجل بالفعل');
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    // توليد الـ OTP وتحديد وقت الانتهاء
    const otpCode = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 15);

    // 2. حفظ المستخدم مع إجبار الدور كطالب لحماية النظام
    const newUser = await User.create({
      fullName,
      academicEmail,
      personalEmail,
      phoneNumber,
      password: hashedPassword,
      academicYear,
      department,
      role: 'student', // <-- أمان: تحديد الدور كطالب بشكل إجباري
      otpCode: otpCode,
      otpExpires: otpExpires
    });

    // إرسال الإيميل
    await sendOTPEmail(academicEmail, otpCode);

    // إخفاء البيانات الحساسة من الرد (Security Fix)
    newUser.password = undefined; 
    newUser.otpCode = undefined;    // إخفاء كود الـ OTP
    newUser.otpExpires = undefined; // إخفاء وقت انتهاء الـ OTP

    return sendResponse(res, 201, true, 'تم التسجيل بنجاح، يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب باستخدام الـ OTP', newUser);

  } catch (error) {
    return sendResponse(res, 500, false, 'حدث خطأ أثناء التسجيل', error.message);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // 1. استلام الإيميل والرمز من الواجهة
    const { academicEmail, otpCode } = req.body;

    // 2. البحث عن المستخدم بالإيميل
    const user = await User.findOne({ academicEmail });
    if (!user) {
      return sendResponse(res, 404, false, 'المستخدم غير موجود');
    }

    // 3. التأكد إن الحساب مش متفعل أصلاً عشان نتجنب التكرار
    if (user.isVerified) {
      return sendResponse(res, 400, false, 'الحساب مفعل بالفعل');
    }

    // 4. التأكد من صحة الرمز
    if (user.otpCode !== otpCode) {
      return sendResponse(res, 400, false, 'رمز التحقق غير صحيح');
    }

    // 5. التأكد إن الرمز لسة صالح (معداش عليه 15 دقيقة)
    if (user.otpExpires < new Date()) {
      return sendResponse(res, 400, false, 'رمز التحقق منتهي الصلاحية، يرجى طلب رمز جديد');
    }

    // 6. لو كل حاجة تمام، نفعل الحساب ونمسح الرمز القديم للأمان
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save(); // حفظ التعديلات في الداتابيز

    return sendResponse(res, 200, true, 'تم تفعيل الحساب بنجاح');

  } catch (error) {
    return sendResponse(res, 500, false, 'حدث خطأ أثناء تفعيل الحساب', error.message);
  }
};