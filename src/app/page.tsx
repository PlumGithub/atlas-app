'use client'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Ambient amber radial behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #ffb000 0%, transparent 60%)',
        }}
      />

      {/* Top bar */}
      <header
        className={`relative z-10 flex justify-between items-center px-8 py-6 transition-opacity duration-700 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-[10px] tracking-[0.25em] text-[#444] uppercase font-bold">
          ATLAS / v0.1
        </div>
        <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] text-[#444] uppercase font-bold">
          <span className="hidden sm:inline">New York City</span>
          <span className="text-[#222]">●</span>
          <span>Invite Only</span>
        </div>
      </header>

      {/* Main hero */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Wordmark */}
          <h1
            className={`text-[clamp(64px,12vw,128px)] font-bold tracking-[0.08em] leading-none transition-all duration-1000 ease-out ${
              phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              color: '#ffb000',
              textShadow: '0 0 40px rgba(255, 176, 0, 0.25), 0 0 80px rgba(255, 176, 0, 0.1)',
            }}
          >
            ATLAS
          </h1>

          {/* Tagline */}
          <div
            className={`mt-10 transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <p className="text-white text-[18px] tracking-[0.05em] font-normal">
              Real signals. No noise.
            </p>
            <p className="text-[#666] text-[13px] mt-3 tracking-[0.15em] uppercase">
              Hyper-personalized cultural discovery for NYC
            </p>
          </div>

          {/* Three-button connection block */}
          <div
            className={`mt-16 transition-all duration-700 ${
              phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="mb-5 text-[10px] tracking-[0.25em] uppercase text-[#444] font-bold">
              Connect your taste
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-xl mx-auto">
              <Button
                variant="secondary"
                size="lg"
                href="/api/auth/spotify"
                className="flex-1 min-w-[160px]"
              >
                Spotify
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/app/substrate"
                className="flex-1 min-w-[160px]"
              >
                Letterboxd
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/app/substrate"
                className="flex-1 min-w-[160px]"
              >
                Beli
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-5">
              <Button variant="tertiary" size="sm" href="/login">
                Sign in
              </Button>
              <span className="text-[#222]">/</span>
              <Button variant="tertiary" size="sm" href="/signup">
                Create account
              </Button>
              <span className="text-[#222]">/</span>
              <Button variant="tertiary" size="sm" href="/app">
                Skip
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 py-8 px-8 border-t border-[#111] transition-opacity duration-700 ${
          phase >= 4 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5 text-[10px] tracking-[0.2em] uppercase text-[#444] font-bold">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
              Encrypted
            </span>
            <span className="text-[#222]">/</span>
            <span>Private</span>
            <span className="text-[#222]">/</span>
            <span>NYC Only</span>
          </div>
          <p className="text-[#333] text-[10px] tracking-[0.15em] uppercase">
            No spam. No tracking. Just signal.
          </p>
        </div>
      </footer>
    </div>
  )
}
