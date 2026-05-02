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
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../LoginModal';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();
  const displayName = user?.name || user?.email?.split('@')[0] || 'Account';

  const navLinks = [
    { name: 'Survey', href: '/survey' },
    { name: 'Careers', href: '/careers' },
    { name: 'AI Mentor', href: '/chat' },
    { name: 'Dashboard', href: '/dashboard', auth: true },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🎯</span>
            <span className={styles.logoText}>Career<span className={styles.logoAccent}>Guide</span> AI</span>
          </Link>

          <nav className={styles.nav}>
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {authLoading ? (
              <span className={styles.authLoading}>Checking...</span>
            ) : isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userName} title={user?.email}>
                  {displayName}
                </span>
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
