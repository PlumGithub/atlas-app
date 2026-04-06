import { NextResponse } from 'next/server'
import { scrapeReddit } from '@/lib/scraper/reddit'
import { processWithClaude } from '@/lib/scraper/processor'
import { saveSignals } from '@/lib/scraper/storage'

export async function GET(request: Request) {
  const secret = request.headers.get('x-scrape-secret')
  const expected = process.env.SCRAPE_SECRET || 'atlas-scrape-2024'

  if (secret !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Scrape Reddit
    const posts = await scrapeReddit()
    console.log(`[scrape] scraped ${posts.length} posts from Reddit`)

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        scraped: 0,
        processed: 0,
        saved: 0,
        message: 'No posts scraped. Check Reddit credentials.',
      })
    }

    // Step 2: Process with Claude
    const signals = await processWithClaude(posts)
    console.log(`[scrape] processed ${signals.length} signals`)

    // Step 3: Save to Supabase
    const saved = await saveSignals(signals)
    console.log(`[scrape] saved ${saved} signals`)

    return NextResponse.json({
      success: true,
      scraped: posts.length,
      processed: signals.length,
      saved,
    })
  } catch (err) {
    console.error('[scrape] error:', err)
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}
