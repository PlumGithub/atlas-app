'use client'
import { useEffect, useState } from 'react'
import TerminalWindow from '@/components/ui/TerminalWindow'

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

  if (error) {
    return (
      <TerminalWindow title="system health">
        <p className="text-red-400/60 font-mono text-[12px]">&gt; could not fetch health status</p>
      </TerminalWindow>
    )
  }

  if (!health) {
    return (
      <TerminalWindow title="system health">
        <p className="text-[#444] font-mono text-[12px]">&gt; checking...</p>
      </TerminalWindow>
    )
  }

  const status = (ok: boolean) => ok ? <span className="text-[#27ae60]">OK</span> : <span className="text-red-400/60">DOWN</span>

  return (
    <TerminalWindow title="system health">
      <div className="font-mono text-[12px] space-y-2">
        <div className="flex justify-between"><span className="text-[#666]">&gt; supabase</span>{status(health.supabase)}</div>
        <div className="flex justify-between"><span className="text-[#666]">&gt; reddit</span>{status(health.reddit)}</div>
        <div className="flex justify-between"><span className="text-[#666]">&gt; anthropic</span>{status(health.anthropic)}</div>
        <div className="flex justify-between"><span className="text-[#666]">&gt; signals</span><span className="text-[#d4d4d4]">{health.signals_count}</span></div>
        <div className="flex justify-between"><span className="text-[#666]">&gt; users</span><span className="text-[#d4d4d4]">{health.users_count}</span></div>
        <div className="flex justify-between"><span className="text-[#666]">&gt; last scraped</span><span className="text-[#444]">{health.last_scraped ? new Date(health.last_scraped).toLocaleString() : 'never'}</span></div>
      </div>
    </TerminalWindow>
  )
}
