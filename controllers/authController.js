const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../utils/responseHandler');

const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../services/emailService');

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

    const userExists = await User.findOne({ academicEmail });
    if (userExists) {
      return sendResponse(res, 400, false, 'هذا البريد الأكاديمي مسجل بالفعل');
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 15);

    // تجهيز اليوزر في الذاكرة المؤقتة (Memory) بدون حفظ
    const newUser = new User({
      fullName,
      academicEmail,
      personalEmail,
      phoneNumber,
      password: hashedPassword,
      academicYear,
      department,
      role: 'student', 
      otpCode: otpCode,
      otpExpires: otpExpires
    });

    // نحاول نبعت الإيميل الأول
    await sendOTPEmail(academicEmail, otpCode);

    // لو الإيميل اتبعت بنجاح (مفيش Error)، نحفظ في قاعدة البيانات
    await newUser.save();

    // إخفاء البيانات الحساسة
    newUser.password = undefined; 
    newUser.otpCode = undefined;    
    newUser.otpExpires = undefined; 

    return sendResponse(res, 201, true, 'تم التسجيل بنجاح، يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب باستخدام الـ OTP', newUser);

  } catch (error) {
    // لو حصل خطأ في الإيميل، هنرد بالخطأ والداتابيز هتفضل نظيفة ومفيهاش اليوزر ده
    return sendResponse(res, 500, false, 'حدث خطأ أثناء التسجيل', error.message);
  }
};

// ... (دالة verifyOTP زي ما هي مفيهاش تغيير)

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