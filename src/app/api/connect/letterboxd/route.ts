import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { username } = await request.json()
    if (!username) {
      return NextResponse.json({ success: false, error: 'username required' }, { status: 400 })
    }

    // Fetch Letterboxd RSS feed
    const rssUrl = `https://letterboxd.com/${username}/rss/`
    const rssRes = await fetch(rssUrl, {
      headers: { 'User-Agent': 'atlas-connect/1.0' },
    })

    if (!rssRes.ok) {
      return NextResponse.json({
        success: false,
        error: `could not fetch letterboxd profile for "${username}"`,
      }, { status: 404 })
    }

    const rssText = await rssRes.text()

    // Parse film titles from RSS XML
    const titleMatches = rssText.match(/<letterboxd:filmTitle>([^<]+)<\/letterboxd:filmTitle>/g) || []
    const ratingMatches = rssText.match(/<letterboxd:memberRating>([^<]+)<\/letterboxd:memberRating>/g) || []

    const films = titleMatches.map((t, i) => {
      const title = t.replace(/<[^>]+>/g, '')
      const rating = ratingMatches[i]?.replace(/<[^>]+>/g, '') || ''
      return rating ? `${title} (${rating}★)` : title
    })

    if (films.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'no films found — check the username or make your profile public',
      }, { status: 404 })
    }

    // Send to Claude for analysis
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey || anthropicKey === 'your_anthropic_api_key') {
      return NextResponse.json({
        success: true,
        films: films.length,
        clusters: [],
        message: 'films found but Anthropic not configured for analysis',
      })
    }

    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this film list. Return JSON only, no other text:
{ "clusters": string[], "directors": string[], "genres": string[], "eras": string[] }
Films: ${films.slice(0, 50).join(', ')}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { clusters: [], directors: [], genres: [], eras: [] }

    return NextResponse.json({
      success: true,
      films: films.length,
      clusters: analysis.clusters || [],
      directors: analysis.directors || [],
      genres: analysis.genres || [],
      eras: analysis.eras || [],
    })
  } catch (err) {
    console.error('[letterboxd] error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
