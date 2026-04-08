import Sidebar from '@/components/layout/Sidebar'
import { createServiceClient } from '@/lib/supabase/service'

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
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar userEmail={userEmail} userTier={userTier} />
      <main className="lg:ml-[220px] flex-1 p-6 lg:p-8 overflow-y-auto pt-14 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
