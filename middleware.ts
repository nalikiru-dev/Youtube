import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Store the current URL in a cookie for redirects after auth
  const url = req.nextUrl.clone()
  res.cookies.set("next-url", req.nextUrl.pathname + req.nextUrl.search)

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Log session status for debugging
  console.log(`Middleware: Session ${session ? "exists" : "does not exist"} for path ${req.nextUrl.pathname}`)

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
