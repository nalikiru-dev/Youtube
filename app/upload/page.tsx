import { UploadForm } from "@/components/upload-form"
import { SignInForm } from "@/components/sign-in-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function UploadPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not authenticated, show sign-in form
  if (!session) {
    return (
      <div className="container max-w-3xl py-6">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to upload videos</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to upload videos to YouTube Clone.</p>
          <SignInForm returnUrl="/upload" />
        </div>
      </div>
    )
  }

  // Check if email verification is required and if the user's email is verified
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const emailVerificationRequired = process.env.REQUIRE_EMAIL_VERIFICATION === "true"

  if (emailVerificationRequired && !user?.email_confirmed_at) {
    return (
      <div className="container max-w-3xl py-6">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Verify your email</h2>
          <p className="text-muted-foreground mb-4">
            You need to verify your email before you can upload videos. Please check your inbox for a verification
            email.
          </p>
          <a href={`/verify-email?email=${encodeURIComponent(user?.email || "")}`} className="underline">
            Resend verification email
          </a>
        </div>
      </div>
    )
  }

  // User is authenticated and email is verified (if required)
  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      <UploadForm userId={session.user.id} />
    </div>
  )
}
