/**
 * AI Service for Career Guide Platform
 * 
 * This module handles all AI-related functionality including:
 * - Career recommendations based on student survey responses
 * - Chat-based career mentoring using OpenAI
 * - Skill gap analysis for target careers
 * - Risk assessment for different career paths
 * 
 * Uses OpenAI's Responses API (gpt-5.4-mini) when available,
 * falls back to curated mock responses for offline/demo mode.
 * 
 * @author Gaurav Kumar Shah
 * @version 2.0
 */

const OpenAI = require('openai');

class AIService {
  constructor() {
    // Check if we have a valid API key configured
    const apiKey = process.env.OPENAI_API_KEY;
    this.isConnected = !!(apiKey && apiKey.startsWith('sk-'));

    if (this.isConnected) {
      this.openai = new OpenAI({ apiKey });
      console.log('✅ OpenAI GPT-5.4-mini connected');
    } else {
      console.warn('⚠️  No OpenAI key found — running in demo mode');
    }
  }

  /**
   * Send a prompt to OpenAI and get a response
   * Uses the new Responses API format
   */
  async _askAI(prompt, systemInstructions = '') {
    const response = await this.openai.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      instructions: systemInstructions || undefined,
      store: false,
    });
    return response.output_text.trim();
  }

  /**
   * Try to parse JSON from AI response text
   * AI sometimes wraps JSON in markdown code blocks, so we handle that
   */
  _parseJSON(text) {
    // Try to find a JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (err) { /* continue */ }
    }
    // Try cleaning markdown fences and parsing directly
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try { return JSON.parse(cleaned); } catch (err) { /* fall through */ }
    return null;
  }

  /**
   * Generate career recommendations based on survey answers
   * Returns top 3 career matches with detailed analysis
   */
  async recommendCareers(surveyAnswers) {
    if (!this.isConnected) return this._getDefaultRecommendations(surveyAnswers);

    try {
      const interests = (surveyAnswers.interests || []).join(', ');
      const skills = (surveyAnswers.skills || []).join(', ');
      const personality = surveyAnswers.personalityType || 'balanced';
      const budget = surveyAnswers.budget || 'flexible';
      const location = surveyAnswers.location || 'india';
      const confusion = surveyAnswers.confusionLevel || 'none';

      const prompt = `Student profile:
- Interests: ${interests}
- Skills: ${skills}
- Personality: ${personality}
- Budget: ${budget}
- Location: ${location}
- Confusion level: ${confusion}

Recommend exactly 3 careers. Return ONLY valid JSON:
{"careers":[{"title":"name","overview":"2 lines","whyThisCareer":"why fits","salaryRange":{"entry":"₹X LPA"},"difficulty":3,"growthRate":"20%","futureScope":"outlook","riskScore":25,"requiredSkills":["s1","s2"],"category":"technology"}],"analysis":"brief","confusionAdvice":"advice or empty"}`;

      const aiResponse = await this._askAI(prompt, 
        'You are an expert Indian career counselor. Return ONLY valid JSON, no markdown fences.'
      );

      const parsed = this._parseJSON(aiResponse);
      if (parsed?.careers) return parsed;

      // If parsing failed, use default recommendations
      return this._getDefaultRecommendations(surveyAnswers);
    } catch (error) {
      console.error('Career recommendation error:', error.message);
      return this._getDefaultRecommendations(surveyAnswers);
    }
  }

  /**
   * Handle chat conversation with the AI mentor
   * Formats conversation history and sends to OpenAI
   */
  async chat(messages, userContext = {}) {
    if (!this.isConnected) return this._getDemoChat(messages);

    try {
      // Build conversation history string for the AI
      const conversationHistory = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const mentorInstructions = `You are "Career Guide AI", a direct and clear career advisor for Indian students.

STRICT FORMAT RULES:
- EACH numbered option MUST be on its OWN line, separated by a newline character
- NEVER put multiple numbered items on the same line
- Use NUMBERED lists (1. 2. 3.) with EACH on a NEW LINE
- NEVER use ** or * or any markdown. Plain text only.
- NO greetings, NO "congrats", NO "great question"
- Max 1-2 emojis per response
- Format each option as: "1. Career Name - X-Y LPA (short description)"
- End with ONE follow-up question on its own line
- Be direct and simple
- Know Indian education: JEE, NEET, UPSC, CAT, GATE
- Salary in INR LPA

EXAMPLE FORMAT:
1. Engineering - 4-15 LPA (B.Tech via JEE)
2. Medical - 6-20 LPA (MBBS via NEET)
3. Defence - 5-12 LPA (NDA/CDS route)
Which interests you?`;

      const aiResponse = await this._askAI(conversationHistory, mentorInstructions);

      // Clean up the response - remove any stray markdown and ensure vertical alignment
      let cleanResponse = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '');
      cleanResponse = cleanResponse
        .replace(/(\d+\.\s)/g, '\n$1')   // Force each numbered item to new line
        .replace(/^\n/, '')               // Remove leading newline
        .replace(/\n{3,}/g, '\n\n');      // Collapse excessive blank lines

      return { response: cleanResponse.trim(), tokens: 0 };
    } catch (error) {
      console.error('Chat error:', error.message);
      return this._getDemoChat(messages);
    }
  }

  /**
   * Analyze skill gaps between current skills and target career
   * Helps students understand what they need to learn
   */
  async analyzeSkillGap(currentSkills, targetCareer) {
    if (!this.isConnected) return this._getDefaultSkillGap(currentSkills, targetCareer);

    try {
      const prompt = `Current skills: ${currentSkills.join(', ')}. 
Target career: ${targetCareer}. 
Return JSON: {"matchPercentage":45,"strongSkills":["s1"],"gapSkills":[{"skill":"name","importance":"critical","learningTime":"3 months","resources":"suggestion"}],"learningPath":"steps","timeEstimate":"6 months"}`;

      const aiResponse = await this._askAI(prompt, 'Return ONLY valid JSON.');
      const parsed = this._parseJSON(aiResponse);
      if (parsed?.matchPercentage !== undefined) return parsed;
    } catch (error) {
      console.error('Skill gap analysis error:', error.message);
    }

    return this._getDefaultSkillGap(currentSkills, targetCareer);
  }

  /**
   * Calculate risk score for a specific career path
   * Considers market demand, stability, and future outlook
   */
  async calculateRiskScore(careerName) {
    if (!this.isConnected) {
      return { riskScore: 30, explanation: 'Connect AI for detailed analysis.' };
    }

    try {
      const prompt = `Career risk score (1-100) for "${careerName}" in India. Return JSON: {"riskScore":25,"explanation":"reason","factors":["f1","f2"]}`;
      const aiResponse = await this._askAI(prompt, 'Return ONLY valid JSON.');
      const parsed = this._parseJSON(aiResponse);
      if (parsed?.riskScore) return parsed;
    } catch (error) {
      console.error('Risk score error:', error.message);
    }

    return { riskScore: 30, explanation: 'Unable to calculate at this time.' };
  }

  // ═══════════════════════════════════════════════════════
  //  FALLBACK / DEMO MODE RESPONSES
  //  Used when OpenAI is not available or API calls fail
  // ═══════════════════════════════════════════════════════

  /**
   * Default career recommendations when AI is unavailable
   * Returns curated data based on the student's primary interest
   */
  _getDefaultRecommendations(answers) {
    const topCareers = [
      {
        title: 'Software Engineer',
        overview: 'Build applications, websites, and systems that solve real-world problems.',
        whyThisCareer: 'Strong tech interest combined with analytical thinking.',
        salaryRange: { entry: '₹4-8 LPA' },
        difficulty: 3,
        growthRate: '22%',
        futureScope: 'One of the fastest-growing fields globally.',
        riskScore: 15,
        requiredSkills: ['Programming', 'Data Structures', 'System Design'],
        category: 'technology'
      },
      {
        title: 'Data Scientist',
        overview: 'Extract meaningful insights from large datasets to drive decisions.',
        whyThisCareer: 'Perfect blend of analytical mindset and technology skills.',
        salaryRange: { entry: '₹6-10 LPA' },
        difficulty: 4,
        growthRate: '35%',
        futureScope: 'Ranked #1 job of the decade by multiple reports.',
        riskScore: 12,
        requiredSkills: ['Python', 'Statistics', 'Machine Learning'],
        category: 'technology'
      },
      {
        title: 'AI/ML Engineer',
        overview: 'Design and build intelligent systems that learn and adapt.',
        whyThisCareer: 'Cutting-edge field with massive industry demand.',
        salaryRange: { entry: '₹8-15 LPA' },
        difficulty: 5,
        growthRate: '40%',
        futureScope: 'Transforming every industry from healthcare to finance.',
        riskScore: 10,
        requiredSkills: ['Deep Learning', 'Python', 'Mathematics'],
        category: 'technology'
      }
    ];

    const interests = (answers.interests || []).join(', ') || 'general topics';
    return {
      careers: topCareers,
      analysis: `Based on your interest in ${interests}, here are your top matches.`,
      confusionAdvice: ''
    };
  }

  /**
   * Demo chat responses for when AI is offline
   * Provides helpful career guidance using keyword matching
   */
  _getDemoChat(messages) {
    const lastMessage = (messages[messages.length - 1]?.content || '').toLowerCase();
    let reply = "Hi! I'm Career Guide AI 🎯 Ask me about any career, salary, exam, or roadmap!";

    if (lastMessage.includes('salary') || lastMessage.includes('money')) {
      reply = "Typical salary ranges in India:\n1. Software Engineer - 4-60 LPA\n2. Data Scientist - 6-70 LPA\n3. Doctor - 10-80 LPA\n4. CA - 7-60 LPA\nWhich career interests you?";
    } else if (lastMessage.includes('confused') || lastMessage.includes("don't know")) {
      reply = "Totally normal to feel that way! Answer these:\n1. Do you prefer people or computers?\n2. Numbers or words?\n3. Creating or analyzing?\nTell me and I'll help narrow it down!";
    } else if (lastMessage.includes('engineer') || lastMessage.includes('tech') || lastMessage.includes('coding')) {
      reply = "Tech careers in India:\n1. Software Engineer - 4-60 LPA\n2. Data Scientist - 6-70 LPA\n3. AI/ML Engineer - 8-1 Cr+\nStart with B.Tech CS via JEE or self-learn online!";
    } else if (lastMessage.includes('doctor') || lastMessage.includes('neet')) {
      reply = "Medicine career path:\n1. Study PCB in 11th-12th\n2. Clear NEET exam\n3. MBBS (5.5 years)\n4. Specialization MD/MS (3 years)\nFees: Govt 50K-5L | Private 20L-1Cr\nStarting salary: 6-10 LPA";
    }

    return { response: reply, tokens: 0 };
  }

  /**
   * Default skill gap analysis when AI is unavailable
   */
  _getDefaultSkillGap(skills, career) {
    return {
      matchPercentage: 45,
      strongSkills: skills.slice(0, 2),
      gapSkills: [{
        skill: 'Core Technical Skills',
        importance: 'critical',
        learningTime: '3-6 months',
        resources: 'Online courses on Coursera/Udemy'
      }],
      learningPath: '1. Build fundamentals\n2. Work on projects\n3. Practice consistently',
      timeEstimate: '6-8 months'
    };
  }
}

// Export a single instance so it's reused across the app
module.exports = new AIService();
