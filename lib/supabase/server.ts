import { createServerClient as createServerClientSupabase } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export function createServerClient() {
  const cookieStore = cookies()

  return createServerClientSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Ensure cookies are properly set with secure attributes
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            })
          } catch (error) {
            // Handle cookies in read-only context during SSR
            console.error(`Error setting cookie ${name}:`, error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
              path: "/",
            })
          } catch (error) {
            // Handle cookies in read-only context during SSR
            console.error(`Error removing cookie ${name}:`, error)
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  )
}

// Helper function to get the session with error handling
export async function getSessionWithErrorHandling() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return { session: null, supabase }
    }

    return { session: data.session, supabase }
  } catch (error) {
    console.error("Exception getting session:", error)
    return { session: null, supabase }
  }
}
