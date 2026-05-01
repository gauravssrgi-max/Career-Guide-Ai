/**
 * AI Service — Smart mock responses (no external API needed)
 * Works fully offline with comprehensive career guidance data
 */

class AIService {
  constructor() {
    console.log('✅ AI Service loaded (built-in career intelligence)');
  }

  async recommendCareers(answers) {
    const interestMap = {
      technology: [
        { title: 'Software Engineer', overview: 'Build applications and systems that power the digital world.', whyThisCareer: 'Your interest in technology and problem-solving makes this a great fit.', salaryRange: { entry: '₹4-8 LPA' }, difficulty: 3, growthRate: '22% annually', futureScope: 'One of the fastest-growing fields globally.', riskScore: 15, requiredSkills: ['Programming', 'Problem Solving', 'Data Structures'], category: 'technology' },
        { title: 'Data Scientist', overview: 'Extract insights from data to drive business decisions.', whyThisCareer: 'Strong analytical skills with tech interest make data science ideal.', salaryRange: { entry: '₹6-10 LPA' }, difficulty: 4, growthRate: '35% annually', futureScope: '#1 job of the decade.', riskScore: 12, requiredSkills: ['Python', 'Statistics', 'Machine Learning'], category: 'technology' },
        { title: 'AI/ML Engineer', overview: 'Design intelligent systems that learn and adapt.', whyThisCareer: 'Cutting-edge field combining tech with creative problem solving.', salaryRange: { entry: '₹8-15 LPA' }, difficulty: 5, growthRate: '40% annually', futureScope: 'AI is transforming every industry.', riskScore: 10, requiredSkills: ['Python', 'Deep Learning', 'Mathematics'], category: 'technology' },
      ],
      medical: [
        { title: 'Doctor (MBBS)', overview: 'Diagnose and treat illnesses, save lives.', whyThisCareer: 'Your interest in medical sciences aligns perfectly.', salaryRange: { entry: '₹6-10 LPA' }, difficulty: 5, growthRate: '10%', futureScope: 'Always in demand.', riskScore: 20, requiredSkills: ['Biology', 'Chemistry', 'Patient Care'], category: 'medical' },
        { title: 'Pharmacist', overview: 'Expert in medicines and drug interactions.', whyThisCareer: 'Great blend of medical knowledge with work-life balance.', salaryRange: { entry: '₹3-6 LPA' }, difficulty: 3, growthRate: '8%', futureScope: 'Pharma industry grows steadily.', riskScore: 25, requiredSkills: ['Chemistry', 'Biology', 'Attention to Detail'], category: 'medical' },
        { title: 'Biotech Researcher', overview: 'Innovate at the intersection of biology and technology.', whyThisCareer: 'Perfect for science lovers who want to innovate.', salaryRange: { entry: '₹4-8 LPA' }, difficulty: 4, growthRate: '15%', futureScope: 'Biotech is booming post-pandemic.', riskScore: 22, requiredSkills: ['Molecular Biology', 'Research', 'Lab Skills'], category: 'medical' },
      ],
      business: [
        { title: 'Management Consultant', overview: 'Advise companies on strategy and operations.', whyThisCareer: 'Your business interest and analytical skills are a perfect match.', salaryRange: { entry: '₹8-15 LPA' }, difficulty: 4, growthRate: '15%', futureScope: 'Consulting remains high-growth.', riskScore: 25, requiredSkills: ['Analysis', 'Communication', 'Leadership'], category: 'business' },
        { title: 'Chartered Accountant', overview: 'Financial expert handling audits, taxation, advisory.', whyThisCareer: 'Strong fit for detail-oriented business-minded individuals.', salaryRange: { entry: '₹7-12 LPA' }, difficulty: 5, growthRate: '11%', futureScope: 'Recession-proof career.', riskScore: 15, requiredSkills: ['Accounting', 'Tax Law', 'Financial Analysis'], category: 'business' },
        { title: 'Investment Banker', overview: 'Help companies raise capital and manage mergers.', whyThisCareer: 'High-reward career for ambitious finance lovers.', salaryRange: { entry: '₹10-20 LPA' }, difficulty: 5, growthRate: '12%', futureScope: 'Finance sector always needs talent.', riskScore: 30, requiredSkills: ['Finance', 'Valuation', 'Excel'], category: 'business' },
      ],
      creative: [
        { title: 'UX/UI Designer', overview: 'Design beautiful, user-friendly digital experiences.', whyThisCareer: 'Perfect intersection of creativity and technology.', salaryRange: { entry: '₹4-8 LPA' }, difficulty: 3, growthRate: '20%', futureScope: 'Design-driven companies dominate.', riskScore: 20, requiredSkills: ['Design Thinking', 'Figma', 'User Research'], category: 'creative' },
        { title: 'Content Creator', overview: 'Create engaging content across platforms.', whyThisCareer: 'Your creative drive can build a personal brand.', salaryRange: { entry: '₹2-5 LPA' }, difficulty: 3, growthRate: '25%', futureScope: 'Creator economy is booming.', riskScore: 55, requiredSkills: ['Content Creation', 'Video Editing', 'Marketing'], category: 'creative' },
        { title: 'Graphic Designer', overview: 'Create visual concepts for brands and products.', whyThisCareer: 'Turn your artistic talent into a career.', salaryRange: { entry: '₹3-6 LPA' }, difficulty: 2, growthRate: '13%', futureScope: 'Every brand needs great design.', riskScore: 25, requiredSkills: ['Adobe Suite', 'Typography', 'Color Theory'], category: 'creative' },
      ],
      government: [
        { title: 'IAS Officer', overview: 'Lead government administration and shape policies.', whyThisCareer: 'Your interest in governance aligns with civil services.', salaryRange: { entry: '₹8-10 LPA + perks' }, difficulty: 5, growthRate: '2%', futureScope: 'Prestigious with job security.', riskScore: 45, requiredSkills: ['General Knowledge', 'Writing', 'Leadership'], category: 'government' },
        { title: 'Defense Officer', overview: 'Serve and protect the nation in armed forces.', whyThisCareer: 'Honor, discipline, and service to the nation.', salaryRange: { entry: '₹6-9 LPA + perks' }, difficulty: 4, growthRate: '3%', futureScope: 'Stable, respected career.', riskScore: 35, requiredSkills: ['Physical Fitness', 'Leadership', 'Discipline'], category: 'government' },
      ],
      science: [
        { title: 'Research Scientist', overview: 'Push boundaries of knowledge through research.', whyThisCareer: 'Your curiosity and analytical mind fit perfectly.', salaryRange: { entry: '₹5-10 LPA' }, difficulty: 4, growthRate: '12%', futureScope: 'R&D investment growing globally.', riskScore: 30, requiredSkills: ['Research Methods', 'Critical Thinking', 'Data Analysis'], category: 'science' },
        { title: 'Space Scientist (ISRO)', overview: 'Work on space missions and satellite technology.', whyThisCareer: 'Dream big — literally reach for the stars.', salaryRange: { entry: '₹8-12 LPA' }, difficulty: 5, growthRate: '10%', futureScope: 'Space industry is exploding.', riskScore: 20, requiredSkills: ['Physics', 'Mathematics', 'Engineering'], category: 'science' },
      ],
    };

    const primary = answers.interests?.[0]?.toLowerCase() || 'technology';
    const careers = interestMap[primary] || interestMap.technology;

    return {
      careers: careers.slice(0, 3),
      analysis: `Based on your interests in ${answers.interests?.join(', ') || 'general topics'} and ${answers.personalityType || 'balanced'} personality, here are your best career matches.`,
      confusionAdvice: answers.confusionLevel === 'high' ? "Don't worry! It's completely normal to feel confused. Start by exploring the top recommendation — you can always pivot later. 💪" : '',
    };
  }

  async chat(messages, userContext = {}) {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let response = `Hi${userContext.name ? ' ' + userContext.name : ''}! I'm Career Guide AI 🎯\n\nI can help you with:\n• **Career recommendations** based on your profile\n• **Salary information** across industries\n• **Education roadmaps** & entrance exams\n• **Skill gap analysis**\n• **Cost estimation** for career paths\n\nWhat would you like to explore? 😊`;

    if (lastMsg.includes('salary') || lastMsg.includes('money') || lastMsg.includes('earn') || lastMsg.includes('pay')) {
      response = "Great question about earnings! 💰\n\nHere's a quick salary overview in India:\n\n• **Software Engineering**: ₹4-60+ LPA\n• **Data Science/AI**: ₹6-70+ LPA\n• **Management Consulting**: ₹8-1Cr+ LPA\n• **Doctor (Specialist)**: ₹10-80+ LPA\n• **Chartered Accountant**: ₹7-60+ LPA\n• **IAS Officer**: ₹8-30 LPA + perks\n• **UX Designer**: ₹4-50 LPA\n\nRemember, salary is important but job satisfaction and growth matter too! Which career interests you most? 🤔";
    } else if (lastMsg.includes('confused') || lastMsg.includes("don't know") || lastMsg.includes('help me') || lastMsg.includes('no idea')) {
      response = "I totally understand feeling confused — it's completely normal! 🤗\n\nLet's simplify with 3 quick questions:\n\n1. **Do you prefer working with people or computers?**\n2. **Do you like numbers or words more?**\n3. **Would you rather create something or analyze something?**\n\nJust answer these and I'll narrow it down for you! 💪";
    } else if (lastMsg.includes('engineer') || lastMsg.includes('coding') || lastMsg.includes('tech') || lastMsg.includes('software') || lastMsg.includes('programming')) {
      response = "Tech is an amazing field! 🚀\n\n**Top Tech Careers:**\n• **Software Engineer** — Build apps & systems (₹4-60L)\n• **Data Scientist** — Work with data & ML (₹6-70L)\n• **AI/ML Engineer** — Build intelligent systems (₹8-1Cr+)\n• **Cybersecurity** — Protect digital systems (₹5-40L)\n• **Cloud Architect** — Design cloud infra (₹10-50L)\n\n**How to start:**\n1. B.Tech in CS/IT (JEE Main entrance)\n2. Or self-learn: freeCodeCamp → projects → internship\n\nWant a detailed roadmap for any of these? 📋";
    } else if (lastMsg.includes('doctor') || lastMsg.includes('medical') || lastMsg.includes('mbbs') || lastMsg.includes('neet')) {
      response = "Medicine is a noble and rewarding career! 🩺\n\n**The Path:**\n1. Class 11-12: PCB (Physics, Chemistry, Biology)\n2. NEET exam (May every year)\n3. MBBS — 5.5 years\n4. Specialization (MD/MS) — 3 years\n\n**Key Info:**\n• Govt college fees: ₹50K-5L total\n• Private college: ₹20L-1Cr+\n• Entry salary: ₹6-10 LPA\n• Specialist salary: ₹20-80+ LPA\n\n**NEET Tips:** Master NCERT first, then reference books. Biology = 50% weightage!\n\nShould I share a detailed NEET preparation strategy? 📚";
    } else if (lastMsg.includes('exam') || lastMsg.includes('jee') || lastMsg.includes('upsc') || lastMsg.includes('cat') || lastMsg.includes('gate')) {
      response = "Here's a quick guide to major entrance exams in India 📝\n\n**Engineering:** JEE Main + Advanced (IITs)\n**Medical:** NEET (AIIMS, govt colleges)\n**Civil Services:** UPSC CSE (IAS/IPS/IFS)\n**Management:** CAT (IIMs), XAT, SNAP\n**Law:** CLAT, LSAT\n**Design:** NID, NIFT entrance\n**Abroad:** GRE, GMAT, SAT, IELTS, TOEFL\n\nWhich exam would you like to know more about? I can share eligibility, syllabus, and preparation tips! 🎯";
    } else if (lastMsg.includes('abroad') || lastMsg.includes('usa') || lastMsg.includes('canada') || lastMsg.includes('foreign') || lastMsg.includes('international')) {
      response = "Studying/working abroad is a great option! 🌍\n\n**Popular Destinations:**\n• 🇺🇸 USA — MS/MBA (GRE/GMAT, $30-80K/year)\n• 🇨🇦 Canada — PR-friendly (IELTS, $15-35K/year)\n• 🇬🇧 UK — 1-year Masters (IELTS, £15-30K/year)\n• 🇩🇪 Germany — Free tuition! (IELTS/TestDaF)\n• 🇦🇺 Australia — Work-study balance (IELTS, A$20-45K)\n\n**Budget-Friendly Tips:**\n• Scholarships (Fulbright, Commonwealth)\n• TA/RA positions in US universities\n• Germany's free public universities\n\nWhich country interests you? 🤔";
    } else if (lastMsg.includes('roadmap') || lastMsg.includes('plan') || lastMsg.includes('path') || lastMsg.includes('how to become')) {
      response = "I'd love to help you plan! 🗺️\n\nTell me which career you're interested in and I'll give you:\n\n1. **Step-by-step roadmap** (Class 10 → Job)\n2. **Required exams** & eligibility\n3. **Skills to learn** with timeline\n4. **Cost breakdown** & budget options\n5. **Resources** (free + paid)\n\nJust tell me the career! For example:\n• \"How to become a software engineer\"\n• \"Roadmap for CA\"\n• \"Path to becoming a doctor\"\n\nWhat career should I map out for you? 🎯";
    }

    return { response, tokens: 0 };
  }

  async analyzeSkillGap(currentSkills, targetCareer) {
    return {
      matchPercentage: 45,
      strongSkills: currentSkills.slice(0, 2),
      gapSkills: [
        { skill: 'Advanced Problem Solving', importance: 'critical', learningTime: '3-6 months', resources: 'LeetCode, HackerRank' },
        { skill: 'System Design', importance: 'important', learningTime: '2-4 months', resources: 'Grokking System Design' },
      ],
      learningPath: `1. Start with fundamentals (Month 1-2)\n2. Build projects (Month 3-4)\n3. Practice ${targetCareer}-specific skills (Month 5-6)`,
      timeEstimate: '6-8 months of dedicated learning',
    };
  }

  async calculateRiskScore(careerTitle) {
    const scores = { 'Software Engineer': 15, 'Doctor': 20, 'CA': 15, 'IAS Officer': 45, 'Content Creator': 55, 'Data Scientist': 12 };
    return { riskScore: scores[careerTitle] || 30, explanation: `${careerTitle} has a moderate risk profile based on market demand and competition.`, factors: ['Market demand', 'Competition level', 'Automation risk'] };
  }
}

module.exports = new AIService();
