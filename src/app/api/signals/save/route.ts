import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const { userId, signalId } = await request.json()
    if (!userId || !signalId) {
      return NextResponse.json({ error: 'userId and signalId required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_signals')
      .select('*')
      .eq('user_id', userId)
      .eq('signal_id', signalId)

    if (existing && existing.length > 0) {
      // Unsave
      await supabase
        .from('saved_signals')
        .delete()
        .eq('user_id', userId)
        .eq('signal_id', signalId)
      return NextResponse.json({ saved: false })
    }

    // Save
    await supabase.from('saved_signals').insert({
      user_id: userId,
      signal_id: signalId,
    })

    return NextResponse.json({ saved: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
