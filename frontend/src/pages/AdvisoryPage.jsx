import { useState, useCallback } from 'react';
import { Mic, Camera, User, MapPin, Globe, Sparkles, Volume2, CheckCircle } from 'lucide-react';

const AGENTS = [
  { id: 'soil', name: 'Soil', emoji: '🌱', desc: 'NPK & pH analysis' },
  { id: 'crop', name: 'Crop', emoji: '🌾', desc: 'Growth stage tips' },
  { id: 'pest', name: 'Pest', emoji: '🐛', desc: 'Disease diagnosis' },
  { id: 'weather', name: 'Weather', emoji: '🌤', desc: '5-day forecast' },
  { id: 'mandi', name: 'Market', emoji: '📈', desc: 'Live mandi prices' },
  { id: 'scheme', name: 'Schemes', emoji: '📋', desc: 'Govt. programs' },
  { id: 'finance', name: 'Finance', emoji: '💳', desc: 'Credit & loans' },
  { id: 'intent', name: 'Intent', emoji: '🎙', desc: 'Language detect' },
];

const LANGS = [
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'en-IN', label: 'English' },
  { code: 'mr-IN', label: 'मराठी' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'gu-IN', label: 'ગુજ' },
];

const DEMO_ADVISORY = `### 🌾 गेहूं की फसल के लिए सलाह

**Ram Singh जी**, आपके खेत के लिए विस्तृत विश्लेषण:

**मिट्टी की स्थिति:** आपकी मिट्टी में नाइट्रोजन (180 kg/ha) की कमी है। तत्काल **यूरिया 45 kg/एकड़** डालें — अगले 48 घंटों में।

**कीट सुरक्षा:** पीले पत्तों का कारण पीला रस्ट रोग हो सकता है। **Propiconazole 25% EC** — 1 मिली प्रति लीटर पानी — सुबह 6-9 बजे के बीच स्प्रे करें।

**मौसम अनुकूलता:** अगले 3 दिन स्प्रे के लिए अच्छे हैं। दिन 4 पर बारिश संभव।

**मंडी सलाह:** अभी न बेचें। अजमेर मंडी में गेहूं ₹2,380/क्विंटल है — **MSP से 4.6% ऊपर**। अगले 2 सप्ताह और रुकें।

**सरकारी योजनाएं:** आप PM-KISAN के अगले किस्त ₹2,000 के पात्र हैं। मार्च 31 से पहले confirm करें।`;

const QUICK_PROMPTS = [
  'मेरे गेहूं के पत्ते पीले पड़ रहे हैं',
  'आज मंडी में गेहूं का भाव क्या है?',
  'मुझे कौन सी सरकारी योजना मिल सकती है?',
  'कल मौसम कैसा रहेगा?',
];

function FarmerProfileCard() {
  return (
    <div className="farmer-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="farmer-avatar">👨‍🌾</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px' }}>Ram Singh</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>📍 Ajmer, Rajasthan</div>
        </div>
      </div>
      <div className="farmer-info-grid">
        {[
          { e: '🌾', l: 'Crop', v: 'Wheat' },
          { e: '📏', l: 'Land', v: '3.5 ac' },
          { e: '🗣', l: 'Lang', v: 'Hindi' },
        ].map((f, i) => (
          <div key={i} className="fi-cell">
            <div className="fi-emoji">{f.e}</div>
            <div className="fi-label">{f.l}</div>
            <div className="fi-val">{f.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderMarkdown(md) {
  const lines = md.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('###')) {
      return <h3 key={i}>{line.slice(4)}</h3>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
    }
    if (line.match(/\*\*(.*?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/);
      return (
        <p key={i}>
          {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
        </p>
      );
    }
    if (line.trim()) {
      return <p key={i}>{line}</p>;
    }
    return null;
  }).filter(Boolean);
}

export default function AdvisoryPage() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('hi-IN');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agents, setAgents] = useState(AGENTS.map(a => ({ ...a, status: 'idle' })));

  const submit = useCallback((q) => {
    if (!q || loading) return;
    setLoading(true);
    setResult(null);
    setAgents(AGENTS.map(a => ({ ...a, status: 'idle' })));
    
    const order = ['intent', 'soil', 'weather', 'crop', 'pest', 'mandi', 'scheme', 'finance'];
    order.forEach((id, i) => {
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'running' } : a));
      }, i * 350);
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'done' } : a));
      }, i * 350 + 600);
    });
    
    setTimeout(() => {
      setLoading(false);
      setResult({ text: DEMO_ADVISORY });
    }, order.length * 350 + 700);
  }, [loading]);

  const handleSubmit = () => {
    if (text.trim()) submit(text.trim());
  };

  return (
    <div className="advisory-layout">
      {/* Sidebar */}
      <div className="advisory-sidebar">
        <FarmerProfileCard />
        
        {/* Language */}
        <div>
          <div className="sidebar-title">Language / भाषा</div>
          <div className="lang-chips">
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`lang-chip ${lang === l.code ? 'sel' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Prompts */}
        <div>
          <div className="sidebar-title">Quick Questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {QUICK_PROMPTS.map((q, i) => (
              <button
                key={i}
                className="quick-btn"
                onClick={() => {
                  setText(q);
                  setTimeout(() => submit(q), 100);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div className="mic-btn" title="Voice input">🎤</div>
            <div className="cam-btn" title="Camera">📷</div>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', alignSelf: 'center' }}>
              {lang === 'hi-IN' ? 'Hindi' : 'English'}
            </span>
          </div>
          <div className="input-wrap">
            <textarea
              className="inp"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="अपना सवाल लिखें... or type in English"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={3}
            />
            <div className="input-footer">
              <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                {loading ? '⏳ Processing...' : 'Press Enter to send'}
              </span>
              <button
                className="send-btn"
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
              >
                {loading ? '⏳ Running...' : 'Send ↗'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="advisory-main">
        {/* Pipeline */}
        <div className="pipeline">
          <div className="pipeline-title">⚡ Agent Pipeline</div>
          <div className="pipeline-row">
            {agents.map(a => (
              <div key={a.id} className={`agent-pill ${a.status}`}>
                <div className={`agent-dot ${a.status === 'running' ? 'spin' : ''}`}></div>
                {a.emoji} {a.name}
                {a.status === 'done' && <span className="pct">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="output-area">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🌿</div>
              <h3 className="empty-title">Ask KrishiMitra</h3>
              <p className="empty-sub">
                Type a question, speak, or upload a crop photo. Eight AI agents will analyze and respond.
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                {['Soil 🌱', 'Pest 🐛', 'Market 📊', 'Weather 🌤'].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--color-wheat)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'var(--color-sage)',
                      fontWeight: '600',
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-wrap">
              <div className="loading-ring"></div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--color-forest)' }}>
                Analyzing your query...
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                {agents.filter(a => a.status === 'running').map(a => a.name).join(', ') || 'Starting up'}
              </div>
            </div>
          )}

          {result && (
            <div className="result-card fade-in">
              <div className="result-header">
                <div className="compliance-badge">
                  <CheckCircle className="w-4 h-4" />
                  Compliance Passed
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className="lang-toggle">
                    <button className="lt-btn active">हिंदी</button>
                    <button className="lt-btn">EN</button>
                  </div>
                  <button className="listen-btn">
                    <Volume2 className="w-4 h-4" />
                    Listen
                  </button>
                </div>
              </div>
              <div className="result-body">
                {renderMarkdown(result.text)}
              </div>
              <div className="scheme-strip">
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C5C0A', marginRight: '4px' }}>
                  📋 Eligible:
                </span>
                {['PM-KISAN ₹2,000 pending', 'PM Fasal Bima', 'KCC @ 4%'].map((s, i) => (
                  <span key={i} className="s-chip">{s}</span>
                ))}
              </div>
              <div className="result-footer">
                <span className="rf-text">
                  ⚡ Powered by 8 AI Agents · Multi-agent Orchestration
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
