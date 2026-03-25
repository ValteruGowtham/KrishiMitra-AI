import { useState } from 'react';
import { Search } from 'lucide-react';

const SCHEMES = [
  { icon: '💰', cat: 'Income', name: 'PM-KISAN', benefit: '₹6,000/year', desc: 'Direct income support to all landholding farmers.', status: 'Open' },
  { icon: '🛡', cat: 'Insurance', name: 'PM Fasal Bima', benefit: '2% Premium', desc: 'Crop insurance against natural calamities.', status: 'Open' },
  { icon: '💳', cat: 'Credit', name: 'Kisan Credit Card', benefit: 'Loans @ 4%', desc: 'Short-term crop credit up to ₹3 lakh.', status: 'Year-round' },
  { icon: '🌱', cat: 'Soil', name: 'Soil Health Card', benefit: 'Free Testing', desc: 'Soil nutrient test + crop-wise recommendations.', status: 'Year-round' },
  { icon: '☀', cat: 'Equipment', name: 'PM KUSUM', benefit: '60% Subsidy', desc: 'Solar pump installation for rural farming.', status: 'Closed' },
  { icon: '🌿', cat: 'Organic', name: 'PKVY', benefit: '₹50,000/ha', desc: 'Organic farming cluster programme.', status: 'Open' },
];

const CATEGORIES = ['All', 'Income', 'Insurance', 'Credit', 'Organic', 'Equipment', 'Soil'];

export default function SchemesPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  
  const filtered = SCHEMES.filter(s => {
    const matchCat = cat === 'All' || s.cat === cat;
    const matchSr = s.name.toLowerCase().includes(search.toLowerCase()) || 
                    s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSr;
  });

  return (
    <div className="page-wrap">
      <div className="market-header-bg">
        <div className="mh-title">Govt. Schemes for Farmers 🏛</div>
        <div className="mh-sub">500+ active schemes — find what you're eligible for</div>
      </div>
      
      <div className="schemes-layout">
        <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto 16px' }}>
          <div className="search-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search schemes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>
        </div>
        
        <div className="lang-chips" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`lang-chip ${cat === c ? 'sel' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        
        <div className="sch-grid">
          {filtered.map((s, i) => (
            <div key={i} className="sch-card">
              <div className="sch-icon-wrap">
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
              </div>
              <div className="sch-cat">{s.cat}</div>
              <div className="sch-name">{s.name}</div>
              <div className="sch-benefit">{s.benefit}</div>
              <div className="sch-desc">{s.desc}</div>
              <div className="sch-footer">
                <span className={`tag ${s.status === 'Open' ? 'tag-green' : s.status === 'Year-round' ? 'tag-blue' : ''}`}>
                  {s.status}
                </span>
                <button 
                  className={`sch-apply ${s.status === 'Closed' ? 'closed' : ''}`}
                  disabled={s.status === 'Closed'}
                >
                  {s.status === 'Closed' ? 'Closed' : 'Apply →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
