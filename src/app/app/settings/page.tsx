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
        lastSynthesized = new Date(users[0].substrate.last_synthesized).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      }
    }

    const { data: conns } = await supabase.from('connections').select('platform, connected_at')
    if (conns) connections = conns
  } catch {}

  const integrations = [
    { key: 'spotify', name: 'Spotify', desc: 'Music taste + listening history' },
    { key: 'letterboxd', name: 'Letterboxd', desc: 'Film diary + watchlist' },
    { key: 'beli', name: 'Beli', desc: 'Restaurant ratings + wishlist' },
  ]

  return (
    <div className="max-w-3xl animate-fade-in-up">
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#444] font-bold mb-3">
          <span>Home</span>
          <span className="text-[#222]">/</span>
          <span className="text-[#666]">Settings</span>
        </div>
        <h1 className="text-[clamp(32px,4vw,40px)] font-bold text-white tracking-[0.04em] leading-[1.1]">
          Account Settings
        </h1>
        <p className="text-[#888] text-[14px] mt-3 leading-relaxed max-w-xl">
          Configuration, integrations, and system status for your ATLAS account.
        </p>
        <div className="mt-8 h-px bg-[#222]" />
      </header>

      {/* Account */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
            Account
          </h2>
          <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase">01</span>
        </div>
        <div className="border border-[#222] rounded-lg bg-[#141414] divide-y divide-[#222]">
          <Row label="Email" value={email} />
          <Row
            label="Plan"
            value={
              <div className="flex items-center gap-3">
                <span className="text-[#ffb000] text-[11px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-[#ffb000]/10 border border-[#ffb000]/30 rounded">
                  {tier}
                </span>
                {tier === 'free' && (
                  <Button variant="tertiary" size="sm">
                    Upgrade plan →
                  </Button>
                )}
              </div>
            }
          />
          <Row label="Substrate synced" value={<span className="text-[#888] text-[12px]">{lastSynthesized}</span>} />
          <div className="px-6 py-4 flex justify-end">
            <Button variant="secondary" size="sm">
              Resync substrate
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
            Integrations
          </h2>
          <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase">02</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {integrations.map(({ key, name, desc }) => {
            const conn = connections.find(c => c.platform === key)
            const connected = !!conn
            return (
              <div
                key={key}
                className="group border border-[#222] rounded-lg bg-[#141414] p-5 hover:border-[#ffb000]/40 hover:shadow-[0_0_20px_rgba(255,176,0,0.08)] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white text-[14px] font-bold tracking-wide">{name}</h3>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connected ? 'bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-[#333]'
                    }`}
                  />
                </div>
                <p className="text-[#666] text-[11px] leading-relaxed mb-4 h-[30px]">{desc}</p>
                {connected ? (
                  <div className="space-y-2">
                    <div className="text-[10px] text-[#4ade80] tracking-[0.1em] uppercase font-bold">
                      Connected
                    </div>
                    <div className="text-[10px] text-[#555]">
                      {new Date(conn!.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    href={key === 'spotify' ? '/api/auth/spotify' : '/app/substrate'}
                    className="w-full"
                  >
                    Connect
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* System Health */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#ffb000] uppercase">
            System Health
          </h2>
          <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase">03</span>
        </div>
        <HealthStatus />
      </section>

      {/* Danger zone */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#ef4444]/70 uppercase">
            Danger Zone
          </h2>
          <span className="text-[10px] text-[#444] tracking-[0.15em] uppercase">04</span>
        </div>
        <div className="border border-[#ef4444]/20 rounded-lg bg-[#141414] p-6">
          <h3 className="text-white text-[14px] font-bold mb-2">Delete substrate</h3>
          <p className="text-[#666] text-[12px] leading-relaxed mb-5 max-w-lg">
            Permanently delete your substrate profile and all associated signals. This action cannot be undone. Your
            account will remain but you&apos;ll need to rebuild your taste profile from scratch.
          </p>
          <Button variant="danger" size="sm">
            Delete substrate
          </Button>
        </div>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center px-6 py-5">
      <span className="text-[#666] text-[11px] tracking-[0.1em] uppercase font-bold">{label}</span>
      <span className="text-white text-[13px] font-mono">{value}</span>
    </div>
  )
}
