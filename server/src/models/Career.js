const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String },
  milestone: { type: String },
}, { _id: false });

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Career title is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'medical', 'business', 'creative', 'government', 'law', 'education', 'science', 'engineering', 'other'],
  },
  icon: {
    type: String,
    default: '💼',
  },
  salaryRange: {
    india: {
      entry: { type: String },
      mid: { type: String },
      senior: { type: String },
    },
    global: {
      entry: { type: String },
      mid: { type: String },
      senior: { type: String },
    },
  },
  skillsRequired: [{
    name: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  }],
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  roadmap: [roadmapStepSchema],
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  }],
  costEstimate: {
    education: { type: String },
    coaching: { type: String },
    exams: { type: String },
    total: { type: String },
    budgetAlternative: { type: String },
  },
  futureScope: {
    type: String,
  },
  growthRate: {
    type: String,
  },
  riskScore: {
    type: Number,
    min: 1,
    max: 100,
  },
  demandPrediction: {
    type: String,
    enum: ['declining', 'stable', 'growing', 'booming'],
  },
  automationRisk: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  tags: [String],
  interests: [String],
  personalityFit: [String],
}, {
  timestamps: true,
});

careerSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

careerSchema.index({ category: 1 });
careerSchema.index({ tags: 1 });
careerSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Career', careerSchema);
