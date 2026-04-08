'use client'
import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
  className?: string
}

export default function TerminalWindow({ title, children, className = '' }: Props) {
  return (
    <div className={`rounded-[4px] overflow-hidden border border-[#1e1e1e] shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[#0e0e0e] transition-all duration-200 hover:border-[#2a2a2a] group ${className}`}>
      {/* Title bar — worn terminal chrome */}
      <div className="h-8 bg-[#141414] border-b border-[#1a1a1a] flex items-center px-3 relative">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#c0392b]/40" />
          <div className="w-2 h-2 rounded-full bg-[#e8b84b]/30" />
          <div className="w-2 h-2 rounded-full bg-[#27ae60]/30" />
        </div>
        <span className="text-[10px] font-mono text-[#333] absolute left-1/2 -translate-x-1/2 tracking-wider ghost-text">{title}</span>
        {/* Worn edge detail */}
        <div className="absolute right-3 text-[8px] font-mono text-[#1a1a1a] group-hover:text-[#222]">///</div>
      </div>
      {/* Content area */}
      <div className="p-4 font-mono text-[12px] text-[#d4d4d4] leading-relaxed relative">
        {children}
        {/* Subtle corner wear */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-[#0a0a0a]/20 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
