'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import TerminalWindow from '@/components/ui/TerminalWindow'
import { createClient } from '@/lib/supabase/client'

const INTERESTS = ['FILM', 'MUSIC', 'FOOD', 'BOOKS', 'ART', 'ARCHITECTURE', 'NIGHTLIFE', 'FASHION', 'SPORT', 'TECH', 'NATURE', 'OTHER']
const NEIGHBORHOODS = ['LOWER EAST SIDE', 'CHINATOWN', 'BUSHWICK', 'RIDGEWOOD', 'WILLIAMSBURG', 'CROWN HEIGHTS', 'ASTORIA', 'HARLEM', 'WEST VILLAGE', 'BED-STUY', 'GREENPOINT', 'JACKSON HEIGHTS', 'FLUSHING', 'SOUTH BRONX', 'STATEN ISLAND', 'LONG ISLAND CITY']
const PLATFORMS = ['SPOTIFY', 'LETTERBOXD', 'BELI']

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState<string[]>([])
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [initLines, setInitLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const router = useRouter()

  const toggle = (arr: string[], item: string, setter: (a: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])
  }

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
    // Save to supabase
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
    // Progress bar
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
    if (step === 4) runInit()
  }, [step, runInit])

  const tileClass = (selected: boolean) =>
    `border rounded px-4 py-3 font-mono text-[12px] cursor-pointer transition-all duration-150 select-none ${
      selected
        ? 'text-[#c0a882] border-[#c0a882] bg-[#c0a882]/[0.08]'
        : 'text-[#555] border-[#3a3a3a] bg-transparent hover:border-[#555]'
    }`

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TerminalWindow title="atlas \u2014 onboarding">
          <div className="relative">
            <div className="absolute top-0 right-0 text-[#444] text-[11px] font-mono">[{step}/4]</div>

            {step === 1 && (
              <div>
                <p className="text-[#c0a882] text-[14px] font-mono mb-4">what pulls you in?</p>
                <div className="grid grid-cols-3 gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggle(interests, i, setInterests)} className={tileClass(interests.includes(i))}>{i}</button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} disabled={interests.length === 0}
                  className="mt-6 text-[#c0a882] text-[12px] font-mono hover:underline disabled:opacity-30 disabled:no-underline">
                  [continue \u2192]
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-[#c0a882] text-[14px] font-mono mb-4">connect your substrate</p>
                <div className="space-y-0">
                  {PLATFORMS.map(p => (
                    <div key={p} className="flex justify-between items-center py-3 border-b border-[#2a2a2a]">
                      <span className="text-[#d4d4d4] font-mono text-[13px]">{p}</span>
                      {connected[p] ? (
                        <span className="text-[#27ae60] text-[11px] font-mono">&bull; connected</span>
                      ) : (
                        <>
                          <span className="text-[#444] text-[11px] font-mono mr-3">not connected</span>
                          <button onClick={() => setConnected(prev => ({ ...prev, [p]: true }))}
                            className="text-[#c0a882] text-[11px] font-mono hover:underline">[connect \u2192]</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(3)} className="text-[#c0a882] text-[12px] font-mono hover:underline">[continue \u2192]</button>
                  <button onClick={() => setStep(3)} className="text-[#333] text-[11px] font-mono hover:text-[#555]">skip for now</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-[#c0a882] text-[14px] font-mono mb-4">where do you move?</p>
                <div className="flex flex-wrap gap-2">
                  {NEIGHBORHOODS.map(n => (
                    <button key={n} onClick={() => toggle(neighborhoods, n, setNeighborhoods)}
                      className={`${tileClass(neighborhoods.includes(n))} rounded-full text-[11px] px-3 py-1.5`}>{n}</button>
                  ))}
                </div>
                <button onClick={() => setStep(4)} disabled={neighborhoods.length === 0}
                  className="mt-6 text-[#c0a882] text-[12px] font-mono hover:underline disabled:opacity-30">
                  [continue \u2192]
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="font-mono text-[12px] space-y-2">
                {initLines.map((line, i) => (
                  <p key={i} className={line.includes('initialized') ? 'text-[#c0a882]' : 'text-[#666]'}>{line}</p>
                ))}
                {progress > 0 && (
                  <div className="h-[1px] bg-[#2a2a2a] rounded overflow-hidden mt-4">
                    <div className="h-full bg-[#c0a882]/30 transition-all duration-100" style={{ width: `${progress}%` }} />
                  </div>
                )}
                {showWelcome && <p className="text-[#d4d4d4] text-[16px] mt-6">welcome to atlas.</p>}
                {showEnter && (
                  <button onClick={() => router.push('/app')}
                    className="text-[#c0a882] text-[12px] font-mono hover:underline mt-4 block">[enter \u2192]</button>
                )}
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    </div>
  )
}
