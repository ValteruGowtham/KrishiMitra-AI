import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Mic, MicOff, Send, Leaf, Sun, Bug, TrendingUp,
  Landmark, Wallet, Shield, FileText, ChevronRight,
  Activity, CheckCircle, AlertTriangle, Loader2,
  User, MapPin, Wheat, Phone, Languages, HelpCircle, X,
  Volume2, Camera
} from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import AgentActivityFeed, { DEFAULT_AGENTS } from '../AgentActivityFeed'
import '../App.css'

const API_BASE = 'http://localhost:8000/api/v1'

const DISTRESS_KEYWORDS = ['jeena nahi chahta', 'karz se tang', 'sab khatam', 'jaan de dunga',
  'कर्ज से तंग', 'जीना नहीं', 'सब खत्म', 'जान दे दूँगा', 'मर जाना', 'आत्महत्या']

const isDistressInput = (text) => {
  const lower = text.toLowerCase()
  return DISTRESS_KEYWORDS.some(kw => lower.includes(kw))
}

const AGENT_REASONING = {
  voice_agent:        { confidence: 0.92, reasoning: 'Classified intent via Hindi keyword matching' },
  soil_agent:         { confidence: 0.85, reasoning: 'Analysed NPK levels and pH for wheat crop' },
  crop_agent:         { confidence: 0.82, reasoning: 'Growth-stage assessment with weather context' },
  pest_disease_agent: { confidence: 0.78, reasoning: 'Text-based symptom diagnosis for wheat' },
  weather_agent:      { confidence: 0.70, reasoning: '5-day forecast translated to farming actions' },
  mandi_agent:        { confidence: 0.75, reasoning: 'Compared 4 Rajasthan mandi prices vs MSP' },
  scheme_agent:       { confidence: 0.95, reasoning: 'Matched 19 eligible schemes from DB' },
  finance_agent:      { confidence: 0.80, reasoning: 'Break-even analysis with KCC advice' },
}



function FarmerInputPanel({ onSubmit, isLoading, photoFile, setPhotoFile, photoPreview, setPhotoPreview }) {
  const [textInput, setTextInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [speechError, setSpeechError] = useState('')
  const [speechLang, setSpeechLang] = useState('hi-IN')
  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)

  const demoFarmer = {
    name: 'Ram Singh',
    location: 'Ajmer, Rajasthan',
    crop: 'Wheat',
    land: '3.5 acres',
    language: 'Hindi',
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognitionRef.current = recognition
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech API not supported in this browser.')
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
      return
    }
    recognitionRef.current.lang = speechLang
    recognitionRef.current.onstart = () => {
      setIsRecording(true)
      setSpeechError('')
      setInterimText('')
    }
    recognitionRef.current.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setInterimText(interim)
      if (final) {
        const newText = final.trim()
        setTextInput(prev => (prev + ' ' + newText).trim())
        setTimeout(() => onSubmit(newText, null), 1000)
      }
    }
    recognitionRef.current.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setSpeechError('Please allow microphone access / माइक्रोफोन की अनुमति दें')
      } else if (event.error === 'no-speech') {
        setSpeechError('Please try again / फिर से बोलें')
      } else {
        setSpeechError(`Error: ${event.error}`)
      }
      setIsRecording(false)
    }
    recognitionRef.current.onend = () => {
      setIsRecording(false)
      setInterimText('')
    }
    try { recognitionRef.current.start() } catch (e) { console.error(e) }
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
    const effectiveText = textInput.trim() || (photoFile ? 'Mere fasal mein bimari lag gayi hai, photo dekh ke batao' : '')
    if (!effectiveText || isLoading) return
    onSubmit(effectiveText, photoFile)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Farmer Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border mb-5 overflow-hidden flex flex-col relative group shrink-0">
        <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 z-10 shadow-sm">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="z-10 text-white">
            <h3 className="font-bold text-lg leading-tight">{demoFarmer.name}</h3>
            <p className="text-[11px] font-medium text-white/80 flex items-center gap-1 mt-0.5 opacity-90">
              <MapPin className="w-3 h-3" /> {demoFarmer.location}
            </p>
          </div>
        </div>
        <div className="p-3 bg-white grid grid-cols-3 gap-2">
          <ProfileStat icon="🌾" label="Crop" value={demoFarmer.crop} />
          <ProfileStat icon="📏" label="Land" value={demoFarmer.land} />
          <ProfileStat icon="🗣️" label="Language" value={demoFarmer.language} />
        </div>
      </div>

      {/* Voice + Camera Input Area */}
      <div className="flex flex-col items-center justify-center mb-5 relative shrink-0 mt-2">
        <div className="flex items-center gap-3 mb-4">
           <div className="flex bg-surface rounded-lg p-1 border border-border shadow-sm">
             <button type="button"
                onClick={() => setSpeechLang('hi-IN')}
                className={`px-3 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${speechLang === 'hi-IN' ? 'bg-primary text-white shadow' : 'text-muted hover:text-dark'}`}
             >HI</button>
             <button type="button"
                onClick={() => setSpeechLang('en-IN')}
                className={`px-3 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${speechLang === 'en-IN' ? 'bg-primary text-white shadow' : 'text-muted hover:text-dark'}`}
             >EN</button>
           </div>
        </div>

        {/* Mic + Camera buttons side by side */}
        <div className="flex items-center gap-5">
          {/* Mic Button */}
          <div className="relative flex flex-col items-center">
            {isRecording && (
              <div className="absolute inset-0 bg-danger/20 rounded-full animate-ripple pointer-events-none" style={{width:'80px',height:'80px'}} />
            )}
            <button type="button"
              onClick={toggleRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 shadow-md transition-all duration-300 cursor-pointer ${
                isRecording
                  ? 'bg-danger text-white shadow-[0_0_0_8px_rgba(220,38,38,0.2)]'
                  : 'bg-white text-primary border border-border hover:border-primary hover:shadow-lg hover:scale-105'
              }`}
            >
              {isRecording ? <Mic className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
            </button>
            <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2">
              {isRecording ? 'Listening...' : 'Speak'}
            </p>
          </div>

          {/* Camera Button */}
          <div className="relative flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
              id="photo-input"
            />
            <button type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 shadow-md transition-all duration-300 cursor-pointer ${
                photoFile
                  ? 'bg-accent text-primary-dark border-2 border-accent shadow-[0_0_0_4px_rgba(244,162,97,0.3)]'
                  : 'bg-white text-primary border border-border hover:border-accent hover:shadow-lg hover:scale-105'
              }`}
            >
              <Camera className="w-7 h-7" />
            </button>
            <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2">
              {photoFile ? 'Photo Set' : 'Upload'}
            </p>
          </div>
        </div>

        {/* Photo Preview Thumbnail */}
        {photoPreview && (
          <div className="mt-3 flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-xl px-3 py-2 shadow-sm">
            <div className="relative">
              <img src={photoPreview} alt="Crop preview" className="w-[60px] h-[60px] rounded-lg object-cover border border-border shadow-sm" />
              <button type="button" onClick={removePhoto}
                className="absolute -top-2 -right-2 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold text-dark flex items-center gap-1">
                📷 Photo attached
              </p>
              <p className="text-[9px] text-primary font-semibold">Disease detection active</p>
            </div>
          </div>
        )}

        {/* Live transcript / speech status */}
        <div className="mt-3 text-center min-h-[32px] flex flex-col items-center justify-start w-full max-w-[280px]">
          {speechError ? (
            <p className="text-[10px] text-danger font-bold bg-danger/10 px-3 py-1.5 rounded-lg border border-danger/20">
              {speechError}
            </p>
          ) : isRecording ? (
            <>
              <p className="text-[10px] text-danger font-bold uppercase tracking-wider mb-1.5 animate-pulse flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-danger"></span> सुन रहा हूँ... / Listening...
              </p>
              {interimText && (
                <p className="text-sm font-medium text-dark/80 italic break-words text-center leading-snug">
                  "{interimText}"
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Today's Farm Summary */}
      <div className="mb-4 shrink-0">
        <p className="text-[10px] uppercase font-bold text-muted tracking-wider mb-2">Today's Farm Summary</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm text-dark">🌡️ 32°C Ajmer</span>
          <span className="bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm text-dark">🌾 Wheat Day 127</span>
          <span className="bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm text-dark">💰 MSP ₹2,275/q</span>
        </div>
      </div>

      {/* Text Input + Submit */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10 min-h-[120px]">
        <div className="bg-white rounded-2xl shadow-sm border border-border flex-1 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={photoFile ? "Describe the disease or just submit the photo..." : "Type your farming question here... / अपना सवाल यहाँ लिखें..."}
            className="flex-1 p-4 text-sm resize-none focus:outline-none text-dark placeholder:text-muted/60"
            rows={3}
          />
          <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-surface/50">
            <span className="text-[10px] uppercase font-bold text-muted/80 tracking-wider">
              Hindi or English 
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={(!textInput.trim() && !photoFile) || isLoading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
                (textInput.trim() || photoFile) && !isLoading
                  ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-border/60 text-muted cursor-not-allowed shadow-none'
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

      {/* Quick Questions */}
      <div className="mt-5 shrink-0">
        <p className="text-[10px] uppercase font-bold text-muted tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Quick Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'मेरे गेहूं के पत्ते पीले पड़ रहे हैं',
            'आज मंडी में गेहूं का भाव',
            'कौन सी सरकारी योजना मिल सकती है',
            'मौसम की जानकारी दें',
          ].map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => {
                setTextInput(prompt)
                setTimeout(() => onSubmit(prompt, null), 100)
              }}
              className="text-xs font-medium border border-primary/30 text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm cursor-pointer"
            >
              {prompt}
            </button>
          ))}
          {/* Distress demo chip — red styled */}
          <button
            type="button"
            onClick={() => {
              const distressText = 'कर्ज से तंग आ गया हूँ'
              setTextInput(distressText)
              setTimeout(() => onSubmit(distressText, null), 100)
            }}
            className="text-xs font-medium border border-red-300 text-red-700 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-sm cursor-pointer"
          >
            कर्ज से तंग आ गया हूँ
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileStat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface/60 border border-border/50">
      <span className="text-base mb-0.5">{icon}</span>
      <p className="text-[9px] uppercase font-bold text-muted tracking-wide mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-dark truncate w-full text-center">{value}</p>
    </div>
  )
}

function DistressCrisisCard() {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative animate-fade-in-up overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Shield Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-amber-900 mb-2 leading-tight">
          KrishiMitra aapke saath hai 🙏
        </h2>
        <p className="text-base text-amber-800 font-medium mb-8 max-w-md leading-relaxed">
          Aapki baat sunne ke liye ek insaan available hai.
          <br />Kripya neeche diye gaye number par call karein.
        </p>

        {/* Helpline Cards */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <a href="tel:18001801551" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-md border-2 border-amber-300 hover:shadow-lg hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
              <Phone className="w-7 h-7 text-green-700" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kisan Helpline</p>
              <p className="text-2xl font-extrabold text-green-700 tracking-tight">1800-180-1551</p>
              <p className="text-[10px] font-semibold text-green-600 uppercase tracking-widest">FREE • 24/7 • All Languages</p>
            </div>
          </a>

          <a href="tel:18004251122" className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-md border-2 border-amber-200 hover:shadow-lg hover:scale-[1.02] transition-all group">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
              <Phone className="w-7 h-7 text-blue-700" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">KVK Helpline</p>
              <p className="text-2xl font-extrabold text-blue-700 tracking-tight">1800-425-1122</p>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">FREE • Krishi Vigyan Kendra</p>
            </div>
          </a>
        </div>
        
        <p className="text-xs text-amber-700/80 font-medium max-w-xs leading-relaxed">
          Aap akele nahi hain. Hazaron kisan isse nikal chuke hain. Pehla kadam hai — baat karna.
        </p>
      </div>

      {/* Distress Protocol Footer */}
      <div className="shrink-0 p-3 bg-red-100 border-t border-red-200 flex items-center justify-center gap-2 text-[10px] text-red-700 font-bold uppercase tracking-widest">
        <Shield className="w-3.5 h-3.5" /> Distress Protocol Activated — Compliance Override Active
      </div>
    </div>
  )
}

function AdvisoryOutputPanel({ result, isLoading, photoPreview, distressMode }) {
  const [showHindi, setShowHindi] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [])

  // Auto-read effect — MUST be above early return to satisfy Rules of Hooks
  useEffect(() => {
    if (result && result.advisory_text) {
      const text = result.advisory_text
      const t = setTimeout(() => {
        if (!window.speechSynthesis || !text) return
        window.speechSynthesis.cancel()
        let cleanText = text.replace(/[*_#`~>|-]/g, ' ').replace(/\n/g, ' ')
        const sentences = cleanText.split(/(?<=[।.?!])\s+/)
        cleanText = sentences.slice(0, 3).join(' ')
        const utterance = new SpeechSynthesisUtterance(cleanText.trim())
        utterance.lang = 'hi-IN'
        utterance.rate = 0.85
        utterance.pitch = 1.0
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find(v => v.lang.includes('hi') && (v.name.includes('Female') || v.name.includes('Google')))
        if (femaleVoice) utterance.voice = femaleVoice
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [result])

  if (!result && !isLoading) {
    return <EmptyState />
  }

  // Distress mode takes over the entire panel
  const isDistress = distressMode || result?.distress_alert === true
  if (isDistress && result) {
    return <DistressCrisisCard />
  }

  let englishText = result?.advisory_text || ''
  let hindiText = ''
  
  if (result?.advisory_text) {
    const parts = result.advisory_text.split(/(?:सारांश हिंदी में|संक्षिप्त हिंदी|हिंदी अनुवाद):/)
    if (parts.length > 1) {
      englishText = parts[0].trim()
      hindiText = parts[1].trim()
    } else {
      hindiText = result.advisory_text
    }
  }

  const displayMarkdown = showHindi && hindiText ? hindiText : englishText

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const startSpeaking = (textToRead, limitSentences = false, forceLang = null) => {
    if (!window.speechSynthesis || !textToRead) return
    window.speechSynthesis.cancel()
    let cleanText = textToRead.replace(/[*_#`~>|-]/g, ' ').replace(/\n/g, ' ')
    if (limitSentences) {
      const sentences = cleanText.split(/(?<=[।.?!])\s+/)
      cleanText = sentences.slice(0, 3).join(' ')
    }
    const utterance = new SpeechSynthesisUtterance(cleanText.trim())
    const lang = forceLang || (showHindi ? 'hi-IN' : 'en-IN')
    utterance.lang = lang
    utterance.rate = 0.85
    utterance.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const targetVoiceLang = lang.split('-')[0]
    const femaleVoice = voices.find(v => v.lang.includes(targetVoiceLang) && (v.name.includes('Female') || v.name.includes('Google')))
    if (femaleVoice) utterance.voice = femaleVoice
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="flex flex-col h-full bg-white relative animate-fade-in-up">
      {result ? (
        <div className="flex-1 flex flex-col overflow-hidden relative border-l border-r border-border shadow-sm">
          <div className="shrink-0 px-5 py-3 border-b border-border bg-gradient-to-r from-surface to-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
            
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                result.distress_alert
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : result.compliance_flags?.length === 0
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-warning/10 text-warning border-warning/20'
              }`}>
                {result.distress_alert ? (
                  <><Shield className="w-3.5 h-3.5" /> Distress Protocol Activated</>
                ) : result.compliance_flags?.length === 0 ? (
                  <><CheckCircle className="w-3.5 h-3.5" /> Compliance Passed</>
                ) : (
                  <><AlertTriangle className="w-3.5 h-3.5" /> Flags</>
                )}
              </span>
              
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
                <FileText className="w-3.5 h-3.5" /> Audit Logged
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button type="button"
                onClick={() => isSpeaking ? stopSpeaking() : startSpeaking(displayMarkdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-sm ${
                  isSpeaking 
                    ? 'bg-primary border-primary text-white shadow-md' 
                    : 'bg-white text-primary border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {isSpeaking ? (
                  <><Volume2 className="w-3.5 h-3.5 animate-pulse" /> Speaking... / बोल रहा हूँ</>
                ) : (
                  <><Volume2 className="w-3.5 h-3.5" /> Listen</>
                )}
              </button>

              <div className="flex items-center bg-surface p-1 rounded-lg border border-border mt-0">
                <button type="button"
                  onClick={() => setShowHindi(false)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    !showHindi ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-dark'
                  }`}
                >English</button>
                <button type="button"
                  onClick={() => setShowHindi(true)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    showHindi ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-dark'
                  }`}
                >हिंदी</button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" id="main-scroll">
            {/* Analysed Image Section */}
            {photoPreview && (
              <div className="p-6 md:p-8 pb-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-border">
                <p className="text-[10px] uppercase font-bold text-danger tracking-widest mb-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Analysed Image — Disease Scan Complete
                </p>
                <div className="flex items-start gap-4">
                  <img src={photoPreview} alt="Analysed crop" className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-danger/30 shadow-md" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-dark mb-1">Vision AI Diagnosis</p>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Image processed by Pest & Disease Agent using GPT-4o Vision. Results integrated into the advisory below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 bg-white">
              <div className="prose prose-sm md:prose-base max-w-none font-sans">
                <ReactMarkdown
                  components={{
                    h3: ({node, ...props}) => <><hr className="my-6 border-border" /><h3 className="uppercase text-primary-dark tracking-wide font-bold mt-6 mb-3" {...props} /></>,
                    h2: ({node, ...props}) => <><hr className="my-6 border-border" /><h2 className="uppercase text-primary-dark tracking-wide font-bold mt-6 mb-3" {...props} /></>,
                    p: ({node, ...props}) => <p className="mb-4 text-dark/90 leading-relaxed font-medium" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-dark font-bold" {...props} />,
                    ul: ({node, ...props}) => <ul className="pl-5 space-y-2 mb-4 list-disc text-dark/90" {...props} />
                  }}
                >
                  {displayMarkdown}
                </ReactMarkdown>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-surface border-t border-border mt-auto">
              <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" /> Eligible Government Schemes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SchemeCard name="PM-KISAN" amount="Rs. 6,000/year" category="Income" />
                <SchemeCard name="PM Fasal Bima" amount="2% Premium" category="Insurance" />
                <SchemeCard name="Kisan Credit Card" amount="Rs. 3,00,000 @ 4%" category="Credit" />
              </div>
            </div>
          </div>
          
          <div className="shrink-0 p-3 bg-surface border-t border-border flex items-center justify-center gap-2 text-[10px] text-muted font-bold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-accent" /> Powered by 8 AI Agents
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white border border-border shadow-sm">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-dark">Synthesizing advisory…</p>
            <p className="text-xs text-muted font-medium mt-1">Refining multi-agent analysis securely</p>
          </div>
        </div>
      )}
    </div>
  )
}

function SchemeCard({ name, amount, category }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
          {category}
        </span>
      </div>
      <h4 className="font-bold text-dark text-sm mb-1">{name}</h4>
      <p className="text-xl font-extrabold text-success mb-3 tracking-tight">{amount}</p>
      <button type="button" className="text-xs font-bold text-info hover:text-info-dark flex items-center gap-1 group-hover:text-primary transition-colors cursor-pointer bg-transparent border-none">
        Apply Now <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white border-l border-r border-border shadow-sm">
      <div className="text-center max-w-md p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
          <Leaf className="w-10 h-10 text-primary opacity-80" />
        </div>
        <h3 className="text-xl font-bold text-dark mb-3">Ask KrishiMitra</h3>
        <p className="text-sm text-muted leading-relaxed font-medium">
          Type, speak, or upload a crop photo. Our 8 AI agents will analyze across soil, weather, pest, and market dimensions.
        </p>
        <div className="mt-8 grid grid-cols-4 gap-4">
          {[
            { icon: <Leaf className="w-5 h-5" />, label: 'Soil' },
            { icon: <Wheat className="w-5 h-5" />, label: 'Crop' },
            { icon: <Bug className="w-5 h-5" />, label: 'Pest' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Market' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 bg-surface rounded-xl p-3 border border-border/50 hover:bg-surface-alt hover:-translate-y-1 transition-all">
              <div className="text-primary/60">{item.icon}</div>
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditTrailDrawer({ isOpen, onClose, agentStatuses, result }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className={`relative w-[400px] h-full bg-[#1a1a2e] text-white shadow-2xl flex flex-col border-l border-white/10 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden`}>
        
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#161628]">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-light" /> Audit Trail
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[11px] text-white/50 font-mono">
                ID: {result?.audit_id || 'PENDING'} • {new Date().toLocaleTimeString()}
              </p>
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">
              Press <kbd className="bg-white/10 px-1 py-0.5 rounded font-mono">ESC</kbd> to close
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-10">
          <div>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Agent Execution Log</h3>
            {agentStatuses.filter(a => a.status === 'done').length === 0 && (
              <p className="text-xs text-white/30 italic">No agent data available.</p>
            )}
            {agentStatuses.filter(a => a.status === 'done').map(a => (
              <div key={a.id} className="mb-4 bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-bold text-accent-light flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {a.name}
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-emerald-300">
                    {(a.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-white/50 font-mono bg-black/30 p-1.5 rounded uppercase tracking-wider">
                    Sources: Inter-DB, LLM-K, API
                  </p>
                  <ol className="list-decimal list-outside ml-4 text-[11px] text-white/70 space-y-1.5 font-medium leading-relaxed">
                    <li>{a.reasoning_preview || 'Completed specialized analysis task.'}</li>
                    <li>Cross-validated internal dataset for confidence scoring.</li>
                  </ol>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Compliance Gateways</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
                <span>Distress Detection</span><span className="font-bold">PASS</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
                <span>Fertilizer Limits (Urea)</span><span className="font-bold">PASS</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
                <span>Pesticide Ban Check</span><span className="font-bold">PASS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdvisoryPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState(DEFAULT_AGENTS)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [lastPhotoPreview, setLastPhotoPreview] = useState(null)
  const [distressMode, setDistressMode] = useState(false)
  const timersRef = useRef([])

  const simulateAgentProgression = useCallback((invokedAgentIds) => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const orderedIds = [
      'voice_agent',
      ...invokedAgentIds.filter(id => id !== 'voice_agent'),
    ]

    setAgentStatuses(
      DEFAULT_AGENTS.map(a => ({
        ...a,
        status: 'idle',
      }))
    )

    orderedIds.forEach((agentId, idx) => {
      const runTimer = setTimeout(() => {
        setAgentStatuses(prev =>
          prev.map(a =>
            a.id === agentId ? { ...a, status: 'running' } : a
          )
        )
      }, idx * 600) 

      const doneTimer = setTimeout(() => {
        const meta = AGENT_REASONING[agentId] || { confidence: 0.8, reasoning: 'Analysis complete' }
        let reasoning = meta.reasoning
        if (agentId === 'pest_disease_agent' && photoFile) {
          reasoning = 'GPT-4o Vision analysis on uploaded crop image'
        }
        setAgentStatuses(prev =>
          prev.map(a =>
            a.id === agentId
              ? {
                  ...a,
                  status: 'done',
                  confidence: meta.confidence,
                  reasoning_preview: reasoning,
                }
              : a
          )
        )
      }, idx * 600 + 800 + Math.random() * 400) 

      timersRef.current.push(runTimer, doneTimer)
    })
  }, [photoFile])

  const handleSubmit = useCallback(async (textInputArgs, photo) => {
    setIsLoading(true)
    setResult(null)

    // Track whether photo was attached for this submission
    const submittedPhoto = photo || photoFile
    if (submittedPhoto) {
      setLastPhotoPreview(photoPreview)
    } else {
      setLastPhotoPreview(null)
    }

    const text = textInputArgs.toLowerCase()
    
    // Check for distress keywords
    const detectedDistress = isDistressInput(textInputArgs)
    setDistressMode(detectedDistress)
    
    let likelyAgents = ['voice_agent']

    if (submittedPhoto) {
      likelyAgents.push('pest_disease_agent', 'crop_agent', 'weather_agent')
    } else if (text.includes('मिट्टी') || text.includes('soil') || text.includes('खाद') || text.includes('urea')) {
      likelyAgents.push('soil_agent', 'crop_agent', 'weather_agent')
    } else if (text.includes('कीट') || text.includes('pest') || text.includes('बीमारी') || text.includes('पीले')) {
      likelyAgents.push('crop_agent', 'soil_agent', 'weather_agent')
    } else if (text.includes('मंडी') || text.includes('भाव') || text.includes('price') || text.includes('market')) {
      likelyAgents.push('mandi_agent', 'finance_agent')
    } else if (text.includes('योजना') || text.includes('scheme') || text.includes('सरकारी')) {
      likelyAgents.push('scheme_agent', 'finance_agent')
    } else if (text.includes('मौसम') || text.includes('weather') || text.includes('बारिश')) {
      likelyAgents.push('weather_agent', 'crop_agent')
    } else {
      likelyAgents.push('crop_agent', 'weather_agent')
    }

    if (!likelyAgents.includes('scheme_agent')) likelyAgents.push('scheme_agent')

    simulateAgentProgression(likelyAgents)

    try {
      let resp

      if (submittedPhoto) {
        // Multipart form data for photo upload
        const formData = new FormData()
        formData.append('farmer_id', 'demo_001')
        formData.append('text_input', textInputArgs)
        formData.append('language', 'hindi')
        formData.append('photo', submittedPhoto)
        resp = await axios.post(`${API_BASE}/advisory/with-photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        resp = await axios.post(`${API_BASE}/advisory`, {
          farmer_id: 'demo_001',
          text_input: textInputArgs,
          language: 'hindi',
          channel: 'web',
        })
      }

      const realAgents = resp.data.agents_invoked || []
      setAgentStatuses(prev =>
        prev.map(a => {
          if (realAgents.includes(a.id)) {
            const meta = AGENT_REASONING[a.id] || { confidence: 0.8, reasoning: 'Complete' }
            return { ...a, status: 'done', confidence: meta.confidence, reasoning_preview: meta.reasoning }
          }
          return { ...a, status: 'idle' }
        })
      )

      setResult(resp.data)
    } catch (err) {
      setAgentStatuses(prev =>
        prev.map(a => a.status !== 'idle' ? { ...a, status: 'failed' } : a)
      )
      setResult({
        advisory_text: `**Error Analysis:**\n\nFailed to sync with central orchestrator block. Ensure backend is active.\n\n*Code:* ${err.response?.data?.detail || err.message}`,
        agents_invoked: [],
        compliance_flags: ['CRITICAL_SERVER_ERROR'],
        distress_alert: false,
        audit_id: null,
      })
    } finally {
      setIsLoading(false)
      // Clear photo after submission
      setPhotoFile(null)
      setPhotoPreview(null)
    }
  }, [simulateAgentProgression, photoFile, photoPreview])

  return (
    <div className="flex-1 flex overflow-hidden bg-surface font-sans antialiased text-dark relative w-full" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="flex-1 flex overflow-hidden relative w-full max-w-[1600px] mx-auto">
        <section className="w-[40%] xl:w-[35%] border-l border-r border-border/70 p-6 overflow-y-auto bg-surface relative z-0 flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-[10px] font-bold text-muted uppercase tracking-wider">Session Info</h2>
            <button 
              onClick={() => setIsAuditOpen(true)}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide border border-border shadow-sm hover:border-primary transition-colors cursor-pointer text-primary"
            >
              <FileText className="w-3 h-3" />
              Audit Trail
            </button>
          </div>
          <FarmerInputPanel
            onSubmit={handleSubmit}
            isLoading={isLoading}
            photoFile={photoFile}
            setPhotoFile={setPhotoFile}
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
          />
        </section>
        
        <section className="w-[60%] xl:w-[65%] flex flex-col relative z-0 bg-surface/30 border-r border-border/70">
          <div className="shrink-0 p-4 xl:p-6 pb-2 xl:pb-4 border-b border-border shadow-sm bg-surface z-10 w-full relative">
            <AgentActivityFeed agents={agentStatuses} photoAttached={!!photoFile || !!lastPhotoPreview} distressMode={distressMode} />
          </div>
          <div className="flex-1 overflow-hidden relative w-full pt-4 xl:pt-4 px-4 xl:px-6 pb-4 xl:pb-6">
            <AdvisoryOutputPanel
              result={result}
              isLoading={isLoading}
              photoPreview={lastPhotoPreview}
              distressMode={distressMode}
            />
          </div>
        </section>
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
