/**
 * AI Chat API Route — Serverless Backend
 * 
 * This runs directly on Vercel as a serverless function,
 * so no separate Express server is needed for production.
 * Connects to OpenAI GPT-5.4-mini for career mentoring.
 * 
 * @author Gaurav Kumar Shah
 */
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client conditionally
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// System instructions for the AI mentor
const MENTOR_INSTRUCTIONS = `You are "Career Guide AI", a direct and clear career advisor for Indian students.

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

// Demo fallback when OpenAI is unavailable
function getDemoResponse(lastMessage) {
  const msg = (lastMessage || '').toLowerCase();
  
  if (msg.includes('salary') || msg.includes('money')) {
    return "Typical salary ranges in India:\n1. Software Engineer - 4-60 LPA\n2. Data Scientist - 6-70 LPA\n3. Doctor - 10-80 LPA\n4. CA - 7-60 LPA\nWhich career interests you?";
  }
  if (msg.includes('confused') || msg.includes("don't know")) {
    return "Totally normal! Answer these:\n1. Do you prefer people or computers?\n2. Numbers or words?\n3. Creating or analyzing?\nTell me and I'll help narrow it down!";
  }
  if (msg.includes('engineer') || msg.includes('tech') || msg.includes('coding')) {
    return "Tech careers in India:\n1. Software Engineer - 4-60 LPA\n2. Data Scientist - 6-70 LPA\n3. AI/ML Engineer - 8-1 Cr+\nStart with B.Tech CS via JEE or self-learn online!";
  }
  
  return "Hi! I'm Career Guide AI 🎯\nAsk me about any career, salary, exam, or roadmap.\nWhat would you like to know?";
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        success: true,
        data: { response: getDemoResponse(lastMsg), tokens: 0 }
      });
    }

    // Build conversation for the AI
    const conversationHistory = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Call OpenAI
    const aiResponse = await openai.responses.create({
      model: 'gpt-5.4-mini',
      input: conversationHistory,
      instructions: MENTOR_INSTRUCTIONS,
      store: false,
    });

    // Clean up the response
    let clean = aiResponse.output_text.trim();
    clean = clean.replace(/\*\*/g, '').replace(/\*/g, '');
    clean = clean.replace(/(\d+\.\s)/g, '\n$1').replace(/^\n/, '').replace(/\n{3,}/g, '\n\n');

    return NextResponse.json({
      success: true,
      data: { response: clean.trim(), tokens: 0 }
    });

  } catch (error) {
    console.error('AI Chat API Error:', error.message);
    
    // Fallback to demo response on error
    const lastMsg = '';
    return NextResponse.json({
      success: true,
      data: { response: getDemoResponse(lastMsg), tokens: 0 }
    });
  }
}
