import {
  Sprout, Cloud, Bug, Sun, TrendingUp,
  FileText, DollarSign, Mic, CheckCircle,
  Loader2, Activity, ShieldAlert, Camera
} from 'lucide-react'

const AGENT_META = {
  soil_agent:         { icon: Sprout,     label: 'Soil', color: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'ring-emerald-500/30' },
  crop_agent:         { icon: Cloud,      label: 'Crop', color: 'text-green-600', bg: 'bg-green-100', ring: 'ring-green-500/30' },
  pest_disease_agent: { icon: Bug,        label: 'Pest', color: 'text-red-600', bg: 'bg-red-100', ring: 'ring-red-500/30' },
  weather_agent:      { icon: Sun,        label: 'Weather', color: 'text-amber-600', bg: 'bg-amber-100', ring: 'ring-amber-500/30' },
  mandi_agent:        { icon: TrendingUp, label: 'Market', color: 'text-blue-600', bg: 'bg-blue-100', ring: 'ring-blue-500/30' },
  scheme_agent:       { icon: FileText,   label: 'Schemes', color: 'text-purple-600', bg: 'bg-purple-100', ring: 'ring-purple-500/30' },
  finance_agent:      { icon: DollarSign, label: 'Finance', color: 'text-indigo-600', bg: 'bg-indigo-100', ring: 'ring-indigo-500/30' },
  voice_agent:        { icon: Mic,        label: 'Intent', color: 'text-pink-600', bg: 'bg-pink-100', ring: 'ring-pink-500/30' },
}

const DEFAULT_AGENTS = Object.entries(AGENT_META).map(([id, m]) => ({
  id,
  name: m.label,
  status: 'idle',
  confidence: 0,
  reasoning_preview: '',
}))

function AgentPill({ agent }) {
  const meta = AGENT_META[agent.id] || AGENT_META.voice_agent
  const Icon = meta.icon
  const isRunning = agent.status === 'running'
  const isDone = agent.status === 'done'
  const isFailed = agent.status === 'failed'

  return (
    <div
      className={`
        flex flex-col items-center gap-1.5 min-w-[4.75rem] max-w-[5.5rem] px-2 py-2.5 rounded-2xl border transition-all duration-200
        ${isDone ? `bg-white border-slate-200 shadow-sm ring-2 ${meta.ring}` : ''}
        ${isRunning ? 'bg-white border-primary-300 shadow-md ring-2 ring-primary-400/40 scale-[1.02]' : ''}
        ${!isDone && !isRunning && !isFailed ? 'bg-slate-50/80 border-slate-100' : ''}
        ${isFailed ? 'bg-red-50 border-red-200' : ''}
      `}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isDone ? meta.bg : isRunning ? 'bg-primary-100' : isFailed ? 'bg-red-100' : 'bg-slate-100'
        }`}
      >
        {isRunning ? (
          <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
        ) : (
          <Icon className={`w-4 h-4 ${isDone ? meta.color : isFailed ? 'text-red-600' : 'text-slate-400'}`} />
        )}
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wide text-center leading-tight line-clamp-2 ${
          isRunning || isDone ? 'text-slate-800' : 'text-slate-400'
        }`}
      >
        {meta.label}
      </span>
      <div className="flex items-center justify-center gap-0.5 min-h-[14px]">
        {isDone && agent.confidence > 0 && (
          <span className="text-[9px] font-bold tabular-nums text-success">{Math.round(agent.confidence * 100)}%</span>
        )}
        {isDone && <CheckCircle className="w-3 h-3 text-success shrink-0" />}
        {isFailed && <span className="text-[9px] font-bold text-red-600">!</span>}
        {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />}
        {!isDone && !isRunning && !isFailed && <span className="w-1 h-1 rounded-full bg-slate-300" />}
      </div>
    </div>
  )
}

export default function AgentActivityFeed({ agents, photoAttached, distressMode }) {
  const list = agents && agents.length > 0 ? agents : DEFAULT_AGENTS

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-600/25 shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 tracking-tight">8-agent pipeline</p>
            <p className="text-xs text-slate-500 truncate">Soil → crop → weather → market → schemes…</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {photoAttached && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-800 border border-primary-200/60">
              <Camera className="w-3.5 h-3.5" />
              Photo
            </span>
          )}
          {distressMode && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200/60">
              <ShieldAlert className="w-3.5 h-3.5" />
              Crisis
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:thin]">
        {list.map((agent) => (
          <div key={agent.id} className="snap-start shrink-0">
            <AgentPill agent={agent} />
          </div>
        ))}
      </div>
    </div>
  )
}
