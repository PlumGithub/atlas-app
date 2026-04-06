'use client'
import type { Signal } from '@/types'

interface Props {
  signal: Signal
  matchScore?: number
  matchReason?: string
}

export default function SignalCard({ signal, matchScore, matchReason }: Props) {
  const scoreColor = !matchScore ? 'text-[#666]'
    : matchScore >= 90 ? 'text-[#ff2d78]'
    : matchScore >= 70 ? 'text-[#c0a882]'
    : 'text-[#666]'

  const obscurityFilled = Math.round(signal.obscurity_score / 10)
  const obscurityEmpty = 10 - obscurityFilled
  const obscurityBar = '\u2588'.repeat(obscurityFilled) + '\u2591'.repeat(obscurityEmpty)

  return (
    <div className="border border-[#3a3a3a] rounded bg-[#1e1e1e] p-4 hover:border-[#c0a882]/40 transition-colors duration-200 cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <span className="text-[#c0a882] text-[12px]">[&#9658;]</span>
          <span className="text-white font-medium text-[13px]">{signal.title}</span>
        </div>
        {matchScore && (
          <span className={`${scoreColor} text-[11px] font-mono whitespace-nowrap`}>{matchScore}% match</span>
        )}
      </div>

      <div className="text-[#666] text-[11px] font-mono mt-1 ml-6">
        {signal.medium}{signal.location ? ` \u00b7 ${signal.location}` : ''} \u00b7 {signal.source}
      </div>

      <p className="text-[#999] text-[12px] font-mono mt-3 ml-6 leading-relaxed">{signal.description}</p>

      {matchReason && (
        <p className="text-[#555] text-[10px] font-mono mt-2 ml-6 italic">{matchReason}</p>
      )}

      <div className="flex justify-between items-center mt-3 ml-6">
        <div className="flex gap-2 flex-wrap">
          {signal.tags.map(tag => (
            <span key={tag} className="text-[#444] text-[11px] font-mono">{tag.startsWith('#') ? tag : `#${tag}`}</span>
          ))}
        </div>
        <span className="text-[#c0a882] text-[10px] font-mono whitespace-nowrap">
          obscurity: {obscurityBar} {signal.obscurity_score}
        </span>
      </div>
    </div>
  )
}
