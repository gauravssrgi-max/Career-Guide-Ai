'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { login, register } = useAuth();

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setAnimating(false);
    setTimeout(() => onClose(), 300); // Wait for exit animation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      handleClose();
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  if (!isOpen && !animating) return null;

  return (
    <>
      {/* Dark backdrop overlay */}
      <div style={{
        ...S.backdrop,
        opacity: animating ? 1 : 0,
      }} onClick={handleClose} />

      {/* Modal card */}
      <div style={{
        ...S.modal,
        opacity: animating ? 1 : 0,
        transform: animating ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.85)',
      }}>
        {/* Close button */}
        <button style={S.closeBtn} onClick={handleClose}>✕</button>

        {/* Header */}
        <div style={S.header}>
          <span style={{fontSize: '2.2rem'}}>🎯</span>
          <h2 style={S.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={S.subtitle}>{isLogin ? 'Continue your career journey' : 'Start exploring careers today'}</p>
        </div>

        {error && <div style={S.error}>{error}</div>}

        {/* Social login buttons */}
        <div style={{display:'flex', flexDirection:'column', gap: 10, marginBottom: 18}}>
          <button style={S.googleBtn} onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <div style={S.divider}>
          <div style={{flex:1, height:1, background:'var(--border)'}} />
          <span>or sign {isLogin ? 'in' : 'up'} with ID</span>
          <div style={{flex:1, height:1, background:'var(--border)'}} />
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{marginBottom: 14}}>
              <label style={S.label}>Full Name</label>
              <input style={S.input} type="text" placeholder="Gaurav Shah" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          )}
          
          <div style={{marginBottom: 14}}>
            <label style={S.label}>Email or Mobile</label>
            <input style={S.input} type="text" placeholder="you@example.com / 9876543210" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>

          <div style={{marginBottom: 20}}>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>

          <button type="submit" style={S.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={S.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={S.toggleBtn}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────
const S = {
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    transition: 'opacity 0.3s ease',
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%', zIndex: 1000,
    width: '90%', maxWidth: 400,
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)', padding: '32px 28px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 16,
    background: 'none', border: 'none', color: 'var(--text-tertiary)',
    fontSize: '1.2rem', cursor: 'pointer', padding: 4,
    transition: 'color 0.2s',
  },
  header: { textAlign: 'center', marginBottom: 24 },
  title: { fontSize: '1.4rem', fontWeight: 700, marginTop: 10, letterSpacing: '-0.02em', color: 'var(--text-primary)' },
  subtitle: { fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 },
  error: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: 14 },
  googleBtn: {
    width: '100%', padding: '11px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
    border: '1px solid var(--border)', fontSize: '0.88rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  githubBtn: {
    width: '100%', padding: '11px 16px', borderRadius: 'var(--radius-md)',
    background: '#24292e', color: '#fff', border: '1px solid #444',
    fontSize: '0.88rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 14, margin: '16px 0',
    color: 'var(--text-tertiary)', fontSize: '0.78rem',
  },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', transition: 'border 0.2s', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', padding: '12px', borderRadius: 'var(--radius-full)',
    background: 'var(--accent-gradient)', color: 'white', border: 'none',
    fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
    transition: 'all 0.2s', fontFamily: 'inherit', marginTop: 4,
  },
  toggle: { textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: 'var(--text-secondary)' },
  toggleBtn: { color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' },
};
