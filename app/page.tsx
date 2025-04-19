import { VideoGrid } from "@/components/video-grid"
import { getVideos } from "@/lib/supabase/queries"
import { EmptyState } from "@/components/empty-state"

export default async function Home() {
  let videos = []
  let error = null

  try {
    videos = await getVideos()
  } catch (e) {
    console.error("Error fetching videos:", e)
    error = "Failed to load videos"
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Recommended</h1>

      {error ? (
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      ) : videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState
          title="No videos yet"
          description="Videos you upload or from channels you subscribe to will appear here"
          icon="video"
        />
      )}
    </div>
  )
}
