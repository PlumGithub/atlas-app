'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Digest', href: '/app' },
  { label: 'Substrate', href: '/app/substrate' },
  { label: 'Saved', href: '/app/saved' },
  { label: 'Connect', href: '/app/connect' },
  { label: 'Settings', href: '/app/settings' },
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
      <div className="mb-12">
        <Link href="/app" className="block group">
          <div
            className="text-[20px] text-[#ffb000] tracking-[0.25em] font-bold group-hover:text-[#ffc933] transition-colors"
            style={{ textShadow: '0 0 20px rgba(255, 176, 0, 0.3)' }}
          >
            ATLAS
          </div>
          <div className="text-[9px] text-[#444] mt-2 tracking-[0.2em] uppercase font-bold">
            signal . nyc
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 flex-1">
        <div className="text-[9px] tracking-[0.2em] uppercase text-[#333] font-bold mb-3 px-3">
          Navigation
        </div>
        {NAV_ITEMS.map(item => {
          const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`relative text-[12px] px-4 py-3 font-mono font-bold tracking-[0.1em] uppercase transition-all duration-200 flex items-center gap-3 group ${
                active
                  ? 'text-[#ffb000] bg-[#ffb000]/5'
                  : 'text-[#666] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#ffb000] rounded-r"
                  style={{ boxShadow: '0 0 12px rgba(255, 176, 0, 0.5)' }}
                />
              )}
              <span
                className={`text-[9px] ${
                  active ? 'text-[#ffb000]' : 'text-[#333] group-hover:text-[#666]'
                }`}
              >
                ◆
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="pt-6 border-t border-[#1a1a1a] mt-auto">
        <div className="text-[9px] tracking-[0.2em] uppercase text-[#333] font-bold mb-2">
          Account
        </div>
        <div className="text-[#888] text-[11px] font-mono truncate">{userEmail}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#ffb000]/80 text-[9px] font-mono tracking-[0.2em] uppercase font-bold px-2 py-0.5 bg-[#ffb000]/10 border border-[#ffb000]/20 rounded">
            {userTier}
          </span>
          <span className="text-[9px] text-[#333] tracking-[0.1em] uppercase font-bold">v0.1</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden text-[#666] hover:text-[#ffb000] transition-colors p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[240px] bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col px-6 py-8 font-mono z-20 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {nav}
      </aside>
    </>
  )
}
