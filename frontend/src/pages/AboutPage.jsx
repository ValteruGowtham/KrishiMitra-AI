import { Link } from 'react-router-dom';
import { Leaf, Target, Eye, Heart, Users, Award, Shield, Sparkles, CheckCircle, Phone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-wrap">
      {/* Hero Section */}
      <section className="hero">
        <div className="max-w-960px mx-auto px-4 text-center">
          <div className="hero-badge" style={{ margin: '0 auto 20px' }}>
            <Sparkles className="w-4 h-4" />
            <span>Empowering Indian Agriculture Since 2024</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '48px', marginBottom: '16px' }}>
            About KrishiMitra AI
          </h1>
          <p className="hero-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
            India's most advanced AI-powered agricultural advisory platform, built by farmers, for farmers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <div className="section">
        <div className="section-label">
          <span className="sec-label-dot"></span>
          Our Purpose
        </div>
        <h2 className="section-title serif">Empowering Every Farmer</h2>
        <p className="section-sub" style={{ maxWidth: '600px' }}>
          We believe every farmer deserves access to expert farming advice, real-time market data, and government schemes — in their own language.
        </p>
        
        <div className="how-grid" style={{ marginTop: '48px' }}>
          {[
            {
              icon: '🎯',
              title: 'Our Mission',
              desc: 'Democratize agricultural knowledge and make expert advisory accessible to all farmers.',
            },
            {
              icon: '👁',
              title: 'Our Vision',
              desc: 'A India where technology bridges the gap between traditional farming and modern science.',
            },
            {
              icon: '❤',
              title: 'Our Values',
              desc: 'Farmer-first approach, data privacy, multilingual access, and free essential services.',
            },
          ].map((item, i) => (
            <div key={i} className="how-card" style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div className="how-icon-wrap" style={{ background: 'var(--color-forest)', color: '#fff' }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
              </div>
              <div className="how-title">{item.title}</div>
              <div className="how-sub">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-forest">
        <h2 className="serif" style={{ color: '#fff', fontSize: '32px', marginBottom: '32px' }}>
          Our Impact
        </h2>
        <div className="hero-stats" style={{ maxWidth: '800px', margin: '0 auto', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { num: '2.5M', unit: '+', label: 'Farmers' },
            { num: '10M', unit: '+', label: 'Advisories' },
            { num: '500', unit: '+', label: 'Schemes' },
            { num: '8', unit: '', label: 'Languages' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-num">
                {stat.num}<span>{stat.unit}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="section">
        <div className="section-label">
          <span className="sec-label-dot"></span>
          What We Offer
        </div>
        <h2 className="section-title serif">Comprehensive Farming Support</h2>
        
        <div className="agents-grid" style={{ marginTop: '36px' }}>
          {[
            { emoji: '🌱', name: 'Soil Health', desc: 'NPK analysis and fertilizer recommendations' },
            { emoji: '🌾', name: 'Crop Advisory', desc: 'Growth stage guidance and best practices' },
            { emoji: '🐛', name: 'Pest Control', desc: 'AI-powered disease diagnosis' },
            { emoji: '🌤', name: 'Weather', desc: '5-day forecast and alerts' },
            { emoji: '📊', name: 'Mandi Rates', desc: 'Live prices from 1000+ mandis' },
            { emoji: '📋', name: 'Schemes', desc: '500+ government schemes' },
            { emoji: '💳', name: 'Finance', desc: 'Credit and loan guidance' },
            { emoji: '🎙', name: 'Voice', desc: '8 Indian languages support' },
          ].map((agent, i) => (
            <div key={i} className="agent-card">
              <div className="agent-icon" style={{ background: ['#F0FDF4', '#FFF7ED', '#FFF1F2', '#EFF6FF', '#F0FDF4', '#EFF6FF', '#EEF2FF', '#FCF4FF'][i] }}>
                {agent.emoji}
              </div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-desc">{agent.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div style={{ background: 'var(--color-wheat)', padding: '56px 24px' }}>
        <div className="section">
          <div className="section-label">
            <span className="sec-label-dot"></span>
            Built With Love
          </div>
          <h2 className="section-title serif">For Farmers, By Farmers</h2>
          <p className="section-sub">
            Our team includes agricultural experts, data scientists, and farmers who understand the challenges you face.
          </p>
          
          <div style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '👨‍🌾', title: 'Farmers', desc: 'Advising 2.5M+ farmers' },
              { icon: '🔬', title: 'Experts', desc: 'Agricultural scientists' },
              { icon: '💻', title: 'Engineers', desc: 'AI/ML specialists' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="section">
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <h2 className="section-title serif" style={{ marginBottom: '16px' }}>Need Help?</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>
            Our team is available 24/7 to assist you.
          </p>
          <a href="tel:18001801551" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Phone className="w-4 h-4" />
            Call 1800-180-1551
          </a>
        </div>
      </div>
    </div>
  );
}
