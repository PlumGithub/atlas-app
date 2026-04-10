'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const INTERESTS = ['FILM', 'MUSIC', 'FOOD', 'BOOKS', 'ART', 'ARCHITECTURE', 'NIGHTLIFE', 'FASHION', 'SPORT', 'TECH', 'NATURE', 'OTHER']
const NEIGHBORHOODS = ['LOWER EAST SIDE', 'CHINATOWN', 'BUSHWICK', 'RIDGEWOOD', 'WILLIAMSBURG', 'CROWN HEIGHTS', 'ASTORIA', 'HARLEM', 'WEST VILLAGE', 'BED-STUY', 'GREENPOINT', 'JACKSON HEIGHTS', 'FLUSHING', 'SOUTH BRONX', 'STATEN ISLAND', 'LONG ISLAND CITY']

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState<string[]>([])
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [initLines, setInitLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const router = useRouter()

  const toggle = (arr: string[], item: string, setter: (a: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])
  }

  const tileClass = (selected: boolean) =>
    `border rounded-lg px-4 py-3 text-[12px] cursor-pointer transition-all duration-200 select-none font-mono ${
      selected
        ? 'text-[#ffb000] border-[#ffb000]/50 bg-[#ffb000]/8'
        : 'text-[#666] border-[#333] bg-transparent hover:border-[#555] hover:text-[#999]'
    }`

  const runInit = useCallback(async () => {
    const lines = [
      '> analyzing taste vectors...',
      '> cross-referencing 127,442 signals...',
      '> mapping geographic substrate...',
      '> synthesizing fingerprint...',
      '> substrate initialized.'
    ]
    for (let i = 0; i < lines.length; i++) {
      await new Promise(r => setTimeout(r, 800))
      setInitLines(prev => [...prev, lines[i]])
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({
        substrate: {
          aesthetic_clusters: interests.map(i => i.toLowerCase()),
          geographic_pulls: neighborhoods.map(n => n.toLowerCase()),
          discovery_vectors: [],
          anti_signals: [],
          density_preference: 'deep',
          last_synthesized: new Date().toISOString()
        },
        onboarded: true
      }).eq('id', user.id)
    }
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / 1000) * 100)
      setProgress(pct)
      if (pct < 100) requestAnimationFrame(animate)
      else {
        setTimeout(() => setShowWelcome(true), 200)
        setTimeout(() => setShowEnter(true), 800)
      }
    }
    animate()
  }, [interests, neighborhoods])

  useEffect(() => {
    if (step === 3) runInit()
  }, [step, runInit])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-0.5 rounded-full overflow-hidden bg-[#222]">
              <div
                className="h-full bg-[#ffb000] transition-all duration-500"
                style={{ width: step >= s ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="text-[24px] font-bold text-white">What pulls you in?</h1>
            <p className="text-[#555] text-[13px] mt-2 mb-8">Select your interests. This shapes your signal feed.</p>
            <div className="grid grid-cols-3 gap-2">
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggle(interests, i, setInterests)} className={tileClass(interests.includes(i))}>{i}</button>
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(2)}
              disabled={interests.length === 0}
              className="w-full mt-8"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="text-[24px] font-bold text-white">Where do you move?</h1>
            <p className="text-[#555] text-[13px] mt-2 mb-8">Pick your neighborhoods. Signals match to your geography.</p>
            <div className="flex flex-wrap gap-2">
              {NEIGHBORHOODS.map(n => (
                <button key={n} onClick={() => toggle(neighborhoods, n, setNeighborhoods)}
                  className={`${tileClass(neighborhoods.includes(n))} rounded-full text-[11px] px-4 py-2`}>{n}</button>
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(3)}
              disabled={neighborhoods.length === 0}
              className="w-full mt-8"
            >
              Synthesize
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="space-y-2 font-mono text-[13px]">
              {initLines.map((line, i) => (
                <p key={i} className={line.includes('initialized') ? 'text-[#ffb000]' : 'text-[#666]'}>{line}</p>
              ))}
            </div>
            {progress > 0 && (
              <div className="h-0.5 bg-[#222] rounded-full overflow-hidden mt-6">
                <div className="h-full bg-[#ffb000] transition-all duration-100 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            )}
            {showWelcome && (
              <h2 className="text-[28px] font-bold text-white mt-10 animate-fade-in-up">Welcome to ATLAS.</h2>
            )}
            {showEnter && (
              <Button variant="primary" size="lg" onClick={() => router.push('/app')} className="w-full mt-6 animate-fade-in-up">
                Enter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
