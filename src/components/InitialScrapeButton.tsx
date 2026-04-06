'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingDots from '@/components/ui/LoadingDots'

export default function InitialScrapeButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  const handleScrape = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scrape', {
        headers: { 'x-scrape-secret': 'atlas-scrape-2024' }
      })
      const data = await res.json()
      if (data.success) {
        setResult(`scraped ${data.scraped} posts \u2192 processed ${data.processed} signals \u2192 saved ${data.saved}`)
        setTimeout(() => router.refresh(), 1500)
      } else {
        setResult(`error: ${data.error}`)
      }
    } catch (e) {
      setResult(`error: ${String(e)}`)
    }
    setLoading(false)
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleScrape}
        disabled={loading}
        className="text-[#c0a882] text-[12px] font-mono hover:underline disabled:opacity-50"
      >
        {loading ? <LoadingDots /> : '[run initial scrape \u2192]'}
      </button>
      {result && <p className="text-[#666] text-[11px] font-mono mt-2">&gt; {result}</p>}
    </div>
  )
}
