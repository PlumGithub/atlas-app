'use client'
import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export default function TerminalWindow({ title, children, className = '', glow = false }: Props) {
  return (
    <div
      className={`rounded-lg overflow-hidden border border-[#333]/60 bg-[#1a1a1a] transition-all duration-300 hover:border-[#333] group ${
        glow ? 'shadow-amber-sm hover:shadow-amber-md' : 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      } ${className}`}
    >
      {/* Title bar */}
      <div className="h-10 bg-[#141414] border-b border-[#222] flex items-center px-4 relative">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#facc15]/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/40" />
        </div>
        <span className="text-[11px] font-mono text-[#555] absolute left-1/2 -translate-x-1/2 tracking-wider">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-6 font-mono text-[13px] text-[#ccc] leading-relaxed">
        {children}
      </div>
    </div>
  )
}
