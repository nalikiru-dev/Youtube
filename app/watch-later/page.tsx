import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getWatchLaterVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { SignInForm } from "@/components/sign-in-form"

export default async function WatchLaterPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your Watch Later list</h2>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to view videos you've saved to watch later.
          </p>
          <SignInForm returnUrl="/watch-later" />
        </div>
      </div>
    )
  }

  const videos = await getWatchLaterVideos(session.user.id)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Watch Later</h1>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No videos saved for later" description="Save videos to watch later" icon="video" />
      )}
    </div>
  )
}
