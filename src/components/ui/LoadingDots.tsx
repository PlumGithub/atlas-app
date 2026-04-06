'use client'

export default function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#c0a882]"
          style={{
            animation: 'dotPulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </span>
  )
}
