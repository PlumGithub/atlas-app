import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <AsciiDivider label="settings" />
      <TerminalWindow title="atlas \u2014 account">
        <div className="font-mono text-[12px] space-y-4">
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; email</span>
            <span className="text-[#d4d4d4]">user@atlas.nyc</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; tier</span>
            <div className="flex items-center gap-3">
              <span className="text-[#c0a882]">FREE</span>
              <button className="text-[#c0a882] text-[11px] hover:underline">[upgrade plan \u2192]</button>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; substrate</span>
            <span className="text-[#444]">last synthesized: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </TerminalWindow>

      <AsciiDivider label="connected accounts" />
      <TerminalWindow title="integrations">
        <div className="font-mono text-[12px] space-y-3">
          {['SPOTIFY', 'LETTERBOXD', 'BELI'].map(p => (
            <div key={p} className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-0">
              <span className="text-[#d4d4d4]">{p}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#444] text-[11px]">not connected</span>
                <button className="text-[#c0a882] text-[11px] hover:underline">[connect \u2192]</button>
              </div>
            </div>
          ))}
        </div>
      </TerminalWindow>

      <div className="mt-8 border border-red-900/30 rounded-[10px] p-5">
        <p className="text-red-400/60 font-mono text-[12px] font-medium">danger zone</p>
        <p className="text-[#444] font-mono text-[11px] mt-2">this action cannot be undone. your substrate and all associated data will be permanently deleted.</p>
        <button className="text-red-400/60 font-mono text-[11px] mt-3 border border-red-900/30 px-4 py-2 rounded hover:bg-red-900/10 transition-colors">
          [delete substrate \u2192]
        </button>
      </div>
    </div>
  )
}
