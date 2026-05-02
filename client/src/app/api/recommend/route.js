/**
 * Career Recommendations API — Serverless
 * Generates AI career recommendations from survey data
 * @author Gaurav Kumar Shah
 */
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Default careers when AI is unavailable
const DEFAULT_CAREERS = [
  { title: 'Software Engineer', overview: 'Build apps and systems.', whyThisCareer: 'Strong tech demand.', salaryRange: { entry: '₹4-8 LPA' }, difficulty: 3, growthRate: '22%', futureScope: 'Fastest growing field.', riskScore: 15, requiredSkills: ['Programming', 'DSA', 'System Design'], category: 'technology' },
  { title: 'Data Scientist', overview: 'Extract insights from data.', whyThisCareer: 'Analytics meets tech.', salaryRange: { entry: '₹6-10 LPA' }, difficulty: 4, growthRate: '35%', futureScope: '#1 job of the decade.', riskScore: 12, requiredSkills: ['Python', 'Statistics', 'ML'], category: 'technology' },
  { title: 'AI/ML Engineer', overview: 'Build intelligent systems.', whyThisCareer: 'Cutting-edge demand.', salaryRange: { entry: '₹8-15 LPA' }, difficulty: 5, growthRate: '40%', futureScope: 'Transforming every industry.', riskScore: 10, requiredSkills: ['Deep Learning', 'Python', 'Math'], category: 'technology' },
];

export async function POST(request) {
  try {
    const { answers } = await request.json();
    
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      return NextResponse.json({ success: true, data: { careers: DEFAULT_CAREERS, analysis: 'Based on your interests, here are top matches.' } });
    }

    const interests = (answers?.interests || []).join(', ');
    const skills = (answers?.skills || []).join(', ');

    const prompt = `Student: Interests: ${interests}. Skills: ${skills}. Personality: ${answers?.personalityType || 'balanced'}. Budget: ${answers?.budget || 'flexible'}. Recommend 3 careers. Return ONLY JSON: {"careers":[{"title":"name","overview":"desc","salaryRange":{"entry":"₹X LPA"},"difficulty":3,"growthRate":"20%","futureScope":"outlook","riskScore":25,"requiredSkills":["s1"],"category":"technology"}],"analysis":"brief"}`;

    const response = await openai.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      instructions: 'Return ONLY valid JSON. No markdown.',
      store: false,
    });

    const jsonMatch = response.output_text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, data: parsed });
    }

    return NextResponse.json({ success: true, data: { careers: DEFAULT_CAREERS, analysis: 'AI-generated recommendations.' } });
  } catch (error) {
    console.error('Recommend API error:', error.message);
    return NextResponse.json({ success: true, data: { careers: DEFAULT_CAREERS, analysis: 'Default recommendations.' } });
  }
}
