// src/lib/claude.ts

import Anthropic from '@anthropic-ai/sdk'
import type { SubstrateProfile } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface SpotifyData {
  topTracks: Array<{
    name: string
    artist: string
    album?: string
    danceability?: number
    energy?: number
    popularity?: number
  }>
  topArtists: Array<{
    name: string
    genres: string[]
    popularity?: number
  }>
  audioFeatures?: {
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    valence: number
  }
}

/**
 * Synthesize a user's taste fingerprint from Spotify data
 */
export async function synthesizeUserSubstrate(
  spotifyData: SpotifyData
): Promise<SubstrateProfile> {
  const prompt = `You are a cultural taste analyst. Analyze this Spotify data and generate a detailed user substrate profile for ATLAS (a discovery engine for NYC).

SPOTIFY DATA:
${JSON.stringify(spotifyData, null, 2)}

Generate ONLY a valid JSON response (no markdown, no preamble) with this EXACT structure:
{
  "aesthetic_clusters": ["cluster1", "cluster2", "cluster3"],
  "geographic_pulls": ["location1", "location2"],
  "density_preference": "surface|mid|deep",
  "discovery_vectors": ["vector1", "vector2", "vector3"],
  "anti_signals": ["thing1", "thing2"],
  "vibe": "short vibe description",
  "risk_profile": "safe|adventurous|mixed"
}

REQUIREMENTS:

aesthetic_clusters (3-4 tags):
- Music/art style tags that capture their taste DNA
- Examples: "lo-fi cyberpunk", "70s soul", "experimental electronic"

geographic_pulls (2-3 NYC neighborhoods):
- Neighborhoods or locations in NYC that match their taste
- Examples: "Chinatown underground bars", "Ridgewood artist spaces"

density_preference:
- "surface" = minimal, clean, mainstream-adjacent
- "mid" = balanced, some depth
- "deep" = chaotic, layered, maximalist, deep cuts only

discovery_vectors (2-4 specific discovery angles):
- Exact types of things they'd want to discover
- Examples: "pre-2000 Korean film soundtracks", "natural wine bars"

anti_signals (2-3 things they avoid):
- Examples: "mainstream pop", "tourist trap restaurants"

vibe (short string):
- One sentence describing their overall energy

risk_profile:
- "safe" = prefers established, proven
- "adventurous" = seeks unknowns, experimental
- "mixed" = both

Return ONLY the JSON object. No markdown. No explanation. JSON only.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed: any
    try {
      parsed = JSON.parse(responseText)
    } catch {
      console.error('Failed to parse Claude response:', responseText)
      throw new Error('Invalid JSON response from Claude API')
    }

    if (
      !parsed.aesthetic_clusters ||
      !parsed.geographic_pulls ||
      !parsed.discovery_vectors ||
      !parsed.anti_signals
    ) {
      throw new Error('Missing required fields in Claude response')
    }

    // Map density_preference from prompt format to our type
    const densityMap: Record<string, 'surface' | 'mid' | 'deep'> = {
      sparse: 'surface',
      surface: 'surface',
      mixed: 'mid',
      mid: 'mid',
      dense: 'deep',
      deep: 'deep',
    }

    const substrate: SubstrateProfile = {
      aesthetic_clusters: parsed.aesthetic_clusters,
      geographic_pulls: parsed.geographic_pulls,
      discovery_vectors: parsed.discovery_vectors,
      anti_signals: parsed.anti_signals,
      density_preference: densityMap[parsed.density_preference] || 'mid',
      last_synthesized: new Date().toISOString(),
      signature: parsed.vibe || undefined,
      risk_profile: parsed.risk_profile || 'mixed',
    }

    return substrate
  } catch (error) {
    console.error('Error synthesizing substrate:', error)
    throw error
  }
}

/**
 * Fetch user's Spotify profile and top tracks/artists
 */
export async function fetchSpotifyProfile(accessToken: string): Promise<SpotifyData> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }

  try {
    const [tracksResponse, artistsResponse] = await Promise.all([
      fetch(
        'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20',
        { headers }
      ),
      fetch(
        'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=15',
        { headers }
      ),
    ])

    const tracksData = tracksResponse.ok ? await tracksResponse.json() : { items: [] }
    const artistsData = artistsResponse.ok ? await artistsResponse.json() : { items: [] }

    // Fetch audio features for tracks
    const trackIds = (tracksData.items || []).map((t: any) => t.id).join(',')
    let avgFeatures = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      valence: 0,
    }

    if (trackIds) {
      const featuresResponse = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
        { headers }
      )

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        if (featuresData.audio_features) {
          const validFeatures = featuresData.audio_features.filter(
            (f: any) => f !== null
          )
          validFeatures.forEach((f: any) => {
            avgFeatures.acousticness += f.acousticness
            avgFeatures.danceability += f.danceability
            avgFeatures.energy += f.energy
            avgFeatures.instrumentalness += f.instrumentalness
            avgFeatures.valence += f.valence
          })

          const count = validFeatures.length || 1
          Object.keys(avgFeatures).forEach((key) => {
            avgFeatures[key as keyof typeof avgFeatures] /= count
          })
        }
      }
    }

    return {
      topTracks: (tracksData.items || []).map((track: any) => ({
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown',
        album: track.album?.name,
        popularity: track.popularity,
      })),
      topArtists: (artistsData.items || []).map((artist: any) => ({
        name: artist.name,
        genres: artist.genres || [],
        popularity: artist.popularity,
      })),
      audioFeatures: avgFeatures,
    }
  } catch (error) {
    console.error('Error fetching Spotify profile:', error)
    throw error
  }
}

/**
 * Complete flow: fetch Spotify data -> synthesize substrate
 */
export async function generateUserSubstrate(accessToken: string): Promise<SubstrateProfile> {
  const spotifyData = await fetchSpotifyProfile(accessToken)
  const substrate = await synthesizeUserSubstrate(spotifyData)
  return substrate
}
