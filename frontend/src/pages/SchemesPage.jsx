import React, { useState } from 'react';
import {
  Search, ExternalLink, ShieldAlert, CheckCircle,
  Clock, ArrowRight, Filter, Building, Info,
  Sparkles, Award, Users, IndianRupee, ArrowUpRight
} from 'lucide-react';

const SCHEMES = [
  {
    id: 1,
    name: 'PM-KISAN Samman Nidhi',
    category: 'Financial',
    benefit: '₹6,000 / year',
    description: 'Direct cash transfer to small and marginal farmers to meet their agricultural needs.',
    eligibility: 'All landholding eligible farmers',
    ministry: 'Min. of Agriculture & Farmers Welfare',
    status: 'Open',
    link: 'https://pmkisan.gov.in/',
    icon: '💰',
    applicants: '110M+',
  },
  {
    id: 2,
    name: 'PM Fasal Bima Yojana',
    category: 'Crop Insurance',
    benefit: '2% Premium Only',
    description: 'Comprehensive crop insurance against drought, dry spells, and non-preventable natural risks.',
    eligibility: 'Farmers growing notified crops',
    ministry: 'Min. of Agriculture',
    status: 'Open',
    link: 'https://pmfby.gov.in/',
    icon: '🛡️',
    applicants: '40M+',
  },
  {
    id: 3,
    name: 'Kisan Credit Card (KCC)',
    category: 'Financial',
    benefit: 'Loans up to ₹3L @ 4%',
    description: 'Provides timely and adequate credit support to farmers for their cultivation needs.',
    eligibility: 'Farmers, Tenant & Sharecroppers',
    ministry: 'NABARD / RBI',
    status: 'Year-round',
    link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
    icon: '💳',
    applicants: '75M+',
  },
  {
    id: 4,
    name: 'Soil Health Card',
    category: 'Soil Health',
    benefit: 'Free Soil Testing',
    description: 'Assess nutrient status and receive crop-wise optimal nutrient recommendations.',
    eligibility: 'All farmers pan-India',
    ministry: 'Dept. of Agriculture',
    status: 'Year-round',
    link: 'https://soilhealth.dac.gov.in/',
    icon: '🌱',
    applicants: '220M+',
  },
  {
    id: 5,
    name: 'PM KUSUM',
    category: 'Equipment',
    benefit: '60% Solar Pump Subsidy',
    description: 'Supports the installation of off-grid solar water pumps for rural agriculture.',
    eligibility: 'Individual farmers, Cooperatives',
    ministry: 'Min. of New & Renewable Energy',
    status: 'Closed',
    link: 'https://pmkusum.mnre.gov.in/',
    icon: '☀️',
    applicants: '500K+',
  },
  {
    id: 6,
    name: 'Paramparagat Krishi Vikas Yojana',
    category: 'Training',
    benefit: '₹50,000 / ha Assistance',
    description: 'Promotes commercial organic farming through a dedicated cluster approach.',
    eligibility: 'Clusters of 50+ farmers',
    ministry: 'Min. of Agriculture',
    status: 'Open',
    link: 'https://pgsindia-ncof.gov.in/pkvy/index.aspx',
    icon: '🌿',
    applicants: '1M+',
  },
  {
    id: 7,
    name: 'National Agriculture Market (eNAM)',
    category: 'Financial',
    benefit: 'Digital Trading Platform',
    description: 'A pan-India electronic trading portal networking existing APMC mandis.',
    eligibility: 'Farmers, Traders, FPOs',
    ministry: 'SFAC',
    status: 'Year-round',
    link: 'https://enam.gov.in/',
    icon: '📱',
    applicants: '15M+',
  },
  {
    id: 8,
    name: 'Kisan Call Centre',
    category: 'Training',
    benefit: 'Dial 1800-180-1551',
    description: 'Immediate solutions to issues related to farming directly in local dialects.',
    eligibility: 'All citizens of India',
    ministry: 'Min. of Agriculture',
    status: 'Year-round',
    link: 'https://mkisan.gov.in/',
    icon: '📞',
    applicants: 'Unlimited',
  }
];

const CATEGORIES = ['All', 'Financial', 'Crop Insurance', 'Equipment', 'Training', 'Soil Health'];

const StatusBadge = ({ status }) => {
  if (status === 'Open') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-success/15 text-success border border-success/20">
        <CheckCircle className="w-3.5 h-3.5" /> Accepting
      </span>
    );
  }
  if (status === 'Year-round') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-info/15 text-info border border-info/20">
        <Clock className="w-3.5 h-3.5" /> Year Round
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
      <ShieldAlert className="w-3.5 h-3.5" /> Closed
    </span>
  );
};

const SchemesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = SCHEMES.filter(scheme => {
    const matchesCategory = activeCategory === 'All' || scheme.category === activeCategory;
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-bold">500+ Active Schemes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Government Schemes for Farmers
          </h1>
          <p className="text-xl text-primary-100 font-medium max-w-3xl mx-auto">
            Find exactly what you're eligible for. Direct application links to official government portals.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            {[
              { label: 'Total Schemes', value: '500+', icon: Info },
              { label: 'Beneficiaries', value: '250M+', icon: Users },
              { label: 'Total Budget', value: '₹1.5L Cr', icon: IndianRupee },
              { label: 'Success Rate', value: '94%', icon: Award },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <Icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-primary-100 uppercase tracking-wider font-semibold">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Filters */}
        <div className="mb-10 space-y-6">
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by scheme name or keyword (e.g., Solar, Loan, Insurance)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-14 pr-6 py-5 border-2 border-slate-200 rounded-2xl bg-white placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all font-medium text-slate-800 text-lg shadow-xl"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-bold text-slate-600 flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4" /> Filter:
            </span>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 cursor-pointer ${
                  activeCategory === category
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-bold text-primary-600">{filteredSchemes.length}</span> schemes
            {activeCategory !== 'All' && <span> in <span className="font-bold text-primary-600">{activeCategory}</span></span>}
          </p>
        </div>

        {/* Scheme Cards Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl hover:border-primary-300 transition-all hover:-translate-y-2 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl border-2 border-primary-200 group-hover:scale-110 transition-transform">
                    {scheme.icon}
                  </div>
                  <StatusBadge status={scheme.status} />
                </div>

                {/* Card Content */}
                <div className="mb-5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-lg inline-block mb-3">
                    {scheme.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 line-clamp-2">
                    {scheme.name}
                  </h3>

                  {/* Benefit Highlight */}
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-success/10 to-emerald/10 border border-success/20 mb-4">
                    <IndianRupee className="w-4 h-4 text-success" />
                    <p className="text-sm font-bold text-success tracking-tight">
                      {scheme.benefit}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 mb-4">
                    {scheme.description}
                  </p>

                  {/* Applicants */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Users className="w-3.5 h-3.5" />
                    <span>{scheme.applicants} beneficiaries</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-3 pt-4 border-t border-slate-100 mb-4">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600 font-medium">
                      <span className="font-bold text-slate-800 block">Eligibility:</span> {scheme.eligibility}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Building className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-500 text-xs font-medium">{scheme.ministry}</p>
                  </div>
                </div>

                {/* Card Action */}
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    scheme.status === 'Closed'
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:shadow-lg'
                  }`}
                  style={{
                    pointerEvents: scheme.status === 'Closed' ? 'none' : 'auto',
                    opacity: scheme.status === 'Closed' ? 0.6 : 1,
                  }}
                >
                  {scheme.status === 'Closed' ? 'Application Closed' : 'Apply Now'}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-16 text-center shadow-xl w-full max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Info className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Schemes Found</h3>
            <p className="text-slate-600 font-medium mb-8">
              We couldn't find any schemes matching "<span className="font-bold text-primary-600">{searchQuery}</span>" under the {activeCategory} category.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/30"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesPage;
