import { NextResponse } from 'next/server'

const PRICES: Record<string, string> = {
  signal: 'price_signal_placeholder',
  substrate: 'price_substrate_placeholder',
}

export async function POST(request: Request) {
  try {
    const { tier } = await request.json()
    const priceId = PRICES[tier]
    if (!priceId) return NextResponse.json({ error: 'invalid tier' }, { status: 400 })

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey === 'your_stripe_secret_key') {
      return NextResponse.json({ error: 'Stripe not configured', url: '/app/settings' })
    }

    const stripe = require('stripe')(stripeKey)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
