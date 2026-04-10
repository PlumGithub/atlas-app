'use client'
import { useEffect, useState } from 'react'

const GLYPHS = ['/', '-', '\\', '|', '.', '*', '+', '~', '^', '#']

export default function LoadingDots() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setFrame(f => f + 1), 120)
    return () => clearInterval(iv)
  }, [])

  const chars = [0, 1, 2, 3].map(i => {
    const idx = (frame + i * 3) % GLYPHS.length
    return GLYPHS[idx]
  })

  return (
    <span className="inline-block font-mono text-[#ffb000] text-[11px] tracking-widest">
      {chars.join('')}
    </span>
  )
}
