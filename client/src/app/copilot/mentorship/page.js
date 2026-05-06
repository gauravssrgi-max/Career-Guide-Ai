'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../copilot.module.css';

export default function MentorshipPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mentorship, setMentorship] = useState(null);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentorForm, setMentorForm] = useState({ name: '', expertise: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMentorship();
  }, [isAuthenticated]);

  const fetchMentorship = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMentorship(data.data.mentorship);
      }
    } catch (error) {
      console.error('Error fetching mentorship:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMentor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mentorForm),
      });

      if (res.ok) {
        setShowAddMentor(false);
        setMentorForm({ name: '', expertise: '' });
        fetchMentorship();
      }
    } catch (error) {
      console.error('Error adding mentor:', error);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading mentorship plan...</div></div>;
  }

  if (!mentorship) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>No Mentorship Plan Found</h2>
          <p>Generate your complete career system first</p>
          <button onClick={() => router.push('/copilot')} className={styles.btnPrimary}>
            Go to Career Copilot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🤝 Mentorship & Community</h1>
        <p className={styles.subtitle}>
          Build your network with mentors and communities that accelerate your growth
        </p>
      </div>

      {/* Ideal Mentors */}
      <section className={styles.section}>
        <h2>🎯 Ideal Mentor Profiles</h2>
        <p>These are the types of mentors who can best guide your career journey</p>
        <div className={styles.mentorsGrid}>
          {mentorship.idealMentors?.map((mentor, index) => (
            <div key={index} className={styles.mentorCard}>
              <h3>{mentor.type}</h3>
              <p><strong>Expertise:</strong> {mentor.expertise}</p>
              <p><strong>Why:</strong> {mentor.why}</p>
              <p><strong>Where to Find:</strong> {mentor.whereToFind}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Communities */}
      <section className={styles.section}>
        <h2>👥 Recommended Communities</h2>
        <div className={styles.communitiesGrid}>
          {mentorship.communities?.map((community, index) => (
            <div key={index} className={styles.communityCard}>
              <h3>{community.name}</h3>
              <p><strong>Platform:</strong> {community.platform}</p>
              <p><strong>Focus:</strong> {community.focus}</p>
              {community.url && (
                <a href={community.url} target="_blank" rel="noopener noreferrer" className={styles.btnLink}>
                  Join Community →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Outreach Templates */}
      <section className={styles.section}>
        <h2>✉️ Outreach Message Templates</h2>
        <p>Use these templates to connect with potential mentors</p>
        {mentorship.outreachTemplates?.map((template, index) => (
          <div key={index} className={styles.templateCard}>
            <h3>{template.purpose}</h3>
            <div className={styles.templateBox}>
              <pre>{template.template}</pre>
              <button 
                onClick={() => navigator.clipboard.writeText(template.template)}
                className={styles.btnCopy}
              >
                📋 Copy
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Mentorship Plan */}
      <section className={styles.section}>
        <h2>📅 Mentorship Structure</h2>
        <div className={styles.planCard}>
          <p><strong>Frequency:</strong> {mentorship.mentorshipPlan?.frequency}</p>
          <p><strong>Structure:</strong> {mentorship.mentorshipPlan?.structure}</p>
          <div>
            <strong>Discussion Goals:</strong>
            <ul>
              {mentorship.mentorshipPlan?.discussionGoals?.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Active Mentors */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🌟 Your Active Mentors</h2>
          <button onClick={() => setShowAddMentor(true)} className={styles.btnPrimary}>
            + Add Mentor
          </button>
        </div>
        
        {mentorship.activeMentors && mentorship.activeMentors.length > 0 ? (
          <div className={styles.activeMentorsGrid}>
            {mentorship.activeMentors.map((mentor, index) => (
              <div key={index} className={styles.activeMentorCard}>
                <h3>{mentor.name}</h3>
                <p><strong>Expertise:</strong> {mentor.expertise}</p>
                <p><strong>Connected:</strong> {new Date(mentor.connectedAt).toLocaleDateString()}</p>
                <p><strong>Last Contact:</strong> {new Date(mentor.lastContact).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No active mentors yet. Start connecting!</p>
        )}
      </section>

      {/* Add Mentor Modal */}
      {showAddMentor && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <h2>Add Mentor Connection</h2>
            <form onSubmit={addMentor} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Mentor Name</label>
                <input
                  type="text"
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Expertise</label>
                <input
                  type="text"
                  value={mentorForm.expertise}
                  onChange={(e) => setMentorForm({ ...mentorForm, expertise: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddMentor(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Add Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
