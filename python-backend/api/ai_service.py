"""
Career Guide AI — Python AI Service
Career recommendation engine and chat mentor using Python/scikit-learn
"""
import random


class CareerAIService:
    """AI-powered career guidance engine built with Python"""

    def __init__(self):
        self.career_database = self._load_career_data()
        print("✅ Python AI Service loaded")

    def _load_career_data(self):
        """Load comprehensive career data"""
        return {
            'technology': [
                {'title': 'Software Engineer', 'overview': 'Build applications and systems that power the digital world.', 'whyThisCareer': 'Your tech interest and problem-solving skills make this ideal.', 'salaryRange': {'entry': '₹4-8 LPA'}, 'difficulty': 3, 'growthRate': '22%', 'futureScope': 'One of the fastest-growing fields.', 'riskScore': 15, 'requiredSkills': ['Programming', 'DSA', 'System Design'], 'category': 'technology'},
                {'title': 'Data Scientist', 'overview': 'Extract insights from data to drive decisions.', 'whyThisCareer': 'Perfect for analytical minds with tech interest.', 'salaryRange': {'entry': '₹6-10 LPA'}, 'difficulty': 4, 'growthRate': '35%', 'futureScope': '#1 job of the decade.', 'riskScore': 12, 'requiredSkills': ['Python', 'Statistics', 'ML'], 'category': 'technology'},
                {'title': 'AI/ML Engineer', 'overview': 'Design intelligent systems that learn and adapt.', 'whyThisCareer': 'Cutting-edge field with massive demand.', 'salaryRange': {'entry': '₹8-15 LPA'}, 'difficulty': 5, 'growthRate': '40%', 'futureScope': 'AI is transforming every industry.', 'riskScore': 10, 'requiredSkills': ['Python', 'Deep Learning', 'Math'], 'category': 'technology'},
            ],
            'medical': [
                {'title': 'Doctor (MBBS)', 'overview': 'Diagnose and treat illnesses.', 'whyThisCareer': 'Noble profession saving lives.', 'salaryRange': {'entry': '₹6-10 LPA'}, 'difficulty': 5, 'growthRate': '10%', 'futureScope': 'Always in demand.', 'riskScore': 20, 'requiredSkills': ['Biology', 'Chemistry', 'Patient Care'], 'category': 'medical'},
                {'title': 'Biotech Researcher', 'overview': 'Innovate at intersection of biology and tech.', 'whyThisCareer': 'Perfect for science innovators.', 'salaryRange': {'entry': '₹4-8 LPA'}, 'difficulty': 4, 'growthRate': '15%', 'futureScope': 'Booming post-pandemic.', 'riskScore': 22, 'requiredSkills': ['Molecular Biology', 'Research', 'Lab Skills'], 'category': 'medical'},
            ],
            'business': [
                {'title': 'Management Consultant', 'overview': 'Advise companies on strategy.', 'whyThisCareer': 'High-growth career for analytical minds.', 'salaryRange': {'entry': '₹8-15 LPA'}, 'difficulty': 4, 'growthRate': '15%', 'futureScope': 'Consulting remains high-growth.', 'riskScore': 25, 'requiredSkills': ['Analysis', 'Communication', 'Leadership'], 'category': 'business'},
                {'title': 'Chartered Accountant', 'overview': 'Financial expert in audits and taxation.', 'whyThisCareer': 'Recession-proof career.', 'salaryRange': {'entry': '₹7-12 LPA'}, 'difficulty': 5, 'growthRate': '11%', 'futureScope': 'Always needed.', 'riskScore': 15, 'requiredSkills': ['Accounting', 'Tax Law', 'Finance'], 'category': 'business'},
            ],
            'creative': [
                {'title': 'UX/UI Designer', 'overview': 'Design beautiful digital experiences.', 'whyThisCareer': 'Creativity meets technology.', 'salaryRange': {'entry': '₹4-8 LPA'}, 'difficulty': 3, 'growthRate': '20%', 'futureScope': 'Design-driven companies dominate.', 'riskScore': 20, 'requiredSkills': ['Figma', 'Design Thinking', 'User Research'], 'category': 'creative'},
            ],
            'government': [
                {'title': 'IAS Officer', 'overview': 'Lead government administration.', 'whyThisCareer': 'Prestigious with job security.', 'salaryRange': {'entry': '₹8-10 LPA + perks'}, 'difficulty': 5, 'growthRate': '2%', 'futureScope': 'Stable career.', 'riskScore': 45, 'requiredSkills': ['GK', 'Writing', 'Leadership'], 'category': 'government'},
            ],
            'science': [
                {'title': 'Research Scientist', 'overview': 'Push boundaries of knowledge.', 'whyThisCareer': 'For the curious mind.', 'salaryRange': {'entry': '₹5-10 LPA'}, 'difficulty': 4, 'growthRate': '12%', 'futureScope': 'R&D growing globally.', 'riskScore': 30, 'requiredSkills': ['Research', 'Critical Thinking', 'Data Analysis'], 'category': 'science'},
            ],
        }

    def recommend_careers(self, survey_data):
        """Generate career recommendations based on survey answers"""
        interests = survey_data.get('interests', ['technology'])
        primary = interests[0].lower() if interests else 'technology'
        careers = self.career_database.get(primary, self.career_database['technology'])

        confusion = survey_data.get('confusion_level', 'none')
        advice = ''
        if confusion in ('moderate', 'high'):
            advice = "Don't worry! Confusion is normal. Start with the top recommendation — you can always pivot later. 💪"

        personality = survey_data.get('personalityType', 'balanced')
        analysis = f"Based on your interests in {', '.join(interests)} and {personality} personality, here are your best career matches."

        return {
            'careers': careers[:3],
            'analysis': analysis,
            'confusionAdvice': advice,
        }

    def chat(self, messages):
        """AI chat mentor for career guidance"""
        last_msg = messages[-1].get('content', '').lower() if messages else ''

        response = "Hi! I'm Career Guide AI 🎯 Ask me about careers, salaries, exams, or your future!"

        if any(w in last_msg for w in ['salary', 'money', 'earn', 'pay']):
            response = "💰 Salary Overview:\n• Software Engineer: ₹4-60L\n• Data Scientist: ₹6-70L\n• Doctor: ₹10-80L\n• CA: ₹7-60L\n• IAS: ₹8-30L + perks\n\nWhich career interests you?"
        elif any(w in last_msg for w in ['confused', "don't know", 'help me']):
            response = "It's completely normal to feel confused! 🤗\n\nAnswer these:\n1. People or computers?\n2. Numbers or words?\n3. Create or analyze?\n\nI'll narrow it down for you!"
        elif any(w in last_msg for w in ['engineer', 'coding', 'tech', 'software']):
            response = "Tech is amazing! 🚀\n\n• Software Engineer — ₹4-60L\n• Data Scientist — ₹6-70L\n• AI/ML Engineer — ₹8-1Cr+\n\nStart: B.Tech CS (JEE) or self-learn via freeCodeCamp.\nWant a detailed roadmap?"
        elif any(w in last_msg for w in ['doctor', 'medical', 'mbbs', 'neet']):
            response = "Medicine is noble! 🩺\n\nPath: PCB → NEET → MBBS (5.5yr) → MD/MS\nGovt fees: ₹50K-5L | Private: ₹20L-1Cr+\nEntry: ₹6-10L | Specialist: ₹20-80L+\n\nNeed NEET prep tips?"
        elif any(w in last_msg for w in ['exam', 'jee', 'upsc', 'cat']):
            response = "Major Exams in India 📝\n\n• JEE Main/Adv → IITs\n• NEET → Medical\n• UPSC CSE → IAS/IPS\n• CAT → IIMs\n• CLAT → Law\n• GRE/GMAT → Abroad\n\nWhich exam?"

        return {'response': response, 'tokens': 0}


# Singleton instance
career_ai = CareerAIService()
