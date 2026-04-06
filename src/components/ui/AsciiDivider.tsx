interface Props {
  label: string
}

export default function AsciiDivider({ label }: Props) {
  const labelUpper = label.toUpperCase()
  const innerWidth = 60
  const leftContent = `  \u00a7 ${labelUpper}  `
  const rightTag = `[ATLAS/NYC]`
  const fillLength = Math.max(0, innerWidth - leftContent.length - rightTag.length)
  const fill = '\u2550'.repeat(fillLength)

  return (
    <pre className="font-mono text-[11px] text-[#3a3a3a] whitespace-pre overflow-hidden mb-4 relative z-10">
{`\u2554${'\u2550'.repeat(innerWidth)}\u2557
\u2551${leftContent}${fill}${rightTag}\u2551
\u255a${'\u2550'.repeat(innerWidth)}\u255d`}
    </pre>
  )
}
