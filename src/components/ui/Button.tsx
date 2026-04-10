'use client'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  href?: string
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#ffb000] text-[#0a0a0a] font-semibold hover:bg-[#ffc933] active:bg-[#cc8c00] shadow-amber-sm hover:shadow-amber-md',
  secondary:
    'bg-transparent border border-[#ffb000]/40 text-[#ffb000] hover:bg-[#ffb000]/10 hover:border-[#ffb000]/70',
  tertiary:
    'bg-transparent text-[#999] hover:text-white hover:underline underline-offset-4',
  danger:
    'bg-transparent border border-[#ef4444]/30 text-[#ef4444]/70 hover:bg-[#ef4444]/10 hover:border-[#ef4444]/50',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-[13px]',
  lg: 'px-8 py-4 text-[14px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  href,
  children,
  className = '',
  disabled,
  ...props
}: Props) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-mono rounded transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed'

  const combined = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={combined}>
        {loading ? <LoadingIndicator /> : children}
      </a>
    )
  }

  return (
    <button className={combined} disabled={disabled || loading} {...props}>
      {loading ? <LoadingIndicator /> : children}
    </button>
  )
}

function LoadingIndicator() {
  return (
    <span className="inline-flex gap-0.5 text-current">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          style={{
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  )
}
