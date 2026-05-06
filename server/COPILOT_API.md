# Career Copilot API Documentation

## Overview
The Career Copilot is an AI-powered system that provides personalized, data-driven career guidance through 5 core modules:

1. **Personalized Career Roadmap** - Phase-by-phase learning journey
2. **Mentorship & Community Network** - Connection strategies and templates
3. **College/Education Recommendations** - Dream/Target/Safe categorization
4. **Real-Time Market Analytics** - Skills, trends, salaries, and gap analysis
5. **Interview Preparation System** - Technical, behavioral, and mock scenarios

---

## Base URL
```
http://localhost:5000/api/copilot
```

---

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create/Update Career Profile
**POST** `/profile`

Create or update user's career profile with skills, interests, goals, etc.

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI", "Startups"],
  "academicBackground": {
    "currentLevel": "undergraduate",
    "stream": "Computer Science",
    "institution": "XYZ University",
    "percentage": 85
  },
  "careerGoals": {
    "targetRole": "Full Stack Developer",
    "targetIndustry": "Technology",
    "timeframe": "6 months"
  },
  "experienceLevel": "student",
  "location": "Bangalore, India",
  "budgetConstraints": {
    "monthly": 5000,
    "currency": "INR"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile created/updated successfully",
  "data": { /* CareerProfile object */ }
}
```

---

### 2. Get Career Profile
**GET** `/profile`

Retrieve the user's complete career profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "...",
    "profile": { /* user profile data */ },
    "roadmap": { /* career roadmap */ },
    "mentorship": { /* mentorship plan */ },
    "educationRecommendations": { /* college recommendations */ },
    "marketAnalytics": { /* market insights */ },
    "interviewPrep": { /* interview questions */ }
  }
}
```

---

### 3. Generate Complete Career Success System
**POST** `/generate-complete`

Generate all 5 modules at once using AI. This is the main endpoint that creates a comprehensive career plan.

**Requirements:**
- User must have a profile created
- Profile must include `careerGoals.targetRole`

**Response:**
```json
{
  "success": true,
  "message": "Complete career success system generated",
  "data": {
    "roadmap": {
      "phases": [
        {
          "name": "beginner",
          "skills": ["HTML", "CSS", "JavaScript Basics"],
          "tools": ["VS Code", "Git", "Chrome DevTools"],
          "resources": [
            {
              "title": "FreeCodeCamp - Responsive Web Design",
              "type": "course",
              "url": "https://freecodecamp.org",
              "free": true
            }
          ],
          "projects": [
            {
              "title": "Personal Portfolio Website",
              "description": "Build a responsive portfolio showcasing your skills",
              "difficulty": "easy",
              "estimatedTime": "1 week"
            }
          ],
          "milestones": [
            "Complete HTML/CSS fundamentals",
            "Deploy first website",
            "Learn Git basics"
          ],
          "estimatedTimeline": "2-3 months"
        }
        /* ... intermediate, advanced, job-ready phases */
      ],
      "currentPhase": "beginner",
      "overallProgress": 0
    },
    "mentorship": {
      "idealMentors": [
        {
          "type": "Senior Full Stack Developer",
          "expertise": "MERN Stack, System Design",
          "why": "Can guide on production-level code and architecture",
          "whereToFind": "LinkedIn, local tech meetups, GitHub"
        }
      ],
      "communities": [
        {
          "name": "ReactJS India",
          "platform": "Discord",
          "url": "https://discord.gg/reactjs-india",
          "focus": "React development, job opportunities"
        }
      ],
      "outreachTemplates": [
        {
          "purpose": "Initial connection",
          "template": "Hi [Name], I'm a student learning full stack development and really admire your work on [specific project]. Would you be open to a 15-minute call to share advice on breaking into the industry?"
        }
      ],
      "mentorshipPlan": {
        "frequency": "Bi-weekly 30-minute calls",
        "discussionGoals": [
          "Code review and best practices",
          "Career guidance and job search strategy",
          "Project ideas and technical challenges"
        ],
        "structure": "Month 1: Fundamentals review, Month 2-3: Project building, Month 4+: Interview prep"
      }
    },
    "educationRecommendations": {
      "colleges": [
        {
          "name": "IIT Bombay",
          "category": "dream",
          "whyFits": "Top-tier CS program, excellent placement record, strong alumni network",
          "requiredExams": ["JEE Advanced"],
          "expectedCutoff": "Top 2000 rank",
          "fees": {
            "amount": 200000,
            "currency": "INR",
            "duration": "per year"
          },
          "roi": {
            "averageSalary": "20 LPA",
            "placementRate": "95%",
            "topRecruiters": ["Google", "Microsoft", "Amazon"]
          },
          "applicationStrategy": "Focus on JEE Advanced preparation, maintain 90+ in boards"
        }
      ],
      "alternativePaths": [
        {
          "title": "Full Stack Web Development Bootcamp",
          "description": "Intensive 6-month program with job guarantee",
          "cost": "₹1.5 lakhs",
          "duration": "6 months"
        }
      ]
    },
    "marketAnalytics": {
      "inDemandSkills": [
        {
          "skill": "React.js",
          "demandScore": 95,
          "trend": "rising",
          "avgSalaryImpact": "+2 LPA"
        },
        {
          "skill": "Node.js",
          "demandScore": 92,
          "trend": "stable",
          "avgSalaryImpact": "+1.5 LPA"
        }
      ],
      "industryTrends": [
        {
          "role": "Full Stack Developer",
          "status": "growing",
          "growthRate": "25%",
          "reason": "Digital transformation across industries"
        }
      ],
      "salaryBenchmarks": [
        {
          "experienceLevel": "fresher",
          "minSalary": 400000,
          "maxSalary": 800000,
          "median": 600000,
          "currency": "INR"
        }
      ],
      "hiringInsights": {
        "topCompanies": ["Flipkart", "Swiggy", "Razorpay", "CRED"],
        "hiringTrends": "Strong demand for full stack developers",
        "competitionLevel": "High"
      },
      "skillGapAnalysis": {
        "matchPercentage": 65,
        "strongSkills": ["JavaScript", "React"],
        "gapSkills": [
          {
            "skill": "System Design",
            "importance": "critical",
            "learningTime": "3 months",
            "resources": "Grokking System Design, YouTube channels"
          }
        ],
        "priorityActions": [
          "Learn Docker and containerization",
          "Build 2-3 full stack projects",
          "Practice DSA for interviews"
        ]
      }
    },
    "interviewPrep": {
      "technicalQuestions": [
        {
          "question": "Explain the difference between var, let, and const in JavaScript",
          "difficulty": "easy",
          "topic": "JavaScript Fundamentals",
          "sampleAnswer": "var is function-scoped and can be redeclared, let is block-scoped and cannot be redeclared, const is block-scoped and cannot be reassigned",
          "keyPoints": ["Scope differences", "Hoisting behavior", "Reassignment rules"]
        }
      ],
      "behavioralQuestions": [
        {
          "question": "Tell me about a time you faced a technical challenge",
          "starFramework": {
            "situation": "While building my e-commerce project, the API calls were very slow",
            "task": "I needed to improve performance without changing the backend",
            "action": "I implemented caching, lazy loading, and optimized re-renders using React.memo",
            "result": "Reduced load time by 60% and learned optimization techniques"
          },
          "tips": ["Be specific with metrics", "Show problem-solving approach", "Highlight learning"]
        }
      ],
      "mockScenarios": [
        {
          "title": "Design a URL Shortener",
          "description": "Design a system like bit.ly that shortens URLs",
          "expectedApproach": "Discuss requirements, database schema, hashing algorithm, scalability"
        }
      ],
      "weaknessDetection": [
        {
          "area": "System Design",
          "severity": "high",
          "improvementPlan": "Study distributed systems, practice on Leetcode system design, build scalable projects"
        }
      ]
    }
  }
}
```

---

### 4. Generate Individual Modules

Generate specific modules separately:

#### 4.1 Generate Career Roadmap
**POST** `/roadmap`

#### 4.2 Generate Mentorship Plan
**POST** `/mentorship`

#### 4.3 Generate Education Recommendations
**POST** `/education`

#### 4.4 Generate Market Analytics
**POST** `/market-analytics`

#### 4.5 Generate Interview Prep
**POST** `/interview-prep`

All return similar structure to the complete system but only for their specific module.

---

### 5. Update Roadmap Progress
**PUT** `/roadmap/progress`

Track progress through roadmap phases.

**Request Body:**
```json
{
  "phase": "beginner",
  "progress": 75,
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress updated",
  "data": { /* updated roadmap */ }
}
```

---

### 6. Add Mentor Connection
**POST** `/mentor`

Record when you connect with a mentor.

**Request Body:**
```json
{
  "name": "John Doe",
  "expertise": "Full Stack Development"
}
```

---

### 7. Track Skill Acquisition
**POST** `/skill`

Log skills as you learn them.

**Request Body:**
```json
{
  "skill": "Docker",
  "level": "intermediate"
}
```

---

### 8. Add Completed Project
**POST** `/project`

Record completed projects.

**Request Body:**
```json
{
  "title": "E-commerce Platform",
  "githubUrl": "https://github.com/username/project"
}
```

---

### 9. Record Interview Practice
**POST** `/interview-practice`

Track interview practice sessions.

**Request Body:**
```json
{
  "type": "technical",
  "score": 85,
  "feedback": "Good problem-solving, need to improve time complexity analysis"
}
```

---

### 10. Get Dashboard Summary
**GET** `/dashboard`

Get a quick overview of your career journey.

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "targetRole": "Full Stack Developer",
      "experienceLevel": "student",
      "currentPhase": "intermediate"
    },
    "progress": {
      "roadmapProgress": 45,
      "skillsAcquired": 12,
      "projectsCompleted": 3,
      "certificationsEarned": 2
    },
    "nextSteps": {
      "currentPhaseSkills": ["Node.js", "Express", "MongoDB"],
      "priorityActions": ["Build REST API", "Learn authentication"],
      "upcomingMilestones": ["Complete backend project", "Deploy to cloud"]
    },
    "mentorship": {
      "activeMentors": 2,
      "communities": 5
    },
    "marketInsights": {
      "matchPercentage": 65,
      "topSkillGaps": [
        {
          "skill": "System Design",
          "importance": "critical",
          "learningTime": "3 months"
        }
      ]
    }
  }
}
```

---

## Usage Flow

### For New Users:
1. **Create Profile** - POST `/profile` with your details
2. **Generate Complete System** - POST `/generate-complete` to get all modules
3. **Review Dashboard** - GET `/dashboard` to see your personalized plan
4. **Track Progress** - Use progress endpoints as you learn

### For Existing Users:
1. **Get Profile** - GET `/profile` to see your current plan
2. **Update Progress** - PUT `/roadmap/progress` as you complete phases
3. **Regenerate Modules** - POST individual module endpoints to refresh with latest data
4. **Track Achievements** - POST `/skill`, `/project`, `/mentor` as you progress

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad request (missing required fields)
- `401` - Unauthorized (invalid/missing token)
- `404` - Resource not found (profile doesn't exist)
- `500` - Server error

---

## AI Provider Configuration

The system uses AI (Gemini or OpenAI) to generate personalized content. Configure in `.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash

# Optional OpenAI fallback
OPENAI_API_KEY=your_openai_key
ALLOW_OPENAI_FALLBACK=true
```

---

## Best Practices

1. **Create Profile First** - Always create a profile before generating modules
2. **Be Specific** - More detailed profile = better recommendations
3. **Update Regularly** - Update progress to get accurate next steps
4. **Regenerate Periodically** - Market analytics should be refreshed monthly
5. **Track Everything** - Log skills, projects, and practice for better insights

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- AI endpoints: 30 requests per 15 minutes

---

## Support

For issues or questions, check the server logs or contact support.
