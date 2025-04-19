import { AuthForm } from "@/components/auth-form"
import { getServerSession } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string }
}) {
  const { session } = await getServerSession()
  const returnUrl = searchParams.returnUrl || "/"

  if (session) {
    redirect(returnUrl)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <AuthForm type="login" returnUrl={returnUrl} />
      </div>
    </div>
  )
}
