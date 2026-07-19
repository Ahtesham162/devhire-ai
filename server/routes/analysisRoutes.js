const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  analyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
  generateCoverLetterForAnalysis,
} = require('../controllers/analysisController');

router.post('/analyze', authMiddleware, analyzeResume);
router.get('/analyses', authMiddleware, getAnalyses);
router.get('/analyses/:id', authMiddleware, getAnalysisById);
router.delete('/analyses/:id', authMiddleware, deleteAnalysis);
router.post('/analyses/:id/cover-letter', authMiddleware, generateCoverLetterForAnalysis);

module.exports = router;