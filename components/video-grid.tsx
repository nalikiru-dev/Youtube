import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Video {
  id: string
  title: string
  thumbnail_url: string | null
  views: number
  created_at: string
  duration: number | null
  user: {
    id: string
    username: string
    avatar_url: string | null
  }
}

export function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="group">
      <Link href={`/video/${video.id}`} className="block">
        <div className="aspect-video relative rounded-lg overflow-hidden mb-2 bg-muted">
          {video.thumbnail_url ? (
            <Image
              src={video.thumbnail_url || "/placeholder.svg"}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No thumbnail</span>
            </div>
          )}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      <div className="flex gap-2">
        <Link href={`/channel/${video.user.id}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={video.user.avatar_url || ""} alt={video.user.username} />
            <AvatarFallback>{video.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/video/${video.id}`} className="block">
            <h3 className="font-medium line-clamp-2 text-sm">{video.title}</h3>
          </Link>
          <Link href={`/channel/${video.user.id}`} className="block">
            <p className="text-muted-foreground text-xs">{video.user.username}</p>
          </Link>
          <p className="text-muted-foreground text-xs">
            {video.views.toLocaleString()} views •{" "}
            {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
          </p>
        </div>
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
