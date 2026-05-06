const CareerProfile = require('../models/CareerProfile');
const careerCopilotService = require('../services/careerCopilotService');

// Create or Update Career Profile
exports.createProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    let profile = await CareerProfile.findOne({ userId });

    if (profile) {
      profile.profile = { ...profile.profile, ...profileData };
      await profile.save();
    } else {
      profile = await CareerProfile.create({
        userId,
        profile: profileData,
      });
    }

    res.json({
      success: true,
      message: 'Profile created/updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get Career Profile
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create one first.',
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Generate Complete Career Success System
exports.generateCompleteSystem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    // Validate required fields
    if (!profile.profile.careerGoals?.targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Please specify your target career role',
      });
    }

    console.log(`🎯 Generating complete system for user: ${userId}`);

    // Generate all modules
    const completeSystem = await careerCopilotService.generateCompleteSystem(profile.profile);

    // Update profile with generated data
    profile.roadmap = completeSystem.roadmap;
    profile.mentorship = completeSystem.mentorship;
    profile.educationRecommendations = completeSystem.educationRecommendations;
    profile.marketAnalytics = completeSystem.marketAnalytics;
    profile.interviewPrep = completeSystem.interviewPrep;

    await profile.save();

    res.json({
      success: true,
      message: 'Complete career success system generated',
      data: completeSystem,
    });
  } catch (error) {
    console.error('Complete system generation error:', error);
    next(error);
  }
};

// Module 1: Generate/Update Career Roadmap
exports.generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    const roadmap = await careerCopilotService.generateCareerRoadmap(profile.profile);
    
    profile.roadmap = roadmap;
    await profile.save();

    res.json({
      success: true,
      message: 'Career roadmap generated',
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// Module 2: Generate Mentorship Plan
exports.generateMentorshipPlan = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    const mentorship = await careerCopilotService.generateMentorshipPlan(profile.profile);
    
    profile.mentorship = mentorship;
    await profile.save();

    res.json({
      success: true,
      message: 'Mentorship plan generated',
      data: mentorship,
    });
  } catch (error) {
    next(error);
  }
};

// Module 3: Generate Education Recommendations
exports.generateEducationRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    const education = await careerCopilotService.generateEducationRecommendations(profile.profile);
    
    profile.educationRecommendations = education;
    await profile.save();

    res.json({
      success: true,
      message: 'Education recommendations generated',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// Module 4: Generate Market Analytics
exports.generateMarketAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    const analytics = await careerCopilotService.generateMarketAnalytics(profile.profile);
    
    profile.marketAnalytics = analytics;
    await profile.save();

    res.json({
      success: true,
      message: 'Market analytics generated',
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

// Module 5: Generate Interview Prep
exports.generateInterviewPrep = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Please create a profile first',
      });
    }

    const interviewPrep = await careerCopilotService.generateInterviewPrep(profile.profile);
    
    profile.interviewPrep = interviewPrep;
    await profile.save();

    res.json({
      success: true,
      message: 'Interview preparation generated',
      data: interviewPrep,
    });
  } catch (error) {
    next(error);
  }
};

// Update Roadmap Progress
exports.updateRoadmapProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { phase, progress, completed } = req.body;

    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const phaseIndex = profile.roadmap.phases.findIndex(p => p.name === phase);
    
    if (phaseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Phase not found',
      });
    }

    profile.roadmap.phases[phaseIndex].progress = progress;
    if (completed !== undefined) {
      profile.roadmap.phases[phaseIndex].completed = completed;
    }

    // Update current phase if completed
    if (completed && phaseIndex < profile.roadmap.phases.length - 1) {
      profile.roadmap.currentPhase = profile.roadmap.phases[phaseIndex + 1].name;
    }

    // Calculate overall progress
    const totalProgress = profile.roadmap.phases.reduce((sum, p) => sum + (p.progress || 0), 0);
    profile.roadmap.overallProgress = Math.round(totalProgress / profile.roadmap.phases.length);

    await profile.save();

    res.json({
      success: true,
      message: 'Progress updated',
      data: profile.roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// Add Mentor Connection
exports.addMentor = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, expertise } = req.body;

    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.mentorship.activeMentors) {
      profile.mentorship.activeMentors = [];
    }

    profile.mentorship.activeMentors.push({
      name,
      expertise,
      connectedAt: new Date(),
      lastContact: new Date(),
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Mentor added',
      data: profile.mentorship.activeMentors,
    });
  } catch (error) {
    next(error);
  }
};

// Track Skill Acquisition
exports.trackSkill = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skill, level } = req.body;

    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.progressTracking.skillsAcquired) {
      profile.progressTracking.skillsAcquired = [];
    }

    // Check if skill already exists
    const existingSkill = profile.progressTracking.skillsAcquired.find(s => s.skill === skill);
    
    if (existingSkill) {
      existingSkill.level = level;
    } else {
      profile.progressTracking.skillsAcquired.push({
        skill,
        level,
        acquiredAt: new Date(),
      });
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Skill tracked',
      data: profile.progressTracking.skillsAcquired,
    });
  } catch (error) {
    next(error);
  }
};

// Add Completed Project
exports.addProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, githubUrl } = req.body;

    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.progressTracking.projectsCompleted) {
      profile.progressTracking.projectsCompleted = [];
    }

    profile.progressTracking.projectsCompleted.push({
      title,
      githubUrl,
      completedAt: new Date(),
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Project added',
      data: profile.progressTracking.projectsCompleted,
    });
  } catch (error) {
    next(error);
  }
};

// Record Interview Practice
exports.recordInterviewPractice = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, score, feedback } = req.body;

    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.interviewPrep.practiceHistory) {
      profile.interviewPrep.practiceHistory = [];
    }

    profile.interviewPrep.practiceHistory.push({
      date: new Date(),
      type,
      score,
      feedback,
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Practice recorded',
      data: profile.interviewPrep.practiceHistory,
    });
  } catch (error) {
    next(error);
  }
};

// Get Dashboard Summary
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const dashboard = {
      profile: {
        targetRole: profile.profile.careerGoals?.targetRole,
        experienceLevel: profile.profile.experienceLevel,
        currentPhase: profile.roadmap?.currentPhase,
      },
      progress: {
        roadmapProgress: profile.roadmap?.overallProgress || 0,
        skillsAcquired: profile.progressTracking?.skillsAcquired?.length || 0,
        projectsCompleted: profile.progressTracking?.projectsCompleted?.length || 0,
        certificationsEarned: profile.progressTracking?.certificationsEarned?.length || 0,
      },
      nextSteps: {
        currentPhaseSkills: profile.roadmap?.phases?.find(p => p.name === profile.roadmap.currentPhase)?.skills || [],
        priorityActions: profile.marketAnalytics?.skillGapAnalysis?.priorityActions || [],
        upcomingMilestones: profile.roadmap?.phases?.find(p => p.name === profile.roadmap.currentPhase)?.milestones || [],
      },
      mentorship: {
        activeMentors: profile.mentorship?.activeMentors?.length || 0,
        communities: profile.mentorship?.communities?.length || 0,
      },
      marketInsights: {
        matchPercentage: profile.marketAnalytics?.skillGapAnalysis?.matchPercentage || 0,
        topSkillGaps: profile.marketAnalytics?.skillGapAnalysis?.gapSkills?.slice(0, 3) || [],
      },
    };

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
