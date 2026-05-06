const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

class CareerCopilotService {
  constructor() {
    // Initialize AI providers
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'YOUR_GEMINI_KEY_HERE') {
      this.genAI = new GoogleGenerativeAI(geminiKey);
      this.geminiModel = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
      console.log(`✅ Career Copilot: Gemini AI connected (${GEMINI_MODEL})`);
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.startsWith('sk-')) {
      this.openai = new OpenAI({ apiKey: openaiKey });
      console.log('✅ Career Copilot: OpenAI connected');
    }
  }

  // ═══════════════════════════════════════════════════════
  //  CORE AI INTERACTION
  // ═══════════════════════════════════════════════════════

  async _askAI(prompt, systemInstructions = '') {
    try {
      if (this.geminiModel && AI_PROVIDER !== 'openai') {
        const fullPrompt = [systemInstructions, prompt].filter(Boolean).join('\n\n');
        const result = await this.geminiModel.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
      }

      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        });
        return response.choices[0].message.content.trim();
      }

      throw new Error('No AI provider available');
    } catch (error) {
      console.error('AI request failed:', error.message);
      throw error;
    }
  }

  _parseJSON(text) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (err) { /* continue */ }
    }
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try { return JSON.parse(cleaned); } catch (err) { /* fall through */ }
    return null;
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 1: PERSONALIZED CAREER ROADMAP
  // ═══════════════════════════════════════════════════════

  async generateCareerRoadmap(userProfile) {
    const { skills, interests, academicBackground, careerGoals, experienceLevel, budgetConstraints } = userProfile;

    const prompt = `
Generate a complete career roadmap for this profile:
- Skills: ${skills.join(', ')}
- Interests: ${interests.join(', ')}
- Academic: ${academicBackground.currentLevel} in ${academicBackground.stream}
- Goal: ${careerGoals.targetRole} in ${careerGoals.targetIndustry}
- Experience: ${experienceLevel}
- Budget: ${budgetConstraints?.monthly || 'flexible'} per month

Create 4 phases: Beginner → Intermediate → Advanced → Job-ready

For EACH phase provide:
1. Skills to learn (5-7 specific skills)
2. Tools/technologies (3-5 tools)
3. Resources (3-4 with URLs, mix of free/paid)
4. Projects (2-3 practical projects with descriptions)
5. Milestones (3-4 checkpoints)
6. Estimated timeline (realistic duration)

Return ONLY valid JSON:
{
  "phases": [
    {
      "name": "beginner",
      "skills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"],
      "resources": [
        {"title": "Resource Name", "type": "course", "url": "https://...", "free": true}
      ],
      "projects": [
        {"title": "Project Name", "description": "What to build", "difficulty": "easy", "estimatedTime": "2 weeks"}
      ],
      "milestones": ["milestone1", "milestone2"],
      "estimatedTimeline": "2-3 months"
    }
  ],
  "currentPhase": "beginner",
  "overallProgress": 0
}`;

    const systemInstructions = `You are an expert career strategist. Create practical, execution-focused roadmaps.
Focus on real-world skills and projects. Prioritize free resources when budget is limited.
Be specific with tool names, course platforms, and project ideas. Return ONLY valid JSON.`;

    try {
      const response = await this._askAI(prompt, systemInstructions);
      const parsed = this._parseJSON(response);
      
      if (parsed && parsed.phases) {
        parsed.generatedAt = new Date();
        return parsed;
      }

      return this._getDefaultRoadmap(careerGoals.targetRole);
    } catch (error) {
      console.error('Roadmap generation error:', error.message);
      return this._getDefaultRoadmap(careerGoals.targetRole);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 2: MENTORSHIP & COMMUNITY NETWORK
  // ═══════════════════════════════════════════════════════

  async generateMentorshipPlan(userProfile) {
    const { careerGoals, experienceLevel } = userProfile;

    const prompt = `
Create a mentorship and community strategy for:
- Target Role: ${careerGoals.targetRole}
- Experience: ${experienceLevel}

Provide:
1. 3-5 ideal mentor profiles (type, expertise, where to find them)
2. 5 relevant communities (name, platform, URL, focus area)
3. 3 outreach message templates (for different purposes)
4. Mentorship structure (frequency, discussion goals, engagement plan)

Return ONLY valid JSON:
{
  "idealMentors": [
    {"type": "Senior Engineer", "expertise": "Backend Systems", "why": "reason", "whereToFind": "LinkedIn, tech meetups"}
  ],
  "communities": [
    {"name": "Community Name", "platform": "Discord/Slack", "url": "https://...", "focus": "focus area"}
  ],
  "outreachTemplates": [
    {"purpose": "Initial connection", "template": "Hi [Name], I'm..."}
  ],
  "mentorshipPlan": {
    "frequency": "Weekly 30-min calls",
    "discussionGoals": ["goal1", "goal2"],
    "structure": "Month 1: Basics, Month 2: Projects..."
  }
}`;

    const systemInstructions = `You are a networking and mentorship expert. Create actionable, realistic plans.
Focus on retention and long-term engagement. Provide specific platforms and communities. Return ONLY valid JSON.`;

    try {
      const response = await this._askAI(prompt, systemInstructions);
      const parsed = this._parseJSON(response);
      
      if (parsed && parsed.idealMentors) {
        return parsed;
      }

      return this._getDefaultMentorshipPlan(careerGoals.targetRole);
    } catch (error) {
      console.error('Mentorship plan error:', error.message);
      return this._getDefaultMentorshipPlan(careerGoals.targetRole);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 3: COLLEGE/EDUCATION RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════

  async generateEducationRecommendations(userProfile) {
    const { academicBackground, careerGoals, location, budgetConstraints } = userProfile;

    const prompt = `
Recommend colleges/education for:
- Current Level: ${academicBackground.currentLevel}
- Stream: ${academicBackground.stream}
- Target: ${careerGoals.targetRole}
- Location: ${location || 'India'}
- Budget: ${budgetConstraints?.monthly || 'flexible'}

Categorize as Dream/Target/Safe (3-4 colleges each)

For each college provide:
1. Why it fits the user
2. Required exams & expected cutoffs
3. Fees + ROI (avg salary, placement rate, top recruiters)
4. Application strategy

Also suggest 2-3 alternative paths (bootcamps, online degrees, certifications)

Return ONLY valid JSON:
{
  "colleges": [
    {
      "name": "College Name",
      "category": "dream",
      "whyFits": "reason",
      "requiredExams": ["JEE", "GATE"],
      "expectedCutoff": "95 percentile",
      "fees": {"amount": 200000, "currency": "INR", "duration": "per year"},
      "roi": {"averageSalary": "12 LPA", "placementRate": "85%", "topRecruiters": ["Google", "Amazon"]},
      "applicationStrategy": "Focus on..."
    }
  ],
  "alternativePaths": [
    {"title": "Path Name", "description": "details", "cost": "50k", "duration": "6 months"}
  ]
}`;

    const systemInstructions = `You are an education counselor expert in Indian education system.
Provide realistic cutoffs and fees. Focus on ROI and placement outcomes. Return ONLY valid JSON.`;

    try {
      const response = await this._askAI(prompt, systemInstructions);
      const parsed = this._parseJSON(response);
      
      if (parsed && parsed.colleges) {
        return parsed;
      }

      return this._getDefaultEducationRecommendations(careerGoals.targetRole);
    } catch (error) {
      console.error('Education recommendations error:', error.message);
      return this._getDefaultEducationRecommendations(careerGoals.targetRole);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 4: REAL-TIME MARKET ANALYTICS
  // ═══════════════════════════════════════════════════════

  async generateMarketAnalytics(userProfile) {
    const { skills, careerGoals } = userProfile;

    const prompt = `
Analyze market for: ${careerGoals.targetRole} in ${careerGoals.targetIndustry}

Provide:
1. Top 10 in-demand skills (ranked with demand score 1-100, trend, salary impact)
2. Industry trends (5 growing/declining roles with growth rates)
3. Salary benchmarks by experience (student/fresher/1-3yr/3-5yr/5+yr)
4. Hiring insights (top companies, trends, competition level)
5. Skill gap analysis comparing user skills: ${skills.join(', ')}

Return ONLY valid JSON:
{
  "inDemandSkills": [
    {"skill": "Python", "demandScore": 95, "trend": "rising", "avgSalaryImpact": "+2 LPA"}
  ],
  "industryTrends": [
    {"role": "AI Engineer", "status": "growing", "growthRate": "40%", "reason": "AI adoption"}
  ],
  "salaryBenchmarks": [
    {"experienceLevel": "fresher", "minSalary": 400000, "maxSalary": 800000, "median": 600000, "currency": "INR"}
  ],
  "hiringInsights": {
    "topCompanies": ["Google", "Amazon"],
    "hiringTrends": "Strong demand",
    "competitionLevel": "High"
  },
  "skillGapAnalysis": {
    "matchPercentage": 65,
    "strongSkills": ["skill1"],
    "gapSkills": [
      {"skill": "Docker", "importance": "critical", "learningTime": "2 months", "resources": "suggestion"}
    ],
    "priorityActions": ["Learn Docker", "Build projects"]
  }
}`;

    const systemInstructions = `You are a market research analyst. Provide data-driven insights.
Use realistic Indian salary figures. Be specific about skill gaps. Return ONLY valid JSON.`;

    try {
      const response = await this._askAI(prompt, systemInstructions);
      const parsed = this._parseJSON(response);
      
      if (parsed && parsed.inDemandSkills) {
        parsed.lastUpdated = new Date();
        return parsed;
      }

      return this._getDefaultMarketAnalytics(careerGoals.targetRole, skills);
    } catch (error) {
      console.error('Market analytics error:', error.message);
      return this._getDefaultMarketAnalytics(careerGoals.targetRole, skills);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  MODULE 5: INTERVIEW PREPARATION SYSTEM
  // ═══════════════════════════════════════════════════════

  async generateInterviewPrep(userProfile) {
    const { careerGoals, experienceLevel, skills } = userProfile;

    const prompt = `
Create interview prep for: ${careerGoals.targetRole} (${experienceLevel})
User skills: ${skills.join(', ')}

Provide:
1. 10 technical questions (mix of easy/medium/hard with sample answers)
2. 5 behavioral questions (with STAR framework answers)
3. 3 role-specific mock scenarios
4. Weakness detection (3-4 areas based on skill gaps)
5. Improvement plan for each weakness

Return ONLY valid JSON:
{
  "technicalQuestions": [
    {
      "question": "Explain REST API",
      "difficulty": "medium",
      "topic": "Backend",
      "sampleAnswer": "REST is...",
      "keyPoints": ["point1", "point2"]
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time...",
      "starFramework": {
        "situation": "I was working on...",
        "task": "My goal was...",
        "action": "I decided to...",
        "result": "This led to..."
      },
      "tips": ["Be specific", "Quantify results"]
    }
  ],
  "mockScenarios": [
    {
      "title": "System Design",
      "description": "Design a URL shortener",
      "expectedApproach": "Start with requirements..."
    }
  ],
  "weaknessDetection": [
    {
      "area": "System Design",
      "severity": "high",
      "improvementPlan": "Study distributed systems, practice on..."
    }
  ]
}`;

    const systemInstructions = `You are a technical recruiter and interview coach.
Provide realistic questions asked in Indian tech companies. Use STAR method for behavioral questions.
Detect weaknesses based on skill gaps. Return ONLY valid JSON.`;

    try {
      const response = await this._askAI(prompt, systemInstructions);
      const parsed = this._parseJSON(response);
      
      if (parsed && parsed.technicalQuestions) {
        return parsed;
      }

      return this._getDefaultInterviewPrep(careerGoals.targetRole);
    } catch (error) {
      console.error('Interview prep error:', error.message);
      return this._getDefaultInterviewPrep(careerGoals.targetRole);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  COMPLETE CAREER SUCCESS SYSTEM
  // ═══════════════════════════════════════════════════════

  async generateCompleteSystem(userProfile) {
    console.log('🚀 Generating complete career success system...');

    try {
      const [roadmap, mentorship, education, market, interview] = await Promise.all([
        this.generateCareerRoadmap(userProfile),
        this.generateMentorshipPlan(userProfile),
        this.generateEducationRecommendations(userProfile),
        this.generateMarketAnalytics(userProfile),
        this.generateInterviewPrep(userProfile),
      ]);

      return {
        roadmap,
        mentorship,
        educationRecommendations: education,
        marketAnalytics: market,
        interviewPrep: interview,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Complete system generation error:', error.message);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════
  //  FALLBACK DEFAULTS
  // ═══════════════════════════════════════════════════════

  _getDefaultRoadmap(targetRole) {
    return {
      phases: [
        {
          name: 'beginner',
          skills: ['Programming Basics', 'Git', 'Problem Solving'],
          tools: ['VS Code', 'GitHub', 'Terminal'],
          resources: [
            { title: 'FreeCodeCamp', type: 'course', url: 'https://freecodecamp.org', free: true }
          ],
          projects: [
            { title: 'Personal Portfolio', description: 'Build your first website', difficulty: 'easy', estimatedTime: '1 week' }
          ],
          milestones: ['Complete basic syntax', 'First project deployed'],
          estimatedTimeline: '2-3 months'
        }
      ],
      currentPhase: 'beginner',
      overallProgress: 0,
      generatedAt: new Date()
    };
  }

  _getDefaultMentorshipPlan(targetRole) {
    return {
      idealMentors: [
        { type: 'Senior Professional', expertise: targetRole, why: 'Industry experience', whereToFind: 'LinkedIn, Meetups' }
      ],
      communities: [
        { name: 'Tech Community', platform: 'Discord', url: 'https://discord.gg/tech', focus: 'General tech' }
      ],
      outreachTemplates: [
        { purpose: 'Initial connection', template: 'Hi, I\'m interested in learning about...' }
      ],
      mentorshipPlan: {
        frequency: 'Bi-weekly',
        discussionGoals: ['Career guidance', 'Skill development'],
        structure: 'Regular check-ins and project reviews'
      }
    };
  }

  _getDefaultEducationRecommendations(targetRole) {
    return {
      colleges: [
        {
          name: 'Top Institute',
          category: 'dream',
          whyFits: 'Excellent placement record',
          requiredExams: ['Entrance Exam'],
          expectedCutoff: '90+ percentile',
          fees: { amount: 200000, currency: 'INR', duration: 'per year' },
          roi: { averageSalary: '10 LPA', placementRate: '80%', topRecruiters: ['Top Companies'] },
          applicationStrategy: 'Focus on entrance exam preparation'
        }
      ],
      alternativePaths: [
        { title: 'Online Bootcamp', description: 'Intensive training program', cost: '50k', duration: '6 months' }
      ]
    };
  }

  _getDefaultMarketAnalytics(targetRole, userSkills) {
    return {
      inDemandSkills: [
        { skill: 'Core Skill', demandScore: 85, trend: 'rising', avgSalaryImpact: '+2 LPA' }
      ],
      industryTrends: [
        { role: targetRole, status: 'growing', growthRate: '20%', reason: 'Market demand' }
      ],
      salaryBenchmarks: [
        { experienceLevel: 'fresher', minSalary: 400000, maxSalary: 800000, median: 600000, currency: 'INR' }
      ],
      hiringInsights: {
        topCompanies: ['Leading Companies'],
        hiringTrends: 'Steady growth',
        competitionLevel: 'Moderate'
      },
      skillGapAnalysis: {
        matchPercentage: 50,
        strongSkills: userSkills.slice(0, 2),
        gapSkills: [
          { skill: 'Advanced Skill', importance: 'critical', learningTime: '3 months', resources: 'Online courses' }
        ],
        priorityActions: ['Build projects', 'Learn in-demand skills']
      },
      lastUpdated: new Date()
    };
  }

  _getDefaultInterviewPrep(targetRole) {
    return {
      technicalQuestions: [
        {
          question: 'Explain your technical background',
          difficulty: 'easy',
          topic: 'General',
          sampleAnswer: 'I have experience in...',
          keyPoints: ['Be specific', 'Highlight projects']
        }
      ],
      behavioralQuestions: [
        {
          question: 'Tell me about yourself',
          starFramework: {
            situation: 'Background context',
            task: 'What you aimed to achieve',
            action: 'Steps you took',
            result: 'Outcome and learning'
          },
          tips: ['Keep it concise', 'Focus on relevant experience']
        }
      ],
      mockScenarios: [
        {
          title: 'Technical Discussion',
          description: 'Discuss your recent project',
          expectedApproach: 'Explain problem, solution, and impact'
        }
      ],
      weaknessDetection: [
        {
          area: 'Technical depth',
          severity: 'medium',
          improvementPlan: 'Practice coding problems and build projects'
        }
      ]
    };
  }
}

module.exports = new CareerCopilotService();
