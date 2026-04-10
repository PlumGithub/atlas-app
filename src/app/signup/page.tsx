'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
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
    if (password !== confirm) { setError('Passwords do not match'); return }
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="text-[#ffb000] text-[24px] font-bold tracking-[0.25em]">ATLAS</Link>
          <p className="text-[#555] text-[12px] mt-2 tracking-wider">create account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-4 py-3">
              <p className="text-[#ef4444] text-[12px] font-mono">{error}</p>
            </div>
          )}

          <div>
            <label className="text-[#666] text-[11px] font-mono block mb-2 tracking-wider uppercase">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ffb000]/50 rounded-lg outline-none text-white font-mono text-[14px] py-3 px-4 transition-colors"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-[#666] text-[11px] font-mono block mb-2 tracking-wider uppercase">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ffb000]/50 rounded-lg outline-none text-white font-mono text-[14px] py-3 px-4 transition-colors"
              placeholder="*********" required />
          </div>
          <div>
            <label className="text-[#666] text-[11px] font-mono block mb-2 tracking-wider uppercase">Confirm</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ffb000]/50 rounded-lg outline-none text-white font-mono text-[14px] py-3 px-4 transition-colors"
              placeholder="*********" required />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Create Account
          </Button>

          <p className="text-center text-[12px]">
            <span className="text-[#555]">Have an account?</span>{' '}
            <Link href="/login" className="text-[#ffb000] hover:underline underline-offset-4">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
