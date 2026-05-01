const aiService = require('../services/aiService');

// AI Chat
exports.chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const userContext = req.user ? {
      name: req.user.name,
      surveyCompleted: req.user.surveyCompleted,
      level: req.user.level,
    } : {};

    const result = await aiService.chat(messages, userContext);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Skill Gap Analysis
exports.skillGap = async (req, res, next) => {
  try {
    const { currentSkills, targetCareer } = req.body;

    if (!currentSkills || !targetCareer) {
      return res.status(400).json({ success: false, message: 'Current skills and target career are required' });
    }

    const result = await aiService.analyzeSkillGap(currentSkills, targetCareer);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Career Risk Score
exports.riskScore = async (req, res, next) => {
  try {
    const { careerTitle } = req.body;

    if (!careerTitle) {
      return res.status(400).json({ success: false, message: 'Career title is required' });
    }

    const result = await aiService.calculateRiskScore(careerTitle);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
