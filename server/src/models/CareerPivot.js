const mongoose = require('mongoose');

const careerPivotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentCareer: { type: String, required: true },
  targetCareer: { type: String, required: true },
  initiatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['exploring', 'planning', 'in-progress', 'completed'], default: 'exploring' },
  analysis: {
    transferableSkills: [{
      skillName: String,
      currentProficiency: String,
      targetProficiency: String,
    }],
    skillsToGain: [{
      skillName: String,
      importance: { type: String, enum: ['Critical', 'Important', 'Nice-to-have'] },
      estimatedHours: Number,
    }],
    costAnalysis: {
      educationCost: Number,
      opportunityCost: Number,
      totalInvestment: Number,
      breakEvenMonths: Number,
    },
    estimatedMonthsToSwitch: Number,
    successProbability: Number,
  },
  tasksCompleted: [{
    taskName: String,
    completedAt: { type: Date, default: Date.now },
  }],
  assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const pivotSuccessStorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  previousCareer: String,
  currentCareer: String,
  switchDuration: Number,
  story: String,
  lessonsLearned: [String],
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const CareerPivot = mongoose.model('CareerPivot', careerPivotSchema);
const PivotSuccessStory = mongoose.model('PivotSuccessStory', pivotSuccessStorySchema);

module.exports = { CareerPivot, PivotSuccessStory };
