import Anthropic from '@anthropic-ai/sdk'
import type { RawRedditPost, ProcessedSignal } from '@/types'

const BATCH_SIZE = 10

function isAnthropicConfigured(): boolean {
  const key = process.env.ANTHROPIC_API_KEY
  return !!key && key !== 'your_anthropic_api_key' && key.startsWith('sk-')
}

export async function processWithClaude(posts: RawRedditPost[]): Promise<ProcessedSignal[]> {
  if (!isAnthropicConfigured()) {
    console.log('[processor] Anthropic API key not configured, skipping processing')
    return []
  }

  const client = new Anthropic()
  const signals: ProcessedSignal[] = []

  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE)

    const prompt = `You are an NYC cultural signal processor. Analyze these Reddit posts and extract culturally relevant signals.

For each post, determine:
1. Is it relevant to NYC culture, food, music, film, art, events, or places?
2. What medium is it? (music, film, food, event, place, object, art)
3. How obscure is it? (0-100, where 100 is extremely niche)
4. Extract relevant tags

Posts to analyze:
${JSON.stringify(batch.map(p => ({ title: p.title, body: p.body.slice(0, 500), subreddit: p.subreddit, score: p.score, url: p.url })), null, 2)}

Respond with a JSON array of objects. Each object should have:
- title: string
- medium: string (music|film|food|event|place|object|art)
- source: string (e.g. "r/FoodNYC (14 upvotes)")
- url: string
- location: string | null (NYC location if mentioned)
- obscurity_score: number (0-100)
- tags: string[] (relevant hashtags without #)
- description: string (1-2 sentences, terse, lowercase)
- is_nyc_relevant: boolean

ONLY return the JSON array, no other text.`

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        const filtered = parsed
          .filter((s: any) => s.is_nyc_relevant && s.obscurity_score >= 50)
          .map((s: any): ProcessedSignal => ({
            title: s.title,
            medium: s.medium,
            source: s.source,
            url: s.url,
            location: s.location,
            obscurity_score: s.obscurity_score,
            tags: s.tags,
            description: s.description,
            created_at: new Date(),
          }))
        signals.push(...filtered)
      }
    } catch (err) {
      console.error('[processor] Claude API error:', err)
    }
  }

  return signals
}
