import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function H1({ children, className = '', as: Tag = 'h1' }: Props) {
  const Component = Tag as any
  return (
    <Component
      className={`text-[clamp(36px,5vw,48px)] font-bold tracking-[0.05em] leading-[1.1] text-white ${className}`}
    >
      {children}
    </Component>
  )
}

export function H2({ children, className = '', as: Tag = 'h2' }: Props) {
  const Component = Tag as any
  return (
    <Component
      className={`text-[clamp(24px,3.5vw,32px)] font-bold tracking-[0.05em] leading-[1.2] text-white ${className}`}
    >
      {children}
    </Component>
  )
}

export function H3({ children, className = '', as: Tag = 'h3' }: Props) {
  const Component = Tag as any
  return (
    <Component
      className={`text-[20px] font-bold tracking-[0.02em] leading-[1.3] text-white ${className}`}
    >
      {children}
    </Component>
  )
}

export function BodyLg({ children, className = '', as: Tag = 'p' }: Props) {
  const Component = Tag as any
  return (
    <Component className={`text-[16px] font-normal leading-[1.6] text-[#cccccc] ${className}`}>
      {children}
    </Component>
  )
}

export function Body({ children, className = '', as: Tag = 'p' }: Props) {
  const Component = Tag as any
  return (
    <Component className={`text-[14px] font-normal leading-[1.6] text-[#cccccc] ${className}`}>
      {children}
    </Component>
  )
}

export function BodySm({ children, className = '', as: Tag = 'p' }: Props) {
  const Component = Tag as any
  return (
    <Component className={`text-[12px] font-normal leading-[1.5] text-[#888888] ${className}`}>
      {children}
    </Component>
  )
}

export function Label({ children, className = '', as: Tag = 'span' }: Props) {
  const Component = Tag as any
  return (
    <Component
      className={`text-[11px] font-bold tracking-[0.15em] uppercase leading-[1.4] text-[#555555] ${className}`}
    >
      {children}
    </Component>
  )
}

export function MonoCaps({ children, className = '', as: Tag = 'span' }: Props) {
  const Component = Tag as any
  return (
    <Component
      className={`text-[10px] font-bold tracking-[0.2em] uppercase text-[#444444] ${className}`}
    >
      {children}
    </Component>
  )
}

export function Divider({ className = '', label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={`flex items-center gap-4 my-10 ${className}`}>
        <div className="h-px flex-1 bg-[#222]" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#444] font-bold">
          {label}
        </span>
        <div className="h-px flex-1 bg-[#222]" />
      </div>
    )
  }
  return <div className={`h-px w-full bg-[#222] ${className}`} />
}
