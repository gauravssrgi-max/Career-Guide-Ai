const Career = require('../models/Career');
const Exam = require('../models/Exam');
const Resource = require('../models/Resource');
const aiService = require('../services/aiService');

// Get All Careers
exports.getCareers = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = Number(difficulty);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const careers = await Career.find(filter)
      .sort({ title: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Career.countDocuments(filter);

    res.json({
      success: true,
      data: careers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Career by ID
exports.getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id).populate('exams');
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    // Get resources for this career
    const resources = await Resource.find({ careerId: career._id });

    res.json({
      success: true,
      data: { career, resources },
    });
  } catch (error) {
    next(error);
  }
};

// Get Career by Slug
exports.getCareerBySlug = async (req, res, next) => {
  try {
    const career = await Career.findOne({ slug: req.params.slug }).populate('exams');
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    const resources = await Resource.find({ careerId: career._id });

    res.json({
      success: true,
      data: { career, resources },
    });
  } catch (error) {
    next(error);
  }
};

// Compare Careers
exports.compareCareers = async (req, res, next) => {
  try {
    const { careerIds } = req.body;

    if (!careerIds || careerIds.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 career IDs required' });
    }

    const careers = await Career.find({ _id: { $in: careerIds } }).populate('exams');

    res.json({
      success: true,
      data: careers,
    });
  } catch (error) {
    next(error);
  }
};

// Recommend Careers (AI-powered)
exports.recommendCareers = async (req, res, next) => {
  try {
    const { surveyAnswers } = req.body;

    if (!surveyAnswers) {
      return res.status(400).json({ success: false, message: 'Survey answers are required' });
    }

    const recommendations = await aiService.recommendCareers(surveyAnswers);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// Get Cost Estimate
exports.getCostEstimate = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    const { location = 'india' } = req.query;

    const costBreakdown = {
      education: career.costEstimate?.education || 'Varies',
      coaching: career.costEstimate?.coaching || 'Optional',
      exams: career.costEstimate?.exams || 'Varies',
      total: career.costEstimate?.total || 'Contact institutions',
      budgetAlternative: career.costEstimate?.budgetAlternative || 'Government colleges, scholarships',
      location,
      livingCost: location === 'abroad' ? '₹15-30 LPA (varies by country)' : '₹2-5 LPA',
    };

    res.json({
      success: true,
      data: costBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
