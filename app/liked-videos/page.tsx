import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getLikedVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { SignInForm } from "@/components/sign-in-form"

export default async function LikedVideosPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your liked videos</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to view videos you've liked.</p>
          <SignInForm returnUrl="/liked-videos" />
        </div>
      </div>
    )
  }

  const videos = await getLikedVideos(session.user.id)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No liked videos" description="Videos you like will appear here" icon="video" />
      )}
    </div>
  )
}
