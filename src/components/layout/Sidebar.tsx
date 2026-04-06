'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Lock } from 'lucide-react'

const NAV_ITEMS = [
  { label: '[~/] digest', href: '/app' },
  { label: '[~/] substrate', href: '/app/substrate' },
  { label: '[~/] connect', href: '/app/connect', locked: false },
  { label: '[~/] settings', href: '/app/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <>
      <div className="mb-8">
        <div className="text-[13px] text-[#c0a882] tracking-[0.3em] font-bold">ATLAS</div>
        <div className="text-[10px] text-[#444] mt-1">nyc &middot; signal active</div>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-[12px] px-3 py-2 rounded font-mono transition-colors flex items-center gap-2 ${
                active
                  ? 'text-[#c0a882] border-l-2 border-[#c0a882] bg-[#c0a882]/5'
                  : 'text-[#555] hover:text-[#999]'
              }`}
            >
              {item.label}
              {item.locked && <Lock size={10} className="text-[#444]" />}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-8">
        <div className="text-[#333] text-[10px] font-mono">user@atlas.nyc</div>
        <div className="text-[#c0a882] text-[10px] font-mono mt-1 tracking-wider">FREE</div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden text-[#666] hover:text-[#c0a882] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-[220px] bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col px-4 py-6 font-mono z-20 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {nav}
      </aside>
    </>
  )
}
