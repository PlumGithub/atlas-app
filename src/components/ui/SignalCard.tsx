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

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#ffb000' : score >= 70 ? '#ffc933' : '#666'
  const glow = score >= 90
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <div className="w-20 h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            boxShadow: glow ? `0 0 8px ${color}` : 'none',
          }}
        />
      </div>
      <span
        className={`text-[11px] font-mono font-bold tabular-nums tracking-wider ${
          glow ? 'text-[#ffb000]' : 'text-[#888]'
        }`}
        style={{ textShadow: glow ? '0 0 10px rgba(255, 176, 0, 0.5)' : 'none' }}
      >
        {score}%
      </span>
    </div>
  )
}

function ObscurityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] tracking-[0.15em] uppercase text-[#444] font-bold">Obscurity</span>
      <div className="w-16 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ffb000]/50 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] text-[#555] font-mono tabular-nums">{value}</span>
    </div>
  )
}

export default function SignalCard({ signal, matchScore, matchReason, onSave, saved }: Props) {
  const mediumColor = MEDIUM_COLORS[signal.medium] || '#888'

  return (
    <article
      className="group relative border border-[#222] rounded-lg bg-[#141414] p-6 hover:border-[#ffb000]/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_0_1px_rgba(255,176,0,0.15),0_0_30px_rgba(255,176,0,0.08)] hover:-translate-y-[1px]"
    >
      {/* Medium accent line */}
      <div
        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: mediumColor }}
      />

      {/* Header row */}
      <div className="flex justify-between items-start gap-6 pl-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded"
              style={{
                color: mediumColor,
                backgroundColor: `${mediumColor}15`,
              }}
            >
              {signal.medium}
            </span>
            {signal.location && (
              <>
                <span className="text-[#333] text-[9px]">●</span>
                <span className="text-[10px] text-[#666] tracking-wide">{signal.location}</span>
              </>
            )}
          </div>
          <h3 className="text-white font-bold text-[17px] leading-[1.25] tracking-[0.01em] group-hover:text-[#ffb000] transition-colors duration-200">
            {signal.title}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {matchScore !== undefined && <ScoreBadge score={matchScore} />}
          {onSave && (
            <button
              onClick={e => {
                e.stopPropagation()
                onSave(signal.id)
              }}
              className={`text-[10px] font-mono tracking-[0.15em] uppercase font-bold transition-all duration-200 ${
                saved ? 'text-[#ffb000]' : 'text-[#444] hover:text-[#888]'
              }`}
            >
              {saved ? '◆ Saved' : '◇ Save'}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#aaaaaa] text-[13px] mt-4 leading-[1.7] pl-3 max-w-[58ch]">
        {signal.description}
      </p>

      {/* Match reason */}
      {matchReason && (
        <div className="mt-3 pl-3 flex items-center gap-2">
          <span className="text-[#ffb000]/60 text-[11px]">→</span>
          <p className="text-[#777] text-[11px] italic tracking-wide">{matchReason}</p>
        </div>
      )}

      {/* Footer: tags + obscurity + source */}
      <div className="flex flex-wrap justify-between items-center mt-5 pt-4 pl-3 border-t border-[#1e1e1e] gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {signal.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="text-[#666] text-[10px] font-mono bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded group-hover:text-[#aaa] group-hover:border-[#333] transition-all"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ObscurityBar value={signal.obscurity_score} />
          <span className="text-[9px] tracking-[0.15em] uppercase text-[#333] font-bold">
            {signal.source}
          </span>
        </div>
      </div>
    </article>
  )
}
