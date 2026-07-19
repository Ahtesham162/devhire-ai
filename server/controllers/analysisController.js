const { analyzeResumeWithAI, generateCoverLetter } = require('../services/aiService');
const Analysis = require('../models/Analysis');

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription, resumeFilename } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'resumeText and jobDescription are required' });
    }

    const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

    const savedAnalysis = await Analysis.create({
      userId: req.userId,
      resumeFilename: resumeFilename || 'resume.pdf',
      resumeText,
      jobDescription,
      ats_score: analysis.ats_score,
      matched_keywords: analysis.matched_keywords,
      missing_keywords: analysis.missing_keywords,
      skill_gaps: analysis.skill_gaps,
      suggestions: analysis.suggestions,
    });

    res.json({
      message: 'Analysis complete',
      analysis: savedAnalysis,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to analyze resume', error: err.message });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analyses', error: err.message });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: err.message });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json({ message: 'Analysis deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete analysis', error: err.message });
  }
};



exports.generateCoverLetterForAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const coverLetter = await generateCoverLetter(analysis.resumeText, analysis.jobDescription);

    analysis.coverLetter = coverLetter;
    await analysis.save();

    res.json({ message: 'Cover letter generated', coverLetter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate cover letter', error: err.message });
  }
};