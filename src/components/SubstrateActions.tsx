'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingDots from '@/components/ui/LoadingDots'

interface Props {
  userId: string | null
  action: 'resynthesize' | 'synthesize' | 'letterboxd' | 'beli'
}

export default function SubstrateActions({ userId, action }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const router = useRouter()

  const handleSynthesize = async () => {
    if (!userId) { setResult('no user found'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/substrate/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setResult('substrate synthesized')
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'failed')
      }
    } catch (e) { setResult(String(e)) }
    setLoading(false)
  }

  const handleLetterboxd = async () => {
    if (!input.trim()) { setShowInput(true); return }
    setLoading(true)
    try {
      const res = await fetch('/api/connect/letterboxd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(`found ${data.films} films`)
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'not found')
      }
    } catch (e) { setResult(String(e)) }
    setLoading(false)
  }

  const handleBeli = async () => {
    if (!input.trim()) { setShowInput(true); return }
    setLoading(true)
    try {
      const res = await fetch('/api/connect/beli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualSpots: input.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setResult('food taste analyzed')
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'failed')
      }
    } catch (e) { setResult(String(e)) }
    setLoading(false)
  }

  if (action === 'resynthesize' || action === 'synthesize') {
    return (
      <div className="mt-3">
        <button
          onClick={handleSynthesize}
          disabled={loading}
          className="text-[#c0a882] text-[11px] font-mono hover:underline disabled:opacity-50"
        >
          {loading ? <LoadingDots /> : action === 'resynthesize' ? '[re-synthesize substrate -->]' : '[synthesize substrate -->]'}
        </button>
        {result && <p className="text-[#666] text-[10px] font-mono mt-1">&gt; {result}</p>}
      </div>
    )
  }

  if (action === 'letterboxd') {
    return (
      <div className="mt-2">
        {showInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="letterboxd username"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-[11px] font-mono text-[#d4d4d4] focus:border-[#c0a882] outline-none"
              onKeyDown={e => e.key === 'Enter' && handleLetterboxd()}
            />
            <button onClick={handleLetterboxd} disabled={loading} className="text-[#c0a882] text-[11px] font-mono hover:underline disabled:opacity-50">
              {loading ? <LoadingDots /> : '[fetch -->]'}
            </button>
          </div>
        ) : (
          <button onClick={() => setShowInput(true)} className="text-[#c0a882] text-[11px] font-mono hover:underline">{'[connect letterboxd ->]'}</button>
        )}
        {result && <p className="text-[#666] text-[10px] font-mono mt-1">&gt; {result}</p>}
      </div>
    )
  }

  if (action === 'beli') {
    return (
      <div className="mt-2">
        {showInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="your favorite NYC spots (comma separated)"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-[11px] font-mono text-[#d4d4d4] focus:border-[#c0a882] outline-none"
              onKeyDown={e => e.key === 'Enter' && handleBeli()}
            />
            <button onClick={handleBeli} disabled={loading} className="text-[#c0a882] text-[11px] font-mono hover:underline disabled:opacity-50">
              {loading ? <LoadingDots /> : '[analyze -->]'}
            </button>
          </div>
        ) : (
          <button onClick={() => setShowInput(true)} className="text-[#c0a882] text-[11px] font-mono hover:underline">{'[connect beli ->]'}</button>
        )}
        {result && <p className="text-[#666] text-[10px] font-mono mt-1">&gt; {result}</p>}
      </div>
    )
  }

  return null
}
