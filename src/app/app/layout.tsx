import Sidebar from '@/components/layout/Sidebar'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let userEmail = 'anonymous'
  let userTier = 'free'

  try {
    const supabase = createServiceClient()
    const { data: users } = await supabase
      .from('users')
      .select('email, tier')
      .limit(1)

    if (users && users.length > 0) {
      userEmail = users[0].email || 'anonymous'
      userTier = users[0].tier || 'free'
    }
  } catch {}

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar userEmail={userEmail} userTier={userTier} />
      <main className="lg:ml-[240px] flex-1 p-6 lg:p-10 overflow-y-auto pt-14 lg:pt-10">
        {children}
      </main>
    </div>
  )
}
