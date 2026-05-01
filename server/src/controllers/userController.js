const mongoose = require('mongoose');
const User = require('../models/User');
const Survey = require('../models/Survey');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Get Dashboard Data
exports.getDashboard = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({
        success: true,
        data: {
          user: { name: req.user.name || 'Demo User', email: req.user.email || 'demo@careerguide.ai', level: 1, xp: 10, xpToNextLevel: 90, badges: [{ name: 'Welcome Explorer', icon: '🌟' }], surveyCompleted: false, memberSince: new Date() },
          savedCareers: [],
          savedCareersCount: 0,
          surveysCompleted: 0,
          latestSurvey: null,
          stats: { totalBadges: 1, level: 1, xp: 10 },
        },
      });
    }

    const user = await User.findById(req.userId).populate('savedCareers');
    const latestSurvey = await Survey.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    const surveyCount = await Survey.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      data: {
        user: { name: user.name, email: user.email, level: user.level, xp: user.xp, xpToNextLevel: (user.level * 100) - user.xp, badges: user.badges, surveyCompleted: user.surveyCompleted, memberSince: user.createdAt },
        savedCareers: user.savedCareers || [],
        savedCareersCount: (user.savedCareers || []).length,
        surveysCompleted: surveyCount,
        latestSurvey: latestSurvey ? { date: latestSurvey.createdAt, interests: latestSurvey.answers?.interests || [], personalityType: latestSurvey.answers?.personalityType || '', confusionLevel: latestSurvey.confusionLevel } : null,
        stats: { totalBadges: user.badges.length, level: user.level, xp: user.xp },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Save/Unsave Career
exports.saveCareer = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, message: 'Career saved (demo mode)', saved: true });
    }

    const { careerId } = req.body;
    const user = await User.findById(req.userId);
    const isAlreadySaved = user.savedCareers.includes(careerId);

    if (isAlreadySaved) {
      user.savedCareers = user.savedCareers.filter(id => id.toString() !== careerId);
      await user.save();
      return res.json({ success: true, message: 'Career removed', saved: false });
    }

    user.savedCareers.push(careerId);
    user.xp += 5;
    if (user.xp >= user.level * 100) {
      user.level += 1;
      user.badges.push({ name: `Level ${user.level} Achiever`, icon: '🏆' });
    }
    if (user.savedCareers.length === 5 && !user.badges.some(b => b.name === 'Career Collector')) {
      user.badges.push({ name: 'Career Collector', icon: '📚' });
    }
    await user.save();
    res.json({ success: true, message: 'Career saved', saved: true });
  } catch (error) {
    next(error);
  }
};

// Get Badges
exports.getBadges = async (req, res, next) => {
  try {
    const allBadges = [
      { name: 'Welcome Explorer', icon: '🌟', description: 'Joined Career Guide AI', earned: false },
      { name: 'Survey Completed', icon: '📋', description: 'Completed your first survey', earned: false },
      { name: 'Career Collector', icon: '📚', description: 'Saved 5 careers', earned: false },
      { name: 'Chat Explorer', icon: '💬', description: 'Had 10 chat conversations', earned: false },
      { name: 'Level 2 Achiever', icon: '🏆', description: 'Reached level 2', earned: false },
    ];

    if (!isDBConnected()) {
      allBadges[0].earned = true;
      return res.json({ success: true, data: allBadges });
    }

    const user = await User.findById(req.userId);
    const badges = allBadges.map(badge => ({
      ...badge,
      earned: user.badges.some(b => b.name === badge.name),
      earnedAt: user.badges.find(b => b.name === badge.name)?.earnedAt || null,
    }));

    res.json({ success: true, data: badges });
  } catch (error) {
    next(error);
  }
};
