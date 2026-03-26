import { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, Loader } from 'lucide-react';
import { getSchemes } from '../services/api';

const CATEGORIES = ['All', 'income_support', 'crop_insurance', 'credit', 'irrigation', 'soil_health', 'production', 'infrastructure', 'horticulture', 'mechanisation', 'collective_farming', 'organic_farming', 'extension', 'input_subsidy', 'market_access'];

const CATEGORY_LABELS = {
  'All': 'All',
  'income_support': 'Income Support',
  'crop_insurance': 'Insurance',
  'credit': 'Credit',
  'irrigation': 'Irrigation',
  'soil_health': 'Soil Health',
  'production': 'Production',
  'infrastructure': 'Infrastructure',
  'horticulture': 'Horticulture',
  'mechanisation': 'Machinery',
  'collective_farming': 'FPO',
  'organic_farming': 'Organic',
  'extension': 'Training',
  'input_subsidy': 'Subsidy',
  'market_access': 'Market',
};

const SCHEME_ICONS = {
  'income_support': '💰',
  'crop_insurance': '🛡',
  'credit': '💳',
  'irrigation': '💧',
  'soil_health': '🌱',
  'production': '🌾',
  'infrastructure': '🏗',
  'horticulture': '🍅',
  'mechanisation': '🚜',
  'collective_farming': '🤝',
  'organic_farming': '🌿',
  'extension': '📚',
  'input_subsidy': '🎫',
  'market_access': '📊',
};

const STATUS_COLORS = {
  'Rolling': 'tag-green',
  'Annual': 'tag-blue',
  'Closed': '',
};

export default function SchemesPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch schemes from API
  const fetchSchemes = useCallback(async (category = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (category && category !== 'All') {
        params.category = category;
      }
      
      const data = await getSchemes(params);
      setSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch schemes:', err);
      setError('Failed to load schemes. Please try again.');
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and category change
  useEffect(() => {
    fetchSchemes(cat);
  }, [cat, fetchSchemes]);

  // Filter by search
  const filtered = schemes.filter(s => {
    const matchSr = s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.description.toLowerCase().includes(search.toLowerCase()) ||
                    s.benefit_desc.toLowerCase().includes(search.toLowerCase());
    return matchSr;
  });

  // Handle external link click
  const handleApply = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page-wrap">
      <div className="market-header-bg">
        <div className="mh-title">Govt. Schemes for Farmers 🏛</div>
        <div className="mh-sub">
          {schemes.length}+ active schemes — find what you're eligible for
        </div>
      </div>

      <div className="schemes-layout">
        {/* Search Bar */}
        <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto 16px' }}>
          <div className="search-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search schemes by name or benefit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="lang-chips" style={{ justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`lang-chip ${cat === c ? 'sel' : ''}`}
              onClick={() => setCat(c)}
              style={{ fontSize: '10px', padding: '5px 8px' }}
            >
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 16px',
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '12px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '12px',
          }}>
            <div className="loading-ring"></div>
            <span style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Loading schemes...</span>
          </div>
        )}

        {/* Schemes Grid */}
        {!loading && (
          <div className="sch-grid">
            {filtered.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--color-muted)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>
                  No schemes found
                </div>
                <div style={{ fontSize: '13px' }}>
                  {search ? `Try searching for "${search}" with different keywords` : 'Try selecting a different category'}
                </div>
              </div>
            ) : (
              filtered.map((s, i) => {
                const icon = SCHEME_ICONS[s.category] || '📋';
                const statusClass = STATUS_COLORS[s.deadline?.split(' ')[0]] || 'tag-blue';
                const isClosed = s.deadline === 'Closed';
                
                return (
                  <div key={s.scheme_id || i} className="sch-card">
                    <div className="sch-icon-wrap">
                      <span style={{ fontSize: '22px' }}>{icon}</span>
                    </div>
                    <div className="sch-cat">{CATEGORY_LABELS[s.category] || s.category}</div>
                    <div className="sch-name">{s.name}</div>
                    <div className="sch-benefit" style={{ fontSize: '12px', color: 'var(--color-success)' }}>
                      {s.benefit_inr > 0 ? `₹${s.benefit_inr.toLocaleString()} benefit` : s.benefit_desc}
                    </div>
                    <div className="sch-desc">{s.description}</div>
                    <div className="sch-footer">
                      <span className={`tag ${statusClass}`}>
                        {s.deadline || 'Rolling'}
                      </span>
                      <button
                        className={`sch-apply ${isClosed ? 'closed' : ''}`}
                        disabled={isClosed}
                        onClick={() => handleApply(s.enrollment_url)}
                        style={{ cursor: isClosed ? 'not-allowed' : 'pointer' }}
                      >
                        {isClosed ? 'Closed' : (
                          <>
                            Apply <ExternalLink className="w-3 h-3" style={{ marginLeft: '4px' }} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
