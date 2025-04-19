import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function getServerSession() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return { session, supabase }
  } catch (error) {
    console.error("Error getting session:", error)
    return { session: null, supabase }
  }
}

export async function requireAuth(redirectTo?: string) {
  const { session, supabase } = await getServerSession()

  if (!session) {
    const returnUrl = redirectTo || new URL(cookies().get("next-url")?.value || "/", "http://localhost").pathname
    redirect(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  return { session, supabase }
}
