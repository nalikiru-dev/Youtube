import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const returnUrl = searchParams.get("returnUrl") || "/"

  if (code) {
    const supabase = createServerClient()

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication failed")}`)
      }

      // Get the session to ensure it's properly set
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.error("No session after code exchange")
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication failed")}`)
      }

      // Check if the user has a profile, if not create one
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (!profile) {
        // Create a profile for the user
        const username =
          session.user.user_metadata.username ||
          session.user.email?.split("@")[0] ||
          `user_${Math.random().toString(36).substring(2, 10)}`

        await supabase.from("profiles").insert({
          id: session.user.id,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Mark the user as email verified in user_metadata
      // This is a workaround to bypass email verification
      await supabase.auth.updateUser({
        data: { email_verified: true },
      })
    } catch (error) {
      console.error("Error in auth callback:", error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication failed")}`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${returnUrl}`)
}
