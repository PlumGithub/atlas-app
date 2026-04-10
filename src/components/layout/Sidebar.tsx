'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Digest', href: '/app', icon: '>' },
  { label: 'Substrate', href: '/app/substrate', icon: '~' },
  { label: 'Saved', href: '/app/saved', icon: '+' },
  { label: 'Connect', href: '/app/connect', icon: '*' },
  { label: 'Settings', href: '/app/settings', icon: '#' },
]

interface Props {
  userEmail?: string
  userTier?: string
}

export default function Sidebar({ userEmail = 'anonymous', userTier = 'free' }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <>
      {/* Brand */}
      <div className="mb-10 px-2">
        <div className="text-[18px] text-[#ffb000] tracking-[0.3em] font-bold">ATLAS</div>
        <div className="text-[10px] text-[#555] mt-1.5 tracking-[0.15em] uppercase">
          signal . substrate . nyc
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => {
          const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-[12px] px-3 py-2.5 rounded-md font-mono transition-all duration-200 flex items-center gap-3 group ${
                active
                  ? 'text-[#ffb000] bg-[#ffb000]/8 border-l-2 border-[#ffb000]'
                  : 'text-[#666] hover:text-[#ccc] hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-[10px] ${active ? 'text-[#ffb000]' : 'text-[#444] group-hover:text-[#666]'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="pt-6 border-t border-[#222] mt-auto">
        <div className="text-[#444] text-[10px] font-mono truncate">{userEmail}</div>
        <div className="text-[#ffb000]/70 text-[10px] font-mono mt-1 tracking-[0.1em] uppercase">{userTier}</div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden text-[#666] hover:text-[#ffb000] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[240px] bg-[#0e0e0e] border-r border-[#1a1a1a] flex flex-col px-5 py-6 font-mono z-20 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {nav}
      </aside>
    </>
  )
}
