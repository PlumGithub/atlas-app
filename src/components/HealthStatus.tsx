'use client'
import { useEffect, useState } from 'react'

type Health = {
  supabase: boolean
  reddit: boolean
  anthropic: boolean
  signals_count: number
  last_scraped: string | null
  users_count: number
}

export default function HealthStatus() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setError(true))
  }, [])

  const Status = ({ ok }: { ok: boolean }) => (
    <span className={`flex items-center gap-1.5 text-[11px] ${ok ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#4ade80]' : 'bg-[#ef4444]'}`} />
      {ok ? 'OK' : 'DOWN'}
    </span>
  )

  if (error) {
    return (
      <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
        <p className="text-[#ef4444] text-[12px]">Could not fetch health status</p>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
        <p className="text-[#555] text-[12px]">Checking...</p>
      </div>
    )
  }

  return (
    <div className="border border-[#222] rounded-lg bg-[#1a1a1a] divide-y divide-[#222]">
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Supabase</span>
        <Status ok={health.supabase} />
      </div>
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Reddit</span>
        <Status ok={health.reddit} />
      </div>
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Anthropic</span>
        <Status ok={health.anthropic} />
      </div>
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Signals</span>
        <span className="text-white text-[12px] font-medium tabular-nums">{health.signals_count}</span>
      </div>
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Users</span>
        <span className="text-white text-[12px] font-medium tabular-nums">{health.users_count}</span>
      </div>
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-[#666] text-[12px]">Last Scraped</span>
        <span className="text-[#555] text-[12px]">{health.last_scraped ? new Date(health.last_scraped).toLocaleString() : 'Never'}</span>
      </div>
    </div>
  )
}
