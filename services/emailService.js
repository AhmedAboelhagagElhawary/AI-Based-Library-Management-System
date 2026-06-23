const nodemailer = require('nodemailer');

const sendOTPEmail = async (academicEmail, otpCode) => {
  try {
    // التعديل هنا: استخدمنا host و port صريحين بدل كلمة service
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,          // البورت الآمن الخاص بجوجل
      secure: true,       // تفعيل التشفير
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // السطر ده بيمنع تعليق السيرفر (بيخليها لو فشلت ترمي Error فوراً بدل ما تفضل تحمل)
      connectionTimeout: 10000 
    });

    const mailOptions = {
      from: `"مكتبتي - ذكاء اصطناعي" <${process.env.EMAIL_USER}>`,
      to: academicEmail,
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

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to: ${academicEmail}`);
  } catch (error) {
    console.error(`Nodemailer Error: ${error.message}`);
    throw new Error('فشل في إرسال بريد التحقق الإلكتروني');
  }
};

module.exports = { sendOTPEmail };