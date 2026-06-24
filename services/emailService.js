const nodemailer = require('nodemailer');

const sendOTPEmail = async (academicEmail, otpCode) => {
  try {
    // استخدمنا متغيرات البيئة عشان نقدر نغير السيرفر من Railway بسهولة
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"مكتبتي" <${process.env.EMAIL_USER}>`,
      to: academicEmail,
      subject: 'تفعيل حسابك في تطبيق مكتبتي - رمز التحقق (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #2b5876; text-align: center;">مرحباً بك في منصة مكتبتي الأكاديمية</h2>
          <p>شكراً لتسجيلك معنا في النظام. يرجى استخدام رمز التحقق التالي لتفعيل حسابك:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #f4f6f9; color: #4e54c8; font-size: 32px; font-weight: bold; padding: 10px 30px; border-radius: 5px; letter-spacing: 5px; border: 1px dashed #4e54c8;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #ff4d4d; font-size: 14px;">ملاحظة: هذا الرمز صالح لمدة 15 دقيقة فقط من تاريخ إصداره.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] OTP sent successfully to: ${academicEmail}`);
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    throw new Error('فشل في إرسال بريد التحقق الإلكتروني، يرجى التحقق من إعدادات السيرفر');
  }
};

module.exports = { sendOTPEmail };