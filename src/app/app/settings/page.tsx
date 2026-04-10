import HealthStatus from '@/components/HealthStatus'
import Button from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

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
      <div className="mb-10">
        <h1 className="text-[24px] font-bold text-white tracking-wide">Settings</h1>
        <p className="text-[#555] text-[13px] mt-2">Account configuration and system status.</p>
      </div>

      {/* Account */}
      <section className="mb-10">
        <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#555] uppercase mb-4">Account</h2>
        <div className="border border-[#222] rounded-lg bg-[#1a1a1a] divide-y divide-[#222]">
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-[#666] text-[12px]">Email</span>
            <span className="text-white text-[13px]">{email}</span>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-[#666] text-[12px]">Tier</span>
            <span className="text-[#ffb000] text-[12px] font-bold tracking-wider uppercase">{tier}</span>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-[#666] text-[12px]">Substrate</span>
            <span className="text-[#555] text-[12px]">Last synthesized: {lastSynthesized}</span>
          </div>
        </div>
      </section>

      {/* Connections */}
      <section className="mb-10">
        <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#555] uppercase mb-4">Connected Accounts</h2>
        <div className="border border-[#222] rounded-lg bg-[#1a1a1a] divide-y divide-[#222]">
          {['spotify', 'letterboxd', 'beli'].map(platform => {
            const conn = connections.find(c => c.platform === platform)
            return (
              <div key={platform} className="flex justify-between items-center px-6 py-4">
                <span className="text-white text-[13px] capitalize">{platform}</span>
                {conn ? (
                  <span className="flex items-center gap-2 text-[#4ade80] text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                    Connected {new Date(conn.connected_at).toLocaleDateString()}
                  </span>
                ) : (
                  <Button variant="tertiary" size="sm" href="/app/substrate">
                    Connect
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* System Health */}
      <section className="mb-10">
        <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#555] uppercase mb-4">System Health</h2>
        <HealthStatus />
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-[11px] font-bold tracking-[0.15em] text-[#ef4444]/50 uppercase mb-4">Danger Zone</h2>
        <div className="border border-[#ef4444]/20 rounded-lg bg-[#1a1a1a] p-6">
          <p className="text-[#888] text-[12px]">Permanently delete your substrate and all associated data. This cannot be undone.</p>
          <Button variant="danger" size="sm" className="mt-4">
            Delete Substrate
          </Button>
        </div>
      </section>
    </div>
  )
}
