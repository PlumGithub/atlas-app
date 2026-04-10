'use client'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  const [revealed, setRevealed] = useState(false)
  const [tagline, setTagline] = useState(false)
  const [cta, setCta] = useState(false)

  useEffect(() => {
    setTimeout(() => setRevealed(true), 200)
    setTimeout(() => setTagline(true), 800)
    setTimeout(() => setCta(true), 1400)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Main hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          {/* Wordmark */}
          <h1
            className={`text-[clamp(56px,10vw,96px)] font-bold tracking-[0.25em] leading-none transition-all duration-1000 ease-out ${
              revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: '#ffb000' }}
          >
            ATLAS
          </h1>

          {/* Tagline */}
          <p
            className={`text-[#999] text-[14px] mt-6 tracking-[0.2em] transition-all duration-700 delay-200 ${
              tagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            cultural signal discovery for NYC
          </p>

          <p
            className={`text-[#666] text-[13px] mt-3 leading-relaxed max-w-sm mx-auto transition-all duration-700 delay-300 ${
              tagline ? 'opacity-100' : 'opacity-0'
            }`}
          >
            connect your taste. receive signals matched to your substrate.
            <br />
            the city is talking. are you listening?
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-12 space-y-4 transition-all duration-700 ${
              cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              variant="primary"
              size="lg"
              href="/api/auth/spotify"
              className="w-full max-w-xs mx-auto"
            >
              CONNECT SPOTIFY
            </Button>

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" href="/login">
                SIGN IN
              </Button>
              <Button variant="secondary" size="sm" href="/signup">
                CREATE ACCOUNT
              </Button>
            </div>

            <Button variant="tertiary" size="sm" href="/app" className="mx-auto">
              skip for now
            </Button>
          </div>

          {/* Trust signals */}
          <div
            className={`mt-16 flex justify-center gap-8 text-[10px] tracking-[0.15em] uppercase text-[#444] transition-all duration-700 delay-500 ${
              cta ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span>encrypted</span>
            <span className="text-[#333]">/</span>
            <span>private</span>
            <span className="text-[#333]">/</span>
            <span>nyc only</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[#333] text-[10px] tracking-[0.1em]">
          ATLAS v0.1 -- signal . substrate . nyc
        </p>
      </footer>
    </div>
  )
}
