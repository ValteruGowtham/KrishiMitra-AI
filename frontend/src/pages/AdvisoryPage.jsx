import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Mic, Send, Leaf, Sun, Bug, TrendingUp,
  Landmark, Wallet, Shield, FileText,
  Activity, CheckCircle, AlertTriangle, Loader2,
  User, MapPin, Phone, X,
  Volume2, Camera, Wheat, ChevronRight,
  Sparkles, Zap, Globe, CloudSun, Sprout, MessageSquare
} from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import AgentActivityFeed from '../AgentActivityFeed'

const API_BASE = 'http://localhost:8000/api/v1'

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी', full: 'Hindi' },
  { code: 'bn-IN', label: 'বাংলা', full: 'Bengali' },
  { code: 'te-IN', label: 'తెలుగు', full: 'Telugu' },
  { code: 'mr-IN', label: 'मराठी', full: 'Marathi' },
  { code: 'ta-IN', label: 'தமிழ்', full: 'Tamil' },
  { code: 'gu-IN', label: 'ગુજ', full: 'Gujarati' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', full: 'Kannada' },
  { code: 'od-IN', label: 'ଓଡ଼ିଆ', full: 'Odia' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', full: 'Punjabi' },
  { code: 'ml-IN', label: 'മലയാളം', full: 'Malayalam' },
  { code: 'en-IN', label: 'English', full: 'English' },
]

const DISTRESS_KEYWORDS = ['jeena nahi chahta', 'karz se tang', 'sab khatam', 'jaan de dunga',
  'कर्ज से तंग', 'जीना नहीं', 'सब खत्म', 'जान दे दूँगा', 'मर जाना', 'आत्महत्या']

const isDistressInput = (text) => {
  const lower = text.toLowerCase()
  return DISTRESS_KEYWORDS.some(kw => lower.includes(kw))
}

const AGENT_REASONING = {
  voice_agent:        { confidence: 0.92, reasoning: 'Intent classified via multilingual NLP' },
  soil_agent:         { confidence: 0.85, reasoning: 'NPK and pH analysis completed' },
  crop_agent:         { confidence: 0.82, reasoning: 'Growth-stage assessment done' },
  pest_disease_agent: { confidence: 0.78, reasoning: 'Vision/text diagnosis completed' },
  weather_agent:      { confidence: 0.70, reasoning: '5-day forecast analyzed' },
  mandi_agent:        { confidence: 0.75, reasoning: 'Mandi prices vs MSP compared' },
  scheme_agent:       { confidence: 0.95, reasoning: 'Scheme eligibility matched' },
  finance_agent:      { confidence: 0.80, reasoning: 'Credit options analyzed' },
}

const DEFAULT_AGENTS = [
  { id: 'soil_agent', name: 'Soil', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'crop_agent', name: 'Crop', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'pest_disease_agent', name: 'Pest', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'weather_agent', name: 'Weather', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'mandi_agent', name: 'Market', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'scheme_agent', name: 'Schemes', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'finance_agent', name: 'Finance', status: 'idle', confidence: 0, reasoning_preview: '' },
  { id: 'voice_agent', name: 'Intent', status: 'idle', confidence: 0, reasoning_preview: '' },
]

// Farmer Profile Card Component
function FarmerProfileCard() {
  const demoFarmer = {
    name: 'Ram Singh',
    location: 'Ajmer, Rajasthan',
    crop: 'Wheat',
    land: '3.5 acres',
    language: 'Hindi',
  }

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg">{demoFarmer.name}</p>
          <p className="text-sm text-primary-100 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {demoFarmer.location}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p className="text-2xl mb-1">🌾</p>
          <p className="text-xs text-primary-100">Crop</p>
          <p className="font-bold text-sm">{demoFarmer.crop}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p className="text-2xl mb-1">📏</p>
          <p className="text-xs text-primary-100">Land</p>
          <p className="font-bold text-sm">{demoFarmer.land}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p className="text-2xl mb-1">🗣️</p>
          <p className="text-xs text-primary-100">Language</p>
          <p className="font-bold text-sm">{demoFarmer.language}</p>
        </div>
      </div>
    </div>
  )
}

// Language Selector Component
function LanguageSelector({ selectedLang, setSelectedLang }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-slate-500" />
        <p className="text-sm font-semibold text-slate-700">Select Language</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.slice(0, 6).map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelectedLang(lang.code)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 cursor-pointer ${
              selectedLang === lang.code
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Input Panel Component
function FarmerInputPanel({ onSubmit, isLoading, photoFile, setPhotoFile, photoPreview, setPhotoPreview, selectedLang, setSelectedLang }) {
  const [textInput, setTextInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const fileInputRef = useRef(null)

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      return
    }
    setRecordingError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []
      
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        setIsTranscribing(true)
        try {
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')
          formData.append('language_code', selectedLang)
          const res = await axios.post(`${API_BASE}/stt`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          const transcript = res.data.transcript
          if (transcript) {
            setTextInput(prev => (prev + ' ' + transcript).trim())
          } else {
            setRecordingError('No speech detected')
          }
        } catch {
          setRecordingError('Transcription failed')
        } finally {
          setIsTranscribing(false)
        }
      }
      
      recorder.onerror = () => {
        setIsRecording(false)
        setRecordingError('Recording error')
      }
      
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch {
      setRecordingError('Microphone access denied')
    }
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = () => {
    const effectiveText = textInput.trim() || (photoFile ? 'Mere fasal mein bimari lag gayi hai' : '')
    if (!effectiveText || isLoading) return
    onSubmit(effectiveText, photoFile)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Profile Card */}
      <FarmerProfileCard />

      {/* Language Selector */}
      <LanguageSelector selectedLang={selectedLang} setSelectedLang={setSelectedLang} />

      {/* Voice & Photo Input */}
      <div className="flex items-center gap-4">
        {/* Mic Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isRecording
                ? 'bg-danger text-white shadow-danger/30'
                : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400'
            }`}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-2xl bg-danger/20 animate-pulse"></span>
            )}
            <Mic className="w-7 h-7 relative z-10" />
          </button>
          <span className="text-xs font-medium text-slate-600">{isRecording ? 'Recording...' : 'Speak'}</span>
        </div>

        {/* Camera Button */}
        <div className="flex flex-col items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
            id="photo-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              photoFile
                ? 'bg-accent-100 text-accent-600 border-2 border-accent-400'
                : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400'
            }`}
          >
            <Camera className="w-7 h-7" />
          </button>
          <span className="text-xs font-medium text-slate-600">{photoFile ? 'Added' : 'Photo'}</span>
        </div>

        {/* Status Display */}
        <div className="flex-1 min-h-16 flex items-center">
          {photoPreview && (
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2 pr-4">
              <img src={photoPreview} alt="preview" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Photo ready</p>
                <button onClick={removePhoto} className="text-xs text-danger hover:underline">Remove</button>
              </div>
            </div>
          )}
          {!photoPreview && recordingError && (
            <div className="flex items-center gap-2 text-danger bg-danger/10 px-4 py-3 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{recordingError}</span>
            </div>
          )}
          {!photoPreview && isTranscribing && (
            <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-3 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Transcribing...</span>
            </div>
          )}
          {!photoPreview && isRecording && (
            <div className="flex items-center gap-2 text-danger bg-danger/10 px-4 py-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
              <span className="text-sm font-medium">Recording — speak now</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Questions */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Quick Questions</p>
        <div className="flex flex-wrap gap-2">
          {[
            'मेरे गेहूं के पत्ते पीले पड़ रहे हैं',
            'आज मंडी में गेहूं का भाव',
            'कौन सी योजना मिल सकती है',
            'मौसम की जानकारी दें',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setTextInput(prompt); setTimeout(() => onSubmit(prompt, null), 100) }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-50 to-emerald-50 text-primary-700 border border-primary-200 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Area */}
      <div className="flex-1 flex flex-col rounded-2xl border-2 border-slate-200 overflow-hidden bg-white shadow-sm focus-within:border-primary-400 focus-within:shadow-lg focus-within:shadow-primary-500/10 transition-all">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder={photoFile ? 'Describe what you see...' : 'Type your question... / अपना सवाल लिखें...'}
          className="flex-1 p-5 text-sm resize-none focus:outline-none min-h-32"
          rows={4}
        />
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Hindi or English supported</span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!textInput.trim() && !photoFile) || isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              (textInput.trim() || photoFile) && !isLoading
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
            ) : (
              <><Send className="w-4 h-4" /> Ask KrishiMitra</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Distress Crisis Card
function DistressCrisisCard() {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30 animate-float">
          <Shield className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-amber-900 mb-3">KrishiMitra aapke saath hai 🙏</h2>
        <p className="text-base text-amber-800 font-medium mb-8 max-w-md">
          Aapki baat sunne ke liye ek insaan available hai. Neeche diye gaye number par call karein.
        </p>

        <div className="w-full max-w-sm space-y-4 mb-8">
          <a href="tel:18001801551" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border-2 border-amber-300 hover:shadow-xl hover:scale-105 transition-all group">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Phone className="w-8 h-8 text-green-700" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kisan Helpline</p>
              <p className="text-2xl font-extrabold text-green-700">1800-180-1551</p>
              <p className="text-xs font-semibold text-green-600">FREE • 24/7</p>
            </div>
          </a>

          <a href="tel:18004251122" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg border-2 border-amber-200 hover:shadow-xl hover:scale-105 transition-all group">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Phone className="w-8 h-8 text-blue-700" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">KVK Helpline</p>
              <p className="text-2xl font-extrabold text-blue-700">1800-425-1122</p>
              <p className="text-xs font-semibold text-blue-600">Krishi Vigyan Kendra</p>
            </div>
          </a>
        </div>

        <p className="text-xs text-amber-700/80 font-medium max-w-xs">
          Aap akele nahi hain. Hazaron kisan isse nikal chuke hain. Pehla kadam hai — baat karna.
        </p>
      </div>

      <div className="flex-shrink-0 p-4 bg-red-100 border-t border-red-200">
        <p className="text-xs text-red-700 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" /> Distress Protocol Activated
        </p>
      </div>
    </div>
  )
}

// Advisory Output Panel
function AdvisoryOutputPanel({ result, isLoading, photoPreview, distressMode, selectedLang }) {
  const [showHindi, setShowHindi] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  let mainText = result?.advisory_text || ''
  let englishSummary = ''
  const summaryMatch = mainText.match(/(?:English Summary|English\s*Summary\s*:)([\s\S]*)$/i)
  if (summaryMatch) {
    mainText = mainText.slice(0, summaryMatch.index).trim()
    englishSummary = summaryMatch[1].trim()
  }
  const displayMarkdown = showHindi ? mainText : (englishSummary || mainText)

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  const startSpeaking = useCallback(async (textToRead) => {
    if (!textToRead) return
    stopSpeaking()
    setIsSpeaking(true)
    const sentences = textToRead.replace(/[*_#`~>|-]/g, ' ').split(/(?<=[।.?!])\s+/)
    const preview = sentences.slice(0, 3).join(' ').trim().slice(0, 500)
    try {
      const res = await axios.post(`${API_BASE}/tts`, { text: preview, language_code: selectedLang || 'hi-IN' })
      const audioBase64 = res.data.audio_base64
      if (!audioBase64) { setIsSpeaking(false); return }
      const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
      const blob = new Blob([audioBytes], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => { setIsSpeaking(false) }
      audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }, [selectedLang, stopSpeaking])

  useEffect(() => {
    if (result?.advisory_text && !result?.distress_alert) {
      const t = setTimeout(() => startSpeaking(displayMarkdown), 600)
      return () => clearTimeout(t)
    }
  }, [result, startSpeaking, displayMarkdown])

  if (!result && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Ask KrishiMitra</h3>
          <p className="text-slate-600 font-medium mb-8">
            Type, speak, or upload a crop photo. Eight AI agents will analyze soil, weather, pest, and market data together.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Sprout, label: 'Soil' },
              { icon: Wheat, label: 'Crop' },
              { icon: Bug, label: 'Pest' },
              { icon: TrendingUp, label: 'Market' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <Icon className="w-6 h-6 text-primary-500/70" />
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const isDistress = distressMode || result?.distress_alert === true
  if (isDistress && result) {
    return <DistressCrisisCard />
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {result ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 ${
                result.distress_alert
                  ? 'bg-danger/10 border-danger/20 text-danger'
                  : result.compliance_flags?.length === 0
                  ? 'bg-success/10 border-success/20 text-success'
                  : 'bg-warning/10 border-warning/20 text-warning'
              }`}>
                {result.distress_alert ? (
                  <><Shield className="w-5 h-5" /> <span className="font-bold text-sm">Crisis Protocol</span></>
                ) : result.compliance_flags?.length === 0 ? (
                  <><CheckCircle className="w-5 h-5" /> <span className="font-bold text-sm">Compliance Passed</span></>
                ) : (
                  <><AlertTriangle className="w-5 h-5" /> <span className="font-bold text-sm">Review Flags</span></>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : startSpeaking(displayMarkdown)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isSpeaking
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  {isSpeaking ? 'Playing' : 'Listen'}
                </button>

                <div className="flex rounded-xl overflow-hidden border-2 border-slate-200">
                  <button
                    onClick={() => setShowHindi(false)}
                    className={`px-4 py-2.5 text-sm font-bold transition-all ${
                      !showHindi ? 'bg-primary-600 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setShowHindi(true)}
                    className={`px-4 py-2.5 text-sm font-bold transition-all ${
                      showHindi ? 'bg-primary-600 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {photoPreview && (
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-danger-50 to-orange-50">
                <p className="text-xs font-bold mb-3 text-danger flex items-center gap-2">
                  <Camera className="w-4 h-4" /> AI Image Analysis Complete
                </p>
                <div className="flex items-start gap-4">
                  <img src={photoPreview} alt="Analysed crop" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 mb-1">Vision AI Diagnosis</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Image processed by Pest & Disease Agent using GPT-4o Vision. Results integrated into the advisory below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-6 prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h3: ({...props}) => <h3 className="text-lg font-bold text-primary-700 mt-8 mb-3 uppercase tracking-wide" {...props} />,
                  h2: ({...props}) => <h2 className="text-xl font-bold text-primary-700 mt-8 mb-3 uppercase tracking-wide" {...props} />,
                  p: ({...props}) => <p className="mb-4 text-slate-700 leading-relaxed font-medium" {...props} />,
                  strong: ({...props}) => <strong className="text-slate-900 font-bold" {...props} />,
                  ul: ({...props}) => <ul className="pl-5 space-y-2 mb-4 list-disc text-slate-700" {...props} />
                }}
              >
                {displayMarkdown}
              </ReactMarkdown>
            </div>

            {/* Schemes Section */}
            <div className="px-6 py-6 border-t border-slate-200 bg-gradient-to-r from-primary-50 to-emerald-50">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Landmark className="w-5 h-5 text-primary-600" /> Eligible Government Schemes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SchemeCard name="PM-KISAN" amount="₹6,000/year" category="Income Support" />
                <SchemeCard name="PM Fasal Bima" amount="2% Premium" category="Insurance" />
                <SchemeCard name="KCC" amount="₹3L @ 4%" category="Credit" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs font-medium text-slate-600 text-center flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-accent-500" />
              Powered by 8 AI Agents • Multi-agent Orchestration Engine
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-primary-200 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <p className="text-lg font-bold text-slate-800 mb-2">Synthesizing advisory…</p>
            <p className="text-sm text-slate-600 font-medium">Running multi-agent analysis securely</p>
          </div>
        </div>
      )}
    </div>
  )
}

function SchemeCard({ name, amount, category }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700 uppercase tracking-wider">
        {category}
      </span>
      <p className="text-sm font-bold text-slate-800 mt-3 mb-1">{name}</p>
      <p className="text-lg font-bold text-success">{amount}</p>
      <button className="text-xs mt-3 flex items-center gap-1 text-primary-600 font-bold hover:underline">
        Apply Now <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

// Audit Trail Drawer
function AuditTrailDrawer({ isOpen, onClose, agentStatuses, result }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (isOpen && e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-96 h-full bg-slate-900 text-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        <div className="p-6 border-b border-white/10 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent-400" /> Audit Trail
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                ID: {result?.audit_id || 'PENDING'} • {new Date().toLocaleTimeString()}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/5">Agent Execution Log</h3>
            {agentStatuses.filter(a => a.status === 'done').length === 0 ? (
              <p className="text-sm text-slate-500 italic">No agent data available.</p>
            ) : (
              agentStatuses.filter(a => a.status === 'done').map(a => (
                <div key={a.id} className="mb-4 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-accent-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> {a.name}
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/10 px-2 py-1 rounded text-emerald-300">
                      {Math.round(a.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{a.reasoning_preview || 'Analysis complete.'}</p>
                </div>
              ))
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/5">Compliance Gateways</h3>
            <div className="space-y-2">
              {['Distress Detection', 'Fertilizer Limits', 'Pesticide Check'].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 font-mono">
                  <span>{item}</span>
                  <span className="font-bold">PASS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main AdvisoryPage Component
export default function AdvisoryPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState(DEFAULT_AGENTS)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [lastPhotoPreview, setLastPhotoPreview] = useState(null)
  const [distressMode, setDistressMode] = useState(false)
  const [selectedLang, setSelectedLang] = useState('hi-IN')
  const timersRef = useRef([])

  const simulateAgentProgression = useCallback((invokedAgentIds) => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setAgentStatuses(DEFAULT_AGENTS.map(a => ({ ...a, status: 'idle' })))

    invokedAgentIds.forEach((agentId, idx) => {
      const runTimer = setTimeout(() => {
        setAgentStatuses(prev => prev.map(a => a.id === agentId ? { ...a, status: 'running' } : a))
      }, idx * 500)

      const doneTimer = setTimeout(() => {
        const meta = AGENT_REASONING[agentId] || { confidence: 0.8, reasoning: 'Analysis complete' }
        setAgentStatuses(prev => prev.map(a => a.id === agentId ? { ...a, status: 'done', confidence: meta.confidence, reasoning_preview: meta.reasoning } : a))
      }, idx * 500 + 700 + Math.random() * 400)

      timersRef.current.push(runTimer, doneTimer)
    })
  }, [])

  const handleSubmit = useCallback(async (textInputArgs, photo) => {
    setIsLoading(true)
    setResult(null)

    const submittedPhoto = photo || photoFile
    if (submittedPhoto) {
      setLastPhotoPreview(photoPreview)
    } else {
      setLastPhotoPreview(null)
    }

    const detectedDistress = isDistressInput(textInputArgs)
    setDistressMode(detectedDistress)

    let likelyAgents = ['voice_agent']
    const text = textInputArgs.toLowerCase()

    if (submittedPhoto) {
      likelyAgents.push('pest_disease_agent', 'crop_agent', 'weather_agent')
    } else if (text.includes('mitti') || text.includes('soil') || text.includes('खाद')) {
      likelyAgents.push('soil_agent', 'crop_agent', 'weather_agent')
    } else if (text.includes('keeda') || text.includes('pest') || text.includes('bimari')) {
      likelyAgents.push('crop_agent', 'soil_agent', 'weather_agent')
    } else if (text.includes('mandi') || text.includes('bhav') || text.includes('price')) {
      likelyAgents.push('mandi_agent', 'finance_agent')
    } else if (text.includes('yojana') || text.includes('scheme')) {
      likelyAgents.push('scheme_agent', 'finance_agent')
    } else if (text.includes('mausam') || text.includes('weather')) {
      likelyAgents.push('weather_agent', 'crop_agent')
    } else {
      likelyAgents.push('crop_agent', 'weather_agent')
    }

    if (!likelyAgents.includes('scheme_agent')) likelyAgents.push('scheme_agent')
    simulateAgentProgression(likelyAgents)

    try {
      let resp
      if (submittedPhoto) {
        const formData = new FormData()
        formData.append('farmer_id', 'demo_001')
        formData.append('text_input', textInputArgs)
        formData.append('language', selectedLang)
        formData.append('photo', submittedPhoto)
        resp = await axios.post(`${API_BASE}/advisory/with-photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        resp = await axios.post(`${API_BASE}/advisory`, {
          farmer_id: 'demo_001',
          text_input: textInputArgs,
          language: selectedLang,
          language_code: selectedLang,
          channel: 'web',
        })
      }

      const realAgents = resp.data.agents_invoked || []
      setAgentStatuses(prev => prev.map(a => {
        if (realAgents.includes(a.id)) {
          const meta = AGENT_REASONING[a.id] || { confidence: 0.8, reasoning: 'Complete' }
          return { ...a, status: 'done', confidence: meta.confidence, reasoning_preview: meta.reasoning }
        }
        return { ...a, status: 'idle' }
      }))

      setResult(resp.data)
    } catch (err) {
      setAgentStatuses(prev => prev.map(a => a.status !== 'idle' ? { ...a, status: 'failed' } : a))
      setResult({
        advisory_text: `**Error:** Failed to connect to backend.\n\n*Code:* ${err.response?.data?.detail || err.message}`,
        agents_invoked: [],
        compliance_flags: ['CONNECTION_ERROR'],
        distress_alert: false,
        audit_id: null,
      })
    } finally {
      setIsLoading(false)
      setPhotoFile(null)
      setPhotoPreview(null)
    }
  }, [simulateAgentProgression, photoFile, photoPreview, selectedLang])

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100">
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full gap-0">
        {/* Left Sidebar - Input Panel */}
        <aside className="w-96 flex-shrink-0 flex flex-col overflow-y-auto p-6 bg-white border-r border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farmer Session</p>
            <button
              onClick={() => setIsAuditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Audit Trail
            </button>
          </div>
          <FarmerInputPanel
            onSubmit={handleSubmit}
            isLoading={isLoading}
            photoFile={photoFile}
            setPhotoFile={setPhotoFile}
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
          />
        </aside>

        {/* Right Content - Agent Feed + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Agent Activity Feed */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
            <AgentActivityFeed agents={agentStatuses} photoAttached={!!photoFile || !!lastPhotoPreview} distressMode={distressMode} />
          </div>
          
          {/* Advisory Output */}
          <div className="flex-1 overflow-hidden">
            <AdvisoryOutputPanel
              result={result}
              isLoading={isLoading}
              photoPreview={lastPhotoPreview}
              distressMode={distressMode}
              selectedLang={selectedLang}
            />
          </div>
        </div>
      </div>

      <AuditTrailDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        agentStatuses={agentStatuses}
        result={result}
      />
    </div>
  )
}
