'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function ComparePage() {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [compared, setCompared] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareers().then(r => { setCareers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCompare = async () => {
    if (selected.length < 2) return;
    try {
      const res = await api.compareCareers(selected);
      setCompared(res.data);
    } catch (err) { alert('Error comparing careers'); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  return (
    <div style={{minHeight:'calc(100vh - 64px)',padding:'48px 16px'}} className="page-enter">
      <div className="container" style={{maxWidth:1000}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <h1 className="heading-lg">Compare <span className="text-gradient">Careers</span></h1>
          <p style={{color:'var(--text-secondary)',marginTop:8}}>Select 2-3 careers to compare side by side</p>
        </div>

        {compared.length === 0 ? (
          <>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:24}}>
              {careers.map(c => (
                <button key={c._id} onClick={() => toggleSelect(c._id)}
                  className={`btn btn-sm ${selected.includes(c._id) ? 'btn-primary' : 'btn-secondary'}`}>
                  {c.icon} {c.title}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleCompare} disabled={selected.length < 2}>
              Compare Selected ({selected.length})
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setCompared([])} style={{marginBottom:24}}>← Select Different</button>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0}}>
                <thead>
                  <tr>
                    <th style={TH}>Metric</th>
                    {compared.map(c => <th key={c._id} style={TH}>{c.icon} {c.title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Category', get: c => c.category },
                    { label: 'Entry Salary (India)', get: c => c.salaryRange?.india?.entry || '-' },
                    { label: 'Senior Salary', get: c => c.salaryRange?.india?.senior || '-' },
                    { label: 'Difficulty', get: c => '⭐'.repeat(c.difficulty) },
                    { label: 'Growth Rate', get: c => c.growthRate || '-' },
                    { label: 'Risk Score', get: c => `${c.riskScore}/100` },
                    { label: 'Demand', get: c => c.demandPrediction || '-' },
                    { label: 'Automation Risk', get: c => c.automationRisk || '-' },
                    { label: 'Total Cost', get: c => c.costEstimate?.total || '-' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{...TD,fontWeight:600,color:'var(--text-secondary)'}}>{row.label}</td>
                      {compared.map(c => <td key={c._id} style={TD}>{row.get(c)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const TH = { padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid var(--border)', fontSize: '0.85rem', fontWeight: 600 };
const TD = { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' };
