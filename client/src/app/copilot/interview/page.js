'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../copilot.module.css';

export default function InterviewPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [activeTab, setActiveTab] = useState('technical');
  const [showPracticeForm, setShowPracticeForm] = useState(false);
  const [practiceForm, setPracticeForm] = useState({ type: 'technical', score: 0, feedback: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchInterviewPrep();
  }, [isAuthenticated]);

  const fetchInterviewPrep = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setInterviewPrep(data.data.interviewPrep);
      }
    } catch (error) {
      console.error('Error fetching interview prep:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordPractice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/interview-practice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(practiceForm),
      });

      if (res.ok) {
        setShowPracticeForm(false);
        setPracticeForm({ type: 'technical', score: 0, feedback: '' });
        fetchInterviewPrep();
        alert('Practice session recorded!');
      }
    } catch (error) {
      console.error('Error recording practice:', error);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading interview prep...</div></div>;
  }

  if (!interviewPrep) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>No Interview Prep Found</h2>
          <p>Generate your complete career system first</p>
          <button onClick={() => router.push('/copilot')} className={styles.btnPrimary}>
            Go to Career Copilot
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return '#10b981';
    if (difficulty === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>💼 Interview Preparation</h1>
        <p className={styles.subtitle}>
          Master technical and behavioral interviews with curated questions and practice scenarios
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'technical' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          Technical Questions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'behavioral' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('behavioral')}
        >
          Behavioral Questions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'scenarios' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Mock Scenarios
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'weaknesses' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('weaknesses')}
        >
          Weakness Detection
        </button>
      </div>

      {/* Technical Questions */}
      {activeTab === 'technical' && (
        <section className={styles.section}>
          <h2>🔧 Technical Questions</h2>
          {interviewPrep.technicalQuestions?.map((q, index) => (
            <div key={index} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h3>{q.question}</h3>
                <div className={styles.questionMeta}>
                  <span 
                    className={styles.difficulty}
                    style={{ background: getDifficultyColor(q.difficulty) }}
                  >
                    {q.difficulty}
                  </span>
                  <span className={styles.topic}>{q.topic}</span>
                </div>
              </div>
              
              <div className={styles.answer}>
                <h4>Sample Answer:</h4>
                <p>{q.sampleAnswer}</p>
              </div>

              <div className={styles.keyPoints}>
                <h4>Key Points to Cover:</h4>
                <ul>
                  {q.keyPoints?.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Behavioral Questions */}
      {activeTab === 'behavioral' && (
        <section className={styles.section}>
          <h2>🗣️ Behavioral Questions (STAR Method)</h2>
          <div className={styles.starInfo}>
            <p><strong>STAR Framework:</strong> Situation → Task → Action → Result</p>
          </div>
          {interviewPrep.behavioralQuestions?.map((q, index) => (
            <div key={index} className={styles.questionCard}>
              <h3>{q.question}</h3>
              
              <div className={styles.starFramework}>
                <div className={styles.starItem}>
                  <h4>📍 Situation</h4>
                  <p>{q.starFramework?.situation}</p>
                </div>
                <div className={styles.starItem}>
                  <h4>🎯 Task</h4>
                  <p>{q.starFramework?.task}</p>
                </div>
                <div className={styles.starItem}>
                  <h4>⚡ Action</h4>
                  <p>{q.starFramework?.action}</p>
                </div>
                <div className={styles.starItem}>
                  <h4>✅ Result</h4>
                  <p>{q.starFramework?.result}</p>
                </div>
              </div>

              <div className={styles.tips}>
                <h4>💡 Tips:</h4>
                <ul>
                  {q.tips?.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Mock Scenarios */}
      {activeTab === 'scenarios' && (
        <section className={styles.section}>
          <h2>🎭 Mock Interview Scenarios</h2>
          {interviewPrep.mockScenarios?.map((scenario, index) => (
            <div key={index} className={styles.scenarioCard}>
              <h3>{scenario.title}</h3>
              <div className={styles.scenarioContent}>
                <div className={styles.scenarioDescription}>
                  <h4>Scenario:</h4>
                  <p>{scenario.description}</p>
                </div>
                <div className={styles.scenarioApproach}>
                  <h4>Expected Approach:</h4>
                  <p>{scenario.expectedApproach}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Weakness Detection */}
      {activeTab === 'weaknesses' && (
        <section className={styles.section}>
          <h2>🎯 Areas for Improvement</h2>
          {interviewPrep.weaknessDetection?.map((weakness, index) => (
            <div 
              key={index} 
              className={styles.weaknessCard}
              style={{ borderLeft: `4px solid ${weakness.severity === 'high' ? '#ef4444' : weakness.severity === 'medium' ? '#f59e0b' : '#10b981'}` }}
            >
              <div className={styles.weaknessHeader}>
                <h3>{weakness.area}</h3>
                <span className={`${styles.severity} ${styles[weakness.severity]}`}>
                  {weakness.severity} priority
                </span>
              </div>
              <div className={styles.improvementPlan}>
                <h4>Improvement Plan:</h4>
                <p>{weakness.improvementPlan}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Practice History */}
      {interviewPrep.practiceHistory && interviewPrep.practiceHistory.length > 0 && (
        <section className={styles.section}>
          <h2>📊 Your Practice History</h2>
          <div className={styles.practiceGrid}>
            {interviewPrep.practiceHistory.map((practice, index) => (
              <div key={index} className={styles.practiceCard}>
                <div className={styles.practiceDate}>
                  {new Date(practice.date).toLocaleDateString()}
                </div>
                <div className={styles.practiceType}>{practice.type}</div>
                <div className={styles.practiceScore}>Score: {practice.score}/100</div>
                <p>{practice.feedback}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Record Practice Button */}
      <div className={styles.actionSection}>
        <button onClick={() => setShowPracticeForm(true)} className={styles.btnPrimary}>
          📝 Record Practice Session
        </button>
      </div>

      {/* Practice Form Modal */}
      {showPracticeForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <h2>Record Practice Session</h2>
            <form onSubmit={recordPractice} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Type</label>
                <select
                  value={practiceForm.type}
                  onChange={(e) => setPracticeForm({ ...practiceForm, type: e.target.value })}
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="mock">Mock Interview</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={practiceForm.score}
                  onChange={(e) => setPracticeForm({ ...practiceForm, score: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Feedback / Notes</label>
                <textarea
                  rows="4"
                  value={practiceForm.feedback}
                  onChange={(e) => setPracticeForm({ ...practiceForm, feedback: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowPracticeForm(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Practice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
