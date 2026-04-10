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

  const scored = signals
    .map(signal => {
      const { score, reason } = substrate
        ? scoreSignal(signal, substrate)
        : { score: 50, reason: 'connect accounts to personalize' }
      return { signal, score, reason }
    })
    .filter(s => s.score > 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="animate-fade-in-up">
      <div className="flex gap-12">
        {/* Main feed */}
        <div className="flex-1 max-w-3xl">
          {/* Page header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#444] font-bold mb-3">
              <span>{dateStr}</span>
              <span className="text-[#222]">/</span>
              <span>New York City</span>
              {isLive ? (
                <>
                  <span className="text-[#222]">/</span>
                  <span className="flex items-center gap-1.5 text-[#4ade80]">
                    <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" />
                    Live
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#222]">/</span>
                  <span className="text-[#666]">Dormant</span>
                </>
              )}
            </div>
            <h1 className="text-[clamp(32px,4.5vw,48px)] font-bold text-white tracking-[0.04em] leading-[1.05]">
              Your Digest
            </h1>
            <p className="text-[#888] text-[14px] mt-4 leading-relaxed max-w-xl">
              {scored.length > 0
                ? `${scored.length} signals matched to your substrate today.`
                : 'No signals in your digest yet. Connect your accounts to start receiving matches.'}
            </p>
            <div className="mt-8 h-px bg-[#222]" />
          </header>

          {/* Empty states */}
          {!isLive && (
            <div className="border border-[#ffb000]/20 rounded-lg bg-[#141414] p-8 mb-6 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-[0.08]"
                style={{
                  background: 'radial-gradient(circle, #ffb000 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#ffb000] font-bold mb-2">
                  Initialize
                </div>
                <h3 className="text-white text-[18px] font-bold mb-3">No signals detected</h3>
                <p className="text-[#888] text-[13px] leading-relaxed mb-5 max-w-md">
                  The signal pipeline is empty. Run the scraper to populate your digest with fresh cultural data from
                  across NYC.
                </p>
                <InitialScrapeButton />
              </div>
            </div>
          )}

          {isLive && !substrate && (
            <div className="border border-[#ffb000]/20 rounded-lg bg-[#141414] p-8 mb-6 relative overflow-hidden">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#ffb000] font-bold mb-2">
                Substrate Missing
              </div>
              <h3 className="text-white text-[18px] font-bold mb-3">Build your taste profile</h3>
              <p className="text-[#888] text-[13px] leading-relaxed mb-5 max-w-md">
                Signals are flowing but you have no substrate. Connect your accounts to get personalized matches
                instead of generic signals.
              </p>
              <Button variant="secondary" size="md" href="/app/substrate">
                Build substrate →
              </Button>
            </div>
          )}

          {/* Signal feed */}
          {scored.length > 0 ? (
            <DigestClient scored={scored} userId={userId} />
          ) : isLive ? (
            <div className="border border-[#222] rounded-lg bg-[#141414] p-12 text-center">
              <p className="text-[#666] text-[13px]">
                No signals matched your substrate above the threshold.
              </p>
              <p className="text-[#444] text-[11px] mt-2">
                Try re-synthesizing or connecting more accounts.
              </p>
            </div>
          ) : null}

          {scored.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#444] font-bold">
                {scored.length} signals served
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#444] font-bold">
                Refresh at 06:00
              </span>
            </div>
          )}
        </div>

        {/* Substrate sidebar panel */}
        <aside className="hidden xl:block w-[300px] flex-shrink-0">
          <div className="sticky top-10 space-y-6">
            <div className="border border-[#222] rounded-lg bg-[#141414] p-6">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
                  Your Substrate
                </h2>
                <span className="text-[9px] tracking-[0.1em] uppercase text-[#444]">Live</span>
              </div>
              <div className="flex justify-center mb-5">
                <SubstrateRadar substrate={substrate} size={200} />
              </div>
              {substrate ? (
                <div className="space-y-4 text-[11px]">
                  <div>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[#444] font-bold">Clusters</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {substrate.aesthetic_clusters.slice(0, 4).map(c => (
                        <span
                          key={c}
                          className="text-[#ffb000] bg-[#ffb000]/10 border border-[#ffb000]/20 px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[#444] font-bold">Geography</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {substrate.geographic_pulls.slice(0, 3).map(c => (
                        <span
                          key={c}
                          className="text-[#5b8fa8] bg-[#5b8fa8]/10 border border-[#5b8fa8]/20 px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#222] text-[10px] flex justify-between items-center">
                    <span className="text-[#444] tracking-[0.1em] uppercase font-bold">Density</span>
                    <span className="text-white font-mono tracking-wider uppercase">{substrate.density_preference}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#555] text-[11px] mb-3">No substrate yet</p>
                  <Button variant="secondary" size="sm" href="/app/substrate" className="w-full">
                    Build substrate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
