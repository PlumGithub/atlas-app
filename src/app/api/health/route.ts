import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const result: {
    supabase: boolean
    reddit: boolean
    anthropic: boolean
    signals_count: number
    last_scraped: string | null
    users_count: number
  } = {
    supabase: false,
    reddit: false,
    anthropic: false,
    signals_count: 0,
    last_scraped: null,
    users_count: 0,
  }

  // Check Supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && url.startsWith('http')) {
    try {
      const supabase = createServiceClient()
      const { data: signals } = await supabase
        .from('signals')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
      result.supabase = true
      if (signals && signals.length > 0) {
        result.last_scraped = signals[0].created_at
      }
      const { data: allSignals } = await supabase
        .from('signals')
        .select('id')
      result.signals_count = allSignals?.length ?? 0
      const { data: users } = await supabase
        .from('users')
        .select('id')
      result.users_count = users?.length ?? 0
    } catch {
      result.supabase = false
    }
  }

  // Check Reddit
  const redditId = process.env.REDDIT_CLIENT_ID
  result.reddit = !!redditId && redditId !== 'your_reddit_client_id'

  // Check Anthropic
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  result.anthropic = !!anthropicKey && anthropicKey !== 'your_anthropic_api_key' && anthropicKey.startsWith('sk-')

  return NextResponse.json(result)
}
