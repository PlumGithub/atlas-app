import { NextResponse } from 'next/server'
import { scrapeReddit } from '@/lib/scraper/reddit'
import { processWithClaude } from '@/lib/scraper/processor'
import { saveSignals } from '@/lib/scraper/storage'

export async function GET() {
  try {
    const posts = await scrapeReddit()
    if (posts.length === 0) {
      return NextResponse.json({ success: true, saved: 0, message: 'no posts found' })
    }
    const signals = await processWithClaude(posts)
    const saved = await saveSignals(signals)
    return NextResponse.json({ success: true, scraped: posts.length, processed: signals.length, saved })
  } catch (err) {
    console.error('[cron] scrape error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
