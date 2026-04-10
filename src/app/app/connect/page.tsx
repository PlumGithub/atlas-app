import TerminalWindow from '@/components/ui/TerminalWindow'
import Button from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'
import type { SubstrateProfile } from '@/types'

export const dynamic = 'force-dynamic'

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
    const { data: users } = await supabase
      .from('users')
      .select('id, substrate')
      .limit(1)

    if (users && users.length > 0 && users[0].substrate) {
      currentSubstrate = users[0].substrate as SubstrateProfile
      const currentId = users[0].id

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
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-[20px] font-bold text-white">Community Matching</h2>
        <p className="text-[#555] text-[13px] mt-3">Build your substrate first to find people with similar taste.</p>
        <Button variant="primary" size="md" href="/app/substrate" className="mt-6">
          Build Substrate
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-white tracking-wide">Community</h1>
        <p className="text-[#555] text-[13px] mt-2">People with similar substrate profiles in NYC.</p>
      </div>

      {matches.length === 0 ? (
        <div className="border border-[#222] rounded-lg bg-[#1a1a1a] p-12 text-center">
          <p className="text-[#555] text-[14px]">No matches found yet</p>
          <p className="text-[#444] text-[12px] mt-2">More users need to build their profiles.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map(m => (
            <div key={m.id} className="border border-[#222] rounded-lg bg-[#1a1a1a] p-5 hover:border-[#ffb000]/20 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-white font-semibold text-[13px]">0x{m.id}</span>
                  {m.shared.length > 0 && (
                    <p className="text-[#555] text-[11px] mt-1">Shared: {m.shared.join(', ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#ffb000]"
                      style={{ width: `${m.similarity}%` }}
                    />
                  </div>
                  <span className="text-[#ffb000] text-[12px] font-bold tabular-nums">{m.similarity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
