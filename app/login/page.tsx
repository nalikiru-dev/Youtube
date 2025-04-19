import { AuthForm } from "@/components/auth-form"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const redirectTo = searchParams.redirectTo || "/"

  if (session) {
    redirect(redirectTo)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <AuthForm type="login" />
      </div>
    </div>
  )
}
