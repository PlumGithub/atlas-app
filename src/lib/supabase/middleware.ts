import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createStubClient, hasRealSupabase } from "./stub";

export async function updateSession(req: NextRequest) {
  const res = NextResponse.next();
  if (!hasRealSupabase()) {
    return { res, session: null, supabase: createStubClient() };
  }
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return { res, session, supabase };
}
