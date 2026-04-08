export type UserTier = 'free' | 'signal' | 'substrate'

export type SubstrateProfile = {
  aesthetic_clusters: string[]
  geographic_pulls: string[]
  discovery_vectors: string[]
  anti_signals: string[]
  density_preference: 'surface' | 'mid' | 'deep'
  last_synthesized: string
  signature?: string
  risk_profile?: 'safe' | 'adventurous' | 'mixed'
}

export type AtlasUser = {
  id: string
  email: string
  tier: UserTier
  substrate: SubstrateProfile | null
  onboarded: boolean
  created_at: string
}

export type Signal = {
  id: string
  title: string
  medium: 'music' | 'film' | 'food' | 'event' | 'place' | 'object' | 'art'
  source: string
  url: string | null
  location: string | null
  obscurity_score: number
  tags: string[]
  description: string
  created_at: string
}

export type DigestItem = {
  id: string
  signal: Signal
  match_score: number
  match_reason: string
  served_at: string
}

export type RawRedditPost = {
  title: string
  url: string
  body: string
  score: number
  subreddit: string
  permalink: string
  created_at: Date
  source: 'reddit'
}

export type ProcessedSignal = {
  title: string
  medium: string
  source: string
  url: string
  location: string | null
  obscurity_score: number
  tags: string[]
  description: string
  created_at: Date
}
