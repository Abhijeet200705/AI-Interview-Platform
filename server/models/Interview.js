const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  topic: { type: String },
  isFollowUp: { type: Boolean, default: false },
  answer: { type: String },
  answeredAt: { type: Date },
}, { _id: true });

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['technical', 'hr', 'aptitude', 'coding'], required: true },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  questions: [questionSchema],
  violations: [{
    type: { type: String, enum: ['tab_switch', 'fullscreen_exit'] },
    timestamp: { type: Date, default: Date.now },
  }],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);