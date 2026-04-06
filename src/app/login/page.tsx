'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TerminalWindow from '@/components/ui/TerminalWindow'
import LoadingDots from '@/components/ui/LoadingDots'
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
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TerminalWindow title="atlas \u2014 auth">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-[#c0a882] text-[14px] mb-6">authenticate.</p>

            {error && (
              <p className="text-red-400 text-[12px] font-mono">&gt; error: {error}</p>
            )}

            <div>
              <label className="text-[#666] text-[12px] font-mono block mb-1">&gt; email:</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#3a3a3a] focus:border-[#c0a882] outline-none text-[#d4d4d4] font-mono text-[13px] py-2 px-0"
                style={{ caretColor: '#c0a882' }}
                required
              />
            </div>

            <div>
              <label className="text-[#666] text-[12px] font-mono block mb-1">&gt; password:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#3a3a3a] focus:border-[#c0a882] outline-none text-[#d4d4d4] font-mono text-[13px] py-2 px-0"
                style={{ caretColor: '#c0a882' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c0a882]/10 border border-[#c0a882]/30 hover:bg-[#c0a882]/20 text-[#c0a882] font-mono text-[12px] py-3 rounded transition-colors"
            >
              {loading ? <LoadingDots /> : 'sign in \u21b5'}
            </button>

            <div className="text-[#444] text-[11px] font-mono space-y-1 mt-4">
              <p>no account? <Link href="/signup" className="text-[#c0a882] hover:underline">init --new \u2192</Link></p>
              <p>forgot? <span className="text-[#555]">reset --password \u2192</span></p>
            </div>
          </form>
        </TerminalWindow>
      </div>
    </div>
  )
}
