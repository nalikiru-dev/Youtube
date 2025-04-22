import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/env-config"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if Supabase environment variables are set
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()

  // If Supabase is not configured and we're not already on the error page or debug page,
  // redirect to the error page
  if (
    (!supabaseUrl || !supabaseAnonKey) &&
    !req.nextUrl.pathname.startsWith("/supabase-error") &&
    !req.nextUrl.pathname.startsWith("/debug")
  ) {
    return NextResponse.redirect(new URL("/supabase-error", req.url))
  }

  try {
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Store the current URL in a cookie for redirects after auth
    res.cookies.set("next-url", req.nextUrl.pathname + req.nextUrl.search, {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
    })

    // Refresh session if available
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log session status for debugging
    console.log(`Middleware: Session ${session ? "exists" : "does not exist"} for path ${req.nextUrl.pathname}`)

    // If session exists but is about to expire, refresh it
    if (session && new Date(session.expires_at * 1000) < new Date(Date.now() + 10 * 60 * 1000)) {
      console.log("Middleware: Session about to expire, refreshing...")
      await supabase.auth.refreshSession()
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error with Supabase and we're not already on the error page,
    // redirect to the error page
    if (!req.nextUrl.pathname.startsWith("/supabase-error") && !req.nextUrl.pathname.startsWith("/debug")) {
      return NextResponse.redirect(new URL("/supabase-error", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that handle their own authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
}
