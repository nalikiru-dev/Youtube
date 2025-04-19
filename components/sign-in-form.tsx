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

export function SignInForm({ returnUrl = "/" }: { returnUrl?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { supabase, refreshSession } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setShowVerificationMessage(false)

    try {
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Check if the error is due to email not being verified
        if (signInError.message.includes("Email not confirmed")) {
          setShowVerificationMessage(true)
          throw new Error("Please verify your email before signing in.")
        }
        throw signInError
      }

      // Explicitly refresh the session to ensure it's up to date
      await refreshSession()

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      })

      // Redirect to the return URL
      router.push(returnUrl)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to resend verification email
  const handleResendVerification = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      })
    } catch (error: any) {
      setError(error.message || "Failed to send verification email")
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

      {showVerificationMessage && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Please verify your email before signing in.</span>
            <Button type="button" variant="outline" size="sm" onClick={handleResendVerification} disabled={isLoading}>
              Resend verification email
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link
            href={`/register${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
            className="underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}
