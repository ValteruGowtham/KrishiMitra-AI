import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Leaf, Menu, X, Home, MessageSquare, 
  TrendingUp, FileText, Info, Phone, Languages 
} from 'lucide-react';

import HomePage from './pages/HomePage';
import AdvisoryPage from './pages/AdvisoryPage';
import MarketRatesPage from './pages/MarketRatesPage';
import SchemesPage from './pages/SchemesPage';
import AboutPage from './pages/AboutPage';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/advisory', label: 'AI Advisory', icon: <MessageSquare className="w-4 h-4" /> },
    { path: '/market-rates', label: 'Market Rates', icon: <TrendingUp className="w-4 h-4" /> },
    { path: '/schemes', label: 'Schemes', icon: <FileText className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-dark" />
            </div>
            <span className="font-bold text-xl tracking-tight">KrishiMitra AI</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-dark text-white shadow-inner'
                      : 'text-white/80 hover:bg-primary-light hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-dark shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-white/80 hover:bg-primary hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg text-white">KrishiMitra AI</span>
            </div>
            <p className="text-sm">
              Empowering Indian farmers with AI-driven insights for better yield and sustainable practices.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/advisory" className="hover:text-accent transition-colors">AI Advisory</Link></li>
              <li><Link to="/market-rates" className="hover:text-accent transition-colors">Market Rates</Link></li>
              <li><Link to="/schemes" className="hover:text-accent transition-colors">Government Schemes</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-1">
              <Phone className="w-4 h-4" /> Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="flex flex-col">
                  <span className="text-white font-medium">Kisan Helpline</span>
                  <a href="tel:18001801551" className="text-accent hover:underline">1800-180-1551</a>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="text-white font-medium">KVK Support</span>
                  <a href="tel:18004251122" className="text-accent hover:underline">1800-425-1122</a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-1">
              <Languages className="w-4 h-4" /> Languages
            </h3>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-accent transition-colors">English</button></li>
              <li><button className="hover:text-accent transition-colors">हिंदी (Hindi)</button></li>
              <li><button className="hover:text-accent transition-colors">मराठी (Marathi)</button></li>
              <li><button className="hover:text-accent transition-colors">తెలుగు (Telugu)</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} KrishiMitra AI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-surface">
        <Navigation />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/advisory" element={<AdvisoryPage />} />
            <Route path="/market-rates" element={<MarketRatesPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
