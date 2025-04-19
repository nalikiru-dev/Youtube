import { UploadForm } from "@/components/upload-form"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function UploadPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login with return URL
    redirect(`/login?redirectTo=${encodeURIComponent("/upload")}`)
  }

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      <UploadForm userId={session.user.id} />
    </div>
  )
}
