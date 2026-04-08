import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user substrate + connections
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 })
    }

    const { data: connections } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)

    // Build context from all available data
    const substrate = user.substrate || {}
    const spotifyConn = connections?.find((c: any) => c.platform === 'spotify')
    const letterboxdConn = connections?.find((c: any) => c.platform === 'letterboxd')
    const beliConn = connections?.find((c: any) => c.platform === 'beli')

    const context = {
      interests: substrate.aesthetic_clusters || [],
      neighborhoods: substrate.geographic_pulls || [],
      spotify_genres: spotifyConn?.metadata?.top_genres || [],
      spotify_artists: spotifyConn?.metadata?.top_artists || [],
      film_clusters: letterboxdConn?.metadata?.clusters || [],
      food_data: beliConn?.metadata?.spots || [],
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey || anthropicKey === 'your_anthropic_api_key') {
      return NextResponse.json({ error: 'Anthropic not configured' }, { status: 500 })
    }

    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Synthesize a cultural substrate profile. Be specific, not generic.
User selected interests: ${JSON.stringify(context.interests)}
User selected neighborhoods: ${JSON.stringify(context.neighborhoods)}
Spotify top genres: ${JSON.stringify(context.spotify_genres)}
Spotify top artists: ${JSON.stringify(context.spotify_artists)}
Letterboxd taste: ${JSON.stringify(context.film_clusters)}
Beli food spots: ${JSON.stringify(context.food_data)}

Return JSON only — no preamble:
{
  "aesthetic_clusters": string[],
  "geographic_pulls": string[],
  "discovery_vectors": string[],
  "anti_signals": string[],
  "density_preference": "surface"|"mid"|"deep",
  "signature": string
}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'failed to parse Claude response' }, { status: 500 })
    }

    const newSubstrate = JSON.parse(jsonMatch[0])
    newSubstrate.last_synthesized = new Date().toISOString()

    // Save to users table
    await supabase
      .from('users')
      .update({ substrate: newSubstrate })
      .eq('id', userId)

    return NextResponse.json({ success: true, substrate: newSubstrate })
  } catch (err) {
    console.error('[synthesize] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
