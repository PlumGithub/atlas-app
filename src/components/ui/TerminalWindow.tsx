'use client'
import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
  className?: string
}

export default function TerminalWindow({ title, children, className = '' }: Props) {
  return (
    <div className={`rounded-[10px] overflow-hidden border border-white/[0.06] shadow-[0_32px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm bg-[rgba(26,26,26,0.95)] transition-shadow duration-200 hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="h-9 bg-[#2d2d2d] border-b border-[#3a3a3a] flex items-center px-4 relative">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#c0392b]" />
          <div className="w-3 h-3 rounded-full bg-[#e8b84b]" />
          <div className="w-3 h-3 rounded-full bg-[#27ae60]" />
        </div>
        <span className="text-[11px] font-mono text-[#666] absolute left-1/2 -translate-x-1/2">{title}</span>
      </div>
      <div className="p-5 font-mono text-[12px] text-[#d4d4d4] leading-relaxed">
        {children}
      </div>
    </div>
  )
}
