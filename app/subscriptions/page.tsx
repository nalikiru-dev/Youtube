import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getSubscriptionVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SubscriptionsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const videos = await getSubscriptionVideos(session.user.id)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState
          title="No subscription videos"
          description="Videos from channels you subscribe to will appear here"
          icon="video"
        />
      )}
    </div>
  )
}
