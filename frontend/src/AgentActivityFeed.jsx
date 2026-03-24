import {
  Sprout, Cloud, Bug, Sun, TrendingUp,
  FileText, DollarSign, Mic, CheckCircle,
  Loader2, Activity, ShieldAlert, Camera
} from 'lucide-react'

const AGENT_META = {
  soil_agent:         { icon: Sprout,     label: 'Soil', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  crop_agent:         { icon: Cloud,      label: 'Crop', color: 'text-green-600', bg: 'bg-green-100' },
  pest_disease_agent: { icon: Bug,        label: 'Pest', color: 'text-red-600', bg: 'bg-red-100' },
  weather_agent:      { icon: Sun,        label: 'Weather', color: 'text-amber-600', bg: 'bg-amber-100' },
  mandi_agent:        { icon: TrendingUp, label: 'Market', color: 'text-blue-600', bg: 'bg-blue-100' },
  scheme_agent:       { icon: FileText,   label: 'Schemes', color: 'text-purple-600', bg: 'bg-purple-100' },
  finance_agent:      { icon: DollarSign, label: 'Finance', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  voice_agent:        { icon: Mic,        label: 'Intent', color: 'text-pink-600', bg: 'bg-pink-100' },
}

const DEFAULT_AGENTS = Object.entries(AGENT_META).map(([id, m]) => ({
  id,
  name: m.label,
  status: 'idle',
  confidence: 0,
  reasoning_preview: '',
}))

function AgentRow({ agent }) {
  const meta = AGENT_META[agent.id] || AGENT_META.voice_agent
  const Icon = meta.icon
  const isRunning = agent.status === 'running'
  const isDone = agent.status === 'done'
  const isFailed = agent.status === 'failed'

  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl transition-all bg-white border border-slate-200 hover:shadow-md hover:border-primary-300">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isDone ? meta.bg : isRunning ? 'bg-primary-100' : 'bg-slate-100'
      }`}>
        {isRunning ? (
          <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
        ) : (
          <Icon className={`w-4 h-4 ${isDone ? meta.color : isFailed ? 'text-danger' : 'text-slate-400'}`} />
        )}
      </div>

      <span className={`text-xs font-bold flex-1 ${isRunning || isDone ? 'text-slate-800' : 'text-slate-500'}`}>
        {meta.label}
      </span>

      {isDone && agent.confidence > 0 && (
        <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-lg">
          {Math.round(agent.confidence * 100)}%
        </span>
      )}

      {isDone && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
      {isFailed && <span className="text-xs text-danger font-bold">Failed</span>}
      {isRunning && <span className="text-xs text-primary-600 font-bold">Running</span>}
    </div>
  )
}

export default function AgentActivityFeed({ agents, photoAttached, distressMode }) {
  const list = agents && agents.length > 0 ? agents : DEFAULT_AGENTS

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Agent Pipeline</p>
            <p className="text-xs text-slate-500">Real-time execution status</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {photoAttached && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary-100 text-primary-700">
              <Camera className="w-3.5 h-3.5" />
              Photo Attached
            </span>
          )}
          {distressMode && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-danger-100 text-danger-700">
              <ShieldAlert className="w-3.5 h-3.5" />
              Crisis Mode
            </span>
          )}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {list.map((agent) => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
