'use client'
import type { Signal } from '@/types'

interface Props {
  signal: Signal
  matchScore?: number
  matchReason?: string
  onSave?: (id: string) => void
  saved?: boolean
}

const MEDIUM_COLORS: Record<string, string> = {
  music: '#5b8fa8',
  film: '#8b7355',
  food: '#c0a882',
  event: '#c0392b',
  place: '#4a4a5a',
  art: '#bf5fff',
  object: '#666',
}

export default function SignalCard({ signal, matchScore, matchReason, onSave, saved }: Props) {
  const scoreColor = !matchScore ? 'text-[#666]'
    : matchScore >= 90 ? 'text-[#ff2d78]'
    : matchScore >= 70 ? 'text-[#c0a882]'
    : 'text-[#666]'

  const obscurityFilled = Math.round(signal.obscurity_score / 10)
  const obscurityEmpty = 10 - obscurityFilled
  const obscurityBar = '▓'.repeat(obscurityFilled) + '░'.repeat(obscurityEmpty)

  const mediumColor = MEDIUM_COLORS[signal.medium] || '#666'

  return (
    <div
      className="border border-white/[0.04] rounded bg-gradient-to-br from-[#1a1a1a] to-[#161618] p-4 hover:bg-[#1e1e1e] transition-all duration-150 cursor-pointer group hover:translate-x-[2px]"
      style={{
        borderLeft: `2px solid ${mediumColor}`,
        boxShadow: `inset 3px 0 12px ${mediumColor}15`,
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <span className="text-[#c0a882] text-[12px]">[▶]</span>
          <span className="text-white font-medium text-[13px]">{signal.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onSave(signal.id) }}
              className={`text-[11px] font-mono transition-colors ${saved ? 'text-[#c0a882]' : 'text-[#333] hover:text-[#666]'}`}
            >
              {saved ? '[✓]' : '[+]'}
            </button>
          )}
          {matchScore && (
            <span
              className={`${scoreColor} text-[11px] font-mono whitespace-nowrap ${matchScore >= 90 ? 'animate-[pulse-glow_3s_ease-in-out_infinite]' : ''}`}
            >
              {matchScore}% match
            </span>
          )}
        </div>
      </div>

      <div className="text-[#666] text-[11px] font-mono mt-1 ml-6">
        {signal.medium}{signal.location ? ` · ${signal.location}` : ''} · {signal.source}
      </div>

      <p className="text-[#999] text-[12px] font-mono mt-3 ml-6 leading-relaxed">{signal.description}</p>

      {matchReason && (
        <p className="text-[#555] text-[10px] font-mono mt-2 ml-6 italic">→ {matchReason}</p>
      )}

      <div className="flex justify-between items-center mt-3 ml-6">
        <div className="flex gap-2 flex-wrap">
          {signal.tags.map(tag => (
            <span key={tag} className="text-[#4a4a5a] text-[11px] font-mono group-hover:text-[#666] transition-colors">[{tag}]</span>
          ))}
        </div>
        <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: signal.obscurity_score > 70 ? '#c0a882' : '#3a3a3a' }}>
          obscurity: {obscurityBar} {signal.obscurity_score}
        </span>
      </div>
    </div>
  )
}
