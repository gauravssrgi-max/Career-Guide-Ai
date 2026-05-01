const mongoose = require('mongoose');
const Survey = require('../models/Survey');
const User = require('../models/User');
const aiService = require('../services/aiService');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Submit Survey
exports.submitSurvey = async (req, res, next) => {
  try {
    const { answers, confusionLevel, isQuickTest } = req.body;

    if (!answers || !answers.interests || !answers.skills) {
      return res.status(400).json({ success: false, message: 'Interests and skills are required' });
    }

    // Get AI recommendations
    const aiResult = await aiService.recommendCareers({
      ...answers,
      confusionLevel: confusionLevel || 'none',
    });

    if (!isDBConnected()) {
      return res.status(201).json({
        success: true,
        data: {
          survey: { answers, confusionLevel, isQuickTest, aiAnalysis: aiResult.analysis || '' },
          recommendations: aiResult,
        },
      });
    }

    const interestScore = {};
    (answers.interests || []).forEach((interest) => {
      interestScore[interest] = (interestScore[interest] || 0) + 1;
    });

    const survey = await Survey.create({
      userId: req.userId,
      answers,
      interestScore,
      confusionLevel: confusionLevel || 'none',
      isQuickTest: isQuickTest || false,
      aiAnalysis: aiResult.analysis || '',
    });

    await User.findByIdAndUpdate(req.userId, {
      surveyCompleted: true,
      $inc: { xp: isQuickTest ? 15 : 30 },
    });

    const user = await User.findById(req.userId);
    const hasSurveyBadge = user.badges.some(b => b.name === 'Survey Completed');
    if (!hasSurveyBadge) {
      user.badges.push({ name: 'Survey Completed', icon: '📋' });
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: { survey, recommendations: aiResult },
    });
  } catch (error) {
    next(error);
  }
};

// Get Latest Survey Result
exports.getResult = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(404).json({ success: false, message: 'No survey found. Please take the survey first.' });
    }

    const survey = await Survey.findOne({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('recommendedCareers');

    if (!survey) {
      return res.status(404).json({ success: false, message: 'No survey found. Please take the survey first.' });
    }

    const recommendations = await aiService.recommendCareers({
      ...survey.answers,
      confusionLevel: survey.confusionLevel,
    });

    res.json({ success: true, data: { survey, recommendations } });
  } catch (error) {
    next(error);
  }
};

// Get Survey History
exports.getHistory = async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.json({ success: true, data: [] });

    const surveys = await Survey.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: surveys });
  } catch (error) {
    next(error);
  }
};
