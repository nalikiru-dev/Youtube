import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getSubscriptionVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { SignInForm } from "@/components/sign-in-form"

export default async function SubscriptionsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your subscriptions</h2>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to view videos from channels you've subscribed to.
          </p>
          <SignInForm returnUrl="/subscriptions" />
        </div>
      </div>
    )
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
