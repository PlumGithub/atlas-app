import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import SubstrateRadar from '@/components/ui/SubstrateRadar'
import type { SubstrateProfile } from '@/types'

const MOCK_SUBSTRATE: SubstrateProfile = {
  aesthetic_clusters: ['lo-fi japan', 'slow cinema', 'post-punk'],
  geographic_pulls: ['chinatown', 'ridgewood', 'lower east side'],
  discovery_vectors: ['pre-2000 korean film', 'natural wine', 'ambient'],
  anti_signals: ['mainstream', 'tourist', 'viral'],
  density_preference: 'deep',
  last_synthesized: new Date().toISOString()
}

export default function SubstratePage() {
  return (
    <div>
      <AsciiDivider label="substrate profile" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="flex justify-center items-center">
          <SubstrateRadar substrate={MOCK_SUBSTRATE} size={280} />
        </div>
        <TerminalWindow title="substrate readout">
          <div className="space-y-4 text-[12px] font-mono">
            <div><span className="text-[#666]">&gt; aesthetic_clusters</span>
              <div className="flex flex-wrap gap-1 mt-1">{MOCK_SUBSTRATE.aesthetic_clusters.map(c => <span key={c} className="text-[#c0a882]">[{c}]</span>)}</div></div>
            <div><span className="text-[#666]">&gt; geographic_pulls</span>
              <div className="flex flex-wrap gap-1 mt-1">{MOCK_SUBSTRATE.geographic_pulls.map(c => <span key={c} className="text-[#7eb8c9]">[{c}]</span>)}</div></div>
            <div><span className="text-[#666]">&gt; discovery_vectors</span>
              <div className="flex flex-wrap gap-1 mt-1">{MOCK_SUBSTRATE.discovery_vectors.map(c => <span key={c} className="text-[#d4d4d4]">[{c}]</span>)}</div></div>
            <div><span className="text-[#666]">&gt; anti_signals</span>
              <div className="flex flex-wrap gap-1 mt-1">{MOCK_SUBSTRATE.anti_signals.map(c => <span key={c} className="text-red-400/60">[{c}]</span>)}</div></div>
            <div className="text-[#666]">&gt; density: <span className="text-[#c0a882]">{MOCK_SUBSTRATE.density_preference}</span></div>
            <div className="text-[#444]">&gt; last synthesized: {new Date().toLocaleDateString()}</div>
            <button className="text-[#c0a882] text-[11px] hover:underline mt-4 block">[re-synthesize substrate \u2192]</button>
          </div>
        </TerminalWindow>
      </div>
      <AsciiDivider label="connected accounts" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {['SPOTIFY', 'LETTERBOXD', 'BELI'].map(p => (
          <TerminalWindow key={p} title={p.toLowerCase()}>
            <div className="text-center py-4">
              <p className="text-[#444] text-[11px] font-mono">not connected</p>
              <button className="text-[#c0a882] text-[11px] font-mono mt-2 hover:underline">[connect \u2192]</button>
            </div>
          </TerminalWindow>
        ))}
      </div>
    </div>
  )
}
