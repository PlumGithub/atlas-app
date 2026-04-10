import SubstrateRadar from '@/components/ui/SubstrateRadar'
import SubstrateActions from '@/components/SubstrateActions'
import Button from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'
import type { SubstrateProfile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function SubstratePage() {
  let substrate: SubstrateProfile | null = null
  let userId: string | null = null
  let connections: { platform: string; metadata: any; connected_at: string }[] = []

  try {
    const supabase = createServiceClient()
    const { data: users } = await supabase.from('users').select('id, substrate').limit(1)
    if (users && users.length > 0) {
      substrate = users[0].substrate as SubstrateProfile | null
      userId = users[0].id
    }
    if (userId) {
      const { data: conns } = await supabase
        .from('connections')
        .select('platform, metadata, connected_at')
        .eq('user_id', userId)
      if (conns) connections = conns
    }
  } catch {}

  const spotifyConnected = connections.some(c => c.platform === 'spotify')
  const letterboxdConnected = connections.some(c => c.platform === 'letterboxd')
  const beliConnected = connections.some(c => c.platform === 'beli')

  const lastSynthesized = substrate?.last_synthesized
    ? new Date(substrate.last_synthesized).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <div className="max-w-5xl animate-fade-in-up">
      {/* Hero */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#444] font-bold mb-3">
          <span>Home</span>
          <span className="text-[#222]">/</span>
          <span className="text-[#666]">Substrate</span>
        </div>
        <h1 className="text-[clamp(32px,4.5vw,48px)] font-bold text-white tracking-[0.04em] leading-[1.05]">
          Your Substrate
        </h1>
        {substrate?.signature ? (
          <p className="text-[#cccccc] text-[16px] mt-5 italic leading-relaxed max-w-2xl">
            &ldquo;{substrate.signature}&rdquo;
          </p>
        ) : (
          <p className="text-[#888] text-[14px] mt-4 leading-relaxed max-w-xl">
            Your taste fingerprint. Drives all signal matching.
          </p>
        )}
        <div className="mt-8 h-px bg-[#222]" />
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-10">
        {/* LEFT: Taste breakdown */}
        <div className="space-y-10 min-w-0">
          {substrate ? (
            <>
              <Section label="Aesthetic Clusters" index="01">
                <div className="flex flex-wrap gap-2">
                  {substrate.aesthetic_clusters.map(c => (
                    <Pill key={c} color="#ffb000">
                      {c}
                    </Pill>
                  ))}
                </div>
              </Section>

              <Section label="Where You Belong" index="02">
                <div className="flex flex-wrap gap-2">
                  {substrate.geographic_pulls.map(c => (
                    <Pill key={c} color="#5b8fa8">
                      {c}
                    </Pill>
                  ))}
                </div>
              </Section>

              <Section label="What You're Into" index="03">
                <div className="flex flex-wrap gap-2">
                  {substrate.discovery_vectors.map(c => (
                    <Pill key={c} color="#cccccc">
                      {c}
                    </Pill>
                  ))}
                </div>
              </Section>

              {substrate.anti_signals.length > 0 && (
                <Section label="Anti-Signals" index="04">
                  <div className="flex flex-wrap gap-2">
                    {substrate.anti_signals.map(c => (
                      <Pill key={c} color="#ef4444">
                        {c}
                      </Pill>
                    ))}
                  </div>
                </Section>
              )}

              <Section label="Risk Profile" index="05">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#0a0a0a] bg-[#ffb000] px-3 py-1.5 rounded">
                    {substrate.risk_profile || 'Adventurous'}
                  </span>
                  <span className="text-[#666] text-[12px]">
                    Density: <span className="text-white font-mono uppercase">{substrate.density_preference}</span>
                  </span>
                </div>
              </Section>
            </>
          ) : (
            <div className="border border-[#222] rounded-lg bg-[#141414] p-12 text-center">
              <h3 className="text-white text-[18px] font-bold mb-3">No substrate yet</h3>
              <p className="text-[#666] text-[13px] leading-relaxed max-w-md mx-auto mb-6">
                Connect at least one account below, then synthesize your substrate. This is what makes ATLAS personal.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Radar + stats */}
        <aside className="space-y-6">
          <div className="sticky top-10">
            <div className="border border-[#222] rounded-lg bg-[#141414] p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
                  Taste Radar
                </h2>
                <span className="text-[9px] tracking-[0.1em] uppercase text-[#444]">6 axes</span>
              </div>
              <div className="flex justify-center py-4">
                <SubstrateRadar substrate={substrate} size={260} />
              </div>
              {lastSynthesized && (
                <div className="pt-5 border-t border-[#222] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[#444] font-bold">
                      Last synced
                    </span>
                    <span className="text-[10px] text-[#888] font-mono">{lastSynthesized}</span>
                  </div>
                  {substrate && <SubstrateActions userId={userId} action="resynthesize" />}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Divider */}
      <div className="my-16 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#222]" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#444] font-bold">Sources</span>
        <div className="h-px flex-1 bg-[#222]" />
      </div>

      {/* Connected Accounts */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
            Connected Accounts
          </h2>
          <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase">
            {connections.length} / 3
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IntegrationCard
            name="Spotify"
            desc="Music taste + listening history"
            connected={spotifyConnected}
            meta={connections.find(c => c.platform === 'spotify')?.metadata?.top_genres?.slice(0, 3).join(' · ')}
            action={
              <Button variant="secondary" size="sm" href="/api/auth/spotify" className="w-full">
                Connect
              </Button>
            }
          />
          <IntegrationCard
            name="Letterboxd"
            desc="Film diary + watchlist"
            connected={letterboxdConnected}
            meta={connections.find(c => c.platform === 'letterboxd')?.metadata?.clusters?.slice(0, 2).join(' · ')}
            action={<SubstrateActions userId={userId} action="letterboxd" />}
          />
          <IntegrationCard
            name="Beli"
            desc="Restaurant ratings + wishlist"
            connected={beliConnected}
            meta={connections.find(c => c.platform === 'beli')?.metadata?.clusters?.slice(0, 2).join(' · ')}
            action={<SubstrateActions userId={userId} action="beli" />}
          />
        </div>
      </section>

      {/* Synthesize CTA */}
      {connections.length > 0 && !substrate && (
        <div className="mt-10 border border-[#ffb000]/30 rounded-lg bg-[#141414] p-8 text-center">
          <h3 className="text-white text-[18px] font-bold mb-2">Ready to synthesize</h3>
          <p className="text-[#888] text-[13px] mb-5 max-w-md mx-auto">
            You have {connections.length} account{connections.length > 1 ? 's' : ''} connected. Synthesize your
            substrate to start receiving personalized signals.
          </p>
          <SubstrateActions userId={userId} action="synthesize" />
        </div>
      )}
    </div>
  )
}

function Section({
  label,
  index,
  children,
}: {
  label: string
  index: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">{label}</h3>
        <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase font-bold">{index}</span>
      </div>
      {children}
    </div>
  )
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[12px] px-3 py-1.5 rounded border transition-all duration-200 hover:-translate-y-[1px]"
      style={{
        color,
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      {children}
    </span>
  )
}

function IntegrationCard({
  name,
  desc,
  connected,
  meta,
  action,
}: {
  name: string
  desc: string
  connected: boolean
  meta?: string
  action: React.ReactNode
}) {
  return (
    <div className="border border-[#222] rounded-lg bg-[#141414] p-6 hover:border-[#ffb000]/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-bold text-[14px] tracking-wide">{name}</h4>
          <p className="text-[#666] text-[11px] mt-1">{desc}</p>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-[#333]'
          }`}
        />
      </div>
      {connected ? (
        <div className="mt-4 pt-4 border-t border-[#222]">
          <div className="text-[10px] text-[#4ade80] tracking-[0.1em] uppercase font-bold mb-1">Connected</div>
          {meta && <div className="text-[10px] text-[#666] truncate">{meta}</div>}
        </div>
      ) : (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
