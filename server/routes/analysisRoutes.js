const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { analyzeResume, getAnalyses, getAnalysisById, deleteAnalysis } = require('../controllers/analysisController');

router.post('/analyze', authMiddleware, analyzeResume);
router.get('/analyses', authMiddleware, getAnalyses);
router.get('/analyses/:id', authMiddleware, getAnalysisById);
router.delete('/analyses/:id', authMiddleware, deleteAnalysis);

module.exports = router;