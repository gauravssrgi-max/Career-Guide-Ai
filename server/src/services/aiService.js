const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const ALLOW_OPENAI_FALLBACK = process.env.ALLOW_OPENAI_FALLBACK === 'true' || AI_PROVIDER === 'openai';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

class AIService {
  constructor() {
    // OpenAI Setup
    const apiKey = process.env.OPENAI_API_KEY;
    this.isConnected = !!(apiKey && apiKey.startsWith('sk-'));
    if (this.isConnected) {
      this.openai = new OpenAI({ apiKey });
      console.log('✅ OpenAI connected');
    }

    // Gemini Setup (Primary)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'YOUR_GEMINI_KEY_HERE') {
      this.genAI = new GoogleGenerativeAI(geminiKey);
      this.geminiModel = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
      console.log(`✅ Gemini AI connected (${GEMINI_MODEL})`);
    }

    // HuggingFace Setup (Secondary Fallback)
    this.hfKey = process.env.HUGGINGFACE_API_KEY;
    if (this.hfKey) {
      console.log('✅ HuggingFace Backup connected');
    }
  }

  /**
   * Send a prompt to OpenAI and get a response
   * Uses standard Chat Completions API
   */
  async _askAI(prompt, systemInstructions = '') {
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

  async _askBestAI(prompt, systemInstructions = '') {
    if (this.geminiModel && AI_PROVIDER !== 'openai') {
      try {
        return await this._askGeminiPrompt(prompt, systemInstructions);
      } catch (err) {
        console.error('Gemini failed:', err.message);
      }
    }

    if (this.isConnected && ALLOW_OPENAI_FALLBACK) {
      try {
        return await this._askAI(prompt, systemInstructions);
      } catch (err) {
        console.error('OpenAI fallback failed:', err.message);
      }
    }

    return null;
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
    if (!this.geminiModel && !this.isConnected) return this._getDefaultRecommendations(surveyAnswers);

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

      const aiResponse = await this._askBestAI(prompt,
        'You are an expert Indian career counselor. Return ONLY valid JSON, no markdown fences.'
      );
      if (!aiResponse) return this._getDefaultRecommendations(surveyAnswers);

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
   * Formats conversation history and sends it to the configured AI provider
   */
  async chat(messages, userContext = {}) {
    try {
      // 1. TRY GEMINI FIRST (Primary & Free)
      if (this.geminiModel) {
        console.log('🔄 Using Gemini AI (Primary)...');
        const geminiResponse = await this._askGemini(messages);
        if (geminiResponse) return { response: geminiResponse, tokens: 0 };
      }

      // 2. OPTIONAL FALLBACK TO OPENAI
      if (this.isConnected && ALLOW_OPENAI_FALLBACK) {
        console.log('🔄 Trying OpenAI...');
        const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        const mentorInstructions = `You are "Career Guide AI". RULES: 1. GREETINGS: Ask for Qualification/Interests. 2. QUALIFICATIONS: List Gov Jobs, Corporate, and Degrees. 3. ROADMAPS: Detailed with resources/YT. 4. Numbered list format.`;
        const aiResponse = await this._askAI(conversationHistory, mentorInstructions);
        return { response: this._cleanAIResponse(aiResponse), tokens: 0 };
      }

      throw new Error('No AI connected');

    } catch (error) {
      console.error('Chat error:', error.message);

      // 3. FALLBACK TO HUGGINGFACE
      if (process.env.HUGGINGFACE_API_KEY) {
        console.log('🔄 Trying HuggingFace fallback...');
        const hfResponse = await this._askHuggingFace(messages);
        if (hfResponse) return { response: hfResponse, tokens: 0 };
      }

      return this._getDemoChat(messages);
    }
  }

  /**
   * Google Gemini AI primary chat path
   */
  async _askGemini(messages) {
    try {
      const instructions = `You are "Career Guide AI". RULES: 1. GREETINGS: Greet and ask for Qualification/Interests. 2. QUALIFICATIONS (10th/12th): List ALL paths including Govt Jobs, Corporate, and Education. 3. ROADMAPS: Detailed with links. 4. Numbered list format ONLY.`;
      const prompt = instructions + "\n" + messages.map(m => `${m.role}: ${m.content}`).join('\n') + "\nAssistant:";
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      return this._cleanAIResponse(response.text());
    } catch (err) {
      console.error('Gemini failed:', err.message);
    }
    return null;
  }

  async _askGeminiPrompt(prompt, systemInstructions = '') {
    const fullPrompt = [
      systemInstructions,
      prompt,
      'Assistant: Provide clear career advice for an Indian student. No markdown.'
    ].filter(Boolean).join('\n');
    const result = await this.geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return this._cleanAIResponse(response.text());
  }

  /**
   * HuggingFace Inference API Fallback
   * Uses Mistral-7B to provide real AI responses when OpenAI is down/limited
   */
  async _askHuggingFace(messages) {
    try {
      const prompt = messages.map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`).join('\n') + '\nAssistant:';
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 250, temperature: 0.7 }
        })
      });

      const data = await response.json();
      if (data && data[0]?.generated_text) {
        let text = data[0].generated_text.split('Assistant:').pop().trim();
        return this._cleanAIResponse(text);
      }
    } catch (err) {
      console.error('HuggingFace Fallback failed:', err.message);
    }
    return null;
  }

  _cleanAIResponse(text) {
    let clean = text.replace(/^#{1,6}\s*/gm, '').replace(/\*\*/g, '').replace(/\*/g, '');
    return clean.replace(/(\d+\.\s)/g, '\n$1').replace(/^\n/, '').replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * Analyze skill gaps between current skills and target career
   * Helps students understand what they need to learn
   */
  async analyzeSkillGap(currentSkills, targetCareer) {
    if (!this.geminiModel && !this.isConnected) return this._getDefaultSkillGap(currentSkills, targetCareer);

    try {
      const prompt = `Current skills: ${currentSkills.join(', ')}. 
Target career: ${targetCareer}. 
Return JSON: {"matchPercentage":45,"strongSkills":["s1"],"gapSkills":[{"skill":"name","importance":"critical","learningTime":"3 months","resources":"suggestion"}],"learningPath":"steps","timeEstimate":"6 months"}`;

      const aiResponse = await this._askBestAI(prompt, 'Return ONLY valid JSON.');
      if (!aiResponse) return this._getDefaultSkillGap(currentSkills, targetCareer);
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
    if (!this.geminiModel && !this.isConnected) {
      return { riskScore: 30, explanation: 'Connect AI for detailed analysis.' };
    }

    try {
      const prompt = `Career risk score (1-100) for "${careerName}" in India. Return JSON: {"riskScore":25,"explanation":"reason","factors":["f1","f2"]}`;
      const aiResponse = await this._askBestAI(prompt, 'Return ONLY valid JSON.');
      if (!aiResponse) return { riskScore: 30, explanation: 'Unable to calculate at this time.' };
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

    // 1. Greetings
    if (lastMessage.includes('hi') || lastMessage.includes('hello') || lastMessage.includes('hey')) {
      const greetings = [
        "Hello! I'm your Career AI Agent. To build your roadmap, please tell me your current qualification, interests, and if you prefer office work or field work.",
        "Hi there! Let's find your perfect career. What's your current qualification and what subjects do you enjoy the most?",
        "Greetings! I'm ready to assist. Please share your current education level and what kind of work excites you (physical or tech-based)?"
      ];
      return { response: greetings[Math.floor(Math.random() * greetings.length)], tokens: 0 };
    }

    // 2. Qualification Detection -> Ask for Stream
    if (lastMessage.includes('10th') || lastMessage.includes('class 10')) {
      return { response: "Passing 10th is a big milestone! What are you planning for 11th? Science (PCM/PCB), Commerce, or Arts? Or are you looking for ITI/Diploma?", tokens: 0 };
    }
    if (lastMessage === '12' || lastMessage.includes('12th') || lastMessage.includes('class 12')) {
      return { response: "Great! To give you specific advice, tell me your 12th stream: Science (PCM/PCB), Commerce, or Arts? This helps me suggest the right degrees or jobs.", tokens: 0 };
    }
    if (lastMessage.includes('iti')) {
      return { response: "ITI is great for technical roles. What is your trade (Electrician, Fitter, etc.) and do you want to start a job now or go for a Diploma?", tokens: 0 };
    }
    if (lastMessage.includes('diploma') || lastMessage.includes('polytechnic')) {
      return { response: "Technically sound choice! Which branch are you in (Mechanical, Civil, CS)? Also, are you interested in B.Tech via lateral entry?", tokens: 0 };
    }
    if (lastMessage.includes('btech') || lastMessage.includes('b.tech') || lastMessage.includes('engineering')) {
      return { response: "Engineering offers many paths. What is your branch? Also, do you prefer coding, management, or core technical field work?", tokens: 0 };
    }

    if (lastMessage.includes('software') || lastMessage.includes('coding') || lastMessage.includes('programming')) {
      return { response: "Software engineering is a strong career path in India:\n1. Learn programming - Python or JavaScript basics\n2. Build projects - websites, apps, or automation tools\n3. Practice DSA - important for product company interviews\n4. Choose a path - frontend, backend, full-stack, mobile, cloud, or AI\nStarting salary is commonly 4-12 LPA, and strong candidates can grow much higher.\nAre you in 10th, 12th, diploma, or college right now?", tokens: 0 };
    }

    // 3. Stream/Branch Detection -> Give Advice
    if (lastMessage.includes('pcm')) {
      return { response: "With PCM, you have elite options:\n1. Software Engineer - 5-45 LPA\n2. Data Scientist - 6-50 LPA\n3. Defence Service (NDA) - 8-15 LPA\n4. Pilot - 10-60 LPA\nWhich of these sounds exciting to you?", tokens: 0 };
    }
    if (lastMessage.includes('pcb')) {
      return { response: "With PCB, you can focus on healthcare:\n1. Doctor (MBBS) - 10-80 LPA\n2. Biotechnology - 4-18 LPA\n3. Nursing - 3-10 LPA\n4. Physiotherapy - 3-12 LPA\nAre you preparing for NEET?", tokens: 0 };
    }
    if (lastMessage.includes('commerce')) {
      return { response: "Commerce is excellent for finance:\n1. Chartered Accountant (CA) - 8-60 LPA\n2. Investment Banker - 10-80 LPA\n3. Data Analyst - 5-25 LPA\nWhich one would you like to explore?", tokens: 0 };
    }
    if (lastMessage.includes('arts') || lastMessage.includes('humanities')) {
      return { response: "Arts offers creative and stable careers:\n1. UPSC / Civil Services - 8-20 LPA\n2. Digital Marketer - 4-30 LPA\n3. Graphic Designer - 3-15 LPA\nDo you have an interest in government jobs?", tokens: 0 };
    }

    // 4. Money/Salary
    if (lastMessage.includes('salary') || lastMessage.includes('money') || lastMessage.includes('pay')) {
      return { response: "In India, starting salaries vary:\n- Tech/AI: 5-15 LPA\n- Finance/CA: 6-12 LPA\n- Healthcare: 8-15 LPA\n- Skilled Trade: 3-6 LPA\nWhat is your target starting salary?", tokens: 0 };
    }

    return { response: "I'm analyzing your profile. To give you an 'Agent-level' career roadmap, please tell me your exact qualification (12th, ITI, etc.) and your stream (PCM, Trade, etc.)!", tokens: 0 };
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
