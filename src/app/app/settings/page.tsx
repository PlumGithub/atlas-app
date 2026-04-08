import TerminalWindow from '@/components/ui/TerminalWindow'
import AsciiDivider from '@/components/ui/AsciiDivider'
import HealthStatus from '@/components/HealthStatus'
import { createServiceClient } from '@/lib/supabase/service'

export default async function SettingsPage() {
  let email = 'not set'
  let tier = 'free'
  let lastSynthesized = 'never'
  let connections: { platform: string; connected_at: string }[] = []

  try {
    const supabase = createServiceClient()
    const { data: users } = await supabase
      .from('users')
      .select('email, tier, substrate')
      .limit(1)

    if (users && users.length > 0) {
      email = users[0].email || 'not set'
      tier = users[0].tier || 'free'
      if (users[0].substrate?.last_synthesized) {
        lastSynthesized = new Date(users[0].substrate.last_synthesized).toLocaleDateString()
      }
    }

    const { data: conns } = await supabase
      .from('connections')
      .select('platform, connected_at')

    if (conns) connections = conns
  } catch {}

  return (
    <div className="max-w-2xl">
      <AsciiDivider label="settings" />
      <TerminalWindow title="atlas -- account">
        <div className="font-mono text-[12px] space-y-4">
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; email</span>
            <span className="text-[#d4d4d4]">{email}</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; tier</span>
            <div className="flex items-center gap-3">
              <span className="text-[#c0a882] uppercase">{tier}</span>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-3">
            <span className="text-[#666]">&gt; substrate</span>
            <span className="text-[#444]">last synthesized: {lastSynthesized}</span>
          </div>
        </div>
      </TerminalWindow>

      <AsciiDivider label="connected accounts" />
      <TerminalWindow title="integrations">
        <div className="font-mono text-[12px] space-y-3">
          {['spotify', 'letterboxd', 'beli'].map(platform => {
            const conn = connections.find(c => c.platform === platform)
            return (
              <div key={platform} className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-0">
                <span className="text-[#d4d4d4] uppercase">{platform}</span>
                <div className="flex items-center gap-3">
                  {conn ? (
                    <span className="text-[#27ae60] text-[11px]">connected {new Date(conn.connected_at).toLocaleDateString()}</span>
                  ) : (
                    <>
                      <span className="text-[#444] text-[11px]">not connected</span>
                      <a href={`/app/substrate`} className="text-[#c0a882] text-[11px] hover:underline">{'[connect ->]'}</a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </TerminalWindow>

      <AsciiDivider label="system health" />
      <HealthStatus />

      <div className="mt-8 border border-red-900/30 rounded-[10px] p-5">
        <p className="text-red-400/60 font-mono text-[12px] font-medium">danger zone</p>
        <p className="text-[#444] font-mono text-[11px] mt-2">this action cannot be undone. your substrate and all associated data will be permanently deleted.</p>
        <button className="text-red-400/60 font-mono text-[11px] mt-3 border border-red-900/30 px-4 py-2 rounded hover:bg-red-900/10 transition-colors">
          {'[delete substrate ->]'}
        </button>
      </div>
    </div>
  )
}
