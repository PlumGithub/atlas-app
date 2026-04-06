import type { RawRedditPost } from '@/types'

const NYC_SUBREDDITS = [
  'nyc', 'AskNYC', 'FoodNYC', 'avesNYC', 'NYCbike',
  'newyorkcity', 'Brooklyn', 'Queens', 'Bronx', 'StatenIsland',
  'vinyl', 'LetterboxdOfficial', 'TrueFilm', 'listentothis',
  'obscuremedia', 'indieheads'
]

async function getRedditAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_SECRET

  if (!clientId || clientId === 'your_reddit_client_id' || !clientSecret || clientSecret === 'your_reddit_secret') {
    console.log('[reddit] credentials not configured, skipping')
    return null
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'atlas-scraper/1.0',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    console.error('[reddit] auth failed:', res.status)
    return null
  }

  const data = await res.json()
  return data.access_token
}

async function fetchSubredditPosts(
  token: string,
  subreddit: string,
  sort: 'hot' | 'new' = 'hot',
  limit = 25
): Promise<RawRedditPost[]> {
  const res = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/${sort}?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'atlas-scraper/1.0',
      },
    }
  )

  if (!res.ok) {
    console.error(`[reddit] failed to fetch r/${subreddit}/${sort}:`, res.status)
    return []
  }

  const data = await res.json()
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000

  return (data.data?.children || [])
    .map((child: any) => child.data)
    .filter((post: any) => {
      const createdMs = post.created_utc * 1000
      return post.score < 1000 && createdMs > threeDaysAgo
    })
    .map((post: any): RawRedditPost => ({
      title: post.title,
      url: post.url,
      body: post.selftext || '',
      score: post.score,
      subreddit: post.subreddit,
      permalink: `https://reddit.com${post.permalink}`,
      created_at: new Date(post.created_utc * 1000),
      source: 'reddit',
    }))
}

export async function scrapeReddit(): Promise<RawRedditPost[]> {
  const token = await getRedditAccessToken()
  if (!token) return []

  const allPosts: RawRedditPost[] = []

  for (const sub of NYC_SUBREDDITS) {
    const [hot, fresh] = await Promise.all([
      fetchSubredditPosts(token, sub, 'hot', 25),
      fetchSubredditPosts(token, sub, 'new', 25),
    ])
    allPosts.push(...hot, ...fresh)
    // Rate limit
    await new Promise(r => setTimeout(r, 200))
  }

  // Deduplicate by permalink
  const seen = new Set<string>()
  return allPosts.filter(post => {
    if (seen.has(post.permalink)) return false
    seen.add(post.permalink)
    return true
  })
}
