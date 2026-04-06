import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey === 'your_stripe_secret_key') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const _body = await request.text()
    // In production: verify webhook signature, extract session, update user tier
    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
