import TerminalWindow from '@/components/ui/TerminalWindow'
import SubstrateRadar from '@/components/ui/SubstrateRadar'
import InitialScrapeButton from '@/components/InitialScrapeButton'
import DigestClient from '@/components/DigestClient'
import Button from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'
import { scoreSignal } from '@/lib/digest'
import type { Signal, SubstrateProfile } from '@/types'

export const dynamic = 'force-dynamic'

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
    <div className="flex gap-10">
      <div className="flex-1 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-white tracking-wide">Signal Digest</h1>
          <div className="flex items-center gap-4 mt-2 text-[12px] font-mono">
            <span className="text-[#555]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            <span className="text-[#333]">/</span>
            <span className="text-[#555]">NYC</span>
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[#4ade80]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="text-[#666]">NO SIGNALS</span>
            )}
          </div>
        </div>

        {/* Empty states */}
        {!isLive && (
          <TerminalWindow title="initialize" className="mb-6" glow>
            <div className="space-y-3">
              <p className="text-[#ffb000]">No signals found. Run the scraper to populate your digest.</p>
              <InitialScrapeButton />
            </div>
          </TerminalWindow>
        )}

        {isLive && !substrate && (
          <div className="bg-[#ffb000]/5 border border-[#ffb000]/20 rounded-lg p-6 mb-6">
            <p className="text-[#ffb000] text-[14px] font-semibold">Substrate missing</p>
            <p className="text-[#888] text-[13px] mt-1">Signals are live but you have no taste profile. Connect your accounts to get personalized matches.</p>
            <Button variant="secondary" size="sm" href="/app/substrate" className="mt-4">
              Build Substrate
            </Button>
          </div>
        )}

        {/* Signal list */}
        {scored.length > 0 ? (
          <DigestClient scored={scored} userId={userId} />
        ) : isLive ? (
          <TerminalWindow title="empty digest" className="mt-4">
            <p className="text-[#888]">No signals matched your substrate above threshold. Try re-synthesizing or connecting more accounts.</p>
          </TerminalWindow>
        ) : null}

        <p className="text-[11px] text-[#333] mt-6 text-center tracking-wider">
          {scored.length} SIGNALS / {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Substrate sidebar panel */}
      <div className="hidden xl:block w-[300px] flex-shrink-0">
        <div className="sticky top-10 space-y-6">
          <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
            <h2 className="text-[12px] font-bold tracking-[0.15em] text-[#555] uppercase mb-4">Your Substrate</h2>
            <div className="flex justify-center mb-4">
              <SubstrateRadar substrate={substrate} size={220} />
            </div>
            {substrate ? (
              <div className="space-y-4 text-[12px]">
                <div>
                  <span className="text-[#555] text-[10px] tracking-wider uppercase">Clusters</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {substrate.aesthetic_clusters.map(c => (
                      <span key={c} className="text-[#ffb000] bg-[#ffb000]/8 px-2.5 py-1 rounded text-[10px] font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[#555] text-[10px] tracking-wider uppercase">Geography</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {substrate.geographic_pulls.map(c => (
                      <span key={c} className="text-[#5b8fa8] bg-[#5b8fa8]/10 px-2.5 py-1 rounded text-[10px] font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="text-[#555] text-[11px] pt-2 border-t border-[#222]">
                  Density: <span className="text-white">{substrate.density_preference}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#555] text-[12px]">No substrate yet</p>
                <Button variant="secondary" size="sm" href="/app/substrate" className="mt-3">
                  Build Substrate
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
