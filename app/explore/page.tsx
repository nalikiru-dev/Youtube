import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getTrendingVideos, getNewVideos } from "@/lib/supabase/queries"

export default async function ExplorePage() {
  const [trendingVideos, newVideos] = await Promise.all([getTrendingVideos(), getNewVideos()])

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Trending</h2>

          {trendingVideos.length > 0 ? (
            <VideoGrid videos={trendingVideos} />
          ) : (
            <EmptyState title="No trending videos" description="Trending videos will appear here" icon="video" />
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">New</h2>

          {newVideos.length > 0 ? (
            <VideoGrid videos={newVideos} />
          ) : (
            <EmptyState title="No new videos" description="New videos will appear here" icon="video" />
          )}
        </section>
      </div>
    </div>
  )
}
