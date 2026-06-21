const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assetType: { type: String, enum: ['Book', 'Exam', 'Project'], required: true },
  description: { type: String },
  academicMajor: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  projectBannerUrl: { type: String },
  author: { type: String },
  language: { type: String, default: 'English' },
  courseCode: { type: String },
  examType: { type: String, enum: ['Finals', 'Midterms', 'Quizzes'] },
  teamMembers: [{ type: String }],
  supervisors: { type: String },
  graduationYear: { type: String },
  githubLink: { type: String },
  vectorEmbedding: { type: [Number], select: false }
}, { timestamps: true });

assetSchema.index({ title: 'text', description: 'text' });
assetSchema.index({ courseCode: 1, academicMajor: 1, assetType: 1 });

module.exports = mongoose.model('Asset', assetSchema);