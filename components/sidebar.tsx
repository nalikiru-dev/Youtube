"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSupabase } from "@/components/supabase-provider"
import { Home, Compass, Clock, ThumbsUp, PlaySquare, History, ListVideo, UserCircle, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const pathname = usePathname()
  const { session } = useSupabase()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMobile()

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [isMobile])

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Explore",
      icon: Compass,
      href: "/explore",
      active: pathname === "/explore",
    },
    {
      label: "Subscriptions",
      icon: ListVideo,
      href: "/subscriptions",
      active: pathname === "/subscriptions",
      requiresAuth: true,
    },
    {
      label: "Library",
      icon: PlaySquare,
      href: "/library",
      active: pathname === "/library",
      requiresAuth: true,
    },
    {
      label: "History",
      icon: History,
      href: "/history",
      active: pathname === "/history",
      requiresAuth: true,
    },
    {
      label: "Your Videos",
      icon: PlaySquare,
      href: "/your-videos",
      active: pathname === "/your-videos",
      requiresAuth: true,
    },
    {
      label: "Liked Videos",
      icon: ThumbsUp,
      href: "/liked-videos",
      active: pathname === "/liked-videos",
      requiresAuth: true,
    },
    {
      label: "Watch Later",
      icon: Clock,
      href: "/watch-later",
      active: pathname === "/watch-later",
      requiresAuth: true,
    },
  ]

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300 z-20",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        isMobile && !isCollapsed ? "absolute inset-y-0 left-0 h-screen" : "",
      )}
    >
      <div className="flex items-center h-16 px-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => {
              if (route.requiresAuth && !session) return null

              return (
                <Button
                  key={route.href}
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("justify-start", isCollapsed && "justify-center px-2")}
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="h-5 w-5 mr-2" />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                </Button>
              )
            })}
          </nav>

          {!session && !isCollapsed && (
            <div className="px-4 py-4">
              <p className="text-sm mb-2">Sign in to like videos, comment, and subscribe.</p>
              <Button asChild className="w-full">
                <Link href="/login">
                  <UserCircle className="h-5 w-5 mr-2" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
