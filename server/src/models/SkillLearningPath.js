const mongoose = require('mongoose');

const skillLearningPathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  skillId: String,
  careerPaths: [String],
  prerequisites: [String],
  targetProficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
  estimatedDuration: Number,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  modules: [{
    title: String,
    description: String,
    duration: Number,
    order: Number,
    resources: [{
      type: { type: String, enum: ['video', 'article', 'course', 'book', 'project', 'tutorial'] },
      title: String,
      provider: String,
      url: String,
      duration: Number,
      cost: Number,
    }],
    assessments: [{
      title: String,
      type: { type: String, enum: ['quiz', 'assignment', 'project', 'practical'] },
      passingScore: Number,
    }],
  }],
  certification: {
    available: { type: Boolean, default: false },
    name: String,
    issuer: String,
  },
  enrolledUsers: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const userSkillProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLearningPath', required: true },
  status: { type: String, enum: ['in-progress', 'paused', 'completed', 'abandoned'], default: 'in-progress' },
  currentModule: { type: Number, default: 0 },
  moduleProgress: [{
    moduleId: String,
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
  quizScores: [{
    assessmentId: String,
    score: Number,
    passed: Boolean,
    passedAt: Date,
  }],
  certificateUrl: String,
  totalHoursSpent: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const SkillLearningPath = mongoose.model('SkillLearningPath', skillLearningPathSchema);
const UserSkillProgress = mongoose.model('UserSkillProgress', userSkillProgressSchema);

module.exports = { SkillLearningPath, UserSkillProgress };
