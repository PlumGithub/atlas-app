import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />
      <main className="lg:ml-[220px] flex-1 p-6 lg:p-8 overflow-y-auto pt-14 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
