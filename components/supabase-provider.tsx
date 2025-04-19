"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient, Session } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  session: Session | null
  isLoading: boolean
  refreshSession: () => Promise<void>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
        return
      }
      setSession(data.session)
    } catch (error) {
      console.error("Failed to refresh session:", error)
    }
  }

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true)

        // Get the initial session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        // If we have a session but it's expired, try to refresh it
        if (initialSession && new Date(initialSession.expires_at * 1000) < new Date()) {
          await refreshSession()
        } else {
          setSession(initialSession)
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed:", event, newSession ? "session exists" : "no session")

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            setSession(newSession)
            router.refresh()

            // Check if the user has a profile, if not create one
            if (newSession) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", newSession.user.id)
                .single()

              if (!profile) {
                // Create a profile for the user
                const username =
                  newSession.user.user_metadata.username ||
                  newSession.user.email?.split("@")[0] ||
                  `user_${Math.random().toString(36).substring(2, 10)}`

                await supabase.from("profiles").insert({
                  id: newSession.user.id,
                  username,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }
            }
          }

          if (event === "SIGNED_OUT") {
            setSession(null)
            router.refresh()
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing session:", error)
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication. Please try signing in again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()
  }, [supabase, router, toast])

  return <Context.Provider value={{ supabase, session, isLoading, refreshSession }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }

  return context
}
