import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface Video {
  id: string
  title: string
  thumbnail_url: string
  views: number
  created_at: string
  duration: number
  user: {
    id: string
    username: string
  }
}

export function RecommendedVideos({ videos }: { videos: Video[] }) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold">Recommended</h2>

      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.id} className="flex gap-2">
            <Link href={`/video/${video.id}`} className="flex-shrink-0">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No thumbnail</span>
                  </div>
                )}
                {video.duration && (
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/video/${video.id}`}>
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
              </Link>

              <Link href={`/channel/${video.user.id}`}>
                <p className="text-xs text-muted-foreground mt-1">{video.user.username}</p>
              </Link>

              <p className="text-xs text-muted-foreground">
                {video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
