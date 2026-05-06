const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['exam', 'career', 'language', 'skill'],
    default: 'career',
  },
  exam: String,
  careerPath: String,
  skill: String,
  maxMembers: { type: Number, default: 50 },
  isPublic: { type: Boolean, default: true },
  tags: [String],
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  }],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resources: [{
    title: String,
    type: { type: String, enum: ['notes', 'video', 'test', 'article', 'book'] },
    url: String,
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now },
  }],
  discussions: [{
    topic: String,
    content: String,
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    replies: [{
      content: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    }],
  }],
  events: [{
    title: String,
    description: String,
    type: { type: String, enum: ['doubt-session', 'mock-test', 'study-session', 'webinar'] },
    scheduledAt: Date,
    duration: Number,
    link: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  avatar: String,
  banner: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
