import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  accent?: boolean
  onClick?: () => void
  as?: 'div' | 'section' | 'article'
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  accent = false,
  onClick,
  as: Component = 'div',
}: CardProps) {
  const base = 'bg-[#141414] border rounded-lg transition-all duration-200'
  const borderStyle = accent ? 'border-[#ffb000]/40' : 'border-[#222]'
  const hover = hoverable
    ? 'hover:border-[#ffb000]/40 hover:shadow-[0_0_0_1px_rgba(255,176,0,0.1),0_0_20px_rgba(255,176,0,0.08)] hover:-translate-y-[1px] cursor-pointer'
    : ''
  const combined = `${base} ${borderStyle} ${hover} ${className}`

  return (
    <Component className={combined} onClick={onClick}>
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-5 border-b border-[#222] ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-[#222] ${className}`}>{children}</div>
}
