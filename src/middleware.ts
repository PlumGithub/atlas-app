import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip auth check if Supabase isn't configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return res

  if (req.nextUrl.pathname.startsWith('/app')) {
    // In production, check session here
    // For now with placeholder env, allow through
    return res
  }
  return res
}

export const config = {
  matcher: ['/app/:path*']
}
