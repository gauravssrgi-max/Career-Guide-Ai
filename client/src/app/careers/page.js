'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getCareers().then(r => { setCareers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter ? careers.filter(c => c.category === filter) : careers;
  const categories = [...new Set(careers.map(c => c.category))];

  return (
    <div style={{minHeight:'calc(100vh - 64px)',padding:'48px 16px'}} className="page-enter">
      <div className="container" style={{maxWidth:1000}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <h1 className="heading-lg">Explore <span className="text-gradient">Careers</span></h1>
          <p style={{color:'var(--text-secondary)',marginTop:8}}>Browse all career paths with details</p>
        </div>

        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginBottom:32}}>
          <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('')}>All</button>
          {categories.map(c => (
            <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{display:'grid',gap:16}}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{height:120,borderRadius:'var(--radius-lg)'}} />)}</div>
        ) : (
          <div style={{display:'grid',gap:16}}>
            {filtered.map((c, i) => (
              <div key={c._id || i} className="card" style={{padding:24,animation:`fadeInUp 0.4s ease-out ${i*0.05}s both`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <span style={{fontSize:'1.5rem'}}>{c.icon || '💼'}</span>
                    <div>
                      <h3 className="heading-sm">{c.title}</h3>
                      <span className="badge badge-primary" style={{marginTop:4}}>{c.category}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:16,alignItems:'center'}}>
                    <div style={{textAlign:'right'}}>
                      <div className="text-xs" style={{color:'var(--text-tertiary)'}}>Entry Salary</div>
                      <div style={{fontWeight:600,fontSize:'0.9rem'}}>{c.salaryRange?.india?.entry || 'Varies'}</div>
                    </div>
                    <div className="difficulty-meter">
                      {[1,2,3,4,5].map(d => <div key={d} className={`difficulty-dot ${d <= c.difficulty ? 'active' : ''}`} />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm" style={{color:'var(--text-secondary)',marginTop:12}}>{c.shortDescription || c.description?.slice(0,150)}</p>
                <Link href={`/careers/${c._id}`} className="btn btn-ghost btn-sm" style={{marginTop:12}}>View Details →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
