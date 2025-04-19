import { VideoGrid } from "@/components/video-grid"
import { EmptyState } from "@/components/empty-state"
import { getUserVideos } from "@/lib/supabase/queries"
import { requireAuth } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"

export default async function YourVideosPage() {
  const { session, supabase } = await requireAuth("/your-videos")
  const videos = await getUserVideos(session.user.id)

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Videos</h1>
        <Button asChild>
          <Link href="/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No videos yet" description="Your uploaded videos will appear here" icon="file">
          <Button asChild className="mt-4">
            <Link href="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Video
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
