import SignalCard from '@/components/ui/SignalCard'
import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import { createServiceClient } from '@/lib/supabase/service'
import type { Signal } from '@/types'

export default async function SavedPage() {
  let savedSignals: Signal[] = []

  try {
    const supabase = createServiceClient()

    // Get first user
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
      <AsciiDivider label="saved signals" />

      {savedSignals.length === 0 ? (
        <TerminalWindow title="atlas -- saved">
          <div className="text-center py-8 font-mono">
            <p className="text-[#666] text-[12px]">&gt; no saved signals yet</p>
            <p className="text-[#444] text-[11px] mt-2">&gt; click [+] on any signal card to save it</p>
            <a href="/app" className="text-[#c0a882] text-[11px] mt-4 hover:underline block">{'[go to digest ->]'}</a>
          </div>
        </TerminalWindow>
      ) : (
        <div className="space-y-3 mt-4">
          {savedSignals.map(signal => (
            <SignalCard key={signal.id} signal={signal} saved />
          ))}
          <p className="font-mono text-[11px] text-[#333] mt-4 text-center">
            {savedSignals.length} saved signals
          </p>
        </div>
      )}
    </div>
  )
}
