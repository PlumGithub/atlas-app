import { createServiceClient } from '@/lib/supabase/service'
import type { ProcessedSignal } from '@/types'

export async function saveSignals(signals: ProcessedSignal[]): Promise<number> {
  const supabase = createServiceClient()
  let saved = 0

  for (const signal of signals) {
    const { error } = await supabase.from('signals').upsert(
      {
        title: signal.title,
        medium: signal.medium,
        source: signal.source,
        url: signal.url,
        location: signal.location,
        obscurity_score: signal.obscurity_score,
        tags: signal.tags,
        description: signal.description,
        created_at: signal.created_at.toISOString(),
      },
      { onConflict: 'title,source' }
    )

    if (!error) saved++
    else console.error('[storage] upsert error:', error)
  }

  return saved
}
