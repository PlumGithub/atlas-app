interface Props {
  label: string
}

export default function AsciiDivider({ label }: Props) {
  const labelUpper = label.toUpperCase()
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
  const innerWidth = 60
  const leftContent = `  § ${labelUpper}  `
  const rightTag = `[ ◈ ATLAS · NYC · ${date} ]`
  const fillLength = Math.max(0, innerWidth - leftContent.length - rightTag.length)
  const fill = '═'.repeat(fillLength)

  return (
    <pre className="font-mono text-[11px] text-[#3a3a3a] whitespace-pre overflow-hidden mb-4 relative z-10" style={{ textShadow: '0 0 8px rgba(192,168,130,0.15)' }}>
{`╔${'═'.repeat(innerWidth)}╗
║${leftContent}${fill}${rightTag}║
╚${'═'.repeat(innerWidth)}╝`}
    </pre>
  )
}
