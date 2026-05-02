/**
 * Header Component — Main Navigation Bar
 * 
 * Provides site navigation, theme toggle, and authentication controls.
 * Uses LoginModal for popup authentication instead of page redirect.
 * 
 * @author Gaurav Kumar Shah
 */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../LoginModal';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🎯</span>
            <span className={styles.logoText}>Career<span className={styles.logoAccent}>Guide</span> AI</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/survey" className={styles.navLink}>Survey</Link>
            <Link href="/careers" className={styles.navLink}>Careers</Link>
            <Link href="/chat" className={styles.navLink}>AI Mentor</Link>
            {isAuthenticated && <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>}
          </nav>

          <div className={styles.actions}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-sm">Get Started</button>
            )}
          </div>
        </div>
      </header>

      {/* Popup login modal — no page redirect */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
