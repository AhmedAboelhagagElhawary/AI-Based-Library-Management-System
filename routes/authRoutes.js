const express = require('express');
const router = express.Router();
// استدعاء الدوال من الـ Controller
const { registerUser, verifyOTP } = require('../controllers/authController');

// مسار التسجيل: /api/v1/auth/register
router.post('/register', registerUser);

// مسار التفعيل: /api/v1/auth/verify-otp
router.post('/verify-otp', verifyOTP); // <--- المسار الجديد

module.exports = router;