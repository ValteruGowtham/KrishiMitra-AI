import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, ShieldCheck, ExternalLink } from 'lucide-react';

const MARKET = [
  { crop: 'Wheat (Sharbati)', state: 'Rajasthan', mandi: 'Ajmer', price: 2380, msp: 2275, chg: 4.6 },
  { crop: 'Rice (Basmati)', state: 'Haryana', mandi: 'Karnal', price: 3400, msp: 3100, chg: 2.1 },
  { crop: 'Cotton', state: 'Gujarat', mandi: 'Rajkot', price: 7800, msp: 6620, chg: -1.2 },
  { crop: 'Soybean', state: 'M.P.', mandi: 'Indore', price: 4800, msp: 4600, chg: 3.5 },
  { crop: 'Mustard', state: 'Rajasthan', mandi: 'Bharatpur', price: 5600, msp: 5650, chg: -0.8 },
  { crop: 'Onion', state: 'Maharashtra', mandi: 'Lasalgaon', price: 2100, msp: null, chg: 12.5 },
  { crop: 'Tur/Arhar', state: 'Karnataka', mandi: 'Kalaburagi', price: 10500, msp: 7000, chg: 8.4 },
];

const MSP = [
  { crop: 'Wheat', price: 2275 },
  { crop: 'Paddy (Common)', price: 2183 },
  { crop: 'Mustard', price: 5650 },
  { crop: 'Cotton', price: 6620 },
  { crop: 'Soybean', price: 4600 },
  { crop: 'Gram', price: 5440 },
  { crop: 'Tur', price: 7000 },
  { crop: 'Maize', price: 2090 },
  { crop: 'Bajra', price: 2500 },
];

export default function MarketRatesPage() {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  
  const states = useMemo(() => ['All States', ...Array.from(new Set(MARKET.map(m => m.state)))], []);
  
  const filtered = useMemo(() => {
    return MARKET.filter(m => {
      const matchSearch = m.crop.toLowerCase().includes(search.toLowerCase());
      const matchState = selectedState === 'All States' || m.state === selectedState;
      return matchSearch && matchState;
    });
  }, [search, selectedState]);

  return (
    <div className="page-wrap">
      <div className="market-header-bg">
        <div className="mh-title">Live Mandi Rates 📊</div>
        <div className="mh-sub">Real-time agricultural commodity prices across India</div>
      </div>
      
      <div className="market-layout">
        <div className="market-main">
          <div className="search-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search crop..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <select
              className="filter-sel"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="data-table">
            <div className="dt-head">
              <span className="dt-hcell">Crop</span>
              <span className="dt-hcell">State</span>
              <span className="dt-hcell right">Price/q</span>
              <span className="dt-hcell right">MSP</span>
              <span className="dt-hcell right">Change</span>
            </div>
            {filtered.map((row, i) => (
              <div key={i} className="dt-row">
                <div>
                  <div className="dt-crop">{row.crop}</div>
                  <div className="dt-mandi">📍 {row.mandi}</div>
                </div>
                <div>
                  <span className="dt-state">{row.state}</span>
                </div>
                <div className={`dt-price ${row.msp && row.price > row.msp ? 'above' : ''}`}>
                  ₹{row.price.toLocaleString()}
                </div>
                <div className="dt-msp">
                  {row.msp ? `₹${row.msp.toLocaleString()}` : '—'}
                </div>
                <div className="dt-change">
                  <span className={row.chg > 0 ? 'up' : 'down'}>
                    {row.chg > 0 ? '▲' : '▼'}{Math.abs(row.chg)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="market-sidebar">
          <div className="sidebar-title">FY 2024–25 MSP</div>
          <div className="msp-list">
            {MSP.map((m, i) => (
              <div key={i} className="msp-row">
                <span className="msp-crop">{m.crop}</span>
                <span className="msp-price">₹{m.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <a
              href="https://farmer.gov.in/mspstatements.aspx"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--color-sage)',
                textDecoration: 'none',
              }}
            >
              GoI MSP Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
