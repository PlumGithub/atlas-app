import TerminalWindow from '@/components/ui/TerminalWindow'
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
    const { data: users } = await supabase
      .from('users')
      .select('id, substrate')
      .limit(1)

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

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[24px] font-bold text-white tracking-wide">Substrate Profile</h1>
        <p className="text-[#555] text-[13px] mt-2">Your taste fingerprint. Drives all signal matching.</p>
      </div>

      {/* Radar + Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex justify-center items-center border border-[#222] rounded-lg bg-[#1a1a1a] p-8">
          <SubstrateRadar substrate={substrate} size={280} />
        </div>

        <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-8">
          {substrate ? (
            <div className="space-y-5">
              <div>
                <span className="text-[#555] text-[10px] tracking-[0.15em] uppercase font-bold">Aesthetic Clusters</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {substrate.aesthetic_clusters.map(c => (
                    <span key={c} className="text-[#ffb000] bg-[#ffb000]/8 px-3 py-1 rounded text-[11px] font-medium">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[#555] text-[10px] tracking-[0.15em] uppercase font-bold">Geographic Pulls</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {substrate.geographic_pulls.map(c => (
                    <span key={c} className="text-[#5b8fa8] bg-[#5b8fa8]/10 px-3 py-1 rounded text-[11px] font-medium">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[#555] text-[10px] tracking-[0.15em] uppercase font-bold">Discovery Vectors</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {substrate.discovery_vectors.map(c => (
                    <span key={c} className="text-[#ccc] bg-white/5 px-3 py-1 rounded text-[11px]">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[#555] text-[10px] tracking-[0.15em] uppercase font-bold">Anti-Signals</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {substrate.anti_signals.map(c => (
                    <span key={c} className="text-[#ef4444]/70 bg-[#ef4444]/8 px-3 py-1 rounded text-[11px]">{c}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                <div className="text-[12px]">
                  <span className="text-[#555]">Density:</span>{' '}
                  <span className="text-white font-medium">{substrate.density_preference}</span>
                </div>
                {substrate.last_synthesized && (
                  <span className="text-[#444] text-[10px]">
                    Synthesized {new Date(substrate.last_synthesized).toLocaleDateString()}
                  </span>
                )}
              </div>
              {substrate.signature && (
                <p className="text-[#666] italic text-[12px] border-t border-[#222] pt-4">&quot;{substrate.signature}&quot;</p>
              )}
              <SubstrateActions userId={userId} action="resynthesize" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-[#555] text-[14px]">No substrate yet</p>
              <p className="text-[#444] text-[12px] mt-2 text-center">Connect your accounts below, then synthesize your profile.</p>
            </div>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mt-12">
        <h2 className="text-[12px] font-bold tracking-[0.15em] text-[#555] uppercase mb-4">Connected Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Spotify */}
          <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-[13px]">Spotify</span>
              {spotifyConnected && <span className="w-2 h-2 rounded-full bg-[#4ade80]" />}
            </div>
            {spotifyConnected ? (
              <p className="text-[#555] text-[11px]">
                {connections.find(c => c.platform === 'spotify')?.metadata?.top_genres?.slice(0, 3).join(', ') || 'Connected'}
              </p>
            ) : (
              <Button variant="secondary" size="sm" href="/api/auth/spotify" className="w-full mt-2">
                Connect
              </Button>
            )}
          </div>

          {/* Letterboxd */}
          <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-[13px]">Letterboxd</span>
              {letterboxdConnected && <span className="w-2 h-2 rounded-full bg-[#4ade80]" />}
            </div>
            {letterboxdConnected ? (
              <p className="text-[#555] text-[11px]">
                {connections.find(c => c.platform === 'letterboxd')?.metadata?.clusters?.slice(0, 2).join(', ') || 'Connected'}
              </p>
            ) : (
              <SubstrateActions userId={userId} action="letterboxd" />
            )}
          </div>

          {/* Beli */}
          <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-[13px]">Beli</span>
              {beliConnected && <span className="w-2 h-2 rounded-full bg-[#4ade80]" />}
            </div>
            {beliConnected ? (
              <p className="text-[#555] text-[11px]">
                {connections.find(c => c.platform === 'beli')?.metadata?.clusters?.slice(0, 2).join(', ') || 'Connected'}
              </p>
            ) : (
              <SubstrateActions userId={userId} action="beli" />
            )}
          </div>
        </div>
      </div>

      {/* Synthesize CTA */}
      {connections.length > 0 && !substrate && (
        <div className="mt-8 text-center">
          <SubstrateActions userId={userId} action="synthesize" />
        </div>
      )}
    </div>
  )
}
