'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

const DUMMY_CAREERS = [
  { _id: 'dummy-1', title: 'Machine Learning Engineer', category: 'technology', difficulty: 5, icon: '🤖', demandPrediction: 'booming', description: 'Build AI models and algorithms that allow systems to learn and improve from data. You will work with large datasets and neural networks.', salaryRange: { india: { entry: '₹10-15 LPA' } }, growthRate: '35% / year', riskScore: 15, roadmap: [{step: 1, title: 'Learn Python & Math', description: 'Master linear algebra, calculus, and Python programming.', duration: '6 months'}, {step: 2, title: 'Machine Learning Basics', description: 'Learn Scikit-Learn, Pandas, and basic algorithms.', duration: '3 months'}, {step: 3, title: 'Deep Learning', description: 'Master PyTorch or TensorFlow for neural networks.', duration: '6 months'}], skillsRequired: [{name: 'Python', level: 'Expert'}, {name: 'PyTorch', level: 'Advanced'}, {name: 'Mathematics', level: 'Advanced'}], costEstimate: { education: '₹5-15 Lakhs (B.Tech)', coaching: '₹50,000 (Certifications)', total: '₹5.5 - 15.5 Lakhs', budgetAlternative: 'Learn for free via Coursera, Fast.ai, and YouTube.' } },
  { _id: 'dummy-2', title: 'Cardiothoracic Surgeon', category: 'medical', difficulty: 5, icon: '🫀', demandPrediction: 'stable', description: 'Specialized surgeons who operate on the heart, lungs, and other thoracic organs. This is one of the most demanding and highly respected medical professions.', salaryRange: { india: { entry: '₹20-35 LPA' } }, growthRate: '12% / year', riskScore: 10, roadmap: [{step: 1, title: 'MBBS Degree', description: 'Complete your foundational medical degree (5.5 years).', duration: '5.5 years'}, {step: 2, title: 'MS in General Surgery', description: 'Master general surgical procedures.', duration: '3 years'}, {step: 3, title: 'MCh in Cardiothoracic Surgery', description: 'Super-specialization in heart surgeries.', duration: '3 years'}], skillsRequired: [{name: 'Surgery', level: 'Expert'}, {name: 'Anatomy', level: 'Expert'}, {name: 'Under-pressure decision making', level: 'Expert'}], costEstimate: { education: '₹10-80 Lakhs (MBBS + MS + MCh)', coaching: '₹1-3 Lakhs (NEET PG/SS)', total: '₹11 - 83 Lakhs', budgetAlternative: 'Government medical colleges (AIIMS) offer heavily subsidized education if you crack NEET with top ranks.' } },
  { _id: 'dummy-3', title: 'Investment Banker', category: 'business', difficulty: 4, icon: '📈', demandPrediction: 'booming', description: 'Help corporations and governments raise capital and provide strategic financial advice for mergers and acquisitions.', salaryRange: { india: { entry: '₹12-20 LPA' } }, growthRate: '15% / year', riskScore: 45, roadmap: [{step: 1, title: 'Bachelor in Finance/Economics', description: 'Get a strong foundation in finance and accounting.', duration: '3-4 years'}, {step: 2, title: 'MBA from Tier-1 Institute', description: 'IIMs, ISB, or top global schools are preferred.', duration: '2 years'}, {step: 3, title: 'Internships', description: 'Intern at top banks (Goldman Sachs, JP Morgan).', duration: '6 months'}], skillsRequired: [{name: 'Financial Modeling', level: 'Expert'}, {name: 'Excel', level: 'Expert'}, {name: 'Negotiation', level: 'Advanced'}], costEstimate: { education: '₹20-30 Lakhs (MBA)', coaching: '₹50,000 (CAT coaching)', total: '₹20.5 - 30.5 Lakhs', budgetAlternative: 'Clear CFA exams and start as an analyst directly after undergrad.' } },
  { _id: 'dummy-4', title: 'Product Designer (UI/UX)', category: 'creative', difficulty: 3, icon: '🎨', demandPrediction: 'booming', description: 'Design beautiful, intuitive user interfaces and experiences for digital products. Bridge the gap between human psychology and software.', salaryRange: { india: { entry: '₹7-12 LPA' } }, growthRate: '25% / year', riskScore: 20, roadmap: [{step: 1, title: 'Learn Design Tools', description: 'Master Figma and Adobe CC.', duration: '2 months'}, {step: 2, title: 'Study UX Principles', description: 'Learn wireframing, user research, and psychology.', duration: '3 months'}, {step: 3, title: 'Build a Portfolio', description: 'Redesign existing apps or create case studies.', duration: '3 months'}], skillsRequired: [{name: 'Figma', level: 'Expert'}, {name: 'User Research', level: 'Advanced'}, {name: 'Visual Design', level: 'Advanced'}], costEstimate: { education: '₹5-10 Lakhs (B.Des)', coaching: '₹20,000 (Bootcamps)', total: '₹5.2 - 10.2 Lakhs', budgetAlternative: 'Self-taught via YouTube and building a stunning Behance portfolio.' } },
  { _id: 'dummy-5', title: 'Aerospace Engineer', category: 'engineering', difficulty: 5, icon: '🚀', demandPrediction: 'booming', description: 'Design, build, and test aircraft, spacecraft, satellites, and missiles. Work at the cutting edge of human exploration.', salaryRange: { india: { entry: '₹8-14 LPA' } }, growthRate: '18% / year', riskScore: 30, roadmap: [{step: 1, title: 'B.Tech in Aerospace/Mechanical', description: 'Learn aerodynamics, propulsion, and materials.', duration: '4 years'}, {step: 2, title: 'Master CAD Software', description: 'Learn SolidWorks, CATIA, and ANSYS.', duration: '6 months'}, {step: 3, title: 'M.Tech / Research', description: 'Specialize in a specific domain like propulsion.', duration: '2 years'}], skillsRequired: [{name: 'Aerodynamics', level: 'Advanced'}, {name: 'CAD/CAM', level: 'Expert'}, {name: 'Physics', level: 'Expert'}], costEstimate: { education: '₹8-15 Lakhs (B.Tech)', coaching: '₹1 Lakh (GATE coaching)', total: '₹9 - 16 Lakhs', budgetAlternative: 'ISRO absorbs top students directly from IIST at minimal cost.' } },
  { _id: 'dummy-6', title: 'Corporate Lawyer', category: 'law', difficulty: 4, icon: '⚖️', demandPrediction: 'stable', description: 'Advise businesses and corporations on legal rights, mergers, intellectual property, and corporate obligations.', salaryRange: { india: { entry: '₹9-16 LPA' } }, growthRate: '10% / year', riskScore: 15, roadmap: [{step: 1, title: 'Clear CLAT', description: 'Prepare for law entrance exams.', duration: '1 year'}, {step: 2, title: 'BA LLB Degree', description: 'Complete a 5-year integrated law degree from an NLU.', duration: '5 years'}, {step: 3, title: 'Corporate Internships', description: 'Intern at top tier law firms (CAM, SAM, Khaitan).', duration: '1 year'}], skillsRequired: [{name: 'Corporate Law', level: 'Expert'}, {name: 'Drafting', level: 'Expert'}, {name: 'Negotiation', level: 'Advanced'}], costEstimate: { education: '₹10-15 Lakhs (NLU)', coaching: '₹1 Lakh (CLAT coaching)', total: '₹11 - 16 Lakhs', budgetAlternative: 'State universities offer law degrees at significantly lower fees.' } }
];

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      if (id.startsWith('dummy-')) {
        const dummy = DUMMY_CAREERS.find(c => c._id === id);
        setCareer(dummy || null);
        setLoading(false);
      } else {
        api.getCareer(id).then(r => { 
          setCareer(r.data.career); 
          setLoading(false); 
        }).catch(() => setLoading(false));
      }
    }
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
