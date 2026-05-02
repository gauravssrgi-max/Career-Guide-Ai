/**
 * AI Service — OpenAI Responses API (gpt-5.4-mini)
 */
const OpenAI = require('openai');

class AIService {
  constructor() {
    const key = process.env.OPENAI_API_KEY;
    this.useAI = !!(key && key.startsWith('sk-'));
    if (this.useAI) {
      this.openai = new OpenAI({ apiKey: key });
      console.log('✅ OpenAI GPT-5.4-mini connected');
    } else {
      console.warn('⚠️  No OpenAI key, using mock responses');
    }
  }

  async _ask(prompt, instructions = '') {
    const res = await this.openai.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      instructions: instructions || undefined,
      store: false,
    });
    return res.output_text.trim();
  }

  _extractJSON(text) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) try { return JSON.parse(m[0]); } catch(e) {}
    try { return JSON.parse(text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()); } catch(e) {}
    return null;
  }

  async recommendCareers(answers) {
    if (!this.useAI) return this._mockRec(answers);
    try {
      const text = await this._ask(
        `Student profile:\n- Interests: ${(answers.interests||[]).join(', ')}\n- Skills: ${(answers.skills||[]).join(', ')}\n- Personality: ${answers.personalityType||'balanced'}\n- Budget: ${answers.budget||'flexible'}\n- Location: ${answers.location||'india'}\n- Confusion: ${answers.confusionLevel||'none'}\n\nRecommend exactly 3 careers. Return ONLY valid JSON:\n{"careers":[{"title":"name","overview":"2 lines","whyThisCareer":"why fits","salaryRange":{"entry":"₹X LPA"},"difficulty":3,"growthRate":"20%","futureScope":"outlook","riskScore":25,"requiredSkills":["s1","s2"],"category":"technology"}],"analysis":"brief","confusionAdvice":"advice or empty"}`,
        'You are an expert Indian career counselor. Return ONLY valid JSON, no markdown fences.'
      );
      const p = this._extractJSON(text);
      if (p?.careers) return p;
      return this._mockRec(answers);
    } catch(e) { console.error('AI rec error:', e.message); return this._mockRec(answers); }
  }

  async chat(messages, userContext = {}) {
    if (!this.useAI) return this._mockChat(messages);
    try {
      const history = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const text = await this._ask(
        history,
        `You are "Career Guide AI", a direct and clear career advisor for Indian students.

STRICT RULES:
- Give SHORT, CLEAR answers (max 8-10 lines)
- Use NUMBERED lists (1. 2. 3.) for options, NOT bullet points
- NEVER use ** or * or any markdown formatting. Plain text only.
- NO excessive greetings, NO "congrats", NO "great question"
- NO emojis overload (max 1-2 per response)
- When listing careers/options: number them with salary on same line
- Format: "1. Career Name - X-Y LPA (one line description)"
- End with ONE simple follow-up question
- Be direct. Student may be confused, so keep it simple
- Know Indian education: JEE, NEET, UPSC, CAT, GATE
- Salary in INR LPA`
      );
      return { response: text.replace(/\*\*/g, '').replace(/\*/g, ''), tokens: 0 };
    } catch(e) { console.error('AI chat error:', e.message); return this._mockChat(messages); }
  }

  async analyzeSkillGap(currentSkills, targetCareer) {
    if (!this.useAI) return this._mockGap(currentSkills, targetCareer);
    try {
      const text = await this._ask(
        `Skills: ${currentSkills.join(', ')}. Target: ${targetCareer}. Return JSON: {"matchPercentage":45,"strongSkills":["s1"],"gapSkills":[{"skill":"name","importance":"critical","learningTime":"3 months","resources":"suggestion"}],"learningPath":"steps","timeEstimate":"6 months"}`,
        'Return ONLY valid JSON.'
      );
      const p = this._extractJSON(text);
      if (p?.matchPercentage !== undefined) return p;
    } catch(e) { console.error('Gap error:', e.message); }
    return this._mockGap(currentSkills, targetCareer);
  }

  async calculateRiskScore(career) {
    if (!this.useAI) return { riskScore: 30, explanation: 'Connect AI for real analysis.' };
    try {
      const text = await this._ask(`Career risk score (1-100) for "${career}" in India. Return JSON: {"riskScore":25,"explanation":"reason","factors":["f1","f2"]}`, 'Return ONLY valid JSON.');
      const p = this._extractJSON(text);
      if (p?.riskScore) return p;
    } catch(e) {}
    return { riskScore: 30, explanation: 'Unable to calculate.' };
  }

  _mockRec(a) {
    const careers = [
      {title:'Software Engineer',overview:'Build apps and systems.',whyThisCareer:'Tech + problem solving.',salaryRange:{entry:'₹4-8 LPA'},difficulty:3,growthRate:'22%',futureScope:'Fastest-growing.',riskScore:15,requiredSkills:['Programming','DSA'],category:'technology'},
      {title:'Data Scientist',overview:'Extract data insights.',whyThisCareer:'Analytical + tech.',salaryRange:{entry:'₹6-10 LPA'},difficulty:4,growthRate:'35%',futureScope:'#1 job.',riskScore:12,requiredSkills:['Python','ML'],category:'technology'},
      {title:'AI/ML Engineer',overview:'Build intelligent systems.',whyThisCareer:'Cutting-edge.',salaryRange:{entry:'₹8-15 LPA'},difficulty:5,growthRate:'40%',futureScope:'Transforming all industries.',riskScore:10,requiredSkills:['Deep Learning','Math'],category:'technology'},
    ];
    return { careers, analysis: `Based on your profile.`, confusionAdvice: '' };
  }

  _mockChat(messages) {
    const m = (messages[messages.length-1]?.content||'').toLowerCase();
    let r = "Hi! I'm Career Guide AI 🎯 Ask me about any career, salary, exam, or roadmap!";
    if (m.includes('salary')) r = "💰 Salaries:\n• SWE: ₹4-60L\n• DS: ₹6-70L\n• Doctor: ₹10-80L\nWhich interests you?";
    else if (m.includes('confused')) r = "Normal! 🤗 Answer: People or computers? Numbers or words? Create or analyze?";
    else if (m.includes('engineer')||m.includes('tech')) r = "Tech 🚀: SWE(₹4-60L), DS(₹6-70L), AI(₹8-1Cr+). Start via JEE or self-learn!";
    return { response: r, tokens: 0 };
  }

  _mockGap(skills, career) {
    return { matchPercentage: 45, strongSkills: skills.slice(0,2), gapSkills: [{skill:'Core Skills',importance:'critical',learningTime:'3-6 months',resources:'Online courses'}], learningPath:'Fundamentals → Projects → Practice', timeEstimate:'6-8 months' };
  }
}

module.exports = new AIService();
