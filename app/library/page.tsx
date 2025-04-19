import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getRecentVideos, getLikedVideos, getWatchLaterVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignInForm } from "@/components/sign-in-form"

export default async function LibraryPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Library</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your library</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your video library.</p>
          <SignInForm returnUrl="/library" />
        </div>
      </div>
    )
  }

  const [recentVideos, likedVideos, watchLaterVideos] = await Promise.all([
    getRecentVideos(session.user.id, 4),
    getLikedVideos(session.user.id, 4),
    getWatchLaterVideos(session.user.id, 4),
  ])

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Library</h1>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent</h2>
            <Button variant="link" asChild>
              <Link href="/history">See all</Link>
            </Button>
          </div>

          {recentVideos.length > 0 ? (
            <VideoGrid videos={recentVideos} />
          ) : (
            <EmptyState title="No recent videos" description="Videos you watch will appear here" icon="video" />
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Liked Videos</h2>
            <Button variant="link" asChild>
              <Link href="/liked-videos">See all</Link>
            </Button>
          </div>

          {likedVideos.length > 0 ? (
            <VideoGrid videos={likedVideos} />
          ) : (
            <EmptyState title="No liked videos" description="Videos you like will appear here" icon="video" />
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Watch Later</h2>
            <Button variant="link" asChild>
              <Link href="/watch-later">See all</Link>
            </Button>
          </div>

          {watchLaterVideos.length > 0 ? (
            <VideoGrid videos={watchLaterVideos} />
          ) : (
            <EmptyState title="No videos saved for later" description="Save videos to watch later" icon="video" />
          )}
        </section>
      </div>
    </div>
  )
}
