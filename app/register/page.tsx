import { RegisterForm } from "@/components/register-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
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
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
