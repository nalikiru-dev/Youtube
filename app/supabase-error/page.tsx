"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SupabaseErrorPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Supabase Configuration Error</h1>

        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <p className="text-red-800">
            The application could not connect to Supabase because the required environment variables are missing.
          </p>
        </div>

        <p className="mb-6 text-muted-foreground">Please make sure the following environment variables are set:</p>

        <ul className="list-disc list-inside text-left mb-6">
          <li className="mb-2">NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        </ul>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/debug/env">Check Environment Variables</Link>
          </Button>

          <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  )
}
