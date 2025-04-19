import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getRecentVideos, getLikedVideos, getWatchLaterVideos } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LibraryPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
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
