'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

const DUMMY_CAREERS = [
  { _id: 'dummy-1', title: 'Machine Learning Engineer', category: 'technology', difficulty: 5, icon: '🤖', shortDescription: 'Build AI models and algorithms that allow systems to learn and improve from data.', salaryRange: { india: { entry: '₹10-15 LPA' } } },
  { _id: 'dummy-2', title: 'Cardiothoracic Surgeon', category: 'medical', difficulty: 5, icon: '🫀', shortDescription: 'Specialized surgeons who operate on the heart, lungs, and other thoracic organs.', salaryRange: { india: { entry: '₹20-35 LPA' } } },
  { _id: 'dummy-3', title: 'Investment Banker', category: 'business', difficulty: 4, icon: '📈', shortDescription: 'Help corporations and governments raise capital and provide strategic financial advice.', salaryRange: { india: { entry: '₹12-20 LPA' } } },
  { _id: 'dummy-4', title: 'Product Designer (UI/UX)', category: 'creative', difficulty: 3, icon: '🎨', shortDescription: 'Design beautiful, intuitive user interfaces and experiences for digital products.', salaryRange: { india: { entry: '₹7-12 LPA' } } },
  { _id: 'dummy-5', title: 'Aerospace Engineer', category: 'engineering', difficulty: 5, icon: '🚀', shortDescription: 'Design, build, and test aircraft, spacecraft, satellites, and missiles.', salaryRange: { india: { entry: '₹8-14 LPA' } } },
  { _id: 'dummy-6', title: 'Corporate Lawyer', category: 'law', difficulty: 4, icon: '⚖️', shortDescription: 'Advise businesses and corporations on legal rights, mergers, and obligations.', salaryRange: { india: { entry: '₹9-16 LPA' } } },
];

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getCareers().then(r => { 
      if (r.data && r.data.length > 0) {
        setCareers(r.data);
      } else {
        setCareers(DUMMY_CAREERS);
      }
      setLoading(false); 
    }).catch(() => {
      setCareers(DUMMY_CAREERS);
      setLoading(false);
    });
  }, []);

  const filtered = careers.filter(c => {
    const matchesCat = filter ? c.category === filter : true;
    const matchesSearch = search ? (c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())) : true;
    return matchesCat && matchesSearch;
  });

  const categories = [...new Set(careers.map(c => c.category))];

  return (
    <div style={{minHeight:'calc(100vh - 64px)', padding:'60px 16px', background: 'var(--bg-primary)'}} className="page-enter">
      <div className="container" style={{maxWidth:1100}}>
        {/* Hero Section */}
        <div style={{textAlign:'center', marginBottom:50}}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--accent-gradient-subtle)', color: 'var(--accent-light)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 16 }}>
            ✨ Explore Your Future
          </div>
          <h1 className="heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: 16 }}>
            Discover <span className="text-gradient">Careers</span>
          </h1>
          <p style={{color:'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto'}}>
            Browse through hundreds of career paths. Find out what they do, how much they pay, and the exact roadmap to get there.
          </p>
        </div>

        {/* Controls: Search & Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40, background: 'var(--bg-secondary)', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <input 
            type="text" 
            placeholder="🔍 Search for a career (e.g. Data Scientist, Doctor...)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
          />
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('')}>All Categories</button>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(c)} style={{ textTransform: 'capitalize' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24}}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{height:280, borderRadius:'var(--radius-xl)'}} />)}
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3 style={{ marginTop: 16, fontSize: '1.2rem' }}>No careers found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24}}>
                {filtered.map((c, i) => (
                  <div key={c._id || i} className="card" style={{ padding:28, display: 'flex', flexDirection: 'column', animation:`fadeInUp 0.4s ease-out ${i*0.05}s both`, position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '16px', background: 'var(--bg-tertiary)', fontSize: '1.8rem', border: '1px solid var(--border)' }}>
                        {c.icon || '💼'}
                      </div>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{c.category}</span>
                    </div>
                    
                    <h3 className="heading-sm" style={{ marginBottom: 8, fontSize: '1.25rem' }}>{c.title}</h3>
                    <p className="text-sm" style={{color:'var(--text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: 20 }}>
                      {c.shortDescription || c.description?.slice(0,120)}...
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                      <div>
                        <div className="text-xs" style={{color:'var(--text-tertiary)', marginBottom: 4}}>Avg. Entry Salary</div>
                        <div style={{fontWeight:700, color: 'var(--accent-light)'}}>{c.salaryRange?.india?.entry || 'Varies'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-xs" style={{color:'var(--text-tertiary)', marginBottom: 4}}>Difficulty</div>
                        <div className="difficulty-meter" style={{ justifyContent: 'flex-end' }}>
                          {[1,2,3,4,5].map(d => <div key={d} className={`difficulty-dot ${d <= c.difficulty ? 'active' : ''}`} />)}
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/careers/${c._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      View Roadmap →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
