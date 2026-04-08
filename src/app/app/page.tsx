import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import SubstrateRadar from '@/components/ui/SubstrateRadar'
import InitialScrapeButton from '@/components/InitialScrapeButton'
import DigestClient from '@/components/DigestClient'
import { createServiceClient } from '@/lib/supabase/service'
import { scoreSignal } from '@/lib/digest'
import type { Signal, SubstrateProfile } from '@/types'

export default async function DashboardPage() {
  const supabase = createServiceClient()
  let signals: Signal[] = []
  let substrate: SubstrateProfile | null = null
  let isLive = false
  let userId: string | null = null

  try {
    const { data } = await supabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40)

    if (data && data.length > 0) {
      signals = data as Signal[]
      isLive = true
    }
  } catch {}

  // Try to get the first user's substrate for scoring
  // In production this would use the authenticated user's session
  try {
    const { data: users } = await supabase
      .from('users')
      .select('id, substrate')
      .limit(1)

    if (users && users.length > 0) {
      substrate = users[0].substrate as SubstrateProfile | null
      userId = users[0].id
    }
  } catch {}

  // Score and sort signals
  const scored = signals.map(signal => {
    const { score, reason } = substrate
      ? scoreSignal(signal, substrate)
      : { score: 50, reason: 'connect accounts to personalize' }
    return { signal, score, reason }
  })
    .filter(s => s.score > 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  return (
    <div className="flex gap-8">
      <div className="flex-1 max-w-3xl">
        <div className="font-mono text-[11px] text-[#444] mb-6 flex justify-between">
          <span>atlas -- signal digest -- {new Date().toLocaleDateString()} -- nyc</span>
          {isLive && <span className="text-[#27ae60]">* live</span>}
          {!isLive && <span className="text-[#666]">o demo -- no signals yet</span>}
        </div>

        <AsciiDivider label="signal digest" />

        {!isLive && (
          <TerminalWindow title="atlas -- initialize" className="mb-4">
            <div className="space-y-2 text-[#666] font-mono text-[12px]">
              <p className="text-[#c0a882]">&gt; no signals found. run scraper to populate your digest.</p>
              <InitialScrapeButton />
            </div>
          </TerminalWindow>
        )}

        {isLive && !substrate && (
          <TerminalWindow title="atlas -- substrate missing" className="mb-4">
            <div className="space-y-1 text-[#666] font-mono text-[12px]">
              <p className="text-[#c0a882]">&gt; signals are live but you have no substrate profile.</p>
              <p className="text-[#555]">&gt; connect spotify / letterboxd / beli to build your taste profile.</p>
              <a href="/app/substrate" className="text-[#c0a882] text-[11px] hover:underline block mt-2">{'[go to substrate ->]'}</a>
            </div>
          </TerminalWindow>
        )}

        {scored.length > 0 ? (
          <div className="mt-4">
            <DigestClient scored={scored} userId={userId} />
          </div>
        ) : isLive ? (
          <TerminalWindow title="atlas -- empty digest" className="mt-4">
            <p className="text-[#555] font-mono text-[12px]">&gt; no signals matched your substrate above threshold (35%). try re-synthesizing or connecting more accounts.</p>
          </TerminalWindow>
        ) : null}

        <p className="font-mono text-[11px] text-[#333] mt-4 text-center">
          showing {scored.length} signals -- {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="hidden xl:block w-[280px] flex-shrink-0">
        <TerminalWindow title="your substrate" className="sticky top-8">
          <div className="flex justify-center mb-4">
            <SubstrateRadar substrate={substrate} size={200} />
          </div>
          {substrate ? (
            <div className="space-y-3 text-[11px] font-mono">
              <div>
                <span className="text-[#666]">&gt; aesthetic_clusters</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {substrate.aesthetic_clusters.map(c => (
                    <span key={c} className="text-[#c0a882] bg-[#c0a882]/10 px-2 py-0.5 rounded text-[10px]">[{c}]</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[#666]">&gt; geographic_pulls</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {substrate.geographic_pulls.map(c => (
                    <span key={c} className="text-[#7eb8c9] bg-[#7eb8c9]/10 px-2 py-0.5 rounded text-[10px]">[{c}]</span>
                  ))}
                </div>
              </div>
              <div className="text-[#444]">&gt; density: {substrate.density_preference}</div>
              <div className="text-[#333] text-[10px]">&gt; last synthesized: {new Date(substrate.last_synthesized).toLocaleDateString()}</div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#444] text-[11px] font-mono">no substrate yet</p>
              <a href="/app/substrate" className="text-[#c0a882] text-[11px] font-mono mt-2 hover:underline block">{'[build substrate ->]'}</a>
            </div>
          )}
        </TerminalWindow>
      </div>
    </div>
  )
}
