import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getWatchHistory } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/login?redirectTo=${encodeURIComponent("/history")}`)
  }

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
