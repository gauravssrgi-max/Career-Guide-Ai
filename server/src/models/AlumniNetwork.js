const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  headline: String,
  bio: String,
  careerPath: String,
  yearsInCareer: Number,
  education: {
    degree: String,
    college: String,
    collegeType: { type: String, enum: ['Tier-1', 'Tier-2', 'Tier-3', 'International'] },
  },
  careerProgression: [{
    role: String,
    company: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
  }],
  availableForMentoring: { type: Boolean, default: false },
  menteesGuided: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  linkedIn: String,
  avatar: String,
}, {
  timestamps: true,
});

const mentorshipSessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'AlumniProfile', required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: String,
  scheduledAt: Date,
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  meetingLink: String,
  feedback: {
    rating: Number,
    comment: String,
  },
}, {
  timestamps: true,
});

const successStorySchema = new mongoose.Schema({
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'AlumniProfile' },
  title: String,
  story: String,
  lessonsLearned: [String],
  views: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);
const MentorshipSession = mongoose.model('MentorshipSession', mentorshipSessionSchema);
const SuccessStory = mongoose.model('SuccessStory', successStorySchema);

module.exports = { AlumniProfile, MentorshipSession, SuccessStory };
