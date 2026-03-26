import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, ShieldCheck, ExternalLink, Loader } from 'lucide-react';
import { getMandiPrices, getMSPList } from '../services/api';

const DEMO_MSP = [
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
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [mspData, setMspData] = useState(DEMO_MSP);
  const [states, setStates] = useState(['All States']);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('demo_data');

  // Fetch mandi prices
  const fetchMandiPrices = useCallback(async (cropFilter = '', stateFilter = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (cropFilter) params.crop = cropFilter;
      if (stateFilter && stateFilter !== 'All States') params.state = stateFilter;
      
      const data = await getMandiPrices(params);
      setMarketData(data.data || []);
      setSource(data.source || 'demo_data');
      
      if (data.msp_list) {
        setMspData(data.msp_list);
      }
      
      // Extract unique states
      const uniqueStates = ['All States', ...new Set((data.data || []).map(d => d.state))];
      setStates(uniqueStates);
    } catch (err) {
      console.error('Failed to fetch mandi prices:', err);
      setError('Failed to load mandi rates. Showing demo data.');
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch MSP list on mount
  useEffect(() => {
    const fetchMSP = async () => {
      try {
        const data = await getMSPList();
        if (data.data) setMspData(data.data);
      } catch (err) {
        console.error('Failed to fetch MSP:', err);
      }
    };
    fetchMSP();
    fetchMandiPrices();
  }, [fetchMandiPrices]);

  // Filter data based on search and state
  const filtered = useMemo(() => {
    return marketData.filter(m => {
      const matchSearch = !search || m.crop.toLowerCase().includes(search.toLowerCase());
      const matchState = selectedState === 'All States' || m.state === selectedState;
      return matchSearch && matchState;
    });
  }, [search, selectedState, marketData]);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    setSearch(value);
    // Fetch from API when search changes
    const debounceTimer = setTimeout(() => {
      if (value.trim()) {
        fetchMandiPrices(value, selectedState !== 'All States' ? selectedState : '');
      } else {
        fetchMandiPrices('', selectedState !== 'All States' ? selectedState : '');
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [fetchMandiPrices, selectedState]);

  return (
    <div className="page-wrap">
      <div className="market-header-bg">
        <div className="mh-title">Live Mandi Rates 📊</div>
        <div className="mh-sub">
          Real-time agricultural commodity prices across India
          {source === 'data.gov.in' && (
            <span style={{ marginLeft: '8px', opacity: 0.7, fontSize: '11px' }}>
              🟢 Live from data.gov.in
            </span>
          )}
        </div>
      </div>

      <div className="market-layout">
        <div className="market-main">
          {/* Search Bar */}
          <div className="search-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search crop (e.g., Wheat, Onion)..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <select
              className="filter-sel"
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                fetchMandiPrices(search, e.target.value !== 'All States' ? e.target.value : '');
              }}
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '12px',
              marginBottom: '16px',
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
              <span style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Fetching latest mandi rates...</span>
            </div>
          )}

          {/* Data Table */}
          {!loading && (
            <div className="data-table">
              <div className="dt-head">
                <span className="dt-hcell">Crop</span>
                <span className="dt-hcell">State</span>
                <span className="dt-hcell right">Price/q</span>
                <span className="dt-hcell right">MSP</span>
                <span className="dt-hcell right">Change</span>
              </div>
              
              {filtered.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: 'var(--color-muted)',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>
                    No results found
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    Try searching for a different crop or state
                  </div>
                </div>
              ) : (
                filtered.map((row, i) => (
                  <div key={i} className="dt-row">
                    <div>
                      <div className="dt-crop">{row.crop}</div>
                      <div className="dt-mandi">📍 {row.mandi}</div>
                    </div>
                    <div>
                      <span className="dt-state">{row.state}</span>
                    </div>
                    <div className={`dt-price ${row.msp && row.price > row.msp ? 'above' : ''}`}>
                      ₹{row.price?.toLocaleString()}
                    </div>
                    <div className="dt-msp">
                      {row.msp ? `₹${row.msp.toLocaleString()}` : '—'}
                    </div>
                    <div className="dt-change">
                      <span className={row.change > 0 ? 'up' : 'down'}>
                        {row.change > 0 ? '▲' : '▼'}{Math.abs(row.change || 0)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar - MSP List */}
        <div className="market-sidebar">
          <div className="sidebar-title">FY 2024–25 MSP</div>
          <div className="msp-list">
            {mspData.map((m, i) => (
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
