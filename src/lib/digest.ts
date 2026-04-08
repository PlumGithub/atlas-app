import type { Signal, SubstrateProfile } from '@/types'

export function scoreSignal(signal: Signal, substrate: SubstrateProfile): {
  score: number
  reason: string
} {
  let score = 40
  const reasons: string[] = []

  // 1. GEOGRAPHIC MATCH — highest weight
  if (signal.location) {
    const loc = signal.location.toLowerCase()
    for (const pull of substrate.geographic_pulls) {
      if (loc.includes(pull.toLowerCase().replace(/\s+/g, ' '))) {
        score += 25
        reasons.push(`in your area: ${pull}`)
        break
      }
    }
  }

  // 2. TAG vs CLUSTER MATCH
  const allSubstrateTerms = [
    ...substrate.aesthetic_clusters,
    ...substrate.discovery_vectors
  ].map(s => s.toLowerCase())

  for (const tag of signal.tags) {
    for (const term of allSubstrateTerms) {
      const tagWords = tag.split(/[\s\-_]/)
      const termWords = term.split(/[\s\-_]/)
      const overlap = tagWords.some(w => termWords.includes(w) && w.length > 3)
      if (overlap) {
        score += 18
        reasons.push(`matches ${term}`)
        break
      }
    }
  }

  // 3. MEDIUM PREFERENCE
  const clusters = substrate.aesthetic_clusters.join(' ').toLowerCase()
  if (signal.medium === 'film' && clusters.includes('cinema')) score += 12
  if (signal.medium === 'music' && (clusters.includes('music') || clusters.includes('punk') || clusters.includes('jazz'))) score += 12
  if (signal.medium === 'food' && substrate.geographic_pulls.length > 2) score += 8
  if (signal.medium === 'event') score += 5

  // 4. ANTI-SIGNAL PENALTY
  for (const anti of substrate.anti_signals) {
    if (signal.tags.some(t => t.toLowerCase().includes(anti.toLowerCase())) ||
        signal.title.toLowerCase().includes(anti.toLowerCase())) {
      score -= 30
      reasons.push(`anti-signal: ${anti}`)
      break
    }
  }

  // 5. OBSCURITY BONUS based on density preference
  if (substrate.density_preference === 'deep') {
    score += Math.floor(signal.obscurity_score / 8)
  } else if (substrate.density_preference === 'mid') {
    score += Math.floor(signal.obscurity_score / 15)
  }

  // 6. RECENCY BONUS
  const ageHours = (Date.now() - new Date(signal.created_at).getTime()) / 3600000
  if (ageHours < 12) score += 10
  else if (ageHours < 24) score += 5

  score = Math.min(99, Math.max(5, Math.round(score)))
  return {
    score,
    reason: reasons[0] || 'substrate alignment'
  }
}
