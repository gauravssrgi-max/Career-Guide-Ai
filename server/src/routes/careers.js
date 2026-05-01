const express = require('express');
const router = express.Router();
const { getCareers, getCareerById, getCareerBySlug, compareCareers, recommendCareers, getCostEstimate } = require('../controllers/careerController');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getCareers);
router.get('/slug/:slug', optionalAuth, getCareerBySlug);
router.get('/:id', optionalAuth, getCareerById);
router.get('/:id/cost', optionalAuth, getCostEstimate);
router.post('/compare', optionalAuth, compareCareers);
router.post('/recommend', auth, recommendCareers);

module.exports = router;
