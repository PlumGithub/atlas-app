'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const isValidUrl = (url: string | undefined): boolean =>
  !!url && url.startsWith('http')

const STUB = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }), data: [], error: null }), limit: async () => ({ data: [], error: null }), data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: () => ({ eq: async () => ({ data: null, error: null }) }),
    upsert: async () => ({ data: null, error: null }),
    delete: () => ({ eq: async () => ({ data: null, error: null }) }),
  }),
} as any

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!isValidUrl(url)) return STUB
  return createSupabaseClient(url!, key!)
}
