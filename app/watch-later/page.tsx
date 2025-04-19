import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getWatchLaterVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function WatchLaterPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
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
