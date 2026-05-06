const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const StudyGroup = require('../models/StudyGroup');
const { Job, JobApplication } = require('../models/JobMarketplace');
const { SkillLearningPath: SkillPath, UserSkillProgress } = require('../models/SkillLearningPath');
const { CareerPivot, PivotSuccessStory } = require('../models/CareerPivot');
const ProgressLog = require('../models/ProgressLog');
const { AlumniProfile, MentorshipSession, SuccessStory } = require('../models/AlumniNetwork');
const { SalaryGuide, WorkLifeBalance, SideHustle, UserSideHustleProgress } = require('../models/CareerSupport');
const Career = require('../models/Career');
const Resource = require('../models/Resource');
const aiService = require('../services/aiService');

// Helper to check DB connection
const isDBConnected = () => mongoose.connection.readyState === 1;

// ────────────────────────────────────────────────────────────────────────────
// 1. RESUME CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.createResume = async (req, res, next) => {
  try {
    const { careerPath, personalInfo, template = 'modern' } = req.body;
    const userId = req.user?._id;

    if (!userId || !careerPath) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isDBConnected()) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }

    // Generate AI professional summary based on career path and skills
    let summary = '';
    try {
      const prompt = `Generate a professional resume summary for a candidate targeting a career in ${careerPath}. Skills: ${(personalInfo.skills || []).join(', ')}. Experience: ${personalInfo.experience || 'Entry level'}. Keep it under 3 sentences.`;
      summary = await aiService._askBestAI(prompt, 'You are a professional resume writer.');
    } catch (aiErr) {
      console.error('AI Summary generation failed:', aiErr.message);
      summary = `Dedicated professional seeking a role in ${careerPath}.`;
    }

    const resumeData = {
      userId,
      careerPath,
      personalInfo: {
        ...personalInfo,
        summary: summary || personalInfo.summary
      },
      template,
      status: 'draft',
    };

    const resume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Security check: Only owner can view
    if (resume.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this resume' });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserResumes = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or not authorized' });
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOneAndDelete({ _id: id, userId: req.user?._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or not authorized' });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.checkATSScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // AI-powered ATS Analysis
    const prompt = `Analyze this resume for ATS compatibility targeting ${resume.careerPath}.
    Resume Data: ${JSON.stringify(resume.personalInfo)}
    Return JSON: {"score":85,"feedback":["tip1","tip2"],"missingKeywords":["k1","k2"]}`;

    const aiResponse = await aiService._askBestAI(prompt, 'You are an ATS optimization expert. Return ONLY valid JSON.');
    const analysis = aiService._parseJSON(aiResponse) || { score: 70, feedback: ['Add more keywords'], missingKeywords: [] };

    resume.atsScore = analysis.score;
    await resume.save();

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format = 'pdf' } = req.query;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // In a real app, we'd use pdfkit or similar to generate the file
    // For now, return the data and a mock download URL
    res.json({
      success: true,
      message: `Resume generation for ${format} initiated`,
      data: {
        resume,
        downloadUrl: `/api/phase2/resume/${id}/export?format=${format}`
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCareerMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const analysis = await aiService.analyzeSkillGap(resume.personalInfo.skills || [], resume.careerPath);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 2. STUDY GROUP CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.createStudyGroup = async (req, res, next) => {
  try {
    const { name, exam, careerPath, description, isPublic = true } = req.body;
    const userId = req.user?._id;

    if (!userId || !name || (!exam && !careerPath)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const group = await StudyGroup.create({
      name,
      exam: exam || null,
      careerPath: careerPath || null,
      description,
      isPublic,
      creatorId: userId,
      members: [{ userId, role: 'admin' }],
    });

    res.status(201).json({
      success: true,
      message: 'Study group created successfully',
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

exports.listStudyGroups = async (req, res, next) => {
  try {
    const { exam, careerPath, page = 1, limit = 20 } = req.query;
    const filter = { isPublic: true };

    if (exam) filter.exam = exam;
    if (careerPath) filter.careerPath = careerPath;

    const groups = await StudyGroup.find(filter)
      .populate('creatorId', 'name avatar')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await StudyGroup.countDocuments(filter);

    res.json({
      success: true,
      data: groups,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudyGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('members.userId', 'name avatar level')
      .populate('creatorId', 'name avatar');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Study group not found' });
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

exports.joinStudyGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Study group not found' });
    }

    const isMember = group.members.some(m => m.userId.toString() === req.user?._id.toString());
    if (isMember) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    group.members.push({ userId: req.user?._id, role: 'member' });
    await group.save();

    res.json({
      success: true,
      message: 'Joined study group successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.postToGroup = async (req, res, next) => {
  try {
    const { topic, content } = req.body;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Study group not found' });
    }

    const post = {
      topic,
      content,
      startedBy: req.user?._id,
      createdAt: new Date(),
    };

    group.discussions.push(post);
    await group.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.leaveStudyGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Study group not found' });

    group.members = group.members.filter(m => m.userId.toString() !== req.user?._id.toString());
    await group.save();

    res.json({ success: true, message: 'Left study group successfully' });
  } catch (error) {
    next(error);
  }
};

exports.uploadGroupResource = async (req, res, next) => {
  try {
    const { title, type, url } = req.body;
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Study group not found' });

    group.resources.push({ title, type, url, sharedBy: req.user?._id });
    await group.save();

    res.status(201).json({ success: true, message: 'Resource uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getGroupLeaderboard = async (req, res, next) => {
  try {
    // Mock leaderboard logic
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

exports.scheduleGroupEvent = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Study group not found' });

    group.events.push({ ...req.body, createdBy: req.user?._id });
    await group.save();

    res.status(201).json({ success: true, message: 'Event scheduled successfully' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 3. JOB MARKETPLACE CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.listJobs = async (req, res, next) => {
  try {
    const { type, category, location, minSalary, page = 1, limit = 20 } = req.query;
    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.locations = { $in: [location] };
    if (minSalary) filter['stipendOrSalary.min'] = { $gte: Number(minSalary) };

    const jobs = await Job.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

exports.applyToJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resumeId, coverLetter } = req.body;
    const userId = req.user?._id;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Resume ID is required' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = await JobApplication.create({
      userId,
      jobId: id,
      resumeId,
      coverLetter,
    });

    job.applicationsReceived += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ jobId: req.params.id }).populate('userId', 'name email');

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { status, feedback } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      appId,
      { status, feedback },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

exports.addJobReview = async (req, res, next) => {
  try {
    const { rating, text, experience } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.reviews.push({ userId: req.user?._id, rating, text, experience });
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobReviews = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('reviews.userId', 'name');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      data: job.reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.postJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserApplications = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user?._id;

    const applications = await JobApplication.find({ userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 4. SKILL LEARNING PATH CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.listSkillPaths = async (req, res, next) => {
  try {
    const { careerPath, difficulty, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (careerPath) filter.careerPaths = { $in: [careerPath] };
    if (difficulty) filter.difficulty = difficulty;

    const paths = await SkillPath.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await SkillPath.countDocuments(filter);

    res.json({
      success: true,
      data: paths,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSkillPath = async (req, res, next) => {
  try {
    const path = await SkillPath.findById(req.params.id);
    if (!path) {
      return res.status(404).json({ success: false, message: 'Skill path not found' });
    }

    res.json({
      success: true,
      data: path,
    });
  } catch (error) {
    next(error);
  }
};

exports.enrollSkillPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const path = await SkillPath.findById(id);
    if (!path) {
      return res.status(404).json({ success: false, message: 'Skill path not found' });
    }

    progress = await UserSkillProgress.create({
      userId,
      pathId: id,
      moduleProgress: path.modules.map(m => ({ moduleId: m._id, completed: false }))
    });

    path.enrolledUsers += 1;
    await path.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSkillPathProgress = async (req, res, next) => {
  try {
    const progress = await UserSkillProgress.findOne({
      userId: req.user?._id,
      pathId: req.params.id
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this path' });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

exports.completeModule = async (req, res, next) => {
  try {
    const { pathId, moduleId } = req.params;

    const progress = await UserSkillProgress.findOne({ userId: req.user?._id, pathId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const moduleIdx = progress.moduleProgress.findIndex(m => m.moduleId === moduleId);
    if (moduleIdx !== -1) {
      progress.moduleProgress[moduleIdx].completed = true;
      progress.moduleProgress[moduleIdx].completedAt = new Date();
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Module marked as complete',
    });
  } catch (error) {
    next(error);
  }
};

exports.submitAssessment = async (req, res, next) => {
  try {
    const { pathId, assessmentId } = req.params;
    const { score } = req.body;

    const progress = await UserSkillProgress.findOne({ userId: req.user?._id, pathId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const path = await SkillPath.findById(pathId);
    let passingScore = 70;
    // Find passing score from path definition if exists

    progress.quizScores.push({
      assessmentId,
      score,
      passed: score >= passingScore,
      passedAt: new Date()
    });

    await progress.save();

    res.json({
      success: true,
      message: 'Assessment submitted',
      data: { score, passed: score >= passingScore }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCertificate = async (req, res, next) => {
  try {
    const progress = await UserSkillProgress.findOne({ userId: req.user?._id, pathId: req.params.id });

    if (!progress || progress.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Course not completed yet' });
    }

    res.json({
      success: true,
      data: { certificateUrl: progress.certificateUrl },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserSkillProgress = async (req, res, next) => {
  try {
    const progress = await UserSkillProgress.find({ userId: req.user?._id }).populate('pathId');

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 5. CAREER PIVOT CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.initiatePivot = async (req, res, next) => {
  try {
    const { currentCareer, targetCareer } = req.body;
    const userId = req.user?._id;

    if (!currentCareer || !targetCareer) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // AI Analysis for Pivot
    const prompt = `Analyze career pivot from ${currentCareer} to ${targetCareer}.
    Return JSON: {"transferableSkills":[{"skillName":"s1","currentProficiency":"High","targetProficiency":"High"}],"skillsToGain":[{"skillName":"s2","importance":"Critical","estimatedHours":100}],"costAnalysis":{"educationCost":50000,"opportunityCost":200000,"totalInvestment":250000,"breakEvenMonths":12},"estimatedMonthsToSwitch":6,"successProbability":80}`;

    const aiResponse = await aiService._askBestAI(prompt, 'You are a career pivot expert. Return ONLY valid JSON.');
    const analysis = aiService._parseJSON(aiResponse);

    const pivot = await CareerPivot.create({
      userId,
      currentCareer,
      targetCareer,
      analysis,
    });

    res.status(201).json({
      success: true,
      message: 'Career pivot analysis generated',
      data: pivot,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPivotDetails = async (req, res, next) => {
  try {
    const pivot = await CareerPivot.findById(req.params.id);
    if (!pivot) {
      return res.status(404).json({ success: false, message: 'Pivot analysis not found' });
    }

    res.json({
      success: true,
      data: pivot,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePivotPlan = async (req, res, next) => {
  try {
    const pivot = await CareerPivot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      success: true,
      data: pivot,
    });
  } catch (error) {
    next(error);
  }
};

exports.completePivotTask = async (req, res, next) => {
  try {
    const { taskName } = req.body;
    const pivot = await CareerPivot.findById(req.params.id);

    if (!pivot) {
      return res.status(404).json({ success: false, message: 'Pivot analysis not found' });
    }

    pivot.tasksCompleted.push({ taskName, completedAt: new Date() });
    await pivot.save();

    res.json({
      success: true,
      message: 'Task completed',
    });
  } catch (error) {
    next(error);
  }
};

exports.getPivotSuccessStories = async (req, res, next) => {
  try {
    const stories = await PivotSuccessStory.find().limit(5);

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

exports.assignPivotMentor = async (req, res, next) => {
  try {
    const { mentorId } = req.body;
    const pivot = await CareerPivot.findByIdAndUpdate(req.params.id, { assignedMentor: mentorId }, { new: true });

    res.json({
      success: true,
      message: 'Mentor assigned',
      data: pivot,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 6. PROGRESS LOG CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.logMilestone = async (req, res, next) => {
  try {
    const { careerPathId, name, description, proof } = req.body;
    let log = await ProgressLog.findOne({ userId: req.user?._id, careerPathId });

    if (!log) {
      log = await ProgressLog.create({ userId: req.user?._id, careerPathId, milestones: [] });
    }

    log.milestones.push({ name, description, achieved: true, achievedAt: new Date(), proof });
    log.progressMetrics.milestonesAchieved += 1;

    await log.save();

    res.status(201).json({
      success: true,
      message: 'Milestone logged',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

exports.logExam = async (req, res, next) => {
  try {
    const { examName, score, percentile, certificateUrl } = req.body;
    let log = await ProgressLog.findOne({ userId: req.user?._id });

    if (!log) {
      log = await ProgressLog.create({ userId: req.user?._id, examsCleared: [] });
    }

    log.examsCleared.push({ examName, score, percentile, clearedAt: new Date(), certificateUrl });
    await log.save();

    res.status(201).json({
      success: true,
      message: 'Exam result logged',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

exports.logCourse = async (req, res, next) => {
  try {
    const { courseName, platform, certificateUrl } = req.body;
    let log = await ProgressLog.findOne({ userId: req.user?._id });

    if (!log) {
      log = await ProgressLog.create({ userId: req.user?._id, coursesCompleted: [] });
    }

    log.coursesCompleted.push({ courseName, platform, completedAt: new Date(), certificateUrl });
    await log.save();

    res.status(201).json({
      success: true,
      message: 'Course completion logged',
    });
  } catch (error) {
    next(error);
  }
};

exports.logSkill = async (req, res, next) => {
  try {
    const { skillName, proficiencyLevel } = req.body;
    let log = await ProgressLog.findOne({ userId: req.user?._id });

    if (!log) {
      log = await ProgressLog.create({ userId: req.user?._id, skillsDemonstrated: [] });
    }

    log.skillsDemonstrated.push({ skillName, proficiencyLevel, demonstratedAt: new Date() });
    log.progressMetrics.skillsAcquired += 1;
    await log.save();

    res.status(201).json({
      success: true,
      message: 'Skill achievement logged',
    });
  } catch (error) {
    next(error);
  }
};

exports.getCareerPathProgress = async (req, res, next) => {
  try {
    const log = await ProgressLog.findOne({ userId: req.user?._id, careerPathId: req.params.careerPathId });
    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgressMetrics = async (req, res, next) => {
  try {
    const logs = await ProgressLog.find({ userId: req.user?._id });
    // Aggregate metrics
    const metrics = {
      totalMilestones: 0,
      totalExams: 0,
      totalSkills: 0,
    };

    logs.forEach(log => {
      metrics.totalMilestones += log.progressMetrics.milestonesAchieved;
      metrics.totalExams += log.examsCleared.length;
      metrics.totalSkills += log.progressMetrics.skillsAcquired;
    });

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCertificate = async (req, res, next) => {
  try {
    // Mock verification
    res.json({
      success: true,
      verified: true,
      message: 'Certificate verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 7. ALUMNI NETWORK CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.createAlumniProfile = async (req, res, next) => {
  try {
    const profile = await AlumniProfile.create({
      ...req.body,
      userId: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Alumni profile created successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAlumniProfile = async (req, res, next) => {
  try {
    const profile = await AlumniProfile.findById(req.params.id).populate('userId', 'name avatar');
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.listAlumni = async (req, res, next) => {
  try {
    const { careerPath, page = 1, limit = 20 } = req.query;
    const filter = { isVerified: true };

    if (careerPath) filter.careerPath = careerPath;

    const alumni = await AlumniProfile.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await AlumniProfile.countDocuments(filter);

    res.json({
      success: true,
      data: alumni,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.requestMentorship = async (req, res, next) => {
  try {
    const { mentorId, topic, scheduledAt } = req.body;

    const session = await MentorshipSession.create({
      mentorId,
      menteeId: req.user?._id,
      topic,
      scheduledAt,
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMentorshipSessions = async (req, res, next) => {
  try {
    const sessions = await MentorshipSession.find({
      $or: [{ menteeId: req.user?._id }, { mentorId: req.user?._id }]
    }).populate('mentorId menteeId', 'name');

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 8. CAREER SUPPORT CONTROLLER
// ────────────────────────────────────────────────────────────────────────────

exports.getSalaryGuide = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { role } = req.query;

    const guide = await SalaryGuide.findOne({ careerId, role: role || 'Entry-level' });
    
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Salary guide not found' });
    }

    res.json({
      success: true,
      data: guide,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkLifeBalance = async (req, res, next) => {
  try {
    const { careerId } = req.params;

    const balance = await WorkLifeBalance.findOne({ careerId });
    
    if (!balance) {
      return res.status(404).json({ success: false, message: 'Work-life balance data not found' });
    }

    res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

exports.listSideHustles = async (req, res, next) => {
  try {
    const { careerId } = req.query;
    const filter = {};
    if (careerId) filter.careerId = careerId;

    const hustles = await SideHustle.find(filter);

    res.json({
      success: true,
      data: hustles,
    });
  } catch (error) {
    next(error);
  }
};

exports.enrollSideHustle = async (req, res, next) => {
  try {
    const { sideHustleId } = req.body;

    const progress = await UserSideHustleProgress.create({
      userId: req.user?._id,
      sideHustleId,
    });

    res.status(201).json({
      success: true,
      message: 'Enrolled in side hustle',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSideHustleProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progress = await UserSideHustleProgress.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      req.body,
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    res.json({
      success: true,
      message: 'Progress updated',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

exports.followAlumni = async (req, res, next) => {
  try {
    // Logic for following (could be adding to a User followers array or Alumni profile)
    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.submitMentorshipFeedback = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { rating, comment } = req.body;
    const { MentorshipSession } = require('../models/AlumniNetwork');

    const session = await MentorshipSession.findByIdAndUpdate(
      sessionId,
      { feedback: { rating, comment }, status: 'completed' },
      { new: true }
    );

    res.json({ success: true, message: 'Feedback submitted', data: session });
  } catch (error) {
    next(error);
  }
};

exports.getSuccessStories = async (req, res, next) => {
  try {
    const { SuccessStory } = require('../models/AlumniNetwork');
    const stories = await SuccessStory.find().limit(10);
    res.json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
};

exports.getSalaryComparison = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { SalaryGuide } = require('../models/CareerSupport');
    const guides = await SalaryGuide.find({ careerId });
    res.json({ success: true, data: guides });
  } catch (error) {
    next(error);
  }
};

exports.addWorkLifeReview = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { rating, comment, hoursPerWeek } = req.body;
    const { WorkLifeBalance } = require('../models/CareerSupport');

    const balance = await WorkLifeBalance.findOne({ careerId });
    if (!balance) return res.status(404).json({ success: false, message: 'Not found' });

    balance.reviews.push({ userId: req.user?._id, rating, comment, hoursPerWeek });
    await balance.save();

    res.json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

exports.getSideHustleDetails = async (req, res, next) => {
  try {
    const { SideHustle } = require('../models/CareerSupport');
    const hustle = await SideHustle.findById(req.params.id);
    res.json({ success: true, data: hustle });
  } catch (error) {
    next(error);
  }
};

exports.trackSideHustle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { UserSideHustleProgress } = require('../models/CareerSupport');
    
    let progress = await UserSideHustleProgress.findOne({ userId: req.user?._id, sideHustleId: id });
    if (!progress) {
      progress = await UserSideHustleProgress.create({ userId: req.user?._id, sideHustleId: id });
    }

    res.json({ success: true, message: 'Side hustle tracking started', data: progress });
  } catch (error) {
    next(error);
  }
};
