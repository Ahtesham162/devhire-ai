const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeFilename: {
    type: String,
  },
  resumeText: {
    type: String,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  ats_score: {
    type: Number,
    required: true,
  },
  matched_keywords: [String],
  missing_keywords: [String],
  skill_gaps: [String],
  suggestions: [String],
  coverLetter: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);