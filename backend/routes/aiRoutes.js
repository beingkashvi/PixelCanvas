const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/aiController');

// POST /api/ai/generate-image
router.post('/generate-image', generateImage);

module.exports = router;