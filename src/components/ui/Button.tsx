'use client'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  href?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#ffb000] text-[#0a0a0a] font-bold hover:bg-[#ffc933] active:bg-[#cc8c00] shadow-[0_0_0_1px_rgba(255,176,0,0.4),0_0_20px_rgba(255,176,0,0.12)] hover:shadow-[0_0_0_1px_rgba(255,176,0,0.6),0_0_30px_rgba(255,176,0,0.3)]',
  secondary:
    'bg-transparent border border-[#333] text-[#ffb000] hover:border-[#ffb000] hover:bg-[#ffb000]/5 hover:shadow-[0_0_20px_rgba(255,176,0,0.12)]',
  tertiary:
    'bg-transparent text-[#888] hover:text-white border border-transparent hover:border-[#333]',
  danger:
    'bg-transparent border border-[#ef4444]/30 text-[#ef4444]/80 hover:bg-[#ef4444]/10 hover:border-[#ef4444]/60 hover:text-[#ef4444]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-[10px] tracking-[0.15em]',
  md: 'px-6 py-3 text-[11px] tracking-[0.15em]',
  lg: 'px-10 py-4 text-[12px] tracking-[0.2em]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  href,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}: Props) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase rounded transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed will-change-transform hover:-translate-y-[1px] active:translate-y-0 no-underline'

  const combined = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  const content = loading ? (
    <LoadingIndicator />
  ) : (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <a href={href} className={combined}>
        {content}
      </a>
    )
  }

  return (
    <button className={combined} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}

function LoadingIndicator() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          style={{
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </span>
  )
}
