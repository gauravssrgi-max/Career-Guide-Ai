'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../copilot.module.css';

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [isAuthenticated]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/copilot/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.data.marketAnalytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading market analytics...</div></div>;
  }

  if (!analytics) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>No Market Analytics Found</h2>
          <p>Generate your complete career system first</p>
          <button onClick={() => router.push('/copilot')} className={styles.btnPrimary}>
            Go to Career Copilot
          </button>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getStatusColor = (status) => {
    if (status === 'growing') return '#10b981';
    if (status === 'declining') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>📊 Market Analytics</h1>
        <p className={styles.subtitle}>
          Real-time insights on skills demand, salary trends, and your competitive position
        </p>
      </div>

      {/* Skill Gap Analysis */}
      <section className={styles.gapAnalysisCard}>
        <h2>🎯 Your Skill Gap Analysis</h2>
        <div className={styles.matchScore}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>{analytics.skillGapAnalysis?.matchPercentage || 0}%</span>
            <span className={styles.scoreLabel}>Market Match</span>
          </div>
        </div>

        <div className={styles.skillsComparison}>
          <div className={styles.strongSkills}>
            <h3>✅ Your Strong Skills</h3>
            <div className={styles.tags}>
              {analytics.skillGapAnalysis?.strongSkills?.map((skill, i) => (
                <span key={i} className={styles.tagGreen}>{skill}</span>
              ))}
            </div>
          </div>

          <div className={styles.gapSkills}>
            <h3>🎓 Skills to Acquire</h3>
            {analytics.skillGapAnalysis?.gapSkills?.map((gap, i) => (
              <div key={i} className={styles.gapSkillCard}>
                <div className={styles.gapHeader}>
                  <h4>{gap.skill}</h4>
                  <span className={`${styles.importance} ${styles[gap.importance]}`}>
                    {gap.importance}
                  </span>
                </div>
                <p><strong>Learning Time:</strong> {gap.learningTime}</p>
                <p><strong>Resources:</strong> {gap.resources}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.priorityActions}>
          <h3>🚀 Priority Actions</h3>
          <ol>
            {analytics.skillGapAnalysis?.priorityActions?.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* In-Demand Skills */}
      <section className={styles.section}>
        <h2>🔥 Top In-Demand Skills</h2>
        <div className={styles.skillsTable}>
          {analytics.inDemandSkills?.map((skill, index) => (
            <div key={index} className={styles.skillRow}>
              <div className={styles.skillRank}>#{index + 1}</div>
              <div className={styles.skillInfo}>
                <h3>{skill.skill}</h3>
                <p>Salary Impact: {skill.avgSalaryImpact}</p>
              </div>
              <div className={styles.skillMetrics}>
                <div className={styles.demandScore}>
                  <span>Demand Score</span>
                  <strong>{skill.demandScore}/100</strong>
                </div>
                <div className={styles.trend}>
                  {getTrendIcon(skill.trend)} {skill.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Trends */}
      <section className={styles.section}>
        <h2>📈 Industry Trends</h2>
        <div className={styles.trendsGrid}>
          {analytics.industryTrends?.map((trend, index) => (
            <div 
              key={index} 
              className={styles.trendCard}
              style={{ borderLeft: `4px solid ${getStatusColor(trend.status)}` }}
            >
              <h3>{trend.role}</h3>
              <div className={styles.trendStatus} style={{ color: getStatusColor(trend.status) }}>
                {trend.status.toUpperCase()}
              </div>
              <p><strong>Growth Rate:</strong> {trend.growthRate}</p>
              <p>{trend.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Salary Benchmarks */}
      <section className={styles.section}>
        <h2>💰 Salary Benchmarks</h2>
        <div className={styles.salaryTable}>
          {analytics.salaryBenchmarks?.map((benchmark, index) => (
            <div key={index} className={styles.salaryRow}>
              <div className={styles.experienceLevel}>
                {benchmark.experienceLevel}
              </div>
              <div className={styles.salaryRange}>
                <div className={styles.salaryBar}>
                  <div className={styles.salaryMin}>
                    ₹{(benchmark.minSalary / 100000).toFixed(1)}L
                  </div>
                  <div className={styles.salaryMedian}>
                    Median: ₹{(benchmark.median / 100000).toFixed(1)}L
                  </div>
                  <div className={styles.salaryMax}>
                    ₹{(benchmark.maxSalary / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hiring Insights */}
      <section className={styles.section}>
        <h2>🏢 Hiring Insights</h2>
        <div className={styles.hiringCard}>
          <div className={styles.hiringMetric}>
            <h3>Top Hiring Companies</h3>
            <div className={styles.tags}>
              {analytics.hiringInsights?.topCompanies?.map((company, i) => (
                <span key={i} className={styles.tagBlue}>{company}</span>
              ))}
            </div>
          </div>
          <div className={styles.hiringMetric}>
            <h3>Hiring Trends</h3>
            <p>{analytics.hiringInsights?.hiringTrends}</p>
          </div>
          <div className={styles.hiringMetric}>
            <h3>Competition Level</h3>
            <p className={styles.competitionBadge}>{analytics.hiringInsights?.competitionLevel}</p>
          </div>
        </div>
      </section>

      <div className={styles.updateInfo}>
        <p>Last Updated: {new Date(analytics.lastUpdated).toLocaleString()}</p>
        <button onClick={fetchAnalytics} className={styles.btnSecondary}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
