'use client'
import { useState } from 'react'
import type { Signal } from '@/types'

const MEDIUMS = ['all', 'music', 'film', 'food', 'event', 'place', 'art'] as const

const MEDIUM_COLORS: Record<string, string> = {
  all: '#c0a882',
  music: '#5b8fa8',
  film: '#8b7355',
  food: '#c0a882',
  event: '#c0392b',
  place: '#4a4a5a',
  art: '#bf5fff',
}

interface Props {
  onFilter: (medium: string | null) => void
}

export default function MediumFilter({ onFilter }: Props) {
  const [active, setActive] = useState<string>('all')

  return (
    <div className="flex gap-1 flex-wrap font-mono text-[10px]">
      {MEDIUMS.map(m => (
        <button
          key={m}
          onClick={() => { setActive(m); onFilter(m === 'all' ? null : m) }}
          className="px-2 py-1 rounded transition-all duration-150"
          style={{
            color: active === m ? MEDIUM_COLORS[m] : '#333',
            borderBottom: active === m ? `1px solid ${MEDIUM_COLORS[m]}` : '1px solid transparent',
          }}
        >
          [{m}]
        </button>
      ))}
    </div>
  )
}
