import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const isValidUrl = (url: string | undefined): boolean =>
  !!url && url.startsWith('http')

const STUB = {
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }), order: () => ({ limit: async () => ({ data: [], error: null }) }), data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: () => ({ eq: async () => ({ data: null, error: null }) }),
    upsert: async () => ({ data: null, error: null }),
    delete: () => ({ eq: async () => ({ data: null, error: null }) }),
  }),
} as any

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!isValidUrl(url)) return STUB
  return createSupabaseClient(url!, key!)
}
