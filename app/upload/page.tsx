import { UploadForm } from "@/components/upload-form"
import { requireAuth } from "@/lib/auth-helpers"

export default async function UploadPage() {
  const { session } = await requireAuth("/upload")

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      <UploadForm userId={session.user.id} />
    </div>
  )
}
