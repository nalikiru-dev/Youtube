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

  // Check if accessing protected routes
  const protectedRoutes = [
    "/upload",
    "/your-videos",
    "/history",
    "/liked-videos",
    "/watch-later",
    "/subscriptions",
    "/library",
    "/profile",
  ]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    url.pathname = "/auth/signin"
    url.searchParams.set("returnUrl", req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // If accessing auth pages while logged in, redirect to home
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (isAuthRoute && session) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/your-videos/:path*",
    "/history/:path*",
    "/liked-videos/:path*",
    "/watch-later/:path*",
    "/subscriptions/:path*",
    "/library/:path*",
    "/profile/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
}
