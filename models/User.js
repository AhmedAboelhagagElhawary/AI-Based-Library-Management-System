const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  academicEmail: { type: String, required: true, unique: true },
  personalEmail: { type: String },
  phoneNumber: { type: String },
  academicYear: { type: String, enum: ['First', 'Second', 'Third', 'Fourth'] },
  department: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpires: { type: Date },
  bookmarkedAssets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);