import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Search, Filter,
  MapPin, Calendar, ExternalLink, RefreshCw, X, ShieldCheck,
  IndianRupee, ArrowUpRight, Users, Clock
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

  const states = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(d => d.state))).sort();
  }, []);

  const mandis = useMemo(() => {
    if (!selectedState) return [];
    return Array.from(new Set(MOCK_DATA.filter(d => d.state === selectedState).map(d => d.mandi))).sort();
  }, [selectedState]);

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

  // Calculate stats
  const avgPrice = useMemo(() => {
    const valid = filteredData.filter(d => d.price);
    return valid.length ? Math.round(valid.reduce((a, b) => a + b.price, 0) / valid.length) : 0;
  }, [filteredData]);

  const aboveMspCount = useMemo(() => {
    return filteredData.filter(d => d.msp && d.price > d.msp).length;
  }, [filteredData]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Live Mandi Rates</h1>
                  <p className="text-primary-100 font-medium">Real-time agricultural commodity pricing across India</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <Calendar className="w-6 h-6 text-accent-400" />
              <div>
                <p className="text-xs text-primary-100 uppercase tracking-wider font-bold">Today</p>
                <p className="font-bold">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Total Mandis', value: '1,000+', icon: MapPin, color: 'from-blue-400 to-blue-500' },
              { label: 'Avg Price Today', value: `₹${avgPrice}/q`, icon: IndianRupee, color: 'from-green-400 to-green-500' },
              { label: 'Above MSP', value: `${aboveMspCount} crops`, icon: TrendingUp, color: 'from-amber-400 to-amber-500' },
              { label: 'Active Traders', value: '50K+', icon: Users, color: 'from-purple-400 to-purple-500' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-primary-100 font-medium">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-slate-800">Filter Rates</h2>
              </div>
              {(search || selectedState || selectedMandi) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm font-bold text-danger hover:bg-danger/10 px-4 py-2 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crop..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none text-slate-800 font-medium transition-all"
                />
              </div>

              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedMandi(''); }}
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none text-slate-800 font-medium appearance-none cursor-pointer transition-all"
                >
                  <option value="">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="relative">
                <Filter className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  disabled={!selectedState}
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none text-slate-800 font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">All Mandis</option>
                  {mandis.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Crop</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden md:table-cell">State</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Mandi</th>
                    <th className="px-6 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">MSP</th>
                    <th className="px-6 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map(row => {
                      const isAboveMsp = row.msp && row.price > row.msp;
                      const hasPriceAlert = row.msp && row.price < row.msp;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <span className="text-lg">🌾</span>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{row.crop}</p>
                                <p className="text-xs text-slate-500 md:hidden">{row.state}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden md:table-cell">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold">
                              {row.state}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-primary-600 font-bold">
                              <MapPin className="w-4 h-4" />
                              {row.mandi}
                            </div>
                          </td>
                          <td className={`px-6 py-5 text-right text-lg font-bold ${
                            isAboveMsp ? 'text-success' : hasPriceAlert ? 'text-danger' : 'text-slate-800'
                          }`}>
                            ₹{row.price.toLocaleString('en-IN')}
                            {isAboveMsp && (
                              <span className="text-xs font-bold text-success block mt-1">▲ Above MSP</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right text-sm font-semibold text-slate-600 hidden sm:table-cell">
                            {row.msp ? `₹${row.msp.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                              row.change > 0 ? 'bg-success/10 text-success' :
                              row.change < 0 ? 'bg-danger/10 text-danger' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {row.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> :
                               row.change < 0 ? <TrendingDown className="w-3.5 h-3.5" /> :
                               <TrendingUp className="w-3.5 h-3.5 opacity-0" />}
                              {row.change > 0 ? '+' : ''}{row.change}%
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right text-xs font-medium text-slate-500 hidden lg:table-cell">
                            <div className="flex items-center justify-end gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5" />
                              {row.updated}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="font-bold text-slate-800 mb-2">No mandi rates found</p>
                        <p className="text-sm text-slate-500">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MSP Reference Card */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                <h2 className="font-bold text-slate-800 text-lg">FY 2024-25 MSP</h2>
              </div>
              <p className="text-xs text-slate-600 font-medium">Minimum Support Prices by Government of India</p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {MSP_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{item.crop}</span>
                  <span className="text-sm font-bold text-success bg-success/10 px-3 py-1.5 rounded-lg">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <a
                href="https://farmer.gov.in/mspstatements.aspx"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border-2 border-slate-200 text-primary-700 font-bold text-sm hover:border-primary-400 hover:shadow-lg transition-all"
              >
                GoI MSP Portal <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-slate-500 text-center mt-3 font-medium">
                Rates are indicative. Applies to FAQ grade crops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketRatesPage;
