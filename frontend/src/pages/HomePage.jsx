import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, Sun, Wind, Droplets, TrendingUp, TrendingDown,
  FileText, ShieldCheck, CheckCircle, Leaf, Bug, CloudSun, Building2,
  Wallet, Mic, Activity, Sprout, Sparkles, Zap, Globe, Camera,
  MessageSquare, Users, Award, Target, Heart, Clock, Star
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-64 h-64 bg-primary-400/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">भारत का कृषि मित्र • India's Farm AI Assistant</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              Your Trusted<br />
              <span className="gradient-text">Farming Companion</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              AI-powered farming advice tailored to your land, your crop, and your language
            </p>

            <p className="text-lg text-accent-400 mb-12 font-bold animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              किसानों के लिए बना, किसानों द्वारा
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/advisory"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:-translate-y-1 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                Start Free Advisory
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:18001801551"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                <Phone className="w-5 h-5 text-success" />
                Call 1800-180-1551
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: '2.5M+', label: 'Farmers', icon: Users },
                { value: '10M+', label: 'Advisories', icon: MessageSquare },
                { value: '500+', label: 'Schemes', icon: FileText },
                { value: '99.9%', label: 'Uptime', icon: Zap },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                    <Icon className="w-6 h-6 text-primary-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-float"></div>
          </div>
        </div>
      </section>

      {/* Today's Highlights - Overlapping Cards */}
      <section className="relative -mt-20 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather Card */}
            <div className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Weather</h3>
                    <p className="text-xs text-slate-500">Ajmer, Rajasthan</p>
                  </div>
                </div>
                <span className="text-4xl font-bold text-slate-800">32°</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Rainfall
                  </div>
                  <span className="font-bold text-slate-800">0mm</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Wind className="w-4 h-4 text-slate-400" />
                    Wind
                  </div>
                  <span className="font-bold text-slate-800">12 km/h</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Humidity
                  </div>
                  <span className="font-bold text-slate-800">35%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <p className="text-xs font-bold text-amber-800">
                  <span className="uppercase tracking-wider text-xs block mb-1">💡 Farming Tip</span>
                  Avoid spraying chemicals between 12 PM - 3 PM due to high heat.
                </p>
              </div>
            </div>

            {/* Market Rates Card */}
            <div className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Mandi Rates</h3>
                    <p className="text-xs text-slate-500">Live prices</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {[
                  { crop: 'Wheat (Sharbati)', mandi: 'Indore', price: '₹2,850', change: '+1.2%', up: true },
                  { crop: 'Cotton', mandi: 'Rajkot', price: '₹7,200', change: '-0.5%', up: false },
                  { crop: 'Rice (Basmati)', mandi: 'Karnal', price: '₹3,400', change: '+2.1%', up: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.crop}</p>
                      <p className="text-xs text-slate-500">{item.mandi} Mandi</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{item.price}/q</p>
                      <p className={`text-xs font-bold flex items-center justify-end gap-1 ${item.up ? 'text-success' : 'text-danger'}`}>
                        {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {item.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to="/market-rates"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-50 text-primary-700 font-bold text-sm hover:bg-primary-100 transition-colors"
              >
                View All Rates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Schemes Card */}
            <div className="group bg-white rounded-3xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Govt Schemes</h3>
                    <p className="text-xs text-slate-500">Active programs</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {[
                  { name: 'PM-KISAN', benefit: '₹6,000/year', status: 'Open', color: 'success' },
                  { name: 'PM Fasal Bima', benefit: '2% Premium', status: 'Open', color: 'info' },
                  { name: 'Soil Health Card', benefit: 'Free Testing', status: 'Ongoing', color: 'warning' },
                ].map((scheme, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${scheme.color}-500`}></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{scheme.name}</p>
                        <p className={`text-xs font-semibold text-${scheme.color}-600`}>{scheme.benefit}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full bg-${scheme.color}-100 text-${scheme.color}-700 font-bold uppercase tracking-wider`}>
                      {scheme.status}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link
                to="/schemes"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors"
              >
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8 AI Agents Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-bold text-sm mb-6">
              <Zap className="w-4 h-4" />
              Powered by Advanced AI
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              8 Specialized AI Agents
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Each agent is an expert in its domain, working together to give you comprehensive farming advice
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'soil', name: 'Soil Intelligence', desc: 'NPK, pH & Fertilizer analysis', icon: Sprout, color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50' },
              { id: 'crop', name: 'Crop Advisory', desc: 'Growth stage & variety tips', icon: Leaf, color: 'from-green-400 to-lime-500', bg: 'bg-green-50' },
              { id: 'pest', name: 'Pest & Disease', desc: 'Vision AI diagnosis', icon: Bug, color: 'from-red-400 to-rose-500', bg: 'bg-red-50' },
              { id: 'weather', name: 'Weather', desc: '5-day forecast & alerts', icon: CloudSun, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50' },
              { id: 'mandi', name: 'Mandi Market', desc: 'Live prices & MSP', icon: Building2, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
              { id: 'scheme', name: 'Scheme Navigator', desc: 'Govt. scheme matching', icon: FileText, color: 'from-purple-400 to-indigo-500', bg: 'bg-purple-50' },
              { id: 'finance', name: 'Farm Finance', desc: 'Credit & loan guidance', icon: Wallet, color: 'from-indigo-400 to-blue-500', bg: 'bg-indigo-50' },
              { id: 'voice', name: 'Voice & Intent', desc: '8 Indian languages', icon: Mic, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' },
            ].map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${agent.bg}`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-xl mb-2">{agent.name}</h4>
                    <p className="text-slate-600 font-medium">{agent.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-surface to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-bold text-sm mb-6">
              <Activity className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              How KrishiMitra Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Get expert farming advice in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200"></div>

            {[
              {
                step: '01',
                icon: Mic,
                title: 'Ask Your Question',
                desc: 'Speak in your language, type, or upload a photo of your crop issue',
                color: 'from-primary-500 to-primary-600',
              },
              {
                step: '02',
                icon: Zap,
                title: 'AI Analysis',
                desc: '8 specialized AI agents analyze your query with soil, weather & market data',
                color: 'from-accent-500 to-accent-600',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Get Expert Advice',
                desc: 'Receive personalized, compliance-checked advisory in your language',
                color: 'from-success to-emerald-600',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl shadow-primary-500/20 mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-800">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-medium max-w-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              Everything You Need to Grow Better
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Comprehensive farming support, completely free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '24/7 Availability', desc: 'Round-the-clock farming assistance whenever you need it', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { title: '8 Indian Languages', desc: 'Hindi, Marathi, Telugu, Tamil, Gujarati, Punjabi, Bengali, English', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Photo Diagnosis', desc: 'Upload crop photos for instant pest & disease detection', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Voice Input', desc: 'Speak naturally in your dialect - no typing required', icon: Mic, color: 'text-pink-600', bg: 'bg-pink-50' },
              { title: 'Real-time Mandi Rates', desc: 'Live market prices from 1000+ mandis across India', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { title: 'Scheme Matching', desc: 'Auto-eligibility check for 500+ government schemes', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 rounded-3xl border border-slate-200 bg-surface hover:bg-white hover:shadow-2xl hover:border-transparent transition-all hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -bottom-48 -left-48"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Leaf className="w-16 h-16 text-primary-400 mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-slate-300 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
            Join 2.5 million farmers already getting smart, safe, and instant guidance in their local language
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/advisory"
              className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg shadow-2xl shadow-accent-500/30 hover:shadow-accent-500/50 transition-all hover:-translate-y-1 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Get Free AI Advisory
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
