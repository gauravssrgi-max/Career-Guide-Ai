const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  careerPath: {
    type: String,
    required: true,
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedInUrl: String,
    portfolioUrl: String,
    summary: String,
  },
  experiences: [{
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    currentlyWorking: { type: Boolean, default: false },
    description: String,
    bullets: [String],
    skills: [String],
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
    grade: String,
    activities: String,
  }],
  skills: [{
    name: String,
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    careerRelevance: { type: String, enum: ['Core', 'Important', 'Nice-to-have'] },
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: String,
    expiryDate: String,
    credentialUrl: String,
    careerRelevance: { type: Boolean, default: false },
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    careerRelevance: String,
  }],
  template: { type: String, default: 'modern' },
  atsScore: { type: Number, default: 0 },
  careerMatch: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
