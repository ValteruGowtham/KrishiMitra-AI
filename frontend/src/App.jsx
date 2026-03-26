import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Sparkles, Phone } from 'lucide-react';

import HomePage from './pages/HomePage';
import AdvisoryPage from './pages/AdvisoryPage';
import MarketRatesPage from './pages/MarketRatesPage';
import SchemesPage from './pages/SchemesPage';
import AboutPage from './pages/AboutPage';
import ApiStatusPage from './pages/ApiStatusPage';
import WeatherPage from './pages/WeatherPage';

// Navigation Component - Redesigned
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/advisory', label: 'AI Advisory' },
    { path: '/market-rates', label: 'Mandi Rates' },
    { path: '/schemes', label: 'Schemes' },
    { path: '/weather', label: 'Weather' },
  ];

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">🌿</div>
        KrishiMitra
      </Link>
      
      <div className="nav-links">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link to="/advisory" className="nav-cta">
        Start Advisory →
      </Link>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-xl"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-forest/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface shadow-2xl z-50 lg:hidden animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-forest flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-forest">KrishiMitra</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {links.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === link.path
                        ? 'bg-forest text-white'
                        : 'text-muted hover:bg-cream'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="p-5 border-t border-border space-y-3 bg-cream">
                <a href="tel:18001801551" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-success/30 bg-success/5 text-success">
                  <Phone className="w-5 h-5" />
                  Call Kisan Helpline
                </a>
                <Link to="/advisory" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gold text-white">
                  <Sparkles className="w-5 h-5" />
                  Start AI Advisory
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

// Footer Component - Redesigned
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Advisory', path: '/advisory' },
    { label: 'Mandi', path: '/market-rates' },
    { label: 'Schemes', path: '/schemes' },
    { label: 'Weather', path: '/weather' },
    { label: 'About', path: '/about' },
  ];

  return (
    <div className="footer">
      <div className="footer-logo">🌿 KrishiMitra AI</div>
      <div className="footer-links">
        {footerLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="footer-link"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="footer-help">📞 Kisan Helpline: 1800-180-1551 (Free 24/7)</div>
      <div>© {currentYear} KrishiMitra AI · Empowering Indian Farmers</div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/advisory" element={<AdvisoryPage />} />
            <Route path="/market-rates" element={<MarketRatesPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/api-status" element={<ApiStatusPage />} />
            <Route path="/weather" element={<WeatherPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
