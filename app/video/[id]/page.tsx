import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { CommentSection } from "@/components/comment-section"
import { RecommendedVideos } from "@/components/recommended-videos"
import { getVideoById, getVideoComments, getRecommendedVideos } from "@/lib/supabase/queries"
import { notFound } from "next/navigation"
import { EmptyState } from "@/components/empty-state"

export default async function VideoPage({ params }: { params: { id: string } }) {
  let video = null
  let comments = []
  let recommendedVideos = []
  let error = null

  try {
    video = await getVideoById(params.id)

    if (!video) {
      notFound()
    }

    comments = await getVideoComments(params.id)
    recommendedVideos = await getRecommendedVideos(params.id)
  } catch (e) {
    console.error("Error loading video:", e)
    error = "Failed to load video"
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <CommentSection videoId={params.id} comments={comments} />
        </div>
        <div>
          {recommendedVideos.length > 0 ? (
            <RecommendedVideos videos={recommendedVideos} />
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No recommendations yet"
                description="More videos will appear here as you watch content"
                icon="video"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
