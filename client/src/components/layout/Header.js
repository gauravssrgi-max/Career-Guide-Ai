'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
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
            <Link href="/login" className="btn btn-primary btn-sm">Get Started</Link>
          )}
        </div>
      </div>
    </header>
  );
}
