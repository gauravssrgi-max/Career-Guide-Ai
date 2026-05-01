const express = require('express');
const router = express.Router();
const { chat, skillGap, riskScore } = require('../controllers/aiController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/chat', optionalAuth, chat);
router.post('/skill-gap', auth, skillGap);
router.post('/risk-score', optionalAuth, riskScore);

module.exports = router;
