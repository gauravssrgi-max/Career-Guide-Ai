'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) api.getCareer(id).then(r => { setCareer(r.data.career); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{minHeight:'calc(100vh-64px)',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner" style={{width:40,height:40}} /></div>;
  if (!career) return <div style={{textAlign:'center',padding:80}}><h2>Career not found</h2><Link href="/careers" className="btn btn-primary" style={{marginTop:16}}>Browse Careers</Link></div>;

  return (
    <div style={{minHeight:'calc(100vh - 64px)',padding:'48px 16px'}} className="page-enter">
      <div className="container" style={{maxWidth:800}}>
        <Link href="/careers" className="btn btn-ghost btn-sm" style={{marginBottom:24}}>← Back to Careers</Link>

        <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:32}}>
          <span style={{fontSize:'2.5rem'}}>{career.icon || '💼'}</span>
          <div>
            <h1 className="heading-lg">{career.title}</h1>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <span className="badge badge-primary">{career.category}</span>
              <span className={`badge ${career.demandPrediction === 'booming' ? 'badge-success' : 'badge-warning'}`}>{career.demandPrediction} demand</span>
            </div>
          </div>
        </div>

        <p style={{color:'var(--text-secondary)',lineHeight:1.7,marginBottom:32}}>{career.description}</p>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}}>
          <div className="card" style={{textAlign:'center',padding:20}}>
            <div className="text-xs" style={{color:'var(--text-tertiary)'}}>Entry Salary (India)</div>
            <div style={{fontSize:'1.1rem',fontWeight:700,marginTop:4}}>{career.salaryRange?.india?.entry}</div>
          </div>
          <div className="card" style={{textAlign:'center',padding:20}}>
            <div className="text-xs" style={{color:'var(--text-tertiary)'}}>Growth Rate</div>
            <div style={{fontSize:'1.1rem',fontWeight:700,marginTop:4,color:'var(--success)'}}>{career.growthRate}</div>
          </div>
          <div className="card" style={{textAlign:'center',padding:20}}>
            <div className="text-xs" style={{color:'var(--text-tertiary)'}}>Risk Score</div>
            <div style={{fontSize:'1.1rem',fontWeight:700,marginTop:4,color: career.riskScore > 40 ? 'var(--warning)' : 'var(--success)'}}>{career.riskScore}/100</div>
          </div>
        </div>

        {/* Roadmap */}
        {career.roadmap?.length > 0 && (
          <div className="card" style={{padding:28,marginBottom:24}}>
            <h2 className="heading-sm" style={{marginBottom:20}}>🗺️ Career Roadmap</h2>
            <div style={{position:'relative',paddingLeft:24}}>
              <div style={{position:'absolute',left:7,top:0,bottom:0,width:2,background:'var(--border)'}} />
              {career.roadmap.map((step, i) => (
                <div key={i} style={{position:'relative',paddingBottom:24,paddingLeft:24}}>
                  <div style={{position:'absolute',left:-6,top:4,width:16,height:16,borderRadius:'50%',background:'var(--accent-gradient)',border:'3px solid var(--bg-secondary)'}} />
                  <div style={{fontWeight:600}}>Step {step.step}: {step.title}</div>
                  <p className="text-sm" style={{color:'var(--text-secondary)',marginTop:4}}>{step.description}</p>
                  {step.duration && <span className="badge badge-primary" style={{marginTop:6}}>{step.duration}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {career.skillsRequired?.length > 0 && (
          <div className="card" style={{padding:28,marginBottom:24}}>
            <h2 className="heading-sm" style={{marginBottom:16}}>🛠️ Required Skills</h2>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {career.skillsRequired.map((s, i) => (
                <div key={i} className="badge badge-primary" style={{padding:'6px 14px'}}>
                  {s.name} <span style={{opacity:0.7}}>• {s.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost */}
        {career.costEstimate && (
          <div className="card" style={{padding:28,marginBottom:24}}>
            <h2 className="heading-sm" style={{marginBottom:16}}>💰 Cost Breakdown</h2>
            <div style={{display:'grid',gap:12}}>
              {Object.entries(career.costEstimate).filter(([k]) => k !== 'budgetAlternative').map(([k, v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{textTransform:'capitalize',color:'var(--text-secondary)'}}>{k}</span>
                  <span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            {career.costEstimate.budgetAlternative && (
              <div style={{marginTop:16,padding:12,background:'var(--accent-gradient-subtle)',borderRadius:'var(--radius-md)'}}>
                <span className="text-sm" style={{fontWeight:600}}>💡 Budget Alternative: </span>
                <span className="text-sm">{career.costEstimate.budgetAlternative}</span>
              </div>
            )}
          </div>
        )}

        <div style={{display:'flex',gap:12,marginTop:32}}>
          <Link href="/chat" className="btn btn-primary">💬 Ask AI about this career</Link>
          <Link href="/careers" className="btn btn-secondary">Browse more careers</Link>
        </div>
      </div>
    </div>
  );
}
