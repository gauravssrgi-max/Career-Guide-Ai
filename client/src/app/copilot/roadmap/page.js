'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../copilot.module.css';

export default function RoadmapPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchRoadmap();
  }, [isAuthenticated]);

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.data.roadmap);
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (phaseName, progress, completed) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/roadmap/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phase: phaseName, progress, completed }),
      });

      if (res.ok) {
        fetchRoadmap();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading roadmap...</div></div>;
  }

  if (!roadmap) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>No Roadmap Found</h2>
          <p>Generate your complete career system first</p>
          <button onClick={() => router.push('/copilot')} className={styles.btnPrimary}>
            Go to Career Copilot
          </button>
        </div>
      </div>
    );
  }

  const phaseColors = {
    beginner: '#10b981',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6',
    'job-ready': '#f59e0b',
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🗺️ Your Career Roadmap</h1>
        <p className={styles.subtitle}>
          Follow this phase-by-phase journey from beginner to job-ready professional
        </p>
      </div>

      <div className={styles.progressOverview}>
        <h3>Overall Progress: {roadmap.overallProgress || 0}%</h3>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${roadmap.overallProgress || 0}%` }}
          />
        </div>
        <p>Current Phase: <strong>{roadmap.currentPhase}</strong></p>
      </div>

      <div className={styles.phasesContainer}>
        {roadmap.phases?.map((phase, index) => (
          <div 
            key={index} 
            className={styles.phaseCard}
            style={{ borderLeft: `4px solid ${phaseColors[phase.name] || '#667eea'}` }}
          >
            <div className={styles.phaseHeader}>
              <h2 style={{ color: phaseColors[phase.name] }}>
                {phase.name.toUpperCase()}
              </h2>
              <span className={styles.timeline}>{phase.estimatedTimeline}</span>
            </div>

            {phase.completed && <span className={styles.completedBadge}>✓ Completed</span>}

            <div className={styles.phaseProgress}>
              <label>Progress: {phase.progress || 0}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={phase.progress || 0}
                onChange={(e) => updateProgress(phase.name, parseInt(e.target.value), false)}
                disabled={updating}
              />
            </div>

            <div className={styles.section}>
              <h3>📚 Skills to Learn</h3>
              <ul>
                {phase.skills?.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>🛠️ Tools & Technologies</h3>
              <div className={styles.tags}>
                {phase.tools?.map((tool, i) => (
                  <span key={i} className={styles.tag}>{tool}</span>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>📖 Resources</h3>
              {phase.resources?.map((resource, i) => (
                <div key={i} className={styles.resource}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.title}
                  </a>
                  <span className={styles.resourceType}>{resource.type}</span>
                  {resource.free && <span className={styles.freeBadge}>FREE</span>}
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>🚀 Projects</h3>
              {phase.projects?.map((project, i) => (
                <div key={i} className={styles.project}>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className={styles.projectMeta}>
                    <span className={styles.difficulty}>{project.difficulty}</span>
                    <span>{project.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>🎯 Milestones</h3>
              <ul className={styles.milestones}>
                {phase.milestones?.map((milestone, i) => (
                  <li key={i}>{milestone}</li>
                ))}
              </ul>
            </div>

            {!phase.completed && (
              <button
                onClick={() => updateProgress(phase.name, 100, true)}
                className={styles.btnComplete}
                disabled={updating}
              >
                Mark as Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
