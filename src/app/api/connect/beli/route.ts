import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { username, manualSpots } = await request.json()

    // If manual spots provided (fallback), analyze those
    if (manualSpots) {
      const anthropicKey = process.env.ANTHROPIC_API_KEY
      if (!anthropicKey || anthropicKey === 'your_anthropic_api_key') {
        return NextResponse.json({ success: true, clusters: [], message: 'Anthropic not configured' })
      }

      const client = new Anthropic()
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Analyze these favorite NYC food spots and return JSON only:
{ "clusters": string[], "cuisines": string[], "neighborhoods": string[], "vibe": string }
Spots: ${manualSpots}`,
        }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { clusters: [], cuisines: [], neighborhoods: [], vibe: '' }

      return NextResponse.json({ success: true, ...analysis })
    }

    if (!username) {
      return NextResponse.json({ success: false, error: 'username or manual spots required' }, { status: 400 })
    }

    // Try to fetch Beli profile
    try {
      const res = await fetch(`https://beliapp.com/${username}`, {
        headers: { 'User-Agent': 'atlas-connect/1.0' },
      })

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          fallback: true,
          message: 'could not access beli profile — enter your top spots manually',
        })
      }

      // If accessible, try to parse
      const html = await res.text()
      // Simple extraction of restaurant names from page
      const nameMatches = html.match(/class="[^"]*restaurant[^"]*"[^>]*>([^<]+)</gi) || []
      const spots = nameMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean)

      if (spots.length === 0) {
        return NextResponse.json({
          success: false,
          fallback: true,
          message: 'no spots found — enter your favorites manually',
        })
      }

      return NextResponse.json({ success: true, spots })
    } catch {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'beli not accessible — enter your top spots manually',
      })
    }
  } catch (err) {
    console.error('[beli] error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
