const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  country: {
    type: String,
    required: true,
    enum: ['india', 'usa', 'uk', 'global', 'other'],
  },
  category: {
    type: String,
    enum: ['engineering', 'medical', 'management', 'civil-services', 'law', 'language', 'graduate', 'other'],
  },
  eligibility: {
    type: String,
    required: true,
  },
  syllabus: [{
    subject: String,
    topics: [String],
  }],
  fees: {
    type: String,
  },
  dates: {
    type: String,
  },
  preparationStrategy: {
    type: String,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
  },
  website: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Exam', examSchema);
