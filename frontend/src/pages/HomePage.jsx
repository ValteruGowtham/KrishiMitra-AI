import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Phone, Sun, Wind, Droplets, TrendingUp, TrendingDown,
  FileText, ShieldCheck, CheckCircle, Leaf, Bug, CloudSun, Building2,
  Wallet, Mic, Activity, Search, Bot, ThumbsUp, Sprout
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans">
      
      {/* 2. Live Updates Bar */}
      <div className="bg-dark text-white px-4 py-2 sticky top-[64px] z-40 border-t border-white/10 shadow-sm flex items-center justify-between text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 font-bold tracking-widest text-accent uppercase">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          Live Updates
        </div>
        <div className="flex items-center gap-6 ml-4 opacity-90 font-medium">
          <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-success" /> Wheat MSP: ₹2,275/q</span>
          <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-warning" /> 32°C Sunny, Ajmer</span>
          <span className="flex items-center gap-1.5 opacity-70">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/5 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block py-1.5 px-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            भारत का कृषि मित्र
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
            Your Trusted Farming Companion
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 font-medium max-w-3xl leading-relaxed">
            AI-powered farming advice tailored to your land, your crop, and your dialect.
          </p>
          <p className="text-lg md:text-xl text-accent-light font-bold mb-10 tracking-wide drop-shadow-sm">
            किसानों के लिए बना, किसानों द्वारा
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/advisory" className="bg-white text-primary hover:bg-surface-alt px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Free Advisory <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:18001801551" className="bg-black/20 backdrop-blur-md text-white border-2 border-white/30 hover:bg-black/30 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-green-400" /> Call Helpline 1800-180-1551
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-white">2.5M+</p>
              <p className="text-xs text-white/80 uppercase font-bold tracking-wider mt-1">Farmers</p>
            </div>
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-white">10M+</p>
              <p className="text-xs text-white/80 uppercase font-bold tracking-wider mt-1">Advisories</p>
            </div>
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-white">500+</p>
              <p className="text-xs text-white/80 uppercase font-bold tracking-wider mt-1">Schemes</p>
            </div>
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-white">99.9%</p>
              <p className="text-xs text-white/80 uppercase font-bold tracking-wider mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Today's Highlights Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-border p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                <Sun className="text-warning w-5 h-5" /> Today's Weather
              </h3>
            </div>
            <div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-extrabold text-dark tracking-tighter">32°</span>
                <span className="text-xl text-muted font-medium mb-1">C</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm border-b border-surface-alt pb-2">
                  <span className="text-muted flex items-center gap-1.5"><Droplets className="w-4 h-4 text-info" /> Rainfall</span>
                  <span className="font-bold text-dark">0mm</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-surface-alt pb-2">
                  <span className="text-muted flex items-center gap-1.5"><Wind className="w-4 h-4 text-gray-400" /> Wind</span>
                  <span className="font-bold text-dark">12 km/h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Sun className="w-4 h-4 text-warning" /> Humidity</span>
                  <span className="font-bold text-dark">35%</span>
                </div>
              </div>
              <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl">
                <p className="text-xs font-bold text-warning-dark">
                  <span className="uppercase tracking-widest text-[9px] block mb-1">Farming Tip</span>
                  Avoid spraying chemicals between 12 PM - 3 PM due to high heat.
                </p>
              </div>
            </div>
          </div>

          {/* Market Rates Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-border p-6 hover:-translate-y-1 transition-transform flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                <TrendingUp className="text-success w-5 h-5" /> Top Mandi Rates
              </h3>
            </div>
            <div className="space-y-4 flex-1">
              <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-dark text-sm">Wheat (Sharbati)</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Indore Mandi</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-dark tracking-tight">₹2,850/q</p>
                  <p className="text-[10px] text-success font-bold flex items-center justify-end gap-1"><TrendingUp className="w-3 h-3" /> 1.2%</p>
                </div>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-dark text-sm">Cotton</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Rajkot Mandi</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-dark tracking-tight">₹7,200/q</p>
                  <p className="text-[10px] text-danger font-bold flex items-center justify-end gap-1"><TrendingDown className="w-3 h-3" /> 0.5%</p>
                </div>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-dark text-sm">Rice (Basmati)</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Karnal Mandi</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-dark tracking-tight">₹3,400/q</p>
                  <p className="text-[10px] text-success font-bold flex items-center justify-end gap-1"><TrendingUp className="w-3 h-3" /> 2.1%</p>
                </div>
              </div>
            </div>
            <Link to="/market-rates" className="mt-4 text-sm font-bold text-primary flex items-center justify-center gap-1 hover:text-primary-dark transition-colors bg-primary/5 py-2 rounded-lg">
              View All Rates <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>

          {/* Schemes Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-border p-6 hover:-translate-y-1 transition-transform flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                <ShieldCheck className="text-info w-5 h-5" /> Active Schemes
              </h3>
            </div>
            <div className="space-y-4 flex-1 mt-2">
              <div className="border-l-4 border-success pl-4 py-1.5">
                <p className="font-bold text-dark text-sm">PM-KISAN Samman Nidhi</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-semibold text-success">₹6,000 / year</p>
                  <span className="text-[9px] bg-success/10 text-success px-2 py-0.5 rounded uppercase font-bold tracking-wider">Status: Accept</span>
                </div>
              </div>
              <div className="border-l-4 border-info pl-4 py-1.5">
                <p className="font-bold text-dark text-sm">PM Fasal Bima Yojana</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-semibold text-info">Crop Insurance</p>
                  <span className="text-[9px] bg-info/10 text-info px-2 py-0.5 rounded uppercase font-bold tracking-wider">Status: Open</span>
                </div>
              </div>
              <div className="border-l-4 border-accent pl-4 py-1.5">
                <p className="font-bold text-dark text-sm">Soil Health Card</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-semibold text-accent-dark">Free Testing</p>
                  <span className="text-[9px] bg-accent/20 text-accent-dark px-2 py-0.5 rounded uppercase font-bold tracking-wider">Ongoing</span>
                </div>
              </div>
            </div>
            <Link to="/schemes" className="mt-4 text-sm font-bold text-info-dark flex items-center justify-center gap-1 hover:text-info transition-colors bg-info/5 py-2 rounded-lg">
              Check Eligibility <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 8 AI Agents Section */}
      <section className="py-20 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-4">Powered by 8 AI Agents</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-medium">
              We divide your problem into specialized tasks, run them through dedicated AI agents in parallel, and synthesize a verified, distress-safe response.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'soil', title: 'Soil Intelligence', desc: 'NPK, pH & Fertilizer limits', icon: <Leaf className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
              { id: 'crop', title: 'Crop Advisory', desc: 'Growth stage & variety tips', icon: <Sprout className="w-6 h-6 text-green-600" />, bg: 'bg-green-50 border-green-100' },
              { id: 'pest', title: 'Pest & Disease', desc: 'Vision AI & CIB-approved chemicals', icon: <Bug className="w-6 h-6 text-red-600" />, bg: 'bg-red-50 border-red-100' },
              { id: 'weather', title: 'Weather Climate', desc: 'IMD API & farming translation', icon: <CloudSun className="w-6 h-6 text-sky-600" />, bg: 'bg-sky-50 border-sky-100' },
              { id: 'mandi', title: 'Mandi Market', desc: 'AgMarkNet API & MSP guardrails', icon: <Building2 className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
              { id: 'scheme', title: 'Scheme Navigator', desc: 'Local SQLite eligibility checks', icon: <FileText className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50 border-purple-100' },
              { id: 'finance', title: 'Farm Finance', desc: 'Break-even & NABARD credit', icon: <Wallet className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' },
              { id: 'voice', title: 'Voice & Intent', desc: 'Hindi/English dual classification', icon: <Activity className="w-6 h-6 text-pink-600" />, bg: 'bg-pink-50 border-pink-100' },
            ].map((agent, i) => (
              <div key={agent.id || i} className={`p-6 bg-white rounded-2xl border ${agent.bg} hover:shadow-lg transition-all hover:-translate-y-1`}>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                  {agent.icon}
                </div>
                <h4 className="font-bold text-dark text-lg mb-2">{agent.title}</h4>
                <p className="text-sm text-muted font-medium leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-4">How It Works</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-medium">Getting expert advice is just three simple steps away.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-muted/30 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-surface flex items-center justify-center mb-6 text-primary">
                <Mic className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">1. Ask Your Question</h3>
              <p className="text-muted font-medium text-sm max-w-xs leading-relaxed">Speak in Hindi or English, type your issue, or snap a photo of a diseased leaf.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-surface flex items-center justify-center mb-6 text-accent-dark">
                <Bot className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">2. AI Analysis</h3>
              <p className="text-muted font-medium text-sm max-w-xs leading-relaxed">Our orchestrator runs applicable AI agents simultaneously to gather massive insights.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-surface flex items-center justify-center mb-6 text-success">
                <ThumbsUp className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">3. Get Expert Advice</h3>
              <p className="text-muted font-medium text-sm max-w-xs leading-relaxed">Receive a translated, compliance-checked, distress-safe advisory tailored for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-dark to-[#1a2e25] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to Transform Your Farming?</h2>
          <p className="text-xl text-white/70 mb-10 font-medium leading-relaxed">Join 2.5 million farmers already getting smart, safe, and instant guidance right in their local dialect.</p>
          <Link to="/advisory" className="inline-flex items-center gap-3 bg-accent text-primary-dark font-extrabold text-lg px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-accent-light transition-all hover:-translate-y-1">
            Get Free AI Advisory Now <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
