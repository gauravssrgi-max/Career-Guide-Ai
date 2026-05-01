const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    interests: {
      type: [String],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    personalityType: {
      type: String,
      enum: ['introvert', 'extrovert', 'ambivert'],
      required: true,
    },
    academicPerformance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'below-average'],
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high', 'flexible'],
      required: true,
    },
    location: {
      type: String,
      enum: ['india', 'abroad', 'both'],
      required: true,
    },
    // Confusion mode questions
    physicalWorkComfort: {
      type: String,
      enum: ['yes', 'no', 'maybe'],
    },
    riskTolerance: {
      type: String,
      enum: ['stable', 'high-risk-high-reward', 'moderate'],
    },
    learningPreference: {
      type: String,
      enum: ['study', 'practical', 'both'],
    },
    workEnvironment: {
      type: String,
      enum: ['office', 'remote', 'outdoor', 'flexible'],
    },
  },
  interestScore: {
    type: Map,
    of: Number,
  },
  personalityProfile: {
    type: Map,
    of: Number,
  },
  confusionLevel: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'high'],
    default: 'none',
  },
  isQuickTest: {
    type: Boolean,
    default: false,
  },
  aiAnalysis: {
    type: String,
    default: '',
  },
  recommendedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
  }],
}, {
  timestamps: true,
});

surveySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Survey', surveySchema);
