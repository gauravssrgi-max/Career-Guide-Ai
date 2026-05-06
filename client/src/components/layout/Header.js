'use client';
import { useState, useEffect } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const displayName = user?.name || user?.email?.split('@')[0] || 'Account';

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Survey', href: '/survey' },
    { name: 'Careers', href: '/careers' },
    { name: 'AI Mentor', href: '/chat' },
    { name: 'Copilot', href: '/copilot', auth: true },
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

          {/* Desktop Nav */}
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
            
            <div className={styles.desktopActions}>
              {authLoading ? (
                <span className={styles.authLoading}>...</span>
              ) : isAuthenticated ? (
                <div className={styles.userMenu}>
                  <span className={styles.userName}>{displayName}</span>
                  <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-sm">Get Started</button>
              )}
            </div>

            <button 
              className={styles.menuToggle} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                <span></span><span></span><span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
          <div className={styles.mobileNavInner}>
            <button className={styles.mobileCloseBtn} onClick={() => setIsMenuOpen(false)}>
              ✕ Close
            </button>
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className={styles.mobileActions}>
              {isAuthenticated ? (
                <>
                  <div className={styles.mobileUserInfo}>
                    <div className={styles.mobileAvatar}>👤</div>
                    <span>{displayName}</span>
                  </div>
                  <button onClick={logout} className="btn btn-secondary btn-lg" style={{ width: '100%' }}>Logout</button>
                </>
              ) : (
                <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Get Started</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
