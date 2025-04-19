import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getLikedVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LikedVideosPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/login?redirectTo=${encodeURIComponent("/liked-videos")}`)
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
