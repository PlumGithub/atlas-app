import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'

const MOCK_MATCHES = [
  { id: '0x7a3f', similarity: 94, signals: 'lo-fi japan \u00b7 chinatown \u00b7 edward yang', distance: '~1.2mi' },
  { id: '0x91bb', similarity: 87, signals: 'post-punk \u00b7 ridgewood \u00b7 natural wine', distance: '~0.8mi' },
  { id: '0x4e12', similarity: 79, signals: 'spectacle \u00b7 ambient \u00b7 flushing', distance: '~2.1mi' },
]

export default function ConnectPage() {
  const isSubstrateTier = true // mock

  if (!isSubstrateTier) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <TerminalWindow title="atlas \u2014 locked">
          <div className="text-center py-8 font-mono">
            <p className="text-[#666] text-[13px]">this feature requires substrate tier</p>
            <button className="text-[#c0a882] text-[12px] mt-4 hover:underline">[upgrade \u2192]</button>
          </div>
        </TerminalWindow>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <AsciiDivider label="community matching" />
      <p className="font-mono text-[11px] text-[#444] mb-4">substrate overlap within 5mi \u00b7 nyc</p>
      <div className="space-y-3">
        {MOCK_MATCHES.map(m => (
          <TerminalWindow key={m.id} title={`match_${m.id}`}>
            <div className="font-mono text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#d4d4d4]">&gt; match_{m.id}</span>
                <span className="text-[#c0a882]">similarity: {m.similarity}%</span>
              </div>
              <p className="text-[#666]">&gt; shared signals: {m.signals}</p>
              <p className="text-[#444]">&gt; distance: {m.distance}</p>
              <button className="text-[#c0a882] text-[11px] mt-2 hover:underline">[signal \u2192]</button>
            </div>
          </TerminalWindow>
        ))}
      </div>
    </div>
  )
}
