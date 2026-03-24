import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Leaf, Menu, X, Home, MessageSquare, TrendingUp, FileText, Info,
  Phone, ChevronRight, Sparkles, Shield, Zap, Globe, Sun, Cloud,
  Droplets, Activity, Mic, Camera, Send, Volume2, CheckCircle,
  AlertCircle, Loader2, User, MapPin, Languages, Search, Filter,
  ExternalLink, Calendar, ArrowRight, Star, Users, Award, Target
} from 'lucide-react';

import HomePage from './pages/HomePage';
import AdvisoryPage from './pages/AdvisoryPage';
import MarketRatesPage from './pages/MarketRatesPage';
import SchemesPage from './pages/SchemesPage';
import AboutPage from './pages/AboutPage';

// Modern Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/advisory', label: 'AI Advisory', icon: MessageSquare },
    { path: '/market-rates', label: 'Mandi Rates', icon: TrendingUp },
    { path: '/schemes', label: 'Schemes', icon: FileText },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/10 border-b border-slate-200/50' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-800 leading-none">KrishiMitra</span>
              <span className="text-xs text-slate-500 font-medium leading-none mt-1">AI Farm Assistant</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Helpline */}
            <a
              href="tel:18001801551"
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-success/30 bg-success/5 text-success hover:bg-success/15 hover:border-success/50 transition-all duration-200"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">1800-180-1551</span>
              <span className="xl:hidden">Helpline</span>
            </a>
            
            {/* CTA Button */}
            <Link
              to="/advisory"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Start Advisory</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div
            id="mobile-nav-drawer"
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 lg:hidden animate-slide-in-right"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-slate-800">KrishiMitra</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="p-5 border-t border-slate-200 space-y-3 bg-slate-50">
                <a
                  href="tel:18001801551"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-semibold border-2 border-success/30 bg-success/5 text-success hover:bg-success/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Kisan Helpline
                </a>
                <Link
                  to="/advisory"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30"
                >
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

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Advisory', path: '/advisory' },
    { label: 'Mandi Rates', path: '/market-rates' },
    { label: 'Schemes', path: '/schemes' },
    { label: 'About Us', path: '/about' },
  ];

  const features = [
    '8 AI Agents',
    'Voice & Photo Input',
    '8 Indian Languages',
    'Real-time Mandi Prices',
    'Weather Forecast',
    'Scheme Matching',
  ];

  const helplines = [
    { name: 'Kisan Helpline', number: '1800-180-1551', desc: 'Free · 24×7', icon: Phone },
    { name: 'KVK Support', number: '1800-425-1122', desc: 'Krishi Vigyan Kendra', icon: Phone },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">KrishiMitra AI</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's most advanced AI-powered agricultural advisory platform. 
              Empowering farmers with real-time, personalized farming insights.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>ISO Certified · Data Secure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                >
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Features</h4>
            <div className="flex flex-col gap-2.5">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-primary-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Helplines */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">24/7 Helplines</h4>
            <div className="flex flex-col gap-4">
              {helplines.map((helpline, i) => {
                const Icon = helpline.icon;
                return (
                  <a key={i} href={`tel:${helpline.number}`} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                        <Icon className="w-4 h-4 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{helpline.name}</p>
                        <p className="text-accent-400 font-bold">{helpline.number}</p>
                        <p className="text-xs text-slate-500">{helpline.desc}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-slate-800 pt-8 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2.5M+', label: 'Farmers Served' },
              { value: '10M+', label: 'Advisories Given' },
              { value: '500+', label: 'Govt Schemes' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} KrishiMitra AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navigation />
        <main className="flex-1 pt-18">
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
