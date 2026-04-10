'use client'
import { useState } from 'react'

const MEDIUMS = ['all', 'music', 'film', 'food', 'event', 'place', 'art'] as const

const MEDIUM_COLORS: Record<string, string> = {
  all: '#ffb000',
  music: '#5b8fa8',
  film: '#c9a84c',
  food: '#e89b5a',
  event: '#e05555',
  place: '#7a7a9a',
  art: '#b060e0',
}

interface Props {
  onFilter: (medium: string | null) => void
}

export default function MediumFilter({ onFilter }: Props) {
  const [active, setActive] = useState<string>('all')

  return (
    <div className="flex gap-1 flex-wrap">
      {MEDIUMS.map(m => (
        <button
          key={m}
          onClick={() => { setActive(m); onFilter(m === 'all' ? null : m) }}
          className={`px-3 py-1.5 rounded-md text-[11px] font-mono font-medium tracking-wider uppercase transition-all duration-200 ${
            active === m
              ? 'bg-white/[0.08] text-white'
              : 'text-[#555] hover:text-[#999] hover:bg-white/[0.03]'
          }`}
          style={active === m ? { color: MEDIUM_COLORS[m] } : undefined}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
