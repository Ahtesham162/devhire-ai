const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { analyzeResume } = require('../controllers/analysisController');

router.post('/analyze', authMiddleware, analyzeResume);

module.exports = router;