import React, { useState } from 'react';
import { 
  Search, ExternalLink, ShieldAlert, CheckCircle, 
  Clock, ArrowRight, LayoutGrid, Filter, Building, Info 
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
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-200'
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
    color: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-200'
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
    color: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-200'
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
    color: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-200'
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
    color: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200',
    iconBg: 'bg-yellow-200'
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
    color: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-200'
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
    color: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-200',
    iconBg: 'bg-cyan-200'
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
    color: 'from-rose-50 to-rose-100',
    borderColor: 'border-rose-200',
    iconBg: 'bg-rose-200'
  }
];

const CATEGORIES = ['All', 'Financial', 'Crop Insurance', 'Equipment', 'Training', 'Soil Health'];

const StatusBadge = ({ status }) => {
  if (status === 'Open') {
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-success/15 text-success-dark px-2.5 py-1 rounded-full border border-success/20"><CheckCircle className="w-3 h-3" /> Accepting Apps</span>;
  }
  if (status === 'Year-round') {
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-info/15 text-info-dark px-2.5 py-1 rounded-full border border-info/20"><Clock className="w-3 h-3" /> Year Round</span>;
  }
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-danger/10 text-danger-dark px-2.5 py-1 rounded-full border border-danger/20"><ShieldAlert className="w-3 h-3" /> Closed</span>;
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
    <div className="flex flex-col min-h-screen bg-surface">
      {/* 1. Page Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <LayoutGrid className="w-8 h-8 text-accent-light" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Government Schemes for Farmers</h1>
          <p className="text-primary-light font-medium text-lg md:text-xl max-w-2xl">
            500+ active schemes across India. Find exactly what you are eligible for, understand the benefits, and apply directly.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        
        {/* 2. Filter Section */}
        <div className="mb-10 space-y-6">
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <input 
              type="text" 
              placeholder="Search by scheme name or keyword (e.g., Solar, Loan)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 border-2 border-border rounded-2xl leading-5 bg-white placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-dark shadow-sm"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-bold text-muted flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4" /> Filter by type:
            </span>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                  activeCategory === category
                    ? 'bg-primary border-primary text-white shadow-md scale-105'
                    : 'bg-white border-border text-dark hover:bg-surface-alt hover:border-primary/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Scheme Cards Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className={`bg-gradient-to-br ${scheme.color} rounded-3xl border ${scheme.borderColor} p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group`}
              >
                {/* Card Header Layer */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${scheme.iconBg} flex items-center justify-center text-2xl shadow-inner border border-white/40 group-hover:scale-110 transition-transform`}>
                    {scheme.icon}
                  </div>
                  <StatusBadge status={scheme.status} />
                </div>

                {/* Card Content Layer */}
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-dark/50 block mb-1">
                    {scheme.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-dark leading-snug mb-2 group-hover:text-primary transition-colors">
                    {scheme.name}
                  </h3>
                  
                  {/* Benefit Highlight Bubble */}
                  <div className="inline-block bg-white/60 border border-white px-3 py-1.5 rounded-lg mb-3 shadow-sm">
                    <p className="text-sm font-extrabold text-primary-dark tracking-tight">
                      {scheme.benefit}
                    </p>
                  </div>

                  <p className="text-sm text-dark/70 font-medium leading-relaxed line-clamp-2">
                    {scheme.description}
                  </p>
                </div>

                {/* Card Info Layer */}
                <div className="mt-auto space-y-3 pt-4 border-t border-dark/10">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-dark/80 font-medium"><span className="font-bold text-dark block text-xs">Eligibility:</span> {scheme.eligibility}</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                    <p className="text-muted text-xs font-semibold leading-tight">{scheme.ministry}</p>
                  </div>
                </div>

                {/* Card Action Layer */}
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`mt-6 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border shadow-sm ${
                    scheme.status === 'Closed' 
                      ? 'bg-white/50 border-dark/10 text-muted pointer-events-none'
                      : 'bg-white border-white text-primary hover:bg-primary hover:border-primary hover:text-white hover:shadow-md'
                  }`}
                >
                  {scheme.status === 'Closed' ? 'Application Closed' : 'Apply Now'} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-sm w-full max-w-2xl mx-auto">
            <Info className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-dark mb-2">No Schemes Found</h3>
            <p className="text-muted font-medium mb-6">We couldn't find any schemes matching "{searchQuery}" under the {activeCategory} category.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="bg-surface-alt hover:bg-border text-dark font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SchemesPage;
