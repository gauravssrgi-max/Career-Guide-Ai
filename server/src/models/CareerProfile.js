const mongoose = require('mongoose');

const careerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  
  // User Profile Data
  profile: {
    skills: [String],
    interests: [String],
    academicBackground: {
      currentLevel: { type: String, enum: ['10th', '12th', 'diploma', 'undergraduate', 'graduate', 'postgraduate'] },
      stream: String,
      institution: String,
      percentage: Number,
    },
    careerGoals: {
      targetRole: String,
      targetIndustry: String,
      timeframe: String,
    },
    experienceLevel: { 
      type: String, 
      enum: ['student', 'fresher', '1-3years', '3-5years', '5+years'],
      default: 'student'
    },
    location: String,
    budgetConstraints: {
      monthly: Number,
      currency: { type: String, default: 'INR' },
    },
  },

  // Module 1: Personalized Career Roadmap
  roadmap: {
    phases: [{
      name: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'job-ready'] },
      skills: [String],
      tools: [String],
      resources: [{
        title: String,
        type: { type: String, enum: ['course', 'book', 'video', 'article', 'project'] },
        url: String,
        free: Boolean,
      }],
      projects: [{
        title: String,
        description: String,
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
        estimatedTime: String,
      }],
      milestones: [String],
      estimatedTimeline: String,
      completed: { type: Boolean, default: false },
      progress: { type: Number, default: 0 },
    }],
    currentPhase: { type: String, default: 'beginner' },
    overallProgress: { type: Number, default: 0 },
    generatedAt: Date,
  },

  // Module 2: Mentorship & Community Network
  mentorship: {
    idealMentors: [{
      type: String,
      expertise: String,
      why: String,
      whereToFind: String,
    }],
    communities: [{
      name: String,
      platform: String,
      url: String,
      focus: String,
    }],
    outreachTemplates: [{
      purpose: String,
      template: String,
    }],
    mentorshipPlan: {
      frequency: String,
      discussionGoals: [String],
      structure: String,
    },
    activeMentors: [{
      name: String,
      expertise: String,
      connectedAt: Date,
      lastContact: Date,
    }],
  },

  // Module 3: College/Education Recommendations
  educationRecommendations: {
    colleges: [{
      name: String,
      category: { type: String, enum: ['dream', 'target', 'safe'] },
      whyFits: String,
      requiredExams: [String],
      expectedCutoff: String,
      fees: {
        amount: Number,
        currency: { type: String, default: 'INR' },
        duration: String,
      },
      roi: {
        averageSalary: String,
        placementRate: String,
        topRecruiters: [String],
      },
      applicationStrategy: String,
      deadline: Date,
    }],
    alternativePaths: [{
      title: String,
      description: String,
      cost: String,
      duration: String,
    }],
  },

  // Module 4: Real-Time Market Analytics
  marketAnalytics: {
    inDemandSkills: [{
      skill: String,
      demandScore: Number,
      trend: { type: String, enum: ['rising', 'stable', 'declining'] },
      avgSalaryImpact: String,
    }],
    industryTrends: [{
      role: String,
      status: { type: String, enum: ['growing', 'stable', 'declining'] },
      growthRate: String,
      reason: String,
    }],
    salaryBenchmarks: [{
      experienceLevel: String,
      minSalary: Number,
      maxSalary: Number,
      median: Number,
      currency: { type: String, default: 'INR' },
    }],
    hiringInsights: {
      topCompanies: [String],
      hiringTrends: String,
      competitionLevel: String,
    },
    skillGapAnalysis: {
      matchPercentage: Number,
      strongSkills: [String],
      gapSkills: [{
        skill: String,
        importance: { type: String, enum: ['critical', 'important', 'nice-to-have'] },
        learningTime: String,
        resources: String,
      }],
      priorityActions: [String],
    },
    lastUpdated: Date,
  },

  // Module 5: Interview Preparation System
  interviewPrep: {
    technicalQuestions: [{
      question: String,
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
      topic: String,
      sampleAnswer: String,
      keyPoints: [String],
    }],
    behavioralQuestions: [{
      question: String,
      starFramework: {
        situation: String,
        task: String,
        action: String,
        result: String,
      },
      tips: [String],
    }],
    mockScenarios: [{
      title: String,
      description: String,
      expectedApproach: String,
    }],
    weaknessDetection: [{
      area: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
      improvementPlan: String,
    }],
    practiceHistory: [{
      date: Date,
      type: String,
      score: Number,
      feedback: String,
    }],
  },

  // Progress Tracking
  progressTracking: {
    completedMilestones: [String],
    skillsAcquired: [{
      skill: String,
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
      acquiredAt: Date,
    }],
    projectsCompleted: [{
      title: String,
      completedAt: Date,
      githubUrl: String,
    }],
    certificationsEarned: [{
      name: String,
      issuer: String,
      earnedAt: Date,
      url: String,
    }],
  },

  // AI Interaction History
  aiInteractions: [{
    module: String,
    query: String,
    response: String,
    timestamp: { type: Date, default: Date.now },
  }],

}, {
  timestamps: true,
});

// Indexes for performance
careerProfileSchema.index({ 'profile.careerGoals.targetRole': 1 });
careerProfileSchema.index({ 'roadmap.currentPhase': 1 });

module.exports = mongoose.model('CareerProfile', careerProfileSchema);
