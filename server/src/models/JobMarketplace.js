const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  companyId: String,
  type: { type: String, enum: ['internship', 'entry-level', 'mid-level', 'senior'], required: true },
  category: { type: String, required: true },
  department: String,
  requiredSkills: [String],
  requiredExams: [String],
  requiredEducation: String,
  minExperience: Number,
  targetCareerPaths: [String],
  stipendOrSalary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' },
  },
  benefits: [String],
  locations: [String],
  remotePolicy: { type: String, enum: ['fully-remote', 'hybrid', 'on-site'] },
  relocationAssistance: { type: Boolean, default: false },
  visaSponsor: { type: Boolean, default: false },
  duration: Number,
  startDate: String,
  applicationDeadline: Date,
  applicationsReceived: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'closed', 'filled'], default: 'active' },
  slug: String,
  companyLogo: String,
  companyWebsite: String,
}, {
  timestamps: true,
});

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  coverLetter: String,
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'interview', 'offer', 'rejected', 'accepted'], 
    default: 'applied' 
  },
  feedback: String,
}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = { Job, JobApplication };
