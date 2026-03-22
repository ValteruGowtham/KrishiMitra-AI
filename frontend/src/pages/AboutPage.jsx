import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, Target, Eye, Heart, Cpu, Globe, Camera, Zap, 
  Clock, Mic, UserCheck, Landmark, TrendingUp, Mail, 
  PhoneCall, Twitter, Facebook, Instagram, Youtube, ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-accent overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-white/5 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-8 border border-white/20 shadow-2xl">
            <Leaf className="w-12 h-12 text-accent-light" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight max-w-4xl mx-auto">
            Empowering 2.5 Million <br className="hidden md:block"/> Indian Farmers
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Democratizing world-class agricultural knowledge with artificial intelligence, 
            right in the hands of the farmers who feed our nation.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-36 relative z-20">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 drop-shadow-sm">Our Mission</h3>
              <p className="text-muted leading-relaxed font-medium">
                To break the barriers of language and literacy, delivering precise, data-driven farming advisory to every marginal farmer in India for free.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 drop-shadow-sm">Our Vision</h3>
              <p className="text-muted leading-relaxed font-medium">
                A resilient and prosperous agricultural ecosystem where climate change and market volatility are mitigated through intelligent preemptive insights.
              </p>
            </div>

            {/* Values Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 drop-shadow-sm">Our Values</h3>
              <p className="text-muted leading-relaxed font-medium">
                Farmer-First, Empathy-Driven, Technologically Advanced, and Uncompromising on Data Privacy and Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Technology Section */}
      <section className="py-24 bg-surface border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent-dark font-bold uppercase tracking-widest text-xs border border-accent/20">
                <Cpu className="w-4 h-4" /> The Brain Behind KrishiMitra
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-dark tracking-tight leading-tight">
                Architected with Advanced <span className="text-primary block mt-2">AI Orchestration</span>
              </h2>
              <p className="text-lg text-muted font-medium leading-relaxed">
                We've moved beyond standard chatbots. KrishiMitra employs a multi-agent orchestrated system tailored explicitly for Indian agriculture.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-dark mb-1">8-Agent Orchestration Engine</h4>
                    <p className="text-muted text-sm font-medium leading-relaxed">Parallel execution of specialized agents (Soil, Weather, Crop, Pest, Scheme, Finance, Mandi, Voice) synthesizing unified advice.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-200">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-dark mb-1">GPT-4o Vision Integration</h4>
                    <p className="text-muted text-sm font-medium leading-relaxed">Instantly detects crop diseases, nutritional deficiencies, and pest infestations just from a simple smartphone photo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-dark mb-1">Real-Time Data APIs</h4>
                    <p className="text-muted text-sm font-medium leading-relaxed">Pulls live weather from IMD, real-time prices from AgMarkNet, and active scheme details from government datasets.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] transform rotate-3 scale-105 blur-lg"></div>
              <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-2xl relative z-10 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-[600px]">
                <Globe className="w-20 h-20 text-primary-dark mb-8" />
                <h3 className="text-3xl font-extrabold text-dark mb-4">8 Indian Languages</h3>
                <p className="text-muted font-medium text-lg leading-relaxed mb-8 max-w-sm">
                  Seamlessly supporting Hindi, Marathi, Telugu, Tamil, Gujarati, Punjabi, Bengali, and English via unified voice-to-text NLP.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {['हिंदी', 'मराठी', 'తెలుగు', 'தமிழ்', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'বাংলা', 'English'].map(lang => (
                    <span key={lang} className="px-5 py-2.5 rounded-xl bg-surface border border-border font-bold text-dark shadow-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-dark tracking-tight mb-4">Platform Features</h2>
            <p className="text-xl text-muted font-medium max-w-2xl mx-auto">Everything you need to grow better, completely free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "24/7 Availability", desc: "Your farming companion doesn't sleep. Get help anytime, anywhere.", icon: <Clock className="w-7 h-7" />, color: "text-amber-600 bg-amber-50 border-amber-100" },
              { title: "Free for All Farmers", desc: "No subscriptions, no hidden fees. Complete access to all 8 AI agents.", icon: <Heart className="w-7 h-7" />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { title: "Voice & Photo Input", desc: "Can't type? Just speak in your regional language or snap a photo.", icon: <Mic className="w-7 h-7" />, color: "text-purple-600 bg-purple-50 border-purple-100" },
              { title: "Personalized Advice", desc: "Advice dynamically adapted to your land size, crop cycle, and location.", icon: <UserCheck className="w-7 h-7" />, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { title: "Schemes Integration", desc: "Analyzes your profile and auto-matches you with eligible Govt. schemes.", icon: <Landmark className="w-7 h-7" />, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { title: "Market Intelligence", desc: "Makes sure you sell at the right time by analyzing nearby Mandi prices.", icon: <TrendingUp className="w-7 h-7" />, color: "text-green-600 bg-green-50 border-green-100" },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-border bg-surface hover:bg-white hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${f.color} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">{f.title}</h4>
                <p className="text-muted font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-4xl font-extrabold text-white mb-6">We're Here for You</h2>
                <p className="text-white/80 font-medium text-lg leading-relaxed mb-10 max-w-md">
                  Have questions about using the platform, forming an FPO, or technical support? Drop us a line or call our emergency helplines.
                </p>
                
                <div className="space-y-6">
                  <a href="mailto:support@krishimitra.ai" className="flex items-center gap-4 text-white hover:text-accent transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-0.5">Email Us</p>
                      <p className="text-xl font-bold tracking-wide">support@krishimitra.ai</p>
                    </div>
                  </a>
                  
                  <a href="tel:18001801551" className="flex items-center gap-4 text-white hover:text-accent transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500/30">
                      <PhoneCall className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-0.5">Kisan Helpline (Free 24/7)</p>
                      <p className="text-xl font-bold tracking-wide text-green-400">1800-180-1551</p>
                    </div>
                  </a>

                  <a href="tel:18004251122" className="flex items-center gap-4 text-white hover:text-accent transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/30">
                      <PhoneCall className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-0.5">KVK Support</p>
                      <p className="text-xl font-bold tracking-wide text-blue-400">1800-425-1122</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start lg:items-end border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 lg:pl-16">
                <h3 className="text-2xl font-bold text-white mb-8">Follow Our Journey</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Twitter className="w-6 h-6" />, label: "Twitter" },
                    { icon: <Facebook className="w-6 h-6" />, label: "Facebook" },
                    { icon: <Instagram className="w-6 h-6" />, label: "Instagram" },
                    { icon: <Youtube className="w-6 h-6" />, label: "Youtube" }
                  ].map((social, idx) => (
                    <a key={idx} href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:-translate-y-2 hover:bg-white/10 hover:border-white/30 hover:text-accent transition-all shadow-lg" aria-label={social.label}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 bg-white text-center px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <Leaf className="w-16 h-16 text-primary mx-auto mb-8 opacity-50" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-dark mb-6 tracking-tight">Every Farmer Deserves an Expert</h2>
          <p className="text-xl text-muted mb-10 font-medium leading-relaxed">
            Join the agricultural revolution. Equip yourself with AI-driven insights that are highly accurate, empathetic, and culturally tuned.
          </p>
          <Link to="/advisory" className="inline-flex items-center gap-3 bg-primary text-white font-extrabold text-xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-primary-dark transition-all hover:-translate-y-1 active:scale-95 group">
            Start Using KrishiMitra AI Today <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default AboutPage;
