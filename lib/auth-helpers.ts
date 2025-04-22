import { getSessionWithErrorHandling } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

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

// Function to check if a user is authenticated on the server
export async function isAuthenticated() {
  const { session } = await getSessionWithErrorHandling()
  return !!session
}

// Function to get the current user's ID if authenticated
export async function getCurrentUserId() {
  const { session } = await getSessionWithErrorHandling()
  return session?.user?.id || null
}

// Function to handle email verification status - now always returns verified=true
export async function checkEmailVerification() {
  const { session, supabase } = await getSessionWithErrorHandling()

  if (!session) return { verified: false, session: null }

  // We're bypassing email verification, so always return verified=true
  return { verified: true, session }
}

// Function to handle protected routes
export async function requireAuth(redirectTo?: string) {
  const { session, supabase } = await getSessionWithErrorHandling()

  if (!session) {
    // Store the current URL to redirect back after login
    const currentPath = cookies().get("next-url")?.value || "/"
    const returnUrl = redirectTo || currentPath

    // Redirect to login with the return URL
    redirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  // We're bypassing email verification checks
  return { session, supabase }
}
