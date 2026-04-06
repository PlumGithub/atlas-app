import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[clamp(48px,8vw,96px)] font-bold text-white tracking-[0.25em] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ATLAS
        </h1>
        <p className="text-[#c0a882] font-mono text-[13px] mt-4 tracking-[0.15em]">
          signal &middot; substrate &middot; nyc
        </p>
        <Link href="/login" className="inline-block mt-8 text-[#666] font-mono text-[12px] hover:text-[#c0a882] transition-colors">
          [enter &rarr;]<span className="inline-block w-2 h-[14px] bg-[#c0a882] align-text-bottom ml-1 animate-pulse" />
        </Link>
      </div>
    </div>
  )
}
