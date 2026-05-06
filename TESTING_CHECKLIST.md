# ✅ Career Copilot - Testing Checklist

## Pre-Testing Setup

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] Environment variables are set
- [ ] Gemini API key is valid
- [ ] User is registered and logged in

---

## 1. Profile Management

### Create Profile
- [ ] Navigate to `/copilot`
- [ ] Click "Create Profile" button
- [ ] Form modal opens
- [ ] Fill all required fields:
  - [ ] Skills (comma-separated)
  - [ ] Interests (comma-separated)
  - [ ] Current Level (dropdown)
  - [ ] Stream/Branch
  - [ ] Institution
  - [ ] Percentage/CGPA
  - [ ] Target Role
  - [ ] Target Industry
  - [ ] Timeframe
  - [ ] Experience Level (dropdown)
  - [ ] Location
  - [ ] Monthly Budget
- [ ] Click "Save Profile"
- [ ] Success message appears
- [ ] Profile card displays with correct data
- [ ] Form modal closes

### Edit Profile
- [ ] Click "Edit Profile" button
- [ ] Form opens with existing data
- [ ] Modify some fields
- [ ] Click "Save Profile"
- [ ] Changes are reflected
- [ ] Profile card updates

### Validation
- [ ] Try submitting empty required fields → Error
- [ ] Try invalid email format → Error
- [ ] Try negative numbers → Error

---

## 2. Complete System Generation

### Generate All Modules
- [ ] Profile exists with target role
- [ ] Click "Generate Complete System"
- [ ] Loading state shows
- [ ] Wait 30-60 seconds
- [ ] Success message appears
- [ ] All module cards show "Generated" badge
- [ ] Check each module has data

### Error Handling
- [ ] Try generating without profile → Error message
- [ ] Try generating without target role → Error message
- [ ] Check server logs for AI errors

---

## 3. Career Roadmap Module

### View Roadmap
- [ ] Navigate to `/copilot/roadmap`
- [ ] Page loads successfully
- [ ] Overall progress bar displays
- [ ] Current phase is shown
- [ ] All 4 phases are visible:
  - [ ] Beginner
  - [ ] Intermediate
  - [ ] Advanced
  - [ ] Job-ready

### Phase Details
For each phase, verify:
- [ ] Phase name and color
- [ ] Estimated timeline
- [ ] Skills list (5-7 items)
- [ ] Tools/technologies (3-5 items)
- [ ] Resources with:
  - [ ] Title
  - [ ] Type badge
  - [ ] URL (clickable)
  - [ ] Free badge (if applicable)
- [ ] Projects with:
  - [ ] Title
  - [ ] Description
  - [ ] Difficulty badge
  - [ ] Estimated time
- [ ] Milestones list (3-4 items)

### Progress Tracking
- [ ] Drag progress slider
- [ ] Progress updates in real-time
- [ ] Overall progress recalculates
- [ ] Click "Mark as Complete"
- [ ] Phase shows "Completed" badge
- [ ] Current phase advances to next
- [ ] Progress persists on page reload

---

## 4. Mentorship Module

### View Mentorship Plan
- [ ] Navigate to `/copilot/mentorship`
- [ ] Page loads successfully
- [ ] Ideal mentor profiles display (3-5)
- [ ] Each mentor has:
  - [ ] Type
  - [ ] Expertise
  - [ ] Why they fit
  - [ ] Where to find them

### Communities
- [ ] Community cards display (5+)
- [ ] Each has:
  - [ ] Name
  - [ ] Platform
  - [ ] Focus area
  - [ ] Join link (clickable)

### Outreach Templates
- [ ] Templates display (3+)
- [ ] Each has:
  - [ ] Purpose
  - [ ] Template text
  - [ ] Copy button
- [ ] Click copy button
- [ ] Text copied to clipboard
- [ ] Test paste in notepad

### Mentorship Structure
- [ ] Frequency displays
- [ ] Structure displays
- [ ] Discussion goals list

### Add Mentor
- [ ] Click "+ Add Mentor"
- [ ] Form modal opens
- [ ] Fill name and expertise
- [ ] Click "Add Mentor"
- [ ] Mentor appears in active mentors
- [ ] Connected date shows
- [ ] Last contact date shows

---

## 5. Education Module

### View Colleges
- [ ] Navigate to `/copilot/education`
- [ ] Page loads successfully
- [ ] College cards display
- [ ] Category filter buttons work:
  - [ ] All Colleges
  - [ ] Dream
  - [ ] Target
  - [ ] Safe

### College Details
For each college, verify:
- [ ] Name
- [ ] Category badge (correct color)
- [ ] Why it fits
- [ ] Required exams (tags)
- [ ] Expected cutoff
- [ ] Fees (formatted correctly)
- [ ] Average salary
- [ ] Placement rate
- [ ] Top recruiters (tags)
- [ ] Application strategy
- [ ] Deadline (if present)

### Alternative Paths
- [ ] Alternative cards display (2-3)
- [ ] Each has:
  - [ ] Title
  - [ ] Description
  - [ ] Cost
  - [ ] Duration

### Category Explanations
- [ ] Dream explanation displays
- [ ] Target explanation displays
- [ ] Safe explanation displays
- [ ] Icons show correct colors

---

## 6. Market Analytics Module

### View Analytics
- [ ] Navigate to `/copilot/analytics`
- [ ] Page loads successfully

### Skill Gap Analysis
- [ ] Match percentage displays (circle)
- [ ] Strong skills list shows
- [ ] Gap skills cards display
- [ ] Each gap skill has:
  - [ ] Skill name
  - [ ] Importance badge (color-coded)
  - [ ] Learning time
  - [ ] Resources
- [ ] Priority actions list (numbered)

### In-Demand Skills
- [ ] Skills table displays (10 items)
- [ ] Each skill has:
  - [ ] Rank number
  - [ ] Skill name
  - [ ] Salary impact
  - [ ] Demand score (/100)
  - [ ] Trend icon and text

### Industry Trends
- [ ] Trend cards display (5+)
- [ ] Each has:
  - [ ] Role name
  - [ ] Status (color-coded)
  - [ ] Growth rate
  - [ ] Reason

### Salary Benchmarks
- [ ] Salary rows display (5 levels)
- [ ] Each has:
  - [ ] Experience level
  - [ ] Min salary (formatted)
  - [ ] Median salary (highlighted)
  - [ ] Max salary (formatted)

### Hiring Insights
- [ ] Top companies display (tags)
- [ ] Hiring trends text
- [ ] Competition level badge

### Refresh Data
- [ ] Last updated date shows
- [ ] Click "Refresh Data" button
- [ ] Data reloads

---

## 7. Interview Prep Module

### View Interview Prep
- [ ] Navigate to `/copilot/interview`
- [ ] Page loads successfully
- [ ] Tab navigation works

### Technical Questions Tab
- [ ] Technical questions display (10+)
- [ ] Each question has:
  - [ ] Question text
  - [ ] Difficulty badge (color-coded)
  - [ ] Topic badge
  - [ ] Sample answer
  - [ ] Key points list

### Behavioral Questions Tab
- [ ] Switch to behavioral tab
- [ ] STAR info banner displays
- [ ] Behavioral questions display (5+)
- [ ] Each has:
  - [ ] Question text
  - [ ] STAR framework (4 sections)
  - [ ] Tips list

### Mock Scenarios Tab
- [ ] Switch to scenarios tab
- [ ] Scenarios display (3+)
- [ ] Each has:
  - [ ] Title
  - [ ] Description
  - [ ] Expected approach

### Weakness Detection Tab
- [ ] Switch to weaknesses tab
- [ ] Weakness cards display (3-4)
- [ ] Each has:
  - [ ] Area name
  - [ ] Severity badge (color-coded)
  - [ ] Improvement plan

### Practice History
- [ ] If history exists, cards display
- [ ] Each has:
  - [ ] Date
  - [ ] Type
  - [ ] Score
  - [ ] Feedback

### Record Practice
- [ ] Click "Record Practice Session"
- [ ] Form modal opens
- [ ] Select type (dropdown)
- [ ] Enter score (0-100)
- [ ] Enter feedback (textarea)
- [ ] Click "Save Practice"
- [ ] Practice appears in history
- [ ] Modal closes

---

## 8. Dashboard Integration

### View Dashboard
- [ ] Navigate to `/dashboard`
- [ ] Career Copilot data displays
- [ ] Shows:
  - [ ] Target role
  - [ ] Current phase
  - [ ] Roadmap progress
  - [ ] Skills acquired count
  - [ ] Projects completed count
  - [ ] Active mentors count

---

## 9. Progress Tracking

### Track Skill
- [ ] API endpoint: POST `/api/copilot/skill`
- [ ] Add new skill
- [ ] Skill appears in profile
- [ ] Update existing skill level
- [ ] Level updates

### Add Project
- [ ] API endpoint: POST `/api/copilot/project`
- [ ] Add project with GitHub URL
- [ ] Project appears in profile
- [ ] Completion date recorded

---

## 10. Navigation & UI

### Header Navigation
- [ ] "Career Copilot" link works
- [ ] "Roadmap" link works
- [ ] "Mentorship" link works
- [ ] "Market Analytics" link works
- [ ] "Interview Prep" link works
- [ ] All require authentication

### Responsive Design
- [ ] Test on desktop (1920px)
- [ ] Test on laptop (1366px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] All layouts adapt correctly
- [ ] No horizontal scroll
- [ ] Buttons are clickable
- [ ] Text is readable

### Dark Mode
- [ ] Toggle dark mode
- [ ] All pages adapt
- [ ] Colors are readable
- [ ] Contrast is good
- [ ] No white flashes

---

## 11. API Testing

### Profile Endpoints
```bash
# Create profile
curl -X POST http://localhost:5000/api/copilot/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skills":["JS"],"interests":["Web"],...}'

# Get profile
curl http://localhost:5000/api/copilot/profile \
  -H "Authorization: Bearer TOKEN"
```

- [ ] POST /api/copilot/profile → 200
- [ ] GET /api/copilot/profile → 200
- [ ] Without auth → 401

### Generation Endpoints
- [ ] POST /api/copilot/generate-complete → 200
- [ ] POST /api/copilot/roadmap → 200
- [ ] POST /api/copilot/mentorship → 200
- [ ] POST /api/copilot/education → 200
- [ ] POST /api/copilot/market-analytics → 200
- [ ] POST /api/copilot/interview-prep → 200

### Tracking Endpoints
- [ ] PUT /api/copilot/roadmap/progress → 200
- [ ] POST /api/copilot/mentor → 200
- [ ] POST /api/copilot/skill → 200
- [ ] POST /api/copilot/project → 200
- [ ] POST /api/copilot/interview-practice → 200

### Dashboard
- [ ] GET /api/copilot/dashboard → 200

---

## 12. Error Handling

### Frontend Errors
- [ ] No profile → Shows message
- [ ] No data → Shows message
- [ ] Loading states work
- [ ] Error messages display
- [ ] Retry buttons work

### Backend Errors
- [ ] Invalid token → 401
- [ ] Missing fields → 400
- [ ] Not found → 404
- [ ] Server error → 500
- [ ] Rate limit → 429

### AI Errors
- [ ] Invalid API key → Fallback data
- [ ] Quota exceeded → Error message
- [ ] Timeout → Retry or fallback
- [ ] Invalid response → Fallback data

---

## 13. Performance

### Load Times
- [ ] Profile page < 2s
- [ ] Roadmap page < 2s
- [ ] Mentorship page < 2s
- [ ] Education page < 2s
- [ ] Analytics page < 2s
- [ ] Interview page < 2s

### AI Generation
- [ ] Complete system: 30-60s
- [ ] Single module: 10-20s
- [ ] Shows loading state
- [ ] Doesn't freeze UI

### Database
- [ ] Queries are fast
- [ ] No N+1 queries
- [ ] Indexes work
- [ ] Updates are instant

---

## 14. Security

### Authentication
- [ ] Protected routes require login
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] User can only access own data

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF protection
- [ ] Rate limiting works

### Data Privacy
- [ ] Passwords hashed
- [ ] Sensitive data encrypted
- [ ] API keys not exposed
- [ ] CORS configured

---

## 15. Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

---

## 16. Edge Cases

### Empty States
- [ ] No profile created
- [ ] No modules generated
- [ ] No mentors added
- [ ] No skills tracked
- [ ] No projects completed

### Extreme Data
- [ ] Very long skill names
- [ ] 100+ skills
- [ ] Special characters
- [ ] Unicode characters
- [ ] Very long descriptions

### Network Issues
- [ ] Slow connection
- [ ] Connection lost
- [ ] Timeout
- [ ] Retry logic

---

## 17. Accessibility

### Keyboard Navigation
- [ ] Tab through forms
- [ ] Enter to submit
- [ ] Escape to close modals
- [ ] Arrow keys in dropdowns

### Screen Readers
- [ ] Alt text on images
- [ ] ARIA labels
- [ ] Semantic HTML
- [ ] Focus indicators

### Color Contrast
- [ ] Text readable
- [ ] Buttons visible
- [ ] Links distinguishable
- [ ] Dark mode accessible

---

## 18. Documentation

### Code Documentation
- [ ] Functions commented
- [ ] Complex logic explained
- [ ] API endpoints documented
- [ ] Models documented

### User Documentation
- [ ] README complete
- [ ] API docs complete
- [ ] Quick start guide
- [ ] Troubleshooting section

---

## 19. Deployment Readiness

### Environment
- [ ] Production .env configured
- [ ] API keys secured
- [ ] Database connection string
- [ ] CORS origins set

### Build
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] No console warnings
- [ ] Assets optimized

### Monitoring
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Usage analytics
- [ ] Health checks

---

## 20. Final Checks

### Functionality
- [ ] All features work
- [ ] No broken links
- [ ] No console errors
- [ ] No network errors

### User Experience
- [ ] Intuitive navigation
- [ ] Clear instructions
- [ ] Helpful error messages
- [ ] Smooth animations

### Code Quality
- [ ] No unused code
- [ ] Consistent formatting
- [ ] Proper naming
- [ ] DRY principles

---

## ✅ Testing Complete!

**Date**: ___________  
**Tester**: ___________  
**Pass Rate**: _____ / _____  
**Issues Found**: _____  
**Status**: [ ] Pass [ ] Fail [ ] Needs Work  

---

## 🐛 Issues Log

| # | Issue | Severity | Status | Notes |
|---|-------|----------|--------|-------|
| 1 |       |          |        |       |
| 2 |       |          |        |       |
| 3 |       |          |        |       |

---

**Ready for Production**: [ ] Yes [ ] No

**Notes**:
_______________________________________
_______________________________________
_______________________________________
