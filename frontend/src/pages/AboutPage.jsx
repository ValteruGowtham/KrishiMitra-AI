import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Target, Eye, Heart, Cpu, Globe, Camera, Zap,
  Clock, Mic, UserCheck, Landmark, TrendingUp, Mail,
  PhoneCall, Twitter, Facebook, Instagram, Youtube, ArrowRight,
  CheckCircle, CloudSun, Bug, Sprout, Activity, Wallet, FileText, Building2,
  Sparkles, Award, Users, Star, Shield
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-bold text-white">Empowering Indian Agriculture Since 2024</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Empowering 2.5 Million<br />
            <span className="gradient-text">Indian Farmers</span>
          </h1>
          
          <p className="text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Democratizing world-class agricultural knowledge with artificial intelligence, 
            right in the hands of the farmers who feed our nation.
          </p>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="group bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                To break the barriers of language and literacy, delivering precise, data-driven farming advisory to every marginal farmer in India for free.
              </p>
            </div>

            {/* Vision */}
            <div className="group bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                A resilient and prosperous agricultural ecosystem where climate change and market volatility are mitigated through intelligent preemptive insights.
              </p>
            </div>

            {/* Values */}
            <div className="group bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Values</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Farmer-First, Empathy-Driven, Technologically Advanced, and Uncompromising on Data Privacy and Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                Advanced AI Architecture
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
                Architected with Advanced<br />
                <span className="gradient-text">AI Orchestration</span>
              </h2>
              
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                We've moved beyond standard chatbots. KrishiMitra employs a multi-agent orchestrated system tailored explicitly for Indian agriculture.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: '8-Agent Orchestration Engine',
                    desc: 'Parallel execution of specialized agents (Soil, Weather, Crop, Pest, Scheme, Finance, Mandi, Voice) synthesizing unified advice.',
                    color: 'from-amber-400 to-orange-500',
                  },
                  {
                    icon: Camera,
                    title: 'GPT-4o Vision Integration',
                    desc: 'Instantly detects crop diseases, nutritional deficiencies, and pest infestations just from a simple smartphone photo.',
                    color: 'from-purple-400 to-pink-500',
                  },
                  {
                    icon: Globe,
                    title: 'Real-Time Data APIs',
                    desc: 'Pulls live weather from IMD, real-time prices from AgMarkNet, and active scheme details from government datasets.',
                    color: 'from-blue-400 to-cyan-500',
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-slate-800 mb-2">{item.title}</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-accent-200 rounded-3xl transform rotate-3 scale-105 blur-2xl opacity-50"></div>
              <div className="relative bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-2xl">
                <div className="text-center mb-8">
                  <Globe className="w-20 h-20 text-primary-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">8 Indian Languages</h3>
                  <p className="text-slate-600 font-medium">Seamlessly supporting farmers across India</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {['हिंदी', 'मराठी', 'తెలుగు', 'தமிழ்', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'বাংলা', 'English'].map((lang, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-100 text-center hover:shadow-lg hover:border-primary-300 transition-all">
                      <p className="font-bold text-slate-800">{lang}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-600">95%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent-600">&lt;2s</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Response Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-bold text-sm mb-6">
              <Activity className="w-4 h-4" />
              Meet Our AI Agents
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              Eight Specialized AI Experts
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Each agent is trained on domain-specific data to provide expert-level advice
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Soil', icon: Sprout, color: 'from-emerald-400 to-green-500', desc: 'NPK & pH analysis' },
              { name: 'Crop', icon: Leaf, color: 'from-green-400 to-lime-500', desc: 'Growth stage tips' },
              { name: 'Pest', icon: Bug, color: 'from-red-400 to-rose-500', desc: 'Disease diagnosis' },
              { name: 'Weather', icon: CloudSun, color: 'from-amber-400 to-orange-500', desc: '5-day forecast' },
              { name: 'Mandi', icon: Building2, color: 'from-blue-400 to-cyan-500', desc: 'Market prices' },
              { name: 'Schemes', icon: FileText, color: 'from-purple-400 to-indigo-500', desc: 'Govt. programs' },
              { name: 'Finance', icon: Wallet, color: 'from-indigo-400 to-blue-500', desc: 'Credit & loans' },
              { name: 'Voice', icon: Mic, color: 'from-pink-400 to-rose-500', desc: 'Intent detection' },
            ].map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.name} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-2xl hover:border-primary-300 transition-all hover:-translate-y-2 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{agent.name}</h4>
                  <p className="text-sm text-slate-600 font-medium">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Everything you need to grow better, completely free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '24/7 Availability', desc: 'Your farming companion never sleeps. Get help anytime, anywhere.', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { title: 'Free for All Farmers', desc: 'No subscriptions, no hidden fees. Complete access to all 8 AI agents.', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Voice & Photo Input', desc: "Can't type? Just speak in your regional language or snap a photo.", icon: Mic, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Personalized Advice', desc: 'Advice dynamically adapted to your land size, crop cycle, and location.', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Schemes Integration', desc: 'Analyzes your profile and auto-matches you with eligible Govt. schemes.', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Market Intelligence', desc: 'Makes sure you sell at the right time by analyzing nearby Mandi prices.', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 rounded-3xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-2xl hover:border-primary-300 transition-all hover:-translate-y-2"
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

      {/* Contact Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-700 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">We're Here for You</h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10 max-w-md">
                  Have questions about using the platform, forming an FPO, or technical support? Drop us a line or call our emergency helplines.
                </p>

                <div className="space-y-6">
                  <a href="mailto:support@krishimitra.ai" className="flex items-center gap-4 text-white hover:text-accent-400 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Us</p>
                      <p className="text-lg font-bold">support@krishimitra.ai</p>
                    </div>
                  </a>

                  <a href="tel:18001801551" className="flex items-center gap-4 text-white hover:text-accent-400 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500/30">
                      <PhoneCall className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kisan Helpline (Free 24/7)</p>
                      <p className="text-lg font-bold text-green-400">1800-180-1551</p>
                    </div>
                  </a>

                  <a href="tel:18004251122" className="flex items-center gap-4 text-white hover:text-accent-400 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/30">
                      <PhoneCall className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">KVK Support</p>
                      <p className="text-lg font-bold text-blue-400">1800-425-1122</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start lg:items-end border-t lg:border-t-0 lg:border-l border-slate-700 pt-10 lg:pt-0 lg:pl-12">
                <h3 className="text-2xl font-bold text-white mb-8">Follow Our Journey</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Twitter, label: "Twitter" },
                    { icon: Facebook, label: "Facebook" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Youtube, label: "Youtube" }
                  ].map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a 
                        key={idx} 
                        href="#" 
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:-translate-y-2 hover:bg-white/10 hover:border-white/30 hover:text-accent-400 transition-all shadow-lg"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-slate-200 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <Leaf className="w-16 h-16 text-primary-600 mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6 tracking-tight">
            Every Farmer Deserves an Expert
          </h2>
          <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
            Join the agricultural revolution. Equip yourself with AI-driven insights that are highly accurate, empathetic, and culturally tuned.
          </p>
          <Link
            to="/advisory"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:-translate-y-1 hover:scale-105 group"
          >
            Start Using KrishiMitra AI Today
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
