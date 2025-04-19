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

// Function to handle email verification status
export async function checkEmailVerification() {
  const { session, supabase } = await getSessionWithErrorHandling()

  if (!session) return { verified: false, session: null }

  // If email verification is required, check if the email is verified
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Some Supabase configurations don't require email verification
  // If email_confirmed_at is null but we have a session, we'll consider it verified
  // unless the app specifically requires email verification
  const verified = !user?.email_confirmed_at ? false : true

  return { verified, session }
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

  // Check email verification if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const emailVerificationRequired = process.env.REQUIRE_EMAIL_VERIFICATION === "true"

  if (emailVerificationRequired && !user?.email_confirmed_at) {
    redirect(`/verify-email?email=${encodeURIComponent(user?.email || "")}`)
  }

  return { session, supabase }
}
