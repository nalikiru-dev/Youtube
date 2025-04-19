import { ChannelHeader } from "@/components/channel-header"
import { VideoGrid } from "@/components/video-grid"
import { getChannelById, getChannelVideos } from "@/lib/supabase/queries"
import { notFound } from "next/navigation"

export default async function ChannelPage({ params }: { params: { id: string } }) {
  const channel = await getChannelById(params.id)

  if (!channel) {
    notFound()
  }

  const videos = await getChannelVideos(params.id)

  return (
    <div>
      <ChannelHeader channel={channel} />
      <div className="container py-6">
        <h2 className="text-xl font-bold mb-4">Videos</h2>
        <VideoGrid videos={videos} />
      </div>
    </div>
  )
}
