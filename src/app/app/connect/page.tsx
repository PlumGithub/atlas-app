import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import { createServiceClient } from '@/lib/supabase/service'
import type { SubstrateProfile } from '@/types'

function computeSimilarity(a: SubstrateProfile, b: SubstrateProfile): number {
  let overlap = 0
  let total = 0

  const aTerms = [...a.aesthetic_clusters, ...a.geographic_pulls, ...a.discovery_vectors].map(s => s.toLowerCase())
  const bTerms = [...b.aesthetic_clusters, ...b.geographic_pulls, ...b.discovery_vectors].map(s => s.toLowerCase())

  for (const t of aTerms) {
    total++
    if (bTerms.some(bt => bt.includes(t) || t.includes(bt))) overlap++
  }

  if (total === 0) return 0
  return Math.min(99, Math.round((overlap / total) * 100))
}

export default async function ConnectPage() {
  const supabase = createServiceClient()
  let currentSubstrate: SubstrateProfile | null = null
  let matches: { id: string; similarity: number; shared: string[] }[] = []

  try {
    // Get current user (first user for now)
    const { data: users } = await supabase
      .from('users')
      .select('id, substrate')
      .limit(1)

    if (users && users.length > 0 && users[0].substrate) {
      currentSubstrate = users[0].substrate as SubstrateProfile
      const currentId = users[0].id

      // Get other users with substrates
      const { data: others } = await supabase
        .from('users')
        .select('id, substrate')
        .neq('id', currentId)

      if (others) {
        matches = others
          .filter((u: any) => u.substrate)
          .map((u: any) => {
            const other = u.substrate as SubstrateProfile
            const similarity = computeSimilarity(currentSubstrate!, other)
            const shared = currentSubstrate!.aesthetic_clusters
              .filter(c => other.aesthetic_clusters.some(oc => oc.toLowerCase().includes(c.toLowerCase())))
            return { id: u.id.slice(0, 8), similarity, shared }
          })
          .filter((m: { similarity: number }) => m.similarity > 30)
          .sort((a: { similarity: number }, b: { similarity: number }) => b.similarity - a.similarity)
          .slice(0, 10)
      }
    }
  } catch {}

  if (!currentSubstrate) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <TerminalWindow title="atlas -- connect">
          <div className="text-center py-8 font-mono">
            <p className="text-[#666] text-[13px]">build your substrate first to find matches</p>
            <a href="/app/substrate" className="text-[#c0a882] text-[12px] mt-4 hover:underline block">{'[go to substrate ->]'}</a>
          </div>
        </TerminalWindow>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <AsciiDivider label="community matching" />
      <p className="font-mono text-[11px] text-[#444] mb-4">substrate overlap -- nyc</p>

      {matches.length === 0 ? (
        <TerminalWindow title="atlas -- no matches">
          <div className="text-center py-8 font-mono">
            <p className="text-[#666] text-[12px]">&gt; no substrate matches found yet.</p>
            <p className="text-[#444] text-[11px] mt-2">&gt; more users need to build their profiles.</p>
          </div>
        </TerminalWindow>
      ) : (
        <div className="space-y-3">
          {matches.map(m => (
            <TerminalWindow key={m.id} title={`match_0x${m.id}`}>
              <div className="font-mono text-[12px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#d4d4d4]">&gt; match_0x{m.id}</span>
                  <span className="text-[#c0a882]">similarity: {m.similarity}%</span>
                </div>
                {m.shared.length > 0 && (
                  <p className="text-[#666]">&gt; shared: {m.shared.join(' . ')}</p>
                )}
                <button className="text-[#c0a882] text-[11px] mt-2 hover:underline">{'[signal ->]'}</button>
              </div>
            </TerminalWindow>
          ))}
        </div>
      )}
    </div>
  )
}
