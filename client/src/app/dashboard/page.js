'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    api.getDashboard()
      .then(d => { setDashboard(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (loading) return <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  if (!dashboard) return <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Unable to load</p></div>;

  const { user: u, savedCareers, surveysCompleted, stats } = dashboard;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 16px' }} className="page-enter">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="heading-md">Welcome, <span className="text-gradient">{u.name}</span> 👋</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Your career exploration progress</p>
          </div>
          <Link href="/survey" className="btn btn-primary btn-sm">New Survey →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            { icon: '🏆', val: stats.level, label: 'Level' },
            { icon: '📋', val: surveysCompleted, label: 'Surveys' },
            { icon: '💾', val: savedCareers.length, label: 'Saved' },
            { icon: '🎖️', val: stats.totalBadges, label: 'Badges' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 24 }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 8 }}>{s.val}</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/survey" className="btn btn-secondary">📋 New Survey</Link>
          <Link href="/chat" className="btn btn-secondary">💬 AI Mentor</Link>
          <Link href="/careers" className="btn btn-secondary">🔍 Browse Careers</Link>
        </div>
      </div>
    </div>
  );
}
