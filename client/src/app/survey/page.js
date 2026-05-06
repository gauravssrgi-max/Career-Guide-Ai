/**
 * Career Survey — Multi-step Interest & Skill Assessment
 * 
 * Guides the student through 6 steps to understand their interests,
 * skills, personality, and goals. Results are sent to the AI engine
 * for personalized career recommendations.
 * 
 * Steps: Interests → Skills → Personality → Budget → Location → Confusion Level
 * 
 * @author Gaurav Kumar Shah
 */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import styles from './Survey.module.css';

const surveySteps = [
  {
    id: 'interests', title: 'What excites you?', subtitle: 'Pick your top interests',
    type: 'multi', options: [
      { value: 'technology', label: '💻 Technology', desc: 'Coding, AI, gadgets' },
      { value: 'medical', label: '🩺 Medical & Health', desc: 'Healthcare, biology' },
      { value: 'business', label: '📈 Business & Finance', desc: 'Money, management' },
      { value: 'creative', label: '🎨 Arts & Design', desc: 'Design, music, writing' },
      { value: 'science', label: '🔬 Science & Research', desc: 'Physics, chemistry, research' },
      { value: 'government', label: '🏛️ Government & Law', desc: 'Policy, civil services' },
    ],
  },
  {
    id: 'skills', title: 'What are you good at?', subtitle: 'Select your strengths',
    type: 'multi', options: [
      { value: 'coding', label: '⌨️ Coding' }, { value: 'communication', label: '🗣️ Communication' },
      { value: 'creativity', label: '✨ Creativity' }, { value: 'mathematics', label: '🔢 Mathematics' },
      { value: 'leadership', label: '👑 Leadership' }, { value: 'writing', label: '✍️ Writing' },
      { value: 'analytical', label: '🧩 Analytical Thinking' }, { value: 'teamwork', label: '🤝 Teamwork' },
    ],
  },
  {
    id: 'personalityType', title: 'Your personality type?', subtitle: 'How do you recharge?',
    type: 'single', options: [
      { value: 'introvert', label: '🌙 Introvert', desc: 'Prefer quiet, solo work' },
      { value: 'extrovert', label: '☀️ Extrovert', desc: 'Love socializing, teams' },
      { value: 'ambivert', label: '⚖️ Ambivert', desc: 'Best of both worlds' },
    ],
  },
  {
    id: 'budget', title: 'What\'s your budget?', subtitle: 'For education & training',
    type: 'single', options: [
      { value: 'low', label: '💰 Low Budget', desc: 'Under ₹5 LPA' },
      { value: 'medium', label: '💰💰 Medium', desc: '₹5-15 LPA' },
      { value: 'high', label: '💰💰💰 High', desc: '₹15+ LPA' },
      { value: 'flexible', label: '🤷 Flexible', desc: 'Money not a constraint' },
    ],
  },
  {
    id: 'location', title: 'Where do you want to study/work?', subtitle: 'Location preference',
    type: 'single', options: [
      { value: 'india', label: '🇮🇳 India', desc: 'IITs, AIIMS, IIMs' },
      { value: 'abroad', label: '🌍 Abroad', desc: 'USA, UK, Canada, etc.' },
      { value: 'both', label: '🌐 Open to Both', desc: 'Wherever fits best' },
    ],
  },
  {
    id: 'confusion', title: 'How confused are you?', subtitle: 'Be honest — we\'ll help!',
    type: 'single', options: [
      { value: 'none', label: '😊 Not confused', desc: 'I have some ideas' },
      { value: 'mild', label: '🤔 A little confused', desc: 'Need some direction' },
      { value: 'moderate', label: '😅 Quite confused', desc: 'Too many options' },
      { value: 'high', label: '😰 Very confused', desc: 'No clue what to do' },
    ],
  },
];

const confusionQuestions = [
  { id: 'physicalWorkComfort', title: 'Are you comfortable with physical work?', options: [
    { value: 'yes', label: '💪 Yes' }, { value: 'no', label: '🧠 No, prefer desk work' }, { value: 'maybe', label: '🤷 Maybe' },
  ]},
  { id: 'riskTolerance', title: 'Income preference?', options: [
    { value: 'stable', label: '🏦 Stable income' }, { value: 'high-risk-high-reward', label: '🚀 High risk, high reward' }, { value: 'moderate', label: '⚖️ Moderate' },
  ]},
  { id: 'learningPreference', title: 'Study or hands-on?', options: [
    { value: 'study', label: '📚 Love studying' }, { value: 'practical', label: '🔧 Prefer practical' }, { value: 'both', label: '🔄 Both' },
  ]},
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ interests: [], skills: [] });
  const [confusionLevel, setConfusionLevel] = useState('none');
  const [showConfusion, setShowConfusion] = useState(false);
  const [confusionStep, setConfusionStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const totalSteps = surveySteps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleSelect = (stepData, value) => {
    if (stepData.type === 'multi') {
      const current = answers[stepData.id] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      setAnswers({ ...answers, [stepData.id]: updated });
    } else if (stepData.id === 'confusion') {
      setConfusionLevel(value);
      if (value === 'moderate' || value === 'high') setShowConfusion(true);
    } else {
      setAnswers({ ...answers, [stepData.id]: value });
    }
  };

  const handleConfusionAnswer = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
    if (confusionStep < 3 - 1) setConfusionStep(confusionStep + 1);
    else { setShowConfusion(false); handleSubmit({ ...answers, [qId]: value }); }
  };

  const canProceed = () => {
    const s = surveySteps[step];
    if (s.type === 'multi') return (answers[s.id] || []).length > 0;
    if (s.id === 'confusion') return !!confusionLevel;
    return !!answers[s.id];
  };

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else if (confusionLevel === 'moderate' || confusionLevel === 'high') setShowConfusion(true);
    else handleSubmit(answers);
  };

  const handleSubmit = async (finalAnswers) => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setLoading(true);
    try {
      const res = await api.submitSurvey({ answers: finalAnswers, confusionLevel });
      localStorage.setItem('surveyResults', JSON.stringify(res.data));
      router.push('/results');
    } catch (err) {
      alert(err.message || 'Error submitting survey');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <div className="spinner" style={{width:48,height:48,borderWidth:3,margin:'0 auto'}} />
          <h2 style={{marginTop:24}}>🧠 AI is analyzing your profile...</h2>
          <p style={{color:'var(--text-secondary)',marginTop:8}}>Finding the perfect careers for you</p>
        </div>
      </div>
    );
  }

  if (showConfusion) {
    const q = [
      { id: 'physicalWorkComfort', title: 'Are you comfortable with physical work?', options: [{ value: 'yes', label: '💪 Yes' }, { value: 'no', label: '🧠 No, prefer desk work' }, { value: 'maybe', label: '🤷 Maybe' }] },
      { id: 'riskTolerance', title: 'Income preference?', options: [{ value: 'stable', label: '🏦 Stable income' }, { value: 'high-risk-high-reward', label: '🚀 High risk, high reward' }, { value: 'moderate', label: '⚖️ Moderate' }] },
      { id: 'learningPreference', title: 'Study or hands-on?', options: [{ value: 'study', label: '📚 Love studying' }, { value: 'practical', label: '🔧 Prefer practical' }, { value: 'both', label: '🔄 Both' }] },
    ][confusionStep];

    return (
      <div className={styles.surveyPage}>
        <div className={styles.container}>
          <div className={styles.confusionHeader}>
            <span style={{fontSize:'2.5rem'}}>🤗</span>
            <h2 className="heading-md">Let's simplify things</h2>
            <p className="text-sm" style={{color:'var(--text-secondary)'}}>Quick questions to narrow down ({confusionStep + 1}/3)</p>
          </div>
          <h3 className="heading-sm" style={{textAlign:'center',margin:'32px 0'}}>{q.title}</h3>
          <div className={styles.optionGrid}>
            {q.options.map(o => (
              <button key={o.value} className={`${styles.option} card`} onClick={() => handleConfusionAnswer(q.id, o.value)}>
                <span className={styles.optionLabel}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentStep = surveySteps[step];

  return (
    <div className={`${styles.surveyPage} page-enter`}>
      <div className={styles.container}>
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className="text-sm" style={{color:'var(--text-secondary)'}}>Step {step + 1} of {totalSteps}</span>
            <span className="text-sm" style={{color:'var(--accent)',fontWeight:600}}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{width:`${progress}%`}} /></div>
        </div>

        <div className={styles.question} key={step}>
          <h2 className="heading-md">{currentStep.title}</h2>
          <p className="text-sm" style={{color:'var(--text-secondary)',marginTop:4}}>{currentStep.subtitle}</p>
        </div>

        <div className={styles.optionGrid}>
          {currentStep.options.map(o => {
            const selected = currentStep.type === 'multi'
              ? (answers[currentStep.id] || []).includes(o.value)
              : (currentStep.id === 'confusion' ? confusionLevel === o.value : answers[currentStep.id] === o.value);
            return (
              <button 
                key={o.value} 
                className={`${styles.option} card ${selected ? styles.optionSelected : ''}`} 
                onClick={() => handleSelect(currentStep, o.value)}
              >
                <span className={styles.optionLabel}>{o.label}</span>
                {o.desc && <span className={styles.optionDesc}>{o.desc}</span>}
              </button>
            );
          })}
        </div>

        <div className={styles.navigation}>
          {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>}
          <div style={{flex:1}} className="mobile-hide" />
          <button className="btn btn-primary" onClick={nextStep} disabled={!canProceed()}>
            {step === totalSteps - 1 ? 'Get Results ✨' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
