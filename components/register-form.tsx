"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import Link from "next/link"
import { getBaseUrl } from "@/lib/env-config"

export function RegisterForm({ returnUrl = "/" }: { returnUrl?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { supabase, refreshSession } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Get the base URL for proper redirects
      const baseUrl = getBaseUrl()
      const callbackUrl = `${baseUrl}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`

      console.log("Using callback URL:", callbackUrl)

      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split("@")[0],
          },
          // We're still setting emailRedirectTo for cases where email verification might be enabled
          emailRedirectTo: callbackUrl,
        },
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error("This email is already registered. Please sign in instead.")
      }

      // Immediately sign in the user after registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Refresh the session to ensure it's up to date
      await refreshSession()

      toast({
        title: "Registration successful",
        description: "You have been registered and logged in successfully",
      })

      // Redirect to the return URL
      router.push(returnUrl)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing Up...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>

      <div className="text-center text-sm">
        <p>
          Already have an account?{" "}
          <Link
            href={`/login${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
            className="underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
