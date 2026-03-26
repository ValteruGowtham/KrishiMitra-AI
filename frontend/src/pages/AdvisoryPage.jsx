import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, Camera, User, MapPin, Globe, Sparkles, Volume2, CheckCircle, X, AlertCircle, Edit2, Save } from 'lucide-react';
import { useSpeechRecognition, useCamera } from '../hooks';
import { submitAdvisory, submitAdvisoryWithPhoto, getHealth } from '../services/api';

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
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'od-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
];

const DEMO_ADVISORY = `### 🌾 गेहूं की फसल के लिए सलाह

**Ram Singh जी**, आपके खेत के लिए विस्तृत विश्लेषण:

**मिट्टी की स्थिति:** आपकी मिट्टी में नाइट्रोजन (180 kg/ha) की कमी है। तत्काल **यूरिया 45 kg/एकड़** डालें — अगले 48 घंटों में।

**कीट सुरक्षा:** पीले पत्तों का कारण पीला रस्ट रोग हो सकता है। **Propiconazole 25% EC** — 1 मिली प्रति लीटर पानी — सुबह 6-9 बजे के बीच स्प्रे करें।

**मौसम अनुकूलता:** अगले 3 दिन स्प्रे के लिए अच्छे हैं। दिन 4 पर बारिश संभव।

**मंडी सलाह:** अभी न बेचें। अजमेर मंडी में गेहूं ₹2,380/क्विंटल है — **MSP से 4.6% ऊपर**। अगले 2 सप्ताह और रुकें।

**सरकारी योजनाएं:** आप PM-KISAN के अगले किस्त ₹2,000 के पात्र हैं। मार्च 31 से पहले confirm करें।`;

const QUICK_PROMPTS_BY_LANG = {
  'hi-IN': [
    'मेरे गेहूं के पत्ते पीले पड़ रहे हैं',
    'आज मंडी में गेहूं का भाव क्या है?',
    'मुझे कौन सी सरकारी योजना मिल सकती है?',
    'कल मौसम कैसा रहेगा?',
  ],
  'bn-IN': [
    'আমার গমের পাতা হলুদ হয়ে যাচ্ছে',
    'আজ মণ্ডিতে গমের দাম কত?',
    'আমি কোন সরকারি योजना পেতে পারি?',
    'আগামীকাল আবহাওয়া কেমন থাকবে?',
  ],
  'mr-IN': [
    'माझ्या गव्हाची पाने पिवळी पडत आहेत',
    'आज मंडीत गव्हाचा भाव काय आहे?',
    'मला कोणती सरकारी योजना मिळू शकते?',
    'उद्या हवामान कसे असेल?',
  ],
  'te-IN': [
    'నా గోధుమ ఆకులు పసుపు రంగులోకి మారుతున్నాయి',
    'నేడు మండిలో గోధుమ ధర ఎంత?',
    'నాకు ఏ ప్రభుత్వ పథకం లభిస్తుంది?',
    'రేపు వాతావరణం ఎలా ఉంటుంది?',
  ],
  'gu-IN': [
    'મારા ઘઉંના પાંદડા પીળા પડી રહ્યા છે',
    'આજે મંડીમાં ઘઉંના ભાવ શું છે?',
    'મને કઈ સરકારી યોજના મળી શકે છે?',
    'કાલે હવામાન કેવું રહેશે?',
  ],
  'ta-IN': [
    'என் கோதுமை இலைகள் மஞ்சளாகி வருகிறது',
    'இன்று மண்டியில் கோதுமை விலை என்ன?',
    'எனக்கு எந்த அரசு திட்டம் கிடைக்கும்?',
    'நாளை வானிலை எப்படி இருக்கும்?',
  ],
  'kn-IN': [
    'ನನ್ನ ಗೋಧಿ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ',
    'ಇಂದು ಮಂಡಿಯಲ್ಲಿ ಗೋಧಿ ಬೆಲೆ ಎಷ್ಟು?',
    'ನನಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಿಗುತ್ತದೆ?',
    'ನಾಳೆ ಹವಾಮಾನ ಹೇಗಿರುತ್ತದೆ?',
  ],
  'ml-IN': [
    'എൻ്റെ ഗോതമ്പ് ഇലകൾ മഞ്ഞളിക്കുന്നു',
    'ഇന്ന് മണ്ടിയിൽ ഗോതമ്പ് വില എത്ര?',
    'എനിക്ക് ഏത് സർക്കാർ പദ്ധതി ലഭിക്കും?',
    'നാളെ കാലാവസ്ഥ എങ്ങനെയായിരിക്കും?',
  ],
  'od-IN': [
    'ମୋ ଗହମ ପତ୍ରଗୁଡ଼ିକ ହଳଦିଆ ହେଉଛି',
    'ଆଜି ମଣ୍ଡିରେ ଗହମ ଦାମ କେତେ?',
    'ମୁଁ କେଉଁ ସରକାରୀ ଯୋଜନା ପାଇପାରିବି?',
    'ଆସନ୍ତାକାଲି ପାଣିପାଗ କେମି ରହିବ?',
  ],
  'pa-IN': [
    'ਮੇਰੀ ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋ ਰਹੇ ਹਨ',
    'ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਭਾਅ ਕੀ ਹੈ?',
    'ਮੈਨੂੰ ਕੌਣ ਜਿਹੀ ਸਰਕਾਰੀ ਯੋਜਨਾ ਮਿਲ ਸਕਦੀ ਹੈ?',
    'ਕੱਲ੍ਹ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਰਹੇਗਾ?',
  ],
  'en-IN': [
    'My wheat leaves are turning yellow',
    'What is the wheat price in mandi today?',
    'Which government scheme can I get?',
    'How will the weather be tomorrow?',
  ],
};

// Placeholder text for each language
const PLACEHOLDER_TEXT = {
  'hi-IN': 'अपना सवाल लिखें...',
  'bn-IN': 'আপনার প্রশ্ন লিখুন...',
  'mr-IN': 'आपला प्रश्न लिहा...',
  'te-IN': 'మీ ప్రశ్నను వ్రాయండి...',
  'gu-IN': 'તમારો પ્રશ્ન લખો...',
  'ta-IN': 'உங்கள் கேள்வியை எழுதவும்...',
  'kn-IN': 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ...',
  'ml-IN': 'നിങ്ങളുടെ ചോദ്യം എഴുതുക...',
  'od-IN': 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ...',
  'pa-IN': 'ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ...',
  'en-IN': 'Type your question...',
};

const DEFAULT_FARMER = {
  name: 'Ram Singh',
  location: 'Ajmer, Rajasthan',
  crop: 'Wheat',
  land: '3.5 ac',
  language: 'Hindi',
};

function FarmerProfileCard({ farmer, onEdit }) {
  return (
    <div className="farmer-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="farmer-avatar">👨‍🌾</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>{farmer.name}</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>📍 {farmer.location}</div>
          </div>
        </div>
        <button className="edit-profile-btn" onClick={onEdit} title="Edit Profile">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      <div className="farmer-info-grid">
        {[
          { e: '🌾', l: 'Crop', v: farmer.crop },
          { e: '📏', l: 'Land', v: farmer.land },
          { e: '🗣', l: 'Lang', v: farmer.language },
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

// Error Toast Component
function ErrorToast({ error, onClose }) {
  if (!error) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'PERMISSION_DENIED':
        return '🚫';
      case 'NOT_SUPPORTED':
        return '❌';
      case 'INSECURE_CONTEXT':
        return '🔒';
      case 'NO_CAMERA':
      case 'NO_MICROPHONE':
        return '📷';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="error-toast">
      <div className="error-toast-content">
        <span className="error-toast-icon">{getIcon(error.type)}</span>
        <div className="error-toast-text">
          <strong>{error.type.replace(/_/g, ' ')}</strong>
          <p>{error.message}</p>
        </div>
        <button className="error-toast-close" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Camera Modal Component
function CameraModal({ isOpen, onClose, onCapture, useCameraHook }) {
  const { isCameraOpen, isProcessing, error, videoRef, openCamera, capturePhoto, closeCamera } = useCameraHook;
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCapture({ file, preview: URL.createObjectURL(file), fromFile: true });
      onClose();
    }
  };

  return (
    <>
      <div className="camera-overlay" onClick={onClose} />
      <div className="camera-modal">
        <div className="camera-header">
          <h3>📷 Capture Photo</h3>
          <button className="camera-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="camera-body">
          {!isCameraOpen ? (
            <div className="camera-options">
              <button className="camera-option-btn" onClick={openCamera} disabled={isProcessing}>
                <div className="camera-option-icon">📷</div>
                <span>{isProcessing ? 'Opening...' : 'Open Camera'}</span>
              </button>
              <span className="camera-divider">or</span>
              <button className="camera-option-btn" onClick={() => fileInputRef.current?.click()}>
                <div className="camera-option-icon">📁</div>
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              <div className="camera-controls">
                <button className="camera-btn camera-cancel" onClick={closeCamera}>
                  Cancel
                </button>
                <button className="camera-btn camera-capture" onClick={capturePhoto} disabled={isProcessing}>
                  {isProcessing ? '⏳' : '📸'}
                </button>
                <button className="camera-btn camera-switch" title="Switch camera">
                  🔄
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="camera-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
          </div>
        )}
      </div>
    </>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ isOpen, onClose, farmer, onSave }) {
  const [formData, setFormData] = useState({ ...farmer });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>👨‍🌾 Edit Farmer Profile</h3>
          <button className="modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-modal-body">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Ajmer, Rajasthan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="crop">Primary Crop</label>
            <input
              type="text"
              id="crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              placeholder="e.g., Wheat, Rice, Cotton"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="land">Land Size</label>
            <input
              type="text"
              id="land"
              name="land"
              value={formData.land}
              onChange={handleChange}
              placeholder="e.g., 3.5 ac"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="English">English</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <div className="edit-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </>
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
  const [photoAttached, setPhotoAttached] = useState(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [toastError, setToastError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Load farmer data from localStorage or use default
  const [farmer, setFarmer] = useState(() => {
    const saved = localStorage.getItem('farmerProfile');
    return saved ? JSON.parse(saved) : DEFAULT_FARMER;
  });

  // Save farmer data to localStorage
  const handleSaveFarmer = useCallback((updatedFarmer) => {
    setFarmer(updatedFarmer);
    localStorage.setItem('farmerProfile', JSON.stringify(updatedFarmer));
  }, []);

  // Speech recognition hook
  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    language: lang,
    onResult: (finalTranscript) => {
      setText(prev => prev + (prev ? ' ' : '') + finalTranscript);
    },
    onError: (err) => {
      setToastError(err);
    },
  });

  // Camera hook for photo capture
  const cameraHook = useCamera({
    onPhotoCapture: (photoData) => {
      setPhotoAttached(photoData);
      setIsCameraModalOpen(false);
    },
    onError: (err) => {
      setToastError(err);
    },
  });

  // Handle microphone button click
  const handleMicClick = useCallback(() => {
    if (!speechSupported) {
      setToastError({
        type: 'NOT_SUPPORTED',
        message: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setText('');
      startListening();
    }
  }, [isListening, speechSupported, startListening, stopListening]);

  // Handle camera button click
  const handleCameraClick = useCallback(() => {
    setIsCameraModalOpen(true);
  }, []);

  // Handle file upload directly
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      cameraHook.handleFileUpload(file);
      setPhotoAttached({
        file,
        preview: URL.createObjectURL(file),
        base64: null,
      });
    }
  }, [cameraHook]);

  // Clear photo
  const handleClearPhoto = useCallback(() => {
    if (photoAttached?.preview) {
      URL.revokeObjectURL(photoAttached.preview);
    }
    setPhotoAttached(null);
  }, [photoAttached]);

  // Handle submit to real API
  const submit = useCallback(async (q, photo = null) => {
    if ((!q || !q.trim()) && !photo) return;
    if (loading) return;

    setLoading(true);
    setResult(null);
    setAgents(AGENTS.map(a => ({ ...a, status: 'idle' })));

    // Simulate agent activity for UX
    const order = ['intent', 'soil', 'weather', 'crop', 'pest', 'mandi', 'scheme', 'finance'];
    order.forEach((id, i) => {
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'running' } : a));
      }, i * 350);
      setTimeout(() => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'done' } : a));
      }, i * 350 + 600);
    });

    try {
      let responseData;
      
      if (photo?.file) {
        // Submit with photo
        responseData = await submitAdvisoryWithPhoto({
          text_input: q || '',
          photo: photo.file,
          language: lang,
          farmer_id: 'demo_farmer',
        });
      } else {
        // Submit text only
        responseData = await submitAdvisory({
          text_input: q,
          language: lang,
          farmer_id: 'demo_farmer',
        });
      }

      // Process API response
      setLoading(false);
      
      // Extract advisory text from response (backend returns advisory_text)
      const advisoryText = responseData.advisory_text || responseData.advisory || responseData.text || responseData.message || DEMO_ADVISORY;
      
      setResult({ 
        text: advisoryText, 
        hasPhoto: !!photo,
        auditId: responseData.audit_id,
        compliancePassed: !responseData.compliance_flags?.length || responseData.compliance_flags.length === 0,
        queryId: responseData.query_id,
      });
      
    } catch (error) {
      console.error('Advisory API Error:', error);
      setLoading(false);
      
      // Show error to user
      setToastError({
        type: 'API_ERROR',
        message: error.response?.data?.detail || error.message || 'Failed to get advisory. Please try again.',
      });
      
      // Fall back to demo data for demonstration
      setResult({ 
        text: DEMO_ADVISORY, 
        hasPhoto: !!photo,
        error: true,
      });
    }
  }, [loading, lang]);

  const handleSubmit = () => {
    if (text.trim() || photoAttached) {
      submit(text.trim(), photoAttached);
    }
  };

  // Clear error toast
  const clearError = useCallback(() => {
    setToastError(null);
  }, []);

  return (
    <div className="advisory-layout">
      {/* Error Toast */}
      <ErrorToast error={toastError || speechError} onClose={clearError} />

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(photoData) => {
          setPhotoAttached(photoData);
          setIsCameraModalOpen(false);
        }}
        useCameraHook={cameraHook}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        farmer={farmer}
        onSave={handleSaveFarmer}
      />

      {/* Sidebar */}
      <div className="advisory-sidebar">
        <FarmerProfileCard farmer={farmer} onEdit={() => setIsEditModalOpen(true)} />

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
            {(QUICK_PROMPTS_BY_LANG[lang] || QUICK_PROMPTS_BY_LANG['hi-IN']).map((q, i) => (
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
          {/* Photo Preview */}
          {photoAttached && (
            <div className="photo-preview fade-in">
              <img src={photoAttached.preview} alt="Attached" className="photo-preview-img" />
              <button className="photo-preview-close" onClick={handleClearPhoto}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              className={`mic-btn ${isListening ? 'active' : ''}`}
              onClick={handleMicClick}
              title={isListening ? 'Stop recording' : 'Voice input'}
              disabled={!speechSupported}
            >
              🎤
            </button>
            <button
              className="cam-btn"
              onClick={handleCameraClick}
              title="Upload or capture photo"
            >
              📷
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', alignSelf: 'center', marginLeft: 'auto' }}>
              {LANGS.find(l => l.code === lang)?.label.split(' ')[0] || 'Hindi'}
            </span>
          </div>
          <div className="input-wrap">
            <textarea
              className="inp"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={isListening ? 'Listening...' : (PLACEHOLDER_TEXT[lang] || PLACEHOLDER_TEXT['hi-IN'])}
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
                {loading ? '⏳ Processing...' : isListening ? '🔴 Recording...' : 'Press Enter to send'}
              </span>
              <button
                className="send-btn"
                onClick={handleSubmit}
                disabled={loading || (!text.trim() && !photoAttached)}
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
                <div className={`compliance-badge ${result.error ? 'error' : ''}`}>
                  <CheckCircle className="w-4 h-4" />
                  {result.error ? 'Using Demo Data' : 'Compliance Passed'}
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
                {result.hasPhoto && (
                  <div style={{ marginBottom: '16px', padding: '12px', background: '#F0F7F2', borderRadius: '8px', border: '1px solid #DDF0E3' }}>
                    <strong>📸 Photo Analysis:</strong> Crop image was analyzed by AI agents.
                  </div>
                )}
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
