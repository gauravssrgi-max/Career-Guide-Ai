const express = require('express');
const router = express.Router();
const { getDashboard, saveCareer, getBadges } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, getDashboard);
router.post('/save-career', auth, saveCareer);
router.get('/badges', auth, getBadges);

module.exports = router;
