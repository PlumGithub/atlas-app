'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
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
    if (!userId) { setResult('No user found'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/substrate/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setResult('Substrate synthesized')
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'Failed')
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
        setResult(`Found ${data.films} films`)
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'Not found')
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
        setResult('Food taste analyzed')
        setTimeout(() => router.refresh(), 1000)
      } else {
        setResult(data.error || 'Failed')
      }
    } catch (e) { setResult(String(e)) }
    setLoading(false)
  }

  if (action === 'resynthesize' || action === 'synthesize') {
    return (
      <div className="mt-4">
        <Button onClick={handleSynthesize} variant="secondary" size="sm" loading={loading}>
          {action === 'resynthesize' ? 'Re-synthesize' : 'Synthesize Substrate'}
        </Button>
        {result && <p className="text-[#555] text-[11px] mt-2">{result}</p>}
      </div>
    )
  }

  if (action === 'letterboxd') {
    return (
      <div className="mt-3">
        {showInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="letterboxd username"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-[12px] font-mono text-white focus:border-[#ffb000]/50 outline-none transition-colors"
              onKeyDown={e => e.key === 'Enter' && handleLetterboxd()}
            />
            <Button onClick={handleLetterboxd} variant="secondary" size="sm" loading={loading}>
              Fetch
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} variant="secondary" size="sm" className="w-full">
            Connect
          </Button>
        )}
        {result && <p className="text-[#555] text-[11px] mt-2">{result}</p>}
      </div>
    )
  }

  if (action === 'beli') {
    return (
      <div className="mt-3">
        {showInput ? (
          <div className="space-y-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="your favorite NYC spots"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-[12px] font-mono text-white focus:border-[#ffb000]/50 outline-none transition-colors"
              onKeyDown={e => e.key === 'Enter' && handleBeli()}
            />
            <Button onClick={handleBeli} variant="secondary" size="sm" loading={loading}>
              Analyze
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} variant="secondary" size="sm" className="w-full">
            Connect
          </Button>
        )}
        {result && <p className="text-[#555] text-[11px] mt-2">{result}</p>}
      </div>
    )
  }

  return null
}
