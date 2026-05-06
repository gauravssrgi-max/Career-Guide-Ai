'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './copilot.module.css';

export default function CareerCopilotPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    currentLevel: 'undergraduate',
    stream: '',
    institution: '',
    percentage: '',
    targetRole: '',
    targetIndustry: '',
    timeframe: '',
    experienceLevel: 'student',
    location: '',
    monthlyBudget: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const profilePayload = {
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        academicBackground: {
          currentLevel: formData.currentLevel,
          stream: formData.stream,
          institution: formData.institution,
          percentage: parseFloat(formData.percentage) || 0,
        },
        careerGoals: {
          targetRole: formData.targetRole,
          targetIndustry: formData.targetIndustry,
          timeframe: formData.timeframe,
        },
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        budgetConstraints: {
          monthly: parseFloat(formData.monthlyBudget) || 0,
          currency: 'INR',
        },
      };

      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
        setShowForm(false);
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteSystem = async () => {
    if (!profile?.profile?.careerGoals?.targetRole) {
      alert('Please create a profile with a target role first');
      return;
    }

    try {
      setGenerating(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:5000/api/copilot/generate-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert('Complete career system generated! Check individual modules.');
        fetchProfile(); // Refresh profile
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to generate system');
      }
    } catch (error) {
      console.error('Error generating system:', error);
      alert('Error generating system');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !profile) {
    return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🚀 Career Copilot</h1>
        <p className={styles.subtitle}>
          Your AI-powered career success system with personalized roadmaps, mentorship, market analytics, and interview prep
        </p>
      </div>

      {!profile && (
        <div className={styles.card}>
          <h2>Get Started</h2>
          <p>Create your career profile to unlock personalized guidance</p>
          <button onClick={() => setShowForm(true)} className={styles.btnPrimary}>
            Create Profile
          </button>
        </div>
      )}

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <h2>Create Your Career Profile</h2>
            <form onSubmit={handleSubmitProfile} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="JavaScript, React, Python"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Interests (comma-separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="Web Development, AI, Startups"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Current Level</label>
                  <select name="currentLevel" value={formData.currentLevel} onChange={handleInputChange}>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Stream/Branch</label>
                  <input
                    type="text"
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="XYZ University"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Percentage/CGPA</label>
                  <input
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="85"
                    step="0.01"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Target Role</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    placeholder="Full Stack Developer"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Target Industry</label>
                  <input
                    type="text"
                    name="targetIndustry"
                    value={formData.targetIndustry}
                    onChange={handleInputChange}
                    placeholder="Technology"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Timeframe</label>
                  <input
                    type="text"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    placeholder="6 months"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Experience Level</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}>
                    <option value="student">Student</option>
                    <option value="fresher">Fresher</option>
                    <option value="1-3years">1-3 Years</option>
                    <option value="3-5years">3-5 Years</option>
                    <option value="5+years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Bangalore, India"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Monthly Budget (₹)</label>
                  <input
                    type="number"
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    onChange={handleInputChange}
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profile && (
        <>
          <div className={styles.profileCard}>
            <h2>Your Profile</h2>
            <div className={styles.profileInfo}>
              <p><strong>Target Role:</strong> {profile.profile?.careerGoals?.targetRole || 'Not set'}</p>
              <p><strong>Industry:</strong> {profile.profile?.careerGoals?.targetIndustry || 'Not set'}</p>
              <p><strong>Experience:</strong> {profile.profile?.experienceLevel || 'Not set'}</p>
              <p><strong>Skills:</strong> {profile.profile?.skills?.join(', ') || 'None'}</p>
            </div>
            <button onClick={() => setShowForm(true)} className={styles.btnSecondary}>
              Edit Profile
            </button>
          </div>

          <div className={styles.generateSection}>
            <h2>Generate Your Complete Career Success System</h2>
            <p>Get personalized roadmap, mentorship plan, education recommendations, market analytics, and interview prep</p>
            <button 
              onClick={generateCompleteSystem} 
              disabled={generating}
              className={styles.btnGenerate}
            >
              {generating ? '🔄 Generating... (This may take 30-60 seconds)' : '✨ Generate Complete System'}
            </button>
          </div>

          <div className={styles.modulesGrid}>
            <div className={styles.moduleCard} onClick={() => router.push('/copilot/roadmap')}>
              <div className={styles.moduleIcon}>🗺️</div>
              <h3>Career Roadmap</h3>
              <p>Phase-by-phase learning journey from beginner to job-ready</p>
              {profile.roadmap && <span className={styles.badge}>Generated</span>}
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/copilot/mentorship')}>
              <div className={styles.moduleIcon}>🤝</div>
              <h3>Mentorship Network</h3>
              <p>Find mentors, join communities, and build connections</p>
              {profile.mentorship && <span className={styles.badge}>Generated</span>}
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/copilot/education')}>
              <div className={styles.moduleIcon}>🎓</div>
              <h3>Education Path</h3>
              <p>College recommendations and alternative learning paths</p>
              {profile.educationRecommendations && <span className={styles.badge}>Generated</span>}
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/copilot/analytics')}>
              <div className={styles.moduleIcon}>📊</div>
              <h3>Market Analytics</h3>
              <p>Skills demand, salary trends, and gap analysis</p>
              {profile.marketAnalytics && <span className={styles.badge}>Generated</span>}
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/copilot/interview')}>
              <div className={styles.moduleIcon}>💼</div>
              <h3>Interview Prep</h3>
              <p>Technical questions, behavioral scenarios, and practice</p>
              {profile.interviewPrep && <span className={styles.badge}>Generated</span>}
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/dashboard')}>
              <div className={styles.moduleIcon}>📈</div>
              <h3>Dashboard</h3>
              <p>Track your progress and achievements</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
