import SignalCard from '@/components/ui/SignalCard'
import Button from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'
import type { Signal } from '@/types'

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
  let savedSignals: Signal[] = []

  try {
    const supabase = createServiceClient()
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (users && users.length > 0) {
      const { data: saved } = await supabase
        .from('saved_signals')
        .select('signal_id')
        .eq('user_id', users[0].id)

      if (saved && saved.length > 0) {
        const ids = saved.map((s: any) => s.signal_id)
        const { data: signals } = await supabase
          .from('signals')
          .select('*')
          .in('id', ids)

        if (signals) savedSignals = signals as Signal[]
      }
    }
  } catch {}

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-white tracking-wide">Saved Signals</h1>
        <p className="text-[#555] text-[13px] mt-2">Your bookmarked discoveries.</p>
      </div>

      {savedSignals.length === 0 ? (
        <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-12 text-center">
          <p className="text-[#555] text-[14px]">No saved signals yet</p>
          <p className="text-[#444] text-[12px] mt-2">Click [save] on any signal card to bookmark it.</p>
          <Button variant="secondary" size="sm" href="/app" className="mt-6">
            Go to Digest
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {savedSignals.map(signal => (
              <SignalCard key={signal.id} signal={signal} saved />
            ))}
          </div>
          <p className="text-[11px] text-[#333] mt-6 text-center tracking-wider">
            {savedSignals.length} SAVED
          </p>
        </>
      )}
    </div>
  )
}
