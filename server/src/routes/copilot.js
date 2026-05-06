const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const copilotController = require('../controllers/careerCopilotController');

// Profile Management
router.post('/profile', auth, copilotController.createProfile);
router.get('/profile', auth, copilotController.getProfile);

// Complete System Generation
router.post('/generate-complete', auth, copilotController.generateCompleteSystem);

// Individual Module Generation
router.post('/roadmap', auth, copilotController.generateRoadmap);
router.post('/mentorship', auth, copilotController.generateMentorshipPlan);
router.post('/education', auth, copilotController.generateEducationRecommendations);
router.post('/market-analytics', auth, copilotController.generateMarketAnalytics);
router.post('/interview-prep', auth, copilotController.generateInterviewPrep);

// Progress Tracking
router.put('/roadmap/progress', auth, copilotController.updateRoadmapProgress);
router.post('/mentor', auth, copilotController.addMentor);
router.post('/skill', auth, copilotController.trackSkill);
router.post('/project', auth, copilotController.addProject);
router.post('/interview-practice', auth, copilotController.recordInterviewPractice);

// Dashboard
router.get('/dashboard', auth, copilotController.getDashboard);

module.exports = router;
