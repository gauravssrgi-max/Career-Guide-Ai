'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import styles from './Dashboard.module.css';

const isGenericName = (name) => {
  const normalized = (name || '').trim().toLowerCase();
  return !normalized || normalized === 'user' || normalized === 'original user';
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    api.getDashboard()
      .then(d => { setDashboard(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (loading) return <div className={styles.dashboard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  if (!dashboard) return <div className={styles.dashboard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Unable to load dashboard</p></div>;

  const { user: u, savedCareers, surveysCompleted, stats } = dashboard;
  const displayName = isGenericName(u?.name)
    ? (authUser?.name || authUser?.email?.split('@')[0] || 'Original User')
    : u.name;

  return (
    <div className={`${styles.dashboard} page-enter`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className="heading-md">Welcome, <span className="text-gradient">{displayName}</span> 👋</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Your career exploration progress</p>
          </div>
          <Link href="/survey" className="btn btn-primary btn-sm">New Survey →</Link>
        </div>

        <div className={styles.statsGrid}>
          {[
            { icon: '🏆', val: stats.level, label: 'Level' },
            { icon: '📋', val: surveysCompleted, label: 'Surveys' },
            { icon: '💾', val: savedCareers.length, label: 'Saved' },
            { icon: '🎖️', val: stats.totalBadges, label: 'Badges' },
          ].map((s, i) => (
            <div key={i} className={`${styles.statCard} card animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.statIcon}>{s.icon}</span>
              <div className={styles.statValue}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.quickActions}>
          <Link href="/survey" className={styles.navButton}>
            <span>📋</span> Survey
          </Link>
          <Link href="/chat" className={styles.navButton}>
            <span>💬</span> AI Mentor
          </Link>
          <Link href="/careers" className={styles.navButton}>
            <span>🔍</span> Careers
          </Link>
          <Link href="/copilot" className={styles.navButton}>
            <span>🚀</span> Copilot
          </Link>
        </div>
      </div>
    </div>
  );
}
