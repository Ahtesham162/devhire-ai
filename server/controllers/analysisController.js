const { analyzeResumeWithAI } = require('../services/aiService');

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'resumeText and jobDescription are required' });
    }

    const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

    res.json({
      message: 'Analysis complete',
      analysis,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to analyze resume', error: err.message });
  }
};