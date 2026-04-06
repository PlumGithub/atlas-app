import SignalCard from '@/components/ui/SignalCard'
import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import SubstrateRadar from '@/components/ui/SubstrateRadar'
import InitialScrapeButton from '@/components/InitialScrapeButton'
import { createServiceClient } from '@/lib/supabase/service'
import type { Signal, SubstrateProfile } from '@/types'

const MOCK_SIGNALS: Signal[] = [
  { id: '1', title: 'Kopitiam', medium: 'food', location: 'Canal St, Manhattan', source: 'r/FoodNYC (14 upvotes)', obscurity_score: 91, tags: ['#malaysian', '#chinatown', '#cashonly', '#morning'], description: 'Malaysian coffee shop, cash only. regulars only know about it through word of mouth. closes at 2pm.', url: null, created_at: new Date().toISOString() },
  { id: '2', title: 'N\u00eddia \u2014 live', medium: 'event', location: 'Nowadays, Ridgewood', source: 'resident advisor', obscurity_score: 78, tags: ['#club', '#portuguese', '#ridgewood', '#underground'], description: 'Portuguese club producer, 847 monthly listeners. tekno-kuduro. playing a 6hr set. not promoted on instagram.', url: null, created_at: new Date().toISOString() },
  { id: '3', title: 'Taipei Story (1985)', medium: 'film', location: 'Spectacle Theater, Williamsburg', source: 'spectacletheater.com', obscurity_score: 88, tags: ['#edwardyang', '#taiwanese', '#newwave', '#spectacle'], description: 'Edward Yang. 12 seats. one screening. not listed on google. cash at door.', url: null, created_at: new Date().toISOString() },
  { id: '4', title: 'Unknown Pleasures pressing', medium: 'music', location: null, source: 'r/vinyl (Bushwick)', obscurity_score: 82, tags: ['#vinyl', '#joydivision', '#postpunk', '#bushwick'], description: 'Original Factory pressing, found at a Bushwick estate sale. seller post has 8 upvotes.', url: null, created_at: new Date().toISOString() },
  { id: '5', title: 'Flushing Golden Mall', medium: 'food', location: 'Basement, Flushing Main St', source: 'are.na channel: nyc underground food', obscurity_score: 73, tags: ['#flushing', '#noodles', '#underground', '#cashonly'], description: 'Underground food court. stall b6 does hand-pulled noodles. cash only. no english menu.', url: null, created_at: new Date().toISOString() },
]

const MOCK_SCORES: Record<string, number> = { '1': 96, '2': 89, '3': 94, '4': 87, '5': 91 }

const MOCK_SUBSTRATE: SubstrateProfile = {
  aesthetic_clusters: ['lo-fi japan', 'slow cinema', 'post-punk'],
  geographic_pulls: ['chinatown', 'ridgewood', 'lower east side'],
  discovery_vectors: ['pre-2000 korean film', 'natural wine', 'ambient'],
  anti_signals: ['mainstream', 'tourist', 'viral'],
  density_preference: 'deep',
  last_synthesized: new Date().toISOString()
}

export default async function DashboardPage() {
  let signals: Signal[] = []
  let isLive = false

  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('signals').select('*').order('created_at', { ascending: false }).limit(20)
    if (data && data.length > 0) {
      signals = data as Signal[]
      isLive = true
    }
  } catch {}

  if (!isLive) signals = MOCK_SIGNALS

  return (
    <div className="flex gap-8">
      <div className="flex-1 max-w-3xl">
        <div className="font-mono text-[11px] text-[#444] mb-6 flex justify-between">
          <span>atlas \u2014 signal digest \u2014 {new Date().toLocaleDateString()} \u2014 nyc</span>
          {isLive && <span className="text-[#27ae60]">\u25cf live</span>}
          {!isLive && <span className="text-[#666]">\u25cb demo mode</span>}
        </div>

        <AsciiDivider label="signal digest" />

        {!isLive && (
          <TerminalWindow title="atlas \u2014 initialize" className="mb-4">
            <div className="space-y-2 text-[#666] font-mono text-[12px]">
              <p className="text-[#c0a882]">&gt; showing demo signals. connect supabase + run scraper for live data.</p>
              <InitialScrapeButton />
            </div>
          </TerminalWindow>
        )}

        <div className="space-y-3 mt-4">
          {signals.map(signal => (
            <SignalCard
              key={signal.id}
              signal={signal}
              matchScore={isLive ? Math.floor(70 + Math.random() * 29) : MOCK_SCORES[signal.id]}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] text-[#333] mt-4 text-center">
          showing {signals.length} signals \u00b7 {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="hidden xl:block w-[280px] flex-shrink-0">
        <TerminalWindow title="your substrate" className="sticky top-8">
          <div className="flex justify-center mb-4">
            <SubstrateRadar substrate={MOCK_SUBSTRATE} size={200} />
          </div>
          <div className="space-y-3 text-[11px] font-mono">
            <div>
              <span className="text-[#666]">&gt; aesthetic_clusters</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {MOCK_SUBSTRATE.aesthetic_clusters.map(c => (
                  <span key={c} className="text-[#c0a882] bg-[#c0a882]/10 px-2 py-0.5 rounded text-[10px]">[{c}]</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[#666]">&gt; geographic_pulls</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {MOCK_SUBSTRATE.geographic_pulls.map(c => (
                  <span key={c} className="text-[#7eb8c9] bg-[#7eb8c9]/10 px-2 py-0.5 rounded text-[10px]">[{c}]</span>
                ))}
              </div>
            </div>
            <div className="text-[#444]">&gt; density: {MOCK_SUBSTRATE.density_preference}</div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  )
}
