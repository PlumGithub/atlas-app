'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TerminalWindow from '@/components/ui/TerminalWindow'
import LoadingDots from '@/components/ui/LoadingDots'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('passwords do not match'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          tier: 'free',
          onboarded: false
        })
      }
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TerminalWindow title="atlas \u2014 init">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-[#c0a882] text-[14px] mb-6">initialize new substrate.</p>
            {error && <p className="text-red-400 text-[12px] font-mono">&gt; error: {error}</p>}
            <div>
              <label className="text-[#666] text-[12px] font-mono block mb-1">&gt; email:</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#3a3a3a] focus:border-[#c0a882] outline-none text-[#d4d4d4] font-mono text-[13px] py-2 px-0" style={{ caretColor: '#c0a882' }} required />
            </div>
            <div>
              <label className="text-[#666] text-[12px] font-mono block mb-1">&gt; password:</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#3a3a3a] focus:border-[#c0a882] outline-none text-[#d4d4d4] font-mono text-[13px] py-2 px-0" style={{ caretColor: '#c0a882' }} required />
            </div>
            <div>
              <label className="text-[#666] text-[12px] font-mono block mb-1">&gt; confirm:</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="w-full bg-transparent border-b border-[#3a3a3a] focus:border-[#c0a882] outline-none text-[#d4d4d4] font-mono text-[13px] py-2 px-0" style={{ caretColor: '#c0a882' }} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#c0a882]/10 border border-[#c0a882]/30 hover:bg-[#c0a882]/20 text-[#c0a882] font-mono text-[12px] py-3 rounded transition-colors">
              {loading ? <LoadingDots /> : 'create account \u21b5'}
            </button>
            <p className="text-[#444] text-[11px] font-mono">have an account? <Link href="/login" className="text-[#c0a882] hover:underline">auth \u2192</Link></p>
          </form>
        </TerminalWindow>
      </div>
    </div>
  )
}
