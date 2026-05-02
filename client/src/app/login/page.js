'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{fontSize: '2.5rem'}}>🎯</span>
          <h1 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p style={styles.subtitle}>{isLogin ? 'Continue your career journey' : 'Start your career exploration'}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input className="input" type="text" placeholder="John Doe" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 8}} disabled={loading}>
            {loading ? <span className="spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={styles.divider}><span>or</span></div>

        <button className="btn btn-secondary" style={{width: '100%'}} onClick={() => {
          setForm({name: 'Demo User', email: 'demo@careerguide.ai', password: 'demo123456'});
          setIsLogin(true);
        }}>
          🚀 Quick Demo Login
        </button>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.toggleBtn}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative' },
  glow: { position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { width: '100%', maxWidth: 420, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px 32px', position: 'relative', zIndex: 1, animation: 'fadeInUp 0.5s ease-out' },
  header: { textAlign: 'center', marginBottom: 32 },
  title: { fontSize: '1.5rem', fontWeight: 700, marginTop: 12, letterSpacing: '-0.02em' },
  subtitle: { fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 },
  error: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 16 },
  divider: { display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0', color: 'var(--text-tertiary)', fontSize: '0.8rem' },
  toggle: { textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' },
  toggleBtn: { color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' },
};
