import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Spotify not configured' }, { status: 500 })
  }

  const scope = 'user-top-read user-read-recently-played user-library-read user-read-email user-read-private'
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope,
  })

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
}
