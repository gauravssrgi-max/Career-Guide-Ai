'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const features = [
  { icon: '🧠', title: 'AI-Powered Analysis', desc: 'Advanced AI analyzes your interests, skills & personality to find your ideal career' },
  { icon: '🗺️', title: 'Career Roadmaps', desc: 'Step-by-step guides from where you are to where you want to be' },
  { icon: '💰', title: 'Cost Calculator', desc: 'Know exactly what it costs — with budget-friendly alternatives' },
  { icon: '💬', title: 'AI Mentor Chat', desc: 'Get real-time career advice from your personal AI counselor' },
  { icon: '📊', title: 'Career Comparison', desc: 'Compare careers side-by-side on salary, difficulty & growth' },
  { icon: '🏆', title: 'Gamified Progress', desc: 'Earn badges and track your career exploration journey' },
];

const steps = [
  { num: '01', title: 'Take the Survey', desc: 'Answer questions about your interests, skills, and preferences' },
  { num: '02', title: 'Get AI Recommendations', desc: 'Our AI analyzes your profile and suggests the best careers' },
  { num: '03', title: 'Explore Roadmaps', desc: 'See detailed plans with timelines, costs, and requirements' },
  { num: '04', title: 'Chat with AI Mentor', desc: 'Get personalized advice and clear your doubts instantly' },
];

const stats = [
  { value: '50+', label: 'Career Paths' },
  { value: '10K+', label: 'Students Guided' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'AI Availability' },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const onboardingSlides = [
    { emoji: '✨', title: 'Discover Your Perfect Career', desc: 'Stop guessing — let AI find what truly fits you' },
    { emoji: '🤖', title: 'AI-Powered Personalized Guidance', desc: 'Tailored recommendations based on who you really are' },
    { emoji: '🚀', title: 'Plan Your Future with Confidence', desc: 'From roadmaps to cost breakdowns — everything you need' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(p => (p + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              AI-Powered Career Guidance
            </div>
            <h1 className="heading-xl">
              Find Your <span className="text-gradient">Dream Career</span> with AI
            </h1>
            <p className={styles.heroDesc}>
              Not sure what career to choose? Our AI mentor analyzes your interests, personality, 
              and goals to recommend the perfect path — with detailed roadmaps, costs, and more.
            </p>
            <div className={styles.heroCTA}>
              <Link href="/survey" className="btn btn-primary btn-lg">
                Start Career Journey →
              </Link>
              <Link href="/chat" className="btn btn-secondary btn-lg">
                Talk to AI Mentor
              </Link>
            </div>
            <div className={styles.heroStats}>
              {stats.map((s, i) => (
                <div key={i} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroVisual}>
              <div className={styles.orb1} />
              <div className={styles.orb2} />
              <div className={styles.orb3} />
              <div className={styles.heroCard}>
                <div className={styles.heroCardIcon}>🎯</div>
                <h3>Your AI Career Mentor</h3>
                <p>Analyzing 100+ career paths to find your perfect match</p>
                <div className={styles.heroCardDots}>
                  {[1,2,3].map(i => <span key={i} className={styles.heroDot} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Carousel */}
      <section className={`section-sm ${styles.onboarding}`}>
        <div className="container">
          <div className={styles.carousel}>
            {onboardingSlides.map((slide, i) => (
              <div key={i} className={`${styles.slide} ${i === activeSlide ? styles.slideActive : ''}`}>
                <span className={styles.slideEmoji}>{slide.emoji}</span>
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.carouselDots}>
            {onboardingSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                className={`${styles.carouselDot} ${i === activeSlide ? styles.carouselDotActive : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-primary">Features</span>
            <h2 className="heading-lg">Everything You Need to <span className="text-gradient">Decide with Confidence</span></h2>
          </div>
          <div className="grid grid-3 stagger">
            {features.map((f, i) => (
              <div key={i} className={`card ${styles.featureCard} animate-fade-in`} style={{animationDelay: `${i * 0.1}s`}}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className="heading-sm">{f.title}</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`section ${styles.howItWorks}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-success">How it Works</span>
            <h2 className="heading-lg">Your Journey in <span className="text-gradient">4 Simple Steps</span></h2>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className="heading-sm">{s.title}</h3>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaGlow} />
            <h2 className="heading-lg">Ready to Find Your <span className="text-gradient">Perfect Career?</span></h2>
            <p style={{color: 'var(--text-secondary)', maxWidth: 500, margin: '16px auto'}}>
              Join thousands of students who found their path with Career Guide AI.
              It takes only 5 minutes to get started.
            </p>
            <Link href="/survey" className="btn btn-primary btn-lg" style={{marginTop: 16}}>
              Start Free Career Test →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.logoIcon}>🎯</span>
              <span style={{fontWeight: 700}}>CareerGuide AI</span>
            </div>
            <p className="text-sm" style={{color: 'var(--text-tertiary)'}}>
              © 2024 Career Guide AI. Built with ❤️ and artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
