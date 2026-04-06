'use client'
import { useState, useEffect } from 'react'

interface Props {
  text: string
  delay?: number
  speed?: number
  onComplete?: () => void
  className?: string
}

export default function TypewriterText({ text, delay = 0, speed = 35, onComplete, className = '' }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const startTyping = () => {
      const type = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
          const variance = speed * (0.7 + Math.random() * 0.6)
          timeout = setTimeout(type, variance)
        } else {
          setDone(true)
          onComplete?.()
        }
      }
      type()
    }

    timeout = setTimeout(startTyping, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed, onComplete])

  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      {!done && <span className="inline-block w-2 h-[14px] bg-[#c0a882] align-text-bottom ml-[2px] animate-pulse" />}
    </span>
  )
}
