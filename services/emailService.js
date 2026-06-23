const nodemailer = require('nodemailer');

// دالة بتاخد إيميل الطالب، والـ OTP اللي تولد، وبتبعتهم
const sendOTPEmail = async (academicEmail, otpCode) => {
  try {
    // 1. إعداد السيرفر المسؤول عن الإرسال (Transporter)
    // هنا بنعرفه الحساب اللي هيقوم بالإرسال وباسوورده (متخزنين في الـ .env للأمان)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // لو هتستخدم جيميل للتجربة، أو غيّرها حسب رغبتك لـ outlook
      auth: {
        user: process.env.EMAIL_USER, // إيميلك اللي هيبعت
        pass: process.env.EMAIL_PASS  // باسورد التطبيق (App Password) مش الباسورد العادي
      }
    });

    // 2. تجهيز محتوى الرسالة وشكلها
    const mailOptions = {
      from: `"مكتبتي - ذكاء اصطناعي" <${process.env.EMAIL_USER}>`,
      to: academicEmail, // إيميل الطالب المستلم
      subject: 'تفعيل حسابك في تطبيق مكتبتي - رمز التحقق (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
          <h2>مرحباً بك في منصة مكتبتي الأكاديمية</h2>
          <p>شكراً لتسجيلك معنا. يرجى استخدام رمز التحقق التالي لتفعيل حسابك:</p>
          <h1 style="color: #4CAF50; letter-spacing: 2px;">${otpCode}</h1>
          <p>هذا الرمز صالح لمدة 15 دقيقة فقط.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا الإيميل.</p>
        </div>
      `
    };

    // 3. الأمر الفعلي لإرسال الإيميل
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to: ${academicEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('فشل في إرسال بريد التحقق الإلكتروني');
  }
};

module.exports = { sendOTPEmail };