import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const ALLOW_OPENAI_FALLBACK = process.env.ALLOW_OPENAI_FALLBACK === 'true' || AI_PROVIDER === 'openai';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

function cleanAIResponse(text) {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/(\d+\.\s)/g, '\n$1')
    .replace(/^\n/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// System instructions for the AI mentor agent
const MENTOR_INSTRUCTIONS = `You are "Career Guide AI". Provide career strategy for Indian students.

STRICT RULES:
1. GREETINGS: If the user says "hi/hello", greet them and ask for their current Qualification and Interests.
2. QUALIFICATIONS (10th/12th): If info is provided, list ALL major paths:
   - Government Jobs (SSC, Defence, Railway, etc.)
   - Corporate Careers (Tech, Finance, Marketing, etc.)
   - Higher Education (Degrees, Diplomas, Trades)
3. ROADMAPS: For "roadmap" requests, give detailed steps, resources, and YouTube search links.
4. FORMAT: Use "1. Option - Description" format. Plain text only (NO markdown).
5. BREVITY: Keep each point to 2 sentences. No repetitive intros.`;

// Intelligent fallback logic for the agent when AI providers are offline
function getDemoResponse(lastMessage) {
  const msg = (lastMessage || '').toLowerCase();

  // 1. Greetings
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    const greetings = [
      "Hello! I'm your Career AI Agent. To build your roadmap, please tell me your current qualification, interests, and if you prefer office work or field work.",
      "Hi there! Let's find your perfect career. What's your current qualification and what subjects do you enjoy the most?",
      "Greetings! I'm ready to assist. Please share your current education level and what kind of work excites you (physical or tech-based)?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Qualification Detection -> Ask for Stream
  if (msg.includes('10th') || msg.includes('class 10')) {
    return "Passing 10th is a big milestone! What are you planning for 11th? Science (PCM/PCB), Commerce, or Arts? Or are you looking for ITI/Diploma?";
  }
  if (msg === '12' || msg.includes('12th') || msg.includes('class 12')) {
    return "Great! To give you specific advice, tell me your 12th stream: Science (PCM/PCB), Commerce, or Arts? This helps me suggest the right degrees or jobs.";
  }
  if (msg.includes('iti')) {
    return "ITI is great for technical roles. What is your trade (Electrician, Fitter, etc.) and do you want to start a job now or go for a Diploma?";
  }
  if (msg.includes('diploma') || msg.includes('polytechnic')) {
    return "Technically sound choice! Which branch are you in (Mechanical, Civil, CS)? Also, are you interested in B.Tech via lateral entry?";
  }
  if (msg.includes('btech') || msg.includes('b.tech') || msg.includes('engineering')) {
    return "Engineering offers many paths. What is your branch? Also, do you prefer coding, management, or core technical field work?";
  }

  if (msg.includes('software') || msg.includes('coding') || msg.includes('programming')) {
    return "Software engineering is a strong career path in India:\n1. Learn programming - Python or JavaScript basics\n2. Build projects - websites, apps, or automation tools\n3. Practice DSA - important for product company interviews\n4. Choose a path - frontend, backend, full-stack, mobile, cloud, or AI\nStarting salary is commonly 4-12 LPA, and strong candidates can grow much higher.\nAre you in 10th, 12th, diploma, or college right now?";
  }

  // 3. Stream/Branch Detection -> Give Advice
  if (msg.includes('pcm')) {
    return "With PCM, you have elite options:\n1. Software Engineer - 5-45 LPA\n2. Data Scientist - 6-50 LPA\n3. Defence Service (NDA) - 8-15 LPA\n4. Pilot - 10-60 LPA\nWhich of these sounds exciting to you?";
  }
  if (msg.includes('pcb')) {
    return "With PCB, you can focus on healthcare:\n1. Doctor (MBBS) - 10-80 LPA\n2. Biotechnology - 4-18 LPA\n3. Nursing - 3-10 LPA\n4. Physiotherapy - 3-12 LPA\nAre you preparing for NEET?";
  }
  if (msg.includes('commerce')) {
    return "Commerce is excellent for finance:\n1. Chartered Accountant (CA) - 8-60 LPA\n2. Investment Banker - 10-80 LPA\n3. Data Analyst - 5-25 LPA\nWhich one would you like to explore?";
  }
  if (msg.includes('arts') || msg.includes('humanities')) {
    return "Arts offers creative and stable careers:\n1. UPSC / Civil Services - 8-20 LPA\n2. Digital Marketer - 4-30 LPA\n3. Graphic Designer - 3-15 LPA\nDo you have an interest in government jobs?";
  }

  // 4. Money/Salary
  if (msg.includes('salary') || msg.includes('money') || msg.includes('pay')) {
    return "In India, starting salaries vary:\n- Tech/AI: 5-15 LPA\n- Finance/CA: 6-12 LPA\n- Healthcare: 8-15 LPA\n- Skilled Trade: 3-6 LPA\nWhat is your target starting salary?";
  }

  return "I'm analyzing your profile. To give you an 'Agent-level' career roadmap, please tell me your exact qualification (12th, ITI, etc.) and your stream (PCM, Trade, etc.)!";
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1]?.content || '';

    // Build conversation for OpenAI fallback.
    const apiMessages = [
      { role: 'system', content: MENTOR_INSTRUCTIONS },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // 1. TRY GEMINI FIRST (Primary)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.startsWith('AIza') && AI_PROVIDER !== 'openai') {
      try {
        console.log('AI Route: Calling Gemini...');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const prompt = [
          MENTOR_INSTRUCTIONS,
          ...messages.map(m => `${m.role}: ${m.content}`),
          "Assistant:"
        ].join('\n');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = cleanAIResponse(response.text());

        console.log('AI Route: Gemini success');
        return NextResponse.json({ success: true, data: { response: text, tokens: 0 } });
      } catch (geminiError) {
        console.error('AI Route: Gemini failed:', geminiError.message);
      }
    }

    // 2. OPTIONAL OPENAI FALLBACK
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = apiKey?.startsWith('sk-') ? new OpenAI({ apiKey }) : null;
    if (openai && ALLOW_OPENAI_FALLBACK) {
      try {
        console.log('AI Route: Calling OpenAI GPT-4o-mini...');
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: apiMessages,
          temperature: 0.7,
        });

        let clean = cleanAIResponse(aiResponse.choices[0].message.content);
        return NextResponse.json({ success: true, data: { response: clean, tokens: 0 } });
      } catch (openaiError) {
        console.error('AI Route: OpenAI fallback failed:', openaiError.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: { response: getDemoResponse(lastMsg), tokens: 0 }
    });

  } catch (error) {
    console.error('AI Chat API Error:', error.message);

    // Fallback to demo response on error without exposing provider internals.
    return NextResponse.json({
      success: true,
      data: { response: getDemoResponse(''), tokens: 0 }
    });
  }
}
