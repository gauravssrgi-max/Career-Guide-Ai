const express = require('express');
const router = express.Router();
const { submitSurvey, getResult, getHistory } = require('../controllers/surveyController');
const { auth } = require('../middleware/auth');

router.post('/submit', auth, submitSurvey);
router.get('/result', auth, getResult);
router.get('/history', auth, getHistory);

module.exports = router;
