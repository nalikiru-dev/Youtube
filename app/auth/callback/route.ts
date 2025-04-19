import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const returnUrl = searchParams.get("returnUrl") || "/"

  if (code) {
    const supabase = createServerClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent("Authentication failed")}`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${returnUrl}`)
}
