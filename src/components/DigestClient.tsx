'use client'
import { useState } from 'react'
import SignalCard from '@/components/ui/SignalCard'
import MediumFilter from '@/components/ui/MediumFilter'
import type { Signal } from '@/types'

interface ScoredSignal {
  signal: Signal
  score: number
  reason: string
}

interface Props {
  scored: ScoredSignal[]
  userId?: string | null
}

export default function DigestClient({ scored, userId }: Props) {
  const [filter, setFilter] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const filtered = filter
    ? scored.filter(s => s.signal.medium === filter)
    : scored

  const handleSave = async (signalId: string) => {
    if (!userId) return
    try {
      const res = await fetch('/api/signals/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, signalId }),
      })
      const data = await res.json()
      setSavedIds(prev => {
        const next = new Set(prev)
        if (data.saved) next.add(signalId)
        else next.delete(signalId)
        return next
      })
    } catch {}
  }

  return (
    <>
      <div className="mb-3">
        <MediumFilter onFilter={setFilter} />
      </div>
      <div className="space-y-3">
        {filtered.map(({ signal, score, reason }) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            matchScore={score}
            matchReason={reason}
            onSave={userId ? handleSave : undefined}
            saved={savedIds.has(signal.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-[#444] font-mono text-[11px] text-center mt-8">&gt; no signals match this filter</p>
      )}
    </>
  )
}
