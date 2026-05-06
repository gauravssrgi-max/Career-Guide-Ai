const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careerPathId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
  milestones: [{
    name: String,
    description: String,
    achieved: { type: Boolean, default: false },
    achievedAt: Date,
    proof: {
      type: { type: String, enum: ['certificate', 'score-sheet', 'document', 'image'] },
      url: String,
      verified: { type: Boolean, default: false },
    },
  }],
  examsCleared: [{
    examName: String,
    score: Number,
    percentile: Number,
    clearedAt: Date,
    certificateUrl: String,
  }],
  coursesCompleted: [{
    courseName: String,
    platform: String,
    completedAt: Date,
    certificateUrl: String,
  }],
  skillsDemonstrated: [{
    skillName: String,
    proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    demonstratedAt: { type: Date, default: Date.now },
  }],
  progressMetrics: {
    roadmapCompletion: { type: Number, default: 0 },
    milestonesAchieved: { type: Number, default: 0 },
    skillsAcquired: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

const ProgressLog = mongoose.model('ProgressLog', progressLogSchema);

module.exports = ProgressLog;
