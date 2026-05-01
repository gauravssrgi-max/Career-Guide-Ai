'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('surveyResults');
    if (stored) { setData(JSON.parse(stored)); setLoading(false); return; }
    if (isAuthenticated) {
      api.getSurveyResult().then(res => { setData(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [isAuthenticated]);

  if (loading) return <div style={S.center}><div className="spinner" style={{width:40,height:40}} /></div>;
  if (!data?.recommendations) return (
    <div style={S.center}>
      <div style={{textAlign:'center'}}>
        <span style={{fontSize:'3rem'}}>📋</span>
        <h2 style={{marginTop:16}}>No Results Yet</h2>
        <p style={{color:'var(--text-secondary)',marginTop:8}}>Take the career survey first!</p>
        <Link href="/survey" className="btn btn-primary" style={{marginTop:24}}>Take Survey →</Link>
      </div>
    </div>
  );

  const { recommendations } = data;
  const careers = recommendations.careers || [];

  return (
    <div style={S.page} className="page-enter">
      <div className="container" style={{maxWidth:900}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <span style={{fontSize:'2.5rem'}}>🎉</span>
          <h1 className="heading-lg" style={{marginTop:12}}>Your <span className="text-gradient">AI Career Matches</span></h1>
          {recommendations.analysis && <p style={{color:'var(--text-secondary)',marginTop:12,maxWidth:600,margin:'12px auto 0'}}>{recommendations.analysis}</p>}
        </div>

        {recommendations.confusionAdvice && (
          <div className="card" style={{background:'var(--accent-gradient-subtle)',marginBottom:32,padding:20}}>
            <p style={{fontWeight:500}}>💡 {recommendations.confusionAdvice}</p>
          </div>
        )}

        <div style={S.grid}>
          {careers.map((career, i) => (
            <div key={i} className="card" style={{...S.careerCard, animationDelay:`${i * 0.1}s`}}>
              <div style={S.cardTop}>
                <div style={S.rank}>#{i + 1}</div>
                <div>
                  <h3 className="heading-sm">{career.title}</h3>
                  <span className="badge badge-primary" style={{marginTop:4}}>{career.category}</span>
                </div>
              </div>
              <p className="text-sm" style={{color:'var(--text-secondary)',margin:'12px 0'}}>{career.overview || career.whyThisCareer}</p>
              <div style={S.stats}>
                <div style={S.statItem}>
                  <span className="text-xs" style={{color:'var(--text-tertiary)'}}>Salary (Entry)</span>
                  <span style={{fontWeight:600,fontSize:'0.9rem'}}>{career.salaryRange?.entry || 'Varies'}</span>
                </div>
                <div style={S.statItem}>
                  <span className="text-xs" style={{color:'var(--text-tertiary)'}}>Growth</span>
                  <span style={{fontWeight:600,fontSize:'0.9rem',color:'var(--success)'}}>{career.growthRate || 'Growing'}</span>
                </div>
                <div style={S.statItem}>
                  <span className="text-xs" style={{color:'var(--text-tertiary)'}}>Difficulty</span>
                  <div className="difficulty-meter">
                    {[1,2,3,4,5].map(d => <div key={d} className={`difficulty-dot ${d <= career.difficulty ? 'active' : ''} ${career.difficulty >= 4 ? 'high' : career.difficulty >= 3 ? 'medium' : ''}`} />)}
                  </div>
                </div>
                <div style={S.statItem}>
                  <span className="text-xs" style={{color:'var(--text-tertiary)'}}>Risk Score</span>
                  <span style={{fontWeight:600,fontSize:'0.9rem',color: career.riskScore > 40 ? 'var(--warning)' : 'var(--success)'}}>{career.riskScore}/100</span>
                </div>
              </div>
              {career.requiredSkills && (
                <div style={{marginTop:12,display:'flex',flexWrap:'wrap',gap:6}}>
                  {career.requiredSkills.slice(0,4).map((s,j) => <span key={j} className="badge badge-primary">{s}</span>)}
                </div>
              )}
              <div style={{display:'flex',gap:8,marginTop:16}}>
                <Link href="/chat" className="btn btn-ghost btn-sm">Ask AI about this →</Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:48}}>
          <Link href="/survey" className="btn btn-secondary" style={{marginRight:12}}>Retake Survey</Link>
          <Link href="/chat" className="btn btn-primary">Chat with AI Mentor →</Link>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: 'calc(100vh - 64px)', padding: '48px 16px' },
  center: { minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  grid: { display: 'grid', gap: 20 },
  careerCard: { animation: 'fadeInUp 0.5s ease-out both', padding: 28 },
  cardTop: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  rank: { width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' },
  statItem: { display: 'flex', flexDirection: 'column', gap: 4 },
};
