import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import SubstrateRadar from '@/components/ui/SubstrateRadar'
import SubstrateActions from '@/components/SubstrateActions'
import { createServiceClient } from '@/lib/supabase/service'
import type { SubstrateProfile } from '@/types'

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
    <div>
      <AsciiDivider label="substrate profile" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="flex justify-center items-center">
          <SubstrateRadar substrate={substrate} size={280} />
        </div>
        <TerminalWindow title="substrate readout">
          {substrate ? (
            <div className="space-y-4 text-[12px] font-mono">
              <div><span className="text-[#666]">&gt; aesthetic_clusters</span>
                <div className="flex flex-wrap gap-1 mt-1">{substrate.aesthetic_clusters.map(c => <span key={c} className="text-[#c0a882]">[{c}]</span>)}</div></div>
              <div><span className="text-[#666]">&gt; geographic_pulls</span>
                <div className="flex flex-wrap gap-1 mt-1">{substrate.geographic_pulls.map(c => <span key={c} className="text-[#7eb8c9]">[{c}]</span>)}</div></div>
              <div><span className="text-[#666]">&gt; discovery_vectors</span>
                <div className="flex flex-wrap gap-1 mt-1">{substrate.discovery_vectors.map(c => <span key={c} className="text-[#d4d4d4]">[{c}]</span>)}</div></div>
              <div><span className="text-[#666]">&gt; anti_signals</span>
                <div className="flex flex-wrap gap-1 mt-1">{substrate.anti_signals.map(c => <span key={c} className="text-red-400/60">[{c}]</span>)}</div></div>
              <div className="text-[#666]">&gt; density: <span className="text-[#c0a882]">{substrate.density_preference}</span></div>
              {substrate.last_synthesized && (
                <div className="text-[#444]">&gt; last synthesized: {new Date(substrate.last_synthesized).toLocaleDateString()}</div>
              )}
              {substrate.signature && (
                <div className="text-[#555] italic mt-2 border-t border-[#2a2a2a] pt-3">&quot;{substrate.signature}&quot;</div>
              )}
              <SubstrateActions userId={userId} action="resynthesize" />
            </div>
          ) : (
            <div className="text-center py-8 font-mono">
              <p className="text-[#666] text-[12px]">&gt; no substrate profile yet</p>
              <p className="text-[#444] text-[11px] mt-2">&gt; connect your accounts below, then synthesize</p>
            </div>
          )}
        </TerminalWindow>
      </div>

      <AsciiDivider label="connected accounts" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <TerminalWindow title="spotify">
          <div className="text-center py-4">
            {spotifyConnected ? (
              <>
                <p className="text-[#27ae60] text-[11px] font-mono">connected</p>
                <p className="text-[#444] text-[10px] font-mono mt-1">{connections.find(c => c.platform === 'spotify')?.metadata?.top_genres?.slice(0, 3).join(', ') || ''}</p>
              </>
            ) : (
              <>
                <p className="text-[#444] text-[11px] font-mono">not connected</p>
                <a href="/api/auth/spotify" className="text-[#c0a882] text-[11px] font-mono mt-2 hover:underline block">{'[connect spotify ->]'}</a>
              </>
            )}
          </div>
        </TerminalWindow>

        <TerminalWindow title="letterboxd">
          <div className="text-center py-4">
            {letterboxdConnected ? (
              <>
                <p className="text-[#27ae60] text-[11px] font-mono">connected</p>
                <p className="text-[#444] text-[10px] font-mono mt-1">{connections.find(c => c.platform === 'letterboxd')?.metadata?.clusters?.slice(0, 2).join(', ') || ''}</p>
              </>
            ) : (
              <>
                <p className="text-[#444] text-[11px] font-mono">not connected</p>
                <SubstrateActions userId={userId} action="letterboxd" />
              </>
            )}
          </div>
        </TerminalWindow>

        <TerminalWindow title="beli">
          <div className="text-center py-4">
            {beliConnected ? (
              <>
                <p className="text-[#27ae60] text-[11px] font-mono">connected</p>
                <p className="text-[#444] text-[10px] font-mono mt-1">{connections.find(c => c.platform === 'beli')?.metadata?.clusters?.slice(0, 2).join(', ') || ''}</p>
              </>
            ) : (
              <>
                <p className="text-[#444] text-[11px] font-mono">not connected</p>
                <SubstrateActions userId={userId} action="beli" />
              </>
            )}
          </div>
        </TerminalWindow>
      </div>

      {connections.length > 0 && !substrate && (
        <div className="mt-6 text-center">
          <SubstrateActions userId={userId} action="synthesize" />
        </div>
      )}
    </div>
  )
}
