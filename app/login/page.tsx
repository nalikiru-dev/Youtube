import { AuthForm } from "@/components/auth-form"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function LoginPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/")
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
