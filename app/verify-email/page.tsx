"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const email = searchParams.get("email") || ""

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address is missing")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error

      setSuccess(true)
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

  // Check if the user is already verified
  useEffect(() => {
    const checkVerification = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user?.email_confirmed_at) {
          // User is verified, redirect to home
          router.push("/")
        }
      }
    }

    checkVerification()
  }, [supabase, router])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification email to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Verification email sent successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive an email? Check your spam folder or request a new verification email.
          </p>

          <Button onClick={handleResendVerification} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
