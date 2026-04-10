'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/app')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-[#ffb000] text-[24px] font-bold tracking-[0.25em]">ATLAS</Link>
          <p className="text-[#555] text-[12px] mt-2 tracking-wider">authenticate</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-4 py-3">
              <p className="text-[#ef4444] text-[12px] font-mono">{error}</p>
            </div>
          )}

          <div>
            <label className="text-[#666] text-[11px] font-mono block mb-2 tracking-wider uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ffb000]/50 rounded-lg outline-none text-white font-mono text-[14px] py-3 px-4 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-[#666] text-[11px] font-mono block mb-2 tracking-wider uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ffb000]/50 rounded-lg outline-none text-white font-mono text-[14px] py-3 px-4 transition-colors"
              placeholder="*********"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Sign In
          </Button>

          <div className="flex justify-between items-center pt-2">
            <Link href="/signup" className="text-[#ffb000] text-[12px] hover:underline underline-offset-4">
              Create account
            </Link>
            <span className="text-[#444] text-[11px]">forgot password?</span>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#222]" />
          <span className="text-[#444] text-[10px] tracking-wider">OR</span>
          <div className="flex-1 h-px bg-[#222]" />
        </div>

        <Button variant="secondary" size="md" href="/api/auth/spotify" className="w-full">
          Continue with Spotify
        </Button>
      </div>
    </div>
  )
}
