'use client'
import { motion } from 'framer-motion'
import type { SubstrateProfile } from '@/types'

interface Props {
  substrate: SubstrateProfile | null
  size?: number
}

const AXES = ['MUSIC', 'FILM', 'FOOD', 'PLACE', 'TIME', 'DEPTH'] as const

function getValues(substrate: SubstrateProfile | null): number[] {
  if (!substrate) return [30, 30, 30, 30, 30, 30]
  const musicTerms = ['music', 'vinyl', 'lo-fi', 'ambient', 'post-punk', 'jazz', 'club', 'nightlife']
  const filmTerms = ['film', 'cinema', 'screening', 'slow cinema', 'new wave']
  const music = substrate.aesthetic_clusters.some(c => musicTerms.some(t => c.toLowerCase().includes(t))) ? 80 : 40
  const film = substrate.aesthetic_clusters.some(c => filmTerms.some(t => c.toLowerCase().includes(t))) ? 85 : 35
  const food = Math.min(90, substrate.geographic_pulls.length * 15)
  const place = Math.min(80, substrate.geographic_pulls.length * 12)
  const time = substrate.density_preference === 'deep' ? 90 : substrate.density_preference === 'mid' ? 65 : 50
  const depth = Math.min(95, substrate.anti_signals.length * 20 + 40)
  return [music, film, food, place, time, depth]
}

export default function SubstrateRadar({ substrate, size = 240 }: Props) {
  const cx = size / 2, cy = size / 2, R = size * 0.375
  const values = getValues(substrate)
  const angleStep = (Math.PI * 2) / 6

  const getPoint = (i: number, r: number) => ({
    x: cx + Math.cos(angleStep * i - Math.PI / 2) * r,
    y: cy + Math.sin(angleStep * i - Math.PI / 2) * r,
  })

  const rings = [0.33, 0.66, 1.0]
  const dataPoints = values.map((v, i) => getPoint(i, (v / 100) * R))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  return (
    <motion.svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Rings */}
      {rings.map((r, ri) => {
        const pts = Array.from({ length: 6 }, (_, i) => getPoint(i, R * r))
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
        return <path key={ri} d={path} fill="none" stroke="#3a3a3a" strokeWidth="0.5" opacity={0.4} />
      })}

      {/* Axes */}
      {AXES.map((_, i) => {
        const p = getPoint(i, R)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#3a3a3a" strokeWidth="0.5" opacity={0.3} />
      })}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(192,168,130,0.2)" stroke="#c0a882" strokeWidth="1.5" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#c0a882" />
      ))}

      {/* Labels */}
      {AXES.map((label, i) => {
        const p = getPoint(i, R + 18)
        return (
          <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="#666" fontSize="9" fontFamily="'JetBrains Mono', monospace">
            {label}
          </text>
        )
      })}
    </motion.svg>
  )
}
