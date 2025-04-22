import { createServerClient as createServerClientSupabase } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/env-config"

export function createServerClient() {
  const cookieStore = cookies()
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete. Check your environment variables.")
  }

  return createServerClientSupabase<Database>(supabaseUrl, supabaseAnonKey, {
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
  })
}

// Helper function to get the session with error handling
export async function getSessionWithErrorHandling() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return { session: null, supabase }
    }

    return { session: data.session, supabase }
  } catch (error) {
    console.error("Exception getting session:", error)
    return { session: null, supabase: null }
  }
}
