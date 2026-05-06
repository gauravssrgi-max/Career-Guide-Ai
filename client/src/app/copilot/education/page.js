'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../copilot.module.css';

export default function EducationPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchEducation();
  }, [isAuthenticated]);

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setEducation(data.data.educationRecommendations);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading education recommendations...</div></div>;
  }

  if (!education) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>No Education Recommendations Found</h2>
          <p>Generate your complete career system first</p>
          <button onClick={() => router.push('/copilot')} className={styles.btnPrimary}>
            Go to Career Copilot
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    if (category === 'dream') return '#8b5cf6';
    if (category === 'target') return '#3b82f6';
    return '#10b981';
  };

  const filteredColleges = selectedCategory === 'all' 
    ? education.colleges 
    : education.colleges?.filter(c => c.category === selectedCategory);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🎓 Education Recommendations</h1>
        <p className={styles.subtitle}>
          Personalized college recommendations and alternative learning paths for your career goals
        </p>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <button 
          className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Colleges
        </button>
        <button 
          className={`${styles.filterBtn} ${selectedCategory === 'dream' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('dream')}
        >
          🌟 Dream
        </button>
        <button 
          className={`${styles.filterBtn} ${selectedCategory === 'target' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('target')}
        >
          🎯 Target
        </button>
        <button 
          className={`${styles.filterBtn} ${selectedCategory === 'safe' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('safe')}
        >
          ✅ Safe
        </button>
      </div>

      {/* Colleges */}
      <section className={styles.section}>
        <h2>🏛️ College Recommendations</h2>
        <div className={styles.collegesGrid}>
          {filteredColleges?.map((college, index) => (
            <div 
              key={index} 
              className={styles.collegeCard}
              style={{ borderTop: `4px solid ${getCategoryColor(college.category)}` }}
            >
              <div className={styles.collegeHeader}>
                <h3>{college.name}</h3>
                <span 
                  className={styles.categoryBadge}
                  style={{ background: getCategoryColor(college.category) }}
                >
                  {college.category}
                </span>
              </div>

              <div className={styles.collegeSection}>
                <h4>Why This College Fits You</h4>
                <p>{college.whyFits}</p>
              </div>

              <div className={styles.collegeSection}>
                <h4>📝 Required Exams</h4>
                <div className={styles.tags}>
                  {college.requiredExams?.map((exam, i) => (
                    <span key={i} className={styles.tag}>{exam}</span>
                  ))}
                </div>
                <p><strong>Expected Cutoff:</strong> {college.expectedCutoff}</p>
              </div>

              <div className={styles.collegeSection}>
                <h4>💰 Fees & ROI</h4>
                <p><strong>Fees:</strong> ₹{(college.fees?.amount / 100000).toFixed(2)}L {college.fees?.duration}</p>
                <p><strong>Average Salary:</strong> {college.roi?.averageSalary}</p>
                <p><strong>Placement Rate:</strong> {college.roi?.placementRate}</p>
                <div className={styles.recruiters}>
                  <strong>Top Recruiters:</strong>
                  <div className={styles.tags}>
                    {college.roi?.topRecruiters?.map((recruiter, i) => (
                      <span key={i} className={styles.tagBlue}>{recruiter}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.collegeSection}>
                <h4>📋 Application Strategy</h4>
                <p>{college.applicationStrategy}</p>
              </div>

              {college.deadline && (
                <div className={styles.deadline}>
                  <strong>Application Deadline:</strong> {new Date(college.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Alternative Paths */}
      <section className={styles.section}>
        <h2>🚀 Alternative Learning Paths</h2>
        <p>Consider these alternatives if traditional college isn't the right fit</p>
        <div className={styles.alternativesGrid}>
          {education.alternativePaths?.map((path, index) => (
            <div key={index} className={styles.alternativeCard}>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className={styles.alternativeMeta}>
                <span><strong>Cost:</strong> {path.cost}</span>
                <span><strong>Duration:</strong> {path.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Guide */}
      <section className={styles.section}>
        <div className={styles.comparisonGuide}>
          <h2>📊 Understanding Categories</h2>
          <div className={styles.categoryExplanations}>
            <div className={styles.categoryExplanation}>
              <div className={styles.categoryIcon} style={{ background: '#8b5cf6' }}>🌟</div>
              <div>
                <h3>Dream Colleges</h3>
                <p>Top-tier institutions with competitive admissions. Aim high but have backup plans.</p>
              </div>
            </div>
            <div className={styles.categoryExplanation}>
              <div className={styles.categoryIcon} style={{ background: '#3b82f6' }}>🎯</div>
              <div>
                <h3>Target Colleges</h3>
                <p>Realistic options based on your profile. Good balance of quality and admission chances.</p>
              </div>
            </div>
            <div className={styles.categoryExplanation}>
              <div className={styles.categoryIcon} style={{ background: '#10b981' }}>✅</div>
              <div>
                <h3>Safe Colleges</h3>
                <p>High probability of admission. Ensure you have solid backup options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
