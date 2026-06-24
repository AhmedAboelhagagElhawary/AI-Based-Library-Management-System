const nodemailer = require('nodemailer');

const sendOTPEmail = async (academicEmail, otpCode) => {
  try {
    // إعداد الاتصال باستخدام خدمة جي ميل المباشرة
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // لتجاوز قيود الحماية المؤقتة في الداتا سنترز
      }
    });

    const mailOptions = {
      from: `"مكتبتي" <${process.env.EMAIL_USER}>`,
      to: academicEmail,
      subject: 'تفعيل حسابك في تطبيق مكتبتي - رمز التحقق (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 60px0px; margin: auto;">
          <h2 style="color: #2b5876; text-align: center;">مرحباً بك في منصة مكتبتي الأكاديمية</h2>
          <p>شكراً لتسجيلك معنا في النظام. يرجى استخدام رمز التحقق التالي لتفعيل حسابك:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #f4f6f9; color: #4e54c8; font-size: 32px; font-weight: bold; padding: 10px 30px; border-radius: 5px; letter-spacing: 5px; border: 1px dashed #4e54c8;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #ff4d4d; font-size: 14px;">ملاحظة: هذا الرمز صالح لمدة 15 دقيقة فقط من تاريخ إصداره.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.</p>
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