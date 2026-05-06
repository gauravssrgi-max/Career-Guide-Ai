const mongoose = require('mongoose');

const salaryNegotiationGuideSchema = new mongoose.Schema({
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  role: { type: String, enum: ['Entry-level', 'Mid-level', 'Senior'], required: true },
  marketData: {
    location: String,
    averageSalary: Number,
    salaryRange: {
      min: Number,
      max: Number,
    },
    currency: { type: String, default: 'INR' },
  },
  strategies: [{
    title: String,
    description: String,
    effectiveness: { type: String, enum: ['High', 'Medium', 'Low'] },
  }],
  tips: [String],
}, {
  timestamps: true,
});

const workLifeBalanceSchema = new mongoose.Schema({
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  averageWorkHours: Number,
  flexibilityLevel: { type: String, enum: ['Very flexible', 'Flexible', 'Fixed'] },
  remoteWorkAvailable: { type: String, enum: ['Fully remote', 'Hybrid', 'On-site'] },
  burnoutRisk: { type: String, enum: ['High', 'Medium', 'Low'] },
  jobSatisfaction: { type: Number, min: 1, max: 10 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    hoursPerWeek: Number,
  }],
  tips: [String],
}, {
  timestamps: true,
});

const sideHustleSchema = new mongoose.Schema({
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['freelance', 'side-business', 'content-creation', 'consulting'] },
  skillsRequired: [String],
  earningPotential: {
    min: Number,
    max: Number,
    period: { type: String, default: 'per month' },
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  platforms: [String],
}, {
  timestamps: true,
});

const userSideHustleProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sideHustleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SideHustle', required: true },
  status: { type: String, enum: ['exploring', 'setup', 'active', 'paused', 'completed'], default: 'exploring' },
  totalEarnings: { type: Number, default: 0 },
  monthlyEarnings: { type: Number, default: 0 },
  hoursPerWeek: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const SalaryGuide = mongoose.model('SalaryGuide', salaryNegotiationGuideSchema);
const WorkLifeBalance = mongoose.model('WorkLifeBalance', workLifeBalanceSchema);
const SideHustle = mongoose.model('SideHustle', sideHustleSchema);
const UserSideHustleProgress = mongoose.model('UserSideHustleProgress', userSideHustleProgressSchema);

module.exports = { SalaryGuide, WorkLifeBalance, SideHustle, UserSideHustleProgress };
