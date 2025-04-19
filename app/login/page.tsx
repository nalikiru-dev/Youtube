import { SignInForm } from "@/components/sign-in-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string; returnUrl?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const returnUrl = searchParams.returnUrl || "/"

  // If already authenticated, redirect to the return URL
  if (session) {
    redirect(returnUrl)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {searchParams.message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">{searchParams.message}</div>
        )}

        {searchParams.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{searchParams.error}</div>
        )}

        <SignInForm returnUrl={returnUrl} />
      </div>
    </div>
  )
}
