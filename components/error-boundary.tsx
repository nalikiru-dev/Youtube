"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription>
              {error?.message || "An unexpected error occurred"}
              {error?.stack && (
                <details className="mt-2 text-xs">
                  <summary>Technical details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              This could be due to missing environment variables or configuration issues.
            </p>

            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Page
            </Button>

            <div className="text-center">
              <Button variant="link" onClick={() => setHasError(false)}>
                Try to continue anyway
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
