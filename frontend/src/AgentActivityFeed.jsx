/**
 * AgentActivityFeed — Real-time multi-agent status visualiser.
 * 2x4 Grid Design with fixed 90px height cards.
 */

import {
  Sprout, Cloud, Bug, Sun, TrendingUp,
  FileText, DollarSign, Mic, CheckCircle,
  XCircle, Loader2, Activity, ShieldAlert
} from 'lucide-react'

/* ── Agent metadata (icon + colour) ──────────────────────────── */

const AGENT_META = {
  soil_agent:         { icon: Sprout,      color: '#2D6A4F', label: 'Soil Intelligence' },
  crop_agent:         { icon: Cloud,       color: '#16A34A', label: 'Crop Advisory' },
  pest_disease_agent: { icon: Bug,         color: '#DC2626', label: 'Pest & Disease' },
  weather_agent:      { icon: Sun,         color: '#F59E0B', label: 'Weather & Climate' },
  mandi_agent:        { icon: TrendingUp,  color: '#E76F51', label: 'Mandi Market' },
  scheme_agent:       { icon: FileText,    color: '#2563EB', label: 'Scheme Navigator' },
  finance_agent:      { icon: DollarSign,  color: '#7C3AED', label: 'Farm Finance' },
  voice_agent:        { icon: Mic,         color: '#0891B2', label: 'Voice Agent' },
}

export const DEFAULT_AGENTS = Object.entries(AGENT_META).map(([id, m]) => ({
  id,
  name: m.label,
  status: 'idle',
  confidence: 0,
  reasoning_preview: '',
}))

function AgentCard({ agent, photoAttached }) {
  const meta = AGENT_META[agent.id] || AGENT_META.voice_agent
  const Icon = meta.icon
  const isRunning = agent.status === 'running'
  const isDone    = agent.status === 'done'
  const isFailed  = agent.status === 'failed'
  const isIdle    = agent.status === 'idle'
  const isPestWithPhoto = agent.id === 'pest_disease_agent' && photoAttached

  return (
    <div
      className={`relative flex items-center p-3.5 rounded-xl border shadow-sm transition-all duration-300 h-[90px] overflow-hidden`}
      style={{
        backgroundColor: isPestWithPhoto && isIdle ? '#FEF2F2' : (isIdle ? '#F9FAFB' : '#FFFFFF'),
        borderColor: isPestWithPhoto ? '#DC2626' : (isRunning ? '#F59E0B' : (isDone ? '#E5E7EB' : (isFailed ? '#FECACA' : '#E5E7EB'))),
        boxShadow: isPestWithPhoto && !isDone ? '0 0 0 2px rgba(220,38,38,0.25)' : (isRunning ? `0 0 0 2px rgba(245,158,11,0.4)` : '0 1px 2px rgba(0,0,0,0.05)'),
        borderLeftWidth: '5px',
        borderLeftColor: isPestWithPhoto ? '#DC2626' : (isRunning ? '#F59E0B' : (isDone ? '#16A34A' : (isFailed ? '#DC2626' : '#D1D5DB'))),
      }}
    >
      {isRunning && (
        <div className="absolute inset-0 rounded-xl rounded-l-none border-2 border-amber-400 opacity-50 animate-pulse pointer-events-none" />
      )}

      {/* Confidence % top right */}
      {isDone && agent.confidence > 0 && (
        <div className="absolute top-2.5 right-3 text-[11px] font-bold" style={{ color: '#16A34A' }}>
          {Math.round(agent.confidence * 100)}%
        </div>
      )}

      {/* Icon */}
      <div 
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-300"
        style={{
          backgroundColor: isIdle || isFailed ? '#F3F4F6' : `${meta.color}15`,
        }}
      >
        {isRunning ? (
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#F59E0B' }} />
        ) : (
          <Icon className="w-5 h-5 transition-colors" style={{ color: isIdle || isFailed ? '#9CA3AF' : meta.color }} />
        )}
      </div>

      {/* Content Area (Vertically Centered) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
        <h4 className="text-[13px] font-bold text-gray-900 leading-tight pr-6 truncate">
          {agent.name}
        </h4>
        
        {/* Status Badge */}
        <div className="mt-1 flex items-center">
          <span 
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
            style={{ 
              backgroundColor: isRunning ? '#FEF3C7' : isDone ? '#DCFCE7' : isFailed ? '#FEE2E2' : 'transparent',
              color: isRunning ? '#D97706' : isDone ? '#16A34A' : isFailed ? '#DC2626' : '#9CA3AF',
              paddingLeft: isIdle ? '0' : undefined
            }}
          >
            {isRunning ? 'Analyzing' : isDone ? 'Complete' : isFailed ? 'Failed' : (isPestWithPhoto ? '📷 VISION' : 'WAITING')}
          </span>
          {isPestWithPhoto && !isDone && !isRunning && (
            <span className="text-[8px] font-bold text-red-500 ml-1 animate-pulse">Vision Analysis Active</span>
          )}
        </div>

        {/* Reasoning text */}
        {(isDone || isFailed) && agent.reasoning_preview && (
          <p className="mt-1 text-[10px] text-gray-500 leading-snug truncate" title={agent.reasoning_preview}>
            {agent.reasoning_preview}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AgentActivityFeed({ agents, photoAttached, distressMode }) {
  const list = agents && agents.length > 0 ? agents : DEFAULT_AGENTS

  return (
    <div className="w-full">
      {/* Distress Protocol Banner */}
      {distressMode && (
        <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center gap-2 animate-pulse shadow-lg">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Distress Protocol Active — Priority Override</span>
          <ShieldAlert className="w-4 h-4" />
        </div>
      )}

      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" /> Multi-Agent Swarm
      </h3>
      {/* 2-col x 4-row grid */}
      <div className="grid grid-cols-2 gap-3">
        {list.map((agent) => (
          <AgentCard key={agent.id} agent={agent} photoAttached={photoAttached} distressMode={distressMode} />
        ))}
        {/* Distress Guardian — only visible in distress mode */}
        {distressMode && (
          <div
            className="relative flex items-center p-3.5 rounded-xl border shadow-sm transition-all duration-300 h-[90px] overflow-hidden col-span-2"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#DC2626',
              boxShadow: '0 0 0 3px rgba(220,38,38,0.3)',
              borderLeftWidth: '5px',
              borderLeftColor: '#DC2626',
            }}
          >
            <div className="absolute inset-0 rounded-xl rounded-l-none border-2 border-red-400 opacity-50 animate-pulse pointer-events-none" />
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{backgroundColor:'#FEE2E2'}}>
              <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
              <h4 className="text-[13px] font-bold text-red-800 leading-tight">🛡️ Distress Guardian</h4>
              <div className="mt-1 flex items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-red-200 text-red-700">ACTIVE</span>
                <span className="text-[8px] font-bold text-red-500 ml-1.5">Crisis response engaged</span>
              </div>
            </div>
            <div className="absolute top-2.5 right-3 text-[11px] font-bold text-red-600">100%</div>
          </div>
        )}
      </div>
    </div>
  )
}

