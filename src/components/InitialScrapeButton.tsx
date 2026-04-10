'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

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
        setResult(`Scraped ${data.scraped} posts / processed ${data.processed} / saved ${data.saved}`)
        setTimeout(() => router.refresh(), 1500)
      } else {
        setResult(`Error: ${data.error}`)
      }
    } catch (e) {
      setResult(`Error: ${String(e)}`)
    }
    setLoading(false)
  }

  return (
    <div className="mt-4">
      <Button onClick={handleScrape} variant="primary" size="sm" loading={loading}>
        Run Initial Scrape
      </Button>
      {result && <p className="text-[#888] text-[11px] mt-3">{result}</p>}
    </div>
  )
}
