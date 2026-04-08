// src/app/api/digest/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { scoreSignal } from '@/lib/digest'
import type { Signal, SubstrateProfile } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Fetch user and their substrate
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, substrate')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.substrate) {
      return NextResponse.json(
        { error: 'User substrate not yet generated. Connect Spotify to build your profile.' },
        { status: 400 }
      )
    }

    const substrate = user.substrate as SubstrateProfile

    // Fetch signals from last 7 days
    const { data: signals, error: signalsError } = await supabase
      .from('signals')
      .select('*')
      .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (signalsError || !signals) {
      return NextResponse.json(
        { error: 'Failed to fetch signals' },
        { status: 500 }
      )
    }

    // Score and rank signals using the real scoring algorithm
    const scoredSignals = (signals as Signal[])
      .map((signal) => {
        const { score, reason } = scoreSignal(signal, substrate)
        return { ...signal, match_score: score, match_reason: reason }
      })
      .filter((signal) => signal.match_score > 35)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 15)

    return NextResponse.json({
      user_id: userId,
      email: user.email,
      substrate,
      digest: scoredSignals,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Digest fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
