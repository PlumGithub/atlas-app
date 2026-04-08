// src/app/api/auth/spotify/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateUserSubstrate } from '@/lib/claude'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/app/substrate?error=spotify_denied`
    )
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenRes.ok) {
      console.error('[spotify] token exchange failed:', tokenRes.status)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/app/substrate?error=spotify_token`
      )
    }

    const tokens = await tokenRes.json()
    const { access_token, refresh_token, expires_in } = tokens

    // Step 2: Get user profile from Spotify
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    if (!userResponse.ok) {
      console.error('[spotify] user profile error:', await userResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/app/substrate?error=spotify_profile`
      )
    }

    const spotifyUser = await userResponse.json()
    const spotifyId = spotifyUser.id
    const email = spotifyUser.email

    // Step 3: Synthesize user substrate using Claude
    let substrate = null
    try {
      substrate = await generateUserSubstrate(access_token)
      console.log('[spotify] substrate synthesized:', substrate.signature || 'ok')
    } catch (err) {
      console.error('[spotify] substrate synthesis failed:', err)
      // Continue without substrate — user can re-synthesize later
    }

    // Step 4: Upsert user in Supabase
    const supabase = createServiceClient()
    const { data: user, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          spotify_id: spotifyId,
          email,
          substrate,
          spotify_access_token: access_token,
          spotify_refresh_token: refresh_token,
          token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
          last_synced: new Date().toISOString(),
        },
        { onConflict: 'spotify_id' }
      )
      .select()
      .single()

    if (upsertError) {
      console.error('[spotify] upsert error:', upsertError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/app/substrate?error=db_error`
      )
    }

    // Step 5: Set session cookie and redirect
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/app?auth=success`
    )

    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err) {
    console.error('[spotify] callback error:', err)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/app/substrate?error=spotify_error`
    )
  }
}
