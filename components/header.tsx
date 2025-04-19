"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { useSupabase } from "@/components/supabase-provider"
import { Youtube, Search, Upload, Menu, Loader2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const { session, isLoading } = useSupabase()
  const isMobile = useMobile()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (isMobile) {
        setIsSearchOpen(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {!isSearchOpen && (
          <>
            <Link href="/" className="flex items-center gap-2 mr-4">
              <Youtube className="h-6 w-6 text-red-600" />
              <span className="font-semibold hidden sm:inline-block">YouTube Clone</span>
            </Link>
          </>
        )}

        {(isSearchOpen || !isMobile) && (
          <form onSubmit={handleSearch} className={`${isSearchOpen ? "flex-1" : "flex-1 max-w-xl mx-4"}`}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search"
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">
          {isMobile && !isSearchOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {isSearchOpen && isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          )}

          {!isSearchOpen && (
            <>
              {isLoading ? (
                <Button variant="ghost" size="icon" disabled>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </Button>
              ) : session ? (
                <>
                  <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                    <Link href="/upload">
                      <Upload className="h-5 w-5" />
                      <span className="sr-only">Upload</span>
                    </Link>
                  </Button>
                  <UserNav />
                </>
              ) : (
                <Button asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
