import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getWatchHistory } from "@/lib/supabase/queries"
import { requireAuth } from "@/lib/auth-helpers"

export default async function HistoryPage() {
  const { session } = await requireAuth("/history")
  const videos = await getWatchHistory(session.user.id)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No watch history" description="Videos you watch will appear here" icon="video" />
      )}
    </div>
  )
}
