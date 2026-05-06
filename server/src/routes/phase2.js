// Phase 2 API Routes - All new features
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createResume,
  getResume,
  getUserResumes,
  updateResume,
  deleteResume,
  downloadResume,
  checkATSScore,
  getCareerMatch,
  createStudyGroup,
  listStudyGroups,
  getStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  postToGroup,
  uploadGroupResource,
  getGroupLeaderboard,
  scheduleGroupEvent,
  listJobs,
  getJob,
  applyToJob,
  getJobApplications,
  updateApplicationStatus,
  addJobReview,
  getJobReviews,
  postJob,
  getUserApplications,
  listSkillPaths,
  getSkillPath,
  enrollSkillPath,
  getSkillPathProgress,
  completeModule,
  submitAssessment,
  getCertificate,
  getUserSkillProgress,
  initiatePivot,
  getPivotDetails,
  updatePivotPlan,
  completePivotTask,
  getPivotSuccessStories,
  assignPivotMentor,
  logMilestone,
  logExam,
  logCourse,
  logSkill,
  getCareerPathProgress,
  getProgressMetrics,
  verifyCertificate,
  createAlumniProfile,
  getAlumniProfile,
  listAlumni,
  followAlumni,
  requestMentorship,
  getMentorshipSessions,
  submitMentorshipFeedback,
  getSuccessStories,
  getSalaryGuide,
  getSalaryComparison,
  getWorkLifeBalance,
  addWorkLifeReview,
  listSideHustles,
  getSideHustleDetails,
  trackSideHustle,
  updateSideHustleProgress
} = require('../controllers/phase2Controller');

// ────────────────────────────────────────────────────────────────────────────
// 1. RESUME BUILDER ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.post('/resume', auth, createResume);
router.get('/resume/:id', auth, getResume);
router.get('/resume/user/:userId', auth, getUserResumes);
router.put('/resume/:id', auth, updateResume);
router.delete('/resume/:id', auth, deleteResume);
router.post('/resume/:id/download', auth, downloadResume);
router.post('/resume/:id/check-ats', auth, checkATSScore);
router.get('/resume/:id/career-match', auth, getCareerMatch);

// ────────────────────────────────────────────────────────────────────────────
// 2. STUDY GROUP ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.post('/study-groups', auth, createStudyGroup);
router.get('/study-groups', listStudyGroups);
router.get('/study-groups/:id', auth, getStudyGroup);
router.post('/study-groups/:id/join', auth, joinStudyGroup);
router.post('/study-groups/:id/leave', auth, leaveStudyGroup);
router.post('/study-groups/:id/post', auth, postToGroup);
router.post('/study-groups/:id/resources', auth, uploadGroupResource);
router.get('/study-groups/:id/leaderboard', getGroupLeaderboard);
router.post('/study-groups/:id/event', auth, scheduleGroupEvent);

// ────────────────────────────────────────────────────────────────────────────
// 3. JOB MARKETPLACE ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.get('/jobs', listJobs);
router.get('/jobs/:id', getJob);
router.post('/jobs/:id/apply', auth, applyToJob);
router.get('/jobs/:id/applications', auth, getJobApplications);
router.put('/jobs/application/:appId', auth, updateApplicationStatus);
router.post('/jobs/:id/reviews', auth, addJobReview);
router.get('/jobs/:id/reviews', getJobReviews);
router.post('/jobs', auth, postJob);
router.get('/applications/user/:userId', auth, getUserApplications);

// ────────────────────────────────────────────────────────────────────────────
// 4. SKILL LEARNING PATH ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.get('/skill-paths', listSkillPaths);
router.get('/skill-paths/:id', auth, getSkillPath);
router.post('/skill-paths/:id/enroll', auth, enrollSkillPath);
router.get('/skill-paths/:id/progress', auth, getSkillPathProgress);
router.post('/skill-paths/:pathId/module/:moduleId/complete', auth, completeModule);
router.post('/skill-paths/:pathId/assessment/:assessmentId/submit', auth, submitAssessment);
router.get('/skill-paths/:id/certificate', auth, getCertificate);
router.get('/user/skill-progress', auth, getUserSkillProgress);

// ────────────────────────────────────────────────────────────────────────────
// 5. CAREER PIVOT ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.post('/career-pivot', auth, initiatePivot);
router.get('/career-pivot/:id', auth, getPivotDetails);
router.put('/career-pivot/:id', auth, updatePivotPlan);
router.post('/career-pivot/:id/task-complete', auth, completePivotTask);
router.get('/career-pivot/:id/success-stories', getPivotSuccessStories);
router.post('/career-pivot/:id/assign-mentor', auth, assignPivotMentor);

// ────────────────────────────────────────────────────────────────────────────
// 6. PROGRESS LOG ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.post('/progress/milestone', auth, logMilestone);
router.post('/progress/exam', auth, logExam);
router.post('/progress/course', auth, logCourse);
router.post('/progress/skill', auth, logSkill);
router.get('/progress/:careerPathId', auth, getCareerPathProgress);
router.get('/progress/dashboard/metrics', auth, getProgressMetrics);
router.post('/progress/certificate/verify', auth, verifyCertificate);

// ────────────────────────────────────────────────────────────────────────────
// 7. ALUMNI NETWORK ROUTES
// ────────────────────────────────────────────────────────────────────────────

router.post('/alumni/profile', auth, createAlumniProfile);
router.get('/alumni/:userId', getAlumniProfile);
router.get('/alumni', listAlumni);
router.post('/alumni/:id/follow', auth, followAlumni);
router.post('/mentorship/request', auth, requestMentorship);
router.get('/mentorship/sessions', auth, getMentorshipSessions);
router.post('/mentorship/session/:sessionId/feedback', auth, submitMentorshipFeedback);
router.get('/success-stories', getSuccessStories);

// ────────────────────────────────────────────────────────────────────────────
// 8. CAREER SUPPORT (SALARY, WORK-LIFE, SIDE HUSTLE) ROUTES
// ────────────────────────────────────────────────────────────────────────────

// Salary Negotiation
router.get('/salary-guide/:careerId', getSalaryGuide);
router.get('/salary-guide/comparison/:careerId', getSalaryComparison);

// Work-Life Balance
router.get('/work-life-balance/:careerId', getWorkLifeBalance);
router.post('/work-life-balance/:careerId/review', auth, addWorkLifeReview);

// Side Hustle
router.get('/side-hustles', listSideHustles);
router.get('/side-hustles/:id', getSideHustleDetails);
router.post('/side-hustles/:id/track', auth, trackSideHustle);
router.put('/side-hustles/:id/progress', auth, updateSideHustleProgress);

module.exports = router;
