import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getUserVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"
import { SignInForm } from "@/components/sign-in-form"

export default async function YourVideosPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Your Videos</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your videos</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your uploaded videos.</p>
          <SignInForm returnUrl="/your-videos" />
        </div>
      </div>
    )
  }

  const videos = await getUserVideos(session.user.id)

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Videos</h1>
        <Button asChild>
          <Link href="/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No videos yet" description="Your uploaded videos will appear here" icon="file">
          <Button asChild className="mt-4">
            <Link href="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Video
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
