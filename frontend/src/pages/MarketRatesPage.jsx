import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Search, Filter, 
  MapPin, Calendar, ExternalLink, RefreshCw, X, ShieldCheck
} from 'lucide-react';

const MOCK_DATA = [
  { id: 1, crop: 'Wheat (Sharbati)', state: 'Rajasthan', mandi: 'Ajmer', price: 2380, msp: 2275, change: 4.6, updated: '2 hours ago' },
  { id: 2, crop: 'Rice (Basmati)', state: 'Haryana', mandi: 'Karnal', price: 3400, msp: 3100, change: 2.1, updated: '1 hour ago' },
  { id: 3, crop: 'Cotton (Long Staple)', state: 'Gujarat', mandi: 'Rajkot', price: 7800, msp: 6620, change: -1.2, updated: '4 hours ago' },
  { id: 4, crop: 'Soybean (Yellow)', state: 'Madhya Pradesh', mandi: 'Indore', price: 4800, msp: 4600, change: 3.5, updated: '30 mins ago' },
  { id: 5, crop: 'Mustard (Black)', state: 'Rajasthan', mandi: 'Bharatpur', price: 5600, msp: 5650, change: -0.8, updated: '3 hours ago' },
  { id: 6, crop: 'Gram (Chana)', state: 'Maharashtra', mandi: 'Latur', price: 5400, msp: 5440, change: -0.5, updated: '5 hours ago' },
  { id: 7, crop: 'Sugarcane', state: 'Uttar Pradesh', mandi: 'Muzaffarnagar', price: 350, msp: 315, change: 0, updated: '12 hours ago' },
  { id: 8, crop: 'Onion (Red)', state: 'Maharashtra', mandi: 'Lasalgaon', price: 2100, msp: null, change: 12.5, updated: '15 mins ago' },
  { id: 9, crop: 'Potato (Kufri)', state: 'Uttar Pradesh', mandi: 'Agra', price: 1200, msp: null, change: -5.2, updated: '1 hour ago' },
  { id: 10, crop: 'Maize (Hybrid)', state: 'Karnataka', mandi: 'Davangere', price: 2150, msp: 2090, change: 1.8, updated: '2 hours ago' },
  { id: 11, crop: 'Bajra', state: 'Rajasthan', mandi: 'Jaipur', price: 2600, msp: 2500, change: 2.5, updated: '4 hours ago' },
  { id: 12, crop: 'Tur (Arhar)', state: 'Karnataka', mandi: 'Kalaburagi', price: 10500, msp: 7000, change: 8.4, updated: '1 hour ago' },
  { id: 13, crop: 'Groundnut', state: 'Gujarat', mandi: 'Gondal', price: 6800, msp: 6377, change: -2.1, updated: '3 hours ago' },
  { id: 14, crop: 'Barley (Jau)', state: 'Rajasthan', mandi: 'Bikaner', price: 2100, msp: 1850, change: 1.1, updated: '6 hours ago' },
];

const MSP_DATA = [
  { crop: "Paddy / Rice (Common)", price: 2183 },
  { crop: "Paddy / Rice (Grade A)", price: 2203 },
  { crop: "Wheat", price: 2275 },
  { crop: "Barley", price: 1850 },
  { crop: "Gram", price: 5440 },
  { crop: "Masur (Lentil)", price: 6425 },
  { crop: "Rapeseed/Mustard", price: 5650 },
  { crop: "Cotton (Medium Staple)", price: 6620 },
  { crop: "Soybean", price: 4600 },
  { crop: "Tur / Arhar", price: 7000 },
];

const MarketRatesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('');

  // Auto-generate dropdowns from mock data
  const states = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(d => d.state))).sort();
  }, []);

  const mandis = useMemo(() => {
    if (!selectedState) return [];
    return Array.from(new Set(MOCK_DATA.filter(d => d.state === selectedState).map(d => d.mandi))).sort();
  }, [selectedState]);

  // Filter application
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchSearch = item.crop.toLowerCase().includes(search.toLowerCase());
      const matchState = selectedState ? item.state === selectedState : true;
      const matchMandi = selectedMandi ? item.mandi === selectedMandi : true;
      return matchSearch && matchState && matchMandi;
    });
  }, [search, selectedState, selectedMandi]);

  const clearFilters = () => {
    setSearch('');
    setSelectedState('');
    setSelectedMandi('');
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* 1. Page Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Live Mandi Rates</h1>
              <p className="text-primary-light font-medium text-lg">Real-time agricultural commodity pricing across India</p>
            </div>
            <div className="flex items-center gap-2 bg-primary-dark/50 p-3 rounded-xl border border-white/10 shrink-0">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="font-bold text-sm tracking-wide">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Main Content (Filters + Table) */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* 2. Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search crop name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-dark text-sm transition-all"
              />
            </div>
            
            <div className="flex-1 flex items-center gap-4">
              <div className="w-1/2 relative bg-surface rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <MapPin className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedMandi(''); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-transparent appearance-none outline-none text-dark text-sm cursor-pointer"
                >
                  <option value="">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="w-1/2 relative bg-surface rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Filter className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  disabled={!selectedState}
                  className="w-full pl-9 pr-4 py-2.5 bg-transparent appearance-none outline-none text-dark text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Mandis</option>
                  {mandis.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {(search || selectedState || selectedMandi) && (
              <button 
                onClick={clearFilters}
                className="flex items-center justify-center bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                title="Clear Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 3. Rates Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto border-b border-border">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface text-muted text-[10px] sm:text-xs uppercase tracking-widest font-extrabold border-b border-border">
                    <th className="px-5 py-4 w-1/4">Crop</th>
                    <th className="px-5 py-4 hidden md:table-cell">State</th>
                    <th className="px-5 py-4">Mandi</th>
                    <th className="px-5 py-4 text-right">Price (₹/Q)</th>
                    <th className="px-5 py-4 text-right hidden sm:table-cell">MSP</th>
                    <th className="px-5 py-4 text-right">Change</th>
                    <th className="px-5 py-4 text-right hidden lg:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.length > 0 ? (
                    filteredData.map(row => {
                      const isAboveMsp = row.msp && row.price > row.msp;
                      const hasPriceAlert = row.msp && row.price < row.msp; // Selling below MSP
                      return (
                        <tr key={row.id} className="hover:bg-surface/50 transition-colors group">
                          <td className="px-5 py-4">
                            <span className="font-bold text-dark text-sm block">{row.crop}</span>
                            <span className="text-[10px] font-semibold text-muted uppercase md:hidden block mt-0.5">{row.state}</span>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <span className="text-sm font-medium bg-surface-alt px-2.5 py-1 rounded-md text-dark/80">{row.state}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> {row.mandi}
                            </span>
                          </td>
                          <td className={`px-5 py-4 text-right text-base font-extrabold tracking-tight ${isAboveMsp ? 'text-success' : hasPriceAlert ? 'text-danger' : 'text-dark'}`}>
                            ₹{row.price.toLocaleString('en-IN')}
                            {isAboveMsp && <span className="text-[9px] uppercase tracking-wider block font-bold text-success/70 mt-0.5">Above MSP</span>}
                          </td>
                          <td className="px-5 py-4 text-right text-sm font-semibold text-muted hidden sm:table-cell">
                            {row.msp ? `₹${row.msp.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className={`inline-flex items-center justify-end gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              row.change > 0 ? 'bg-success/10 text-success' : 
                              row.change < 0 ? 'bg-danger/10 text-danger' : 'bg-surface-alt text-muted'
                            }`}>
                              {row.change > 0 ? <TrendingUp className="w-3 h-3" /> : 
                               row.change < 0 ? <TrendingDown className="w-3 h-3" /> : 
                               <TrendingUp className="w-3 h-3 opacity-0" />}
                              {row.change > 0 ? '+' : ''}{row.change}%
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right text-xs font-medium text-muted hidden lg:table-cell">
                            <span className="flex items-center justify-end gap-1.5">
                              <RefreshCw className="w-3 h-3 opacity-50" /> {row.updated}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-12 text-center text-muted">
                         <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                         <span className="font-bold text-sm">No mandi rates found matching your filters.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. MSP Reference Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden sticky top-[144px]">
            <div className="bg-dark p-4 border-b border-dark/90 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
               <h2 className="text-white font-bold text-lg flex items-center gap-2 relative z-10">
                 <ShieldCheck className="w-5 h-5 text-accent" /> FY 2024-25 MSP
               </h2>
               <p className="text-white/70 text-xs font-medium mt-1 relative z-10">
                 Minimum Support Prices set by GoI
               </p>
            </div>
            
            <div className="p-0 border-b border-border divide-y divide-border h-[400px] overflow-y-auto">
               {MSP_DATA.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
                   <span className="text-sm font-bold text-dark">{item.crop}</span>
                   <span className="text-sm font-extrabold text-success tracking-tight">₹{item.price.toLocaleString('en-IN')}</span>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-surface flex flex-col gap-3">
              <a 
                href="https://farmer.gov.in/mspstatements.aspx" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-border text-primary font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
              >
                GoI MSP Portal <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[10px] text-muted text-center leading-relaxed">
                Rates are indicative. Prices apply to FAQ (Fair Average Quality) grade crops.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MarketRatesPage;
