import { UploadForm } from "@/components/upload-form"
import { SignInForm } from "@/components/sign-in-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function UploadPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      {session ? (
        <UploadForm userId={session.user.id} />
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-muted/30 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Sign in to upload videos</h2>
            <p className="text-muted-foreground mb-4">You need to be signed in to upload videos to YouTube Clone.</p>
            <SignInForm returnUrl="/upload" />
          </div>
        </div>
      )}
    </div>
  )
}
