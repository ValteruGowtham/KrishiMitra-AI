import React from 'react';
import { Link } from 'react-router-dom';

const MARKET = [
  { crop: 'Wheat (Sharbati)', state: 'Rajasthan', mandi: 'Ajmer', price: 2380, msp: 2275, chg: 4.6 },
  { crop: 'Rice (Basmati)', state: 'Haryana', mandi: 'Karnal', price: 3400, msp: 3100, chg: 2.1 },
  { crop: 'Cotton', state: 'Gujarat', mandi: 'Rajkot', price: 7800, msp: 6620, chg: -1.2 },
  { crop: 'Soybean', state: 'M.P.', mandi: 'Indore', price: 4800, msp: 4600, chg: 3.5 },
];

const HomePage = ({ setPage }) => {
  const agents = [
    { emoji: '🌱', name: 'Soil Intelligence', desc: 'NPK, pH & fertilizer' },
    { emoji: '🌾', name: 'Crop Advisory', desc: 'Growth stage guidance' },
    { emoji: '🐛', name: 'Pest & Disease', desc: 'Vision AI diagnosis' },
    { emoji: '🌤', name: 'Weather Forecast', desc: '5-day IMD forecast' },
    { emoji: '📊', name: 'Mandi Market', desc: 'Live prices & MSP' },
    { emoji: '📋', name: 'Govt. Schemes', desc: 'Auto eligibility check' },
    { emoji: '💳', name: 'Farm Finance', desc: 'Credit & loan advice' },
    { emoji: '🎙', name: 'Voice & Intent', desc: '8 Indian languages' },
  ];

  const iconColors = ['#F0FDF4', '#FFF7ED', '#FFF1F2', '#EFF6FF', '#F0FDF4', '#EFF6FF', '#EEF2FF', '#FCF4FF'];

  return (
    <div className="page-wrap">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <span>🇮🇳</span> भारत का कृषि AI सहायक
            </div>
            <h1>
              Your Trusted <span>Farming</span> Companion
            </h1>
            <p className="hero-sub">
              Eight specialized AI agents working together to give you expert advice on soil, weather, pests, markets, and more — in your language, instantly.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => setPage('advisory')}>
                Get Free Advisory ✨
              </button>
              <a href="tel:18001801551" className="btn-outline">
                📞 1800-180-1551
              </a>
            </div>
          </div>
          <div className="hero-stats">
            {[
              { num: '2.5M', unit: '+', label: 'Farmers Served' },
              { num: '10M', unit: '+', label: 'Advisories Given' },
              { num: '500', unit: '+', label: 'Govt. Schemes' },
              { num: '99.9', unit: '%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-num">
                  {stat.num}<span>{stat.unit}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="highlights">
        <div className="highlight-grid">
          {/* Weather Card */}
          <div className="h-card">
            <div className="h-card-header">
              <div>
                <div className="h-card-title">Today's Weather</div>
                <div className="h-card-sub">Ajmer, Rajasthan</div>
              </div>
              <div className="h-icon" style={{ background: '#FEF3C7', fontSize: '22px' }}>☀</div>
            </div>
            <div className="h-row">
              <span className="h-row-label">Temperature</span>
              <span className="h-row-val">32°C</span>
            </div>
            <div className="h-row">
              <span className="h-row-label">Humidity</span>
              <span className="h-row-val">35%</span>
            </div>
            <div className="h-row">
              <span className="h-row-label">Wind</span>
              <span className="h-row-val">12 km/h</span>
            </div>
            <div style={{ marginTop: '10px', padding: '8px 10px', background: '#FFF7ED', borderRadius: '7px', fontSize: '11px', color: '#92400E', fontWeight: '500' }}>
              💡 Spray tip: Avoid 12 PM–3 PM due to heat.
            </div>
          </div>

          {/* Market Card */}
          <div className="h-card">
            <div className="h-card-header">
              <div>
                <div className="h-card-title">Top Mandi Rates</div>
                <div className="h-card-sub">Live prices</div>
              </div>
              <div className="h-icon" style={{ background: '#F0FDF4', fontSize: '20px' }}>📈</div>
            </div>
            {MARKET.slice(0, 4).map((item, i) => (
              <div key={i} className="h-row">
                <span className="h-row-label">{item.crop.split(' ')[0]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="h-row-val">₹{item.price}/q</span>
                  <span className={item.chg > 0 ? 'up' : 'down'}>
                    {item.chg > 0 ? '+' : ''}{item.chg}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Schemes Card */}
          <div className="h-card">
            <div className="h-card-header">
              <div>
                <div className="h-card-title">Active Schemes</div>
                <div className="h-card-sub">Apply today</div>
              </div>
              <div className="h-icon" style={{ background: '#EFF6FF', fontSize: '20px' }}>🏛</div>
            </div>
            {[
              ['PM-KISAN', '₹6,000/yr', 'green'],
              ['Fasal Bima', '2% premium', 'blue'],
              ['KCC Loan', '@ 4% p.a.', 'amber'],
            ].map(([name, benefit, color], i) => (
              <div key={i} className="h-row">
                <span className="h-row-label">{name}</span>
                <span className={`tag tag-${color}`}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <div className="section">
        <div className="section-label">
          <span className="sec-label-dot"></span>
          Powered by Advanced AI
        </div>
        <h2 className="section-title serif">8 Specialized AI Agents</h2>
        <p className="section-sub">
          Each agent is an expert in its domain, analyzing your query in parallel for the most comprehensive advice.
        </p>
        <div className="agents-grid">
          {agents.map((agent, i) => (
            <div key={i} className="agent-card">
              <div
                className="agent-icon"
                style={{ background: iconColors[i] }}
              >
                {agent.emoji}
              </div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-desc">{agent.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ background: 'var(--wheat)', padding: '0 0 8px' }}>
        <div className="section">
          <div className="section-label">
            <span className="sec-label-dot"></span>
            Simple Steps
          </div>
          <h2 className="section-title serif">How KrishiMitra Works</h2>
          <div className="how-grid">
            {[
              { num: '01', icon: '🎙', title: 'Ask', sub: 'Type, speak or upload a photo in your language' },
              { num: '02', icon: '⚡', title: 'AI Analysis', sub: '8 agents analyze your query with real-time data' },
              { num: '03', icon: '✅', title: 'Get Advice', sub: 'Receive personalized, compliance-checked guidance' },
            ].map((item, i) => (
              <div key={i} className="how-card">
                <div className="how-num">{item.num}</div>
                <div className="how-icon-wrap">
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                </div>
                <div className="how-title">{item.title}</div>
                <div className="how-sub">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-forest">
        <h2 className="serif" style={{ color: '#fff', fontSize: '32px', marginBottom: '10px' }}>
          Ready to Transform Your Farming?
        </h2>
        <p>Join 2.5 million farmers already using KrishiMitra AI.</p>
        <button className="btn-primary" onClick={() => setPage('advisory')}>
          Get Free AI Advisory ✨
        </button>
      </div>
    </div>
  );
};

export default HomePage;
