const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  lastPageViewed: { type: Number, default: 1 },
  progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ReadingSession', readingSessionSchema);