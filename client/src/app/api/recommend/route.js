/**
 * Career Recommendations API — Serverless
 * Generates AI career recommendations from survey data
 * @author Gaurav Kumar Shah
 */
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const ALLOW_OPENAI_FALLBACK = process.env.ALLOW_OPENAI_FALLBACK === 'true' || AI_PROVIDER === 'openai';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

// Default careers when AI is unavailable
const DEFAULT_CAREERS = [
  { title: 'Software Engineer', overview: 'Build apps and systems.', whyThisCareer: 'Strong tech demand.', salaryRange: { entry: '₹4-8 LPA' }, difficulty: 3, growthRate: '22%', futureScope: 'Fastest growing field.', riskScore: 15, requiredSkills: ['Programming', 'DSA', 'System Design'], category: 'technology' },
  { title: 'Data Scientist', overview: 'Extract insights from data.', whyThisCareer: 'Analytics meets tech.', salaryRange: { entry: '₹6-10 LPA' }, difficulty: 4, growthRate: '35%', futureScope: '#1 job of the decade.', riskScore: 12, requiredSkills: ['Python', 'Statistics', 'ML'], category: 'technology' },
  { title: 'AI/ML Engineer', overview: 'Build intelligent systems.', whyThisCareer: 'Cutting-edge demand.', salaryRange: { entry: '₹8-15 LPA' }, difficulty: 5, growthRate: '40%', futureScope: 'Transforming every industry.', riskScore: 10, requiredSkills: ['Deep Learning', 'Python', 'Math'], category: 'technology' },
];

function parseJSON(text) {
  const jsonMatch = text?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

export async function POST(request) {
  try {
    const { answers } = await request.json();

    const interests = (answers?.interests || []).join(', ');
    const skills = (answers?.skills || []).join(', ');

    const prompt = `Student: Interests: ${interests}. Skills: ${skills}. Personality: ${answers?.personalityType || 'balanced'}. Budget: ${answers?.budget || 'flexible'}. Recommend 3 careers. Return ONLY JSON: {"careers":[{"title":"name","overview":"desc","salaryRange":{"entry":"₹X LPA"},"difficulty":3,"growthRate":"20%","futureScope":"outlook","riskScore":25,"requiredSkills":["s1"],"category":"technology"}],"analysis":"brief"}`;

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey?.startsWith('AIza') && AI_PROVIDER !== 'openai') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent(`${prompt}\nReturn ONLY valid JSON. No markdown.`);
        const parsed = parseJSON((await result.response).text());
        if (parsed?.careers) {
          return NextResponse.json({ success: true, data: parsed });
        }
      } catch (geminiError) {
        console.error('Recommend Gemini error:', geminiError.message);
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const openai = apiKey?.startsWith('sk-') ? new OpenAI({ apiKey }) : null;
    if (openai && ALLOW_OPENAI_FALLBACK) {
      try {
        const response = await openai.responses.create({
          model: 'gpt-4o-mini',
          input: prompt,
          instructions: 'Return ONLY valid JSON. No markdown.',
          store: false,
        });

        const parsed = parseJSON(response.output_text);
        if (parsed?.careers) {
          return NextResponse.json({ success: true, data: parsed });
        }
      } catch (openaiError) {
        console.error('Recommend OpenAI fallback error:', openaiError.message);
      }
    }

    return NextResponse.json({ success: true, data: { careers: DEFAULT_CAREERS, analysis: 'AI-generated recommendations.' } });
  } catch (error) {
    console.error('Recommend API error:', error.message);
    return NextResponse.json({ success: true, data: { careers: DEFAULT_CAREERS, analysis: 'Default recommendations.' } });
  }
}
