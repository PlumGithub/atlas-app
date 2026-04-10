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
  film: '#c9a84c',
  food: '#e89b5a',
  event: '#e05555',
  place: '#7a7a9a',
  art: '#b060e0',
  object: '#888',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? '#ffb000' : score >= 70 ? '#ffc933' : '#666'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span
        className={`text-[11px] font-mono font-semibold tabular-nums ${
          score >= 90 ? 'text-[#ffb000] animate-[pulse-glow_3s_ease-in-out_infinite]' : 'text-[#888]'
        }`}
      >
        {score}%
      </span>
    </div>
  )
}

export default function SignalCard({ signal, matchScore, matchReason, onSave, saved }: Props) {
  const mediumColor = MEDIUM_COLORS[signal.medium] || '#888'

  return (
    <div
      className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6 hover:border-[#ffb000]/20 transition-all duration-300 cursor-pointer group hover:shadow-amber-sm"
      style={{
        borderLeft: `3px solid ${mediumColor}`,
      }}
    >
      {/* Header row */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-[15px] leading-tight group-hover:text-[#ffb000] transition-colors">
            {signal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#666]">
            <span className="uppercase tracking-wider font-semibold" style={{ color: mediumColor }}>
              {signal.medium}
            </span>
            {signal.location && (
              <>
                <span className="text-[#333]">/</span>
                <span>{signal.location}</span>
              </>
            )}
            <span className="text-[#333]">/</span>
            <span>{signal.source}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {onSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onSave(signal.id) }}
              className={`text-[12px] font-mono transition-all duration-200 ${
                saved
                  ? 'text-[#ffb000]'
                  : 'text-[#444] hover:text-[#888]'
              }`}
            >
              {saved ? '[saved]' : '[save]'}
            </button>
          )}
          {matchScore !== undefined && <ScoreBar score={matchScore} />}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#999] text-[13px] mt-4 leading-relaxed">
        {signal.description}
      </p>

      {/* Match reason */}
      {matchReason && (
        <p className="text-[#555] text-[11px] mt-2 italic">
          {'-> '}{matchReason}
        </p>
      )}

      {/* Footer: tags + obscurity */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#1e1e1e]">
        <div className="flex gap-2 flex-wrap">
          {signal.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="text-[#555] text-[10px] font-mono bg-[#222] px-2 py-0.5 rounded group-hover:text-[#888] group-hover:bg-[#2a2a2a] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-1 bg-[#222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ffb000]/40 rounded-full"
              style={{ width: `${signal.obscurity_score}%` }}
            />
          </div>
          <span className="text-[10px] text-[#555] font-mono tabular-nums">
            {signal.obscurity_score}
          </span>
        </div>
      </div>
    </div>
  )
}
