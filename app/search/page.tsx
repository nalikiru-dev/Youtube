import { VideoGrid } from "@/components/video-grid"
import { searchVideos } from "@/lib/supabase/queries"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""
  const videos = await searchVideos(query)

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Search results for: {query}</h1>
      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <p className="text-center text-muted-foreground py-10">No videos found for "{query}"</p>
      )}
    </div>
  )
}
