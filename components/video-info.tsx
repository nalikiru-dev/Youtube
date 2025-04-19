"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Share, Clock, MoreHorizontal, Bell } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/components/supabase-provider"
import { toggleLike, toggleSubscription, toggleWatchLater } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface Video {
  id: string
  title: string
  description: string
  views: number
  created_at: string
  user: {
    id: string
    username: string
    avatar_url: string
    subscribers_count: number
  }
  likes_count: number
  user_has_liked?: boolean
  user_has_subscribed?: boolean
}

export function VideoInfo({ video }: { video: Video }) {
  const { session } = useSupabase()
  const { toast } = useToast()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [likesCount, setLikesCount] = useState(video.likes_count)
  const [hasLiked, setHasLiked] = useState(video.user_has_liked || false)
  const [isSubscribed, setIsSubscribed] = useState(video.user_has_subscribed || false)
  const [subscribersCount, setSubscribersCount] = useState(video.user.subscribers_count)
  const [isInWatchLater, setIsInWatchLater] = useState(false)

  const handleLike = async () => {
    if (!session) {
      window.location.href = "/login"
      return
    }

    const newLikeState = !hasLiked
    setHasLiked(newLikeState)
    setLikesCount((prev) => (newLikeState ? prev + 1 : prev - 1))

    try {
      await toggleLike({
        videoId: video.id,
        liked: newLikeState,
      })

      toast({
        title: newLikeState ? "Video liked" : "Like removed",
        description: newLikeState
          ? "This video has been added to your liked videos"
          : "This video has been removed from your liked videos",
      })
    } catch (error) {
      // Revert state on error
      setHasLiked(!newLikeState)
      setLikesCount((prev) => (!newLikeState ? prev + 1 : prev - 1))
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = "/login"
      return
    }

    const newSubscriptionState = !isSubscribed
    setIsSubscribed(newSubscriptionState)
    setSubscribersCount((prev) => (newSubscriptionState ? prev + 1 : prev - 1))

    try {
      await toggleSubscription({
        channelId: video.user.id,
        subscribed: newSubscriptionState,
      })

      toast({
        title: newSubscriptionState ? "Subscribed" : "Unsubscribed",
        description: newSubscriptionState
          ? `You are now subscribed to ${video.user.username}`
          : `You have unsubscribed from ${video.user.username}`,
      })
    } catch (error) {
      // Revert state on error
      setIsSubscribed(!newSubscriptionState)
      setSubscribersCount((prev) => (!newSubscriptionState ? prev + 1 : prev - 1))
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      })
    }
  }

  const handleWatchLater = async () => {
    if (!session) {
      window.location.href = "/login"
      return
    }

    const newWatchLaterState = !isInWatchLater
    setIsInWatchLater(newWatchLaterState)

    try {
      await toggleWatchLater({
        videoId: video.id,
        add: newWatchLaterState,
      })

      toast({
        title: newWatchLaterState ? "Added to Watch Later" : "Removed from Watch Later",
        description: newWatchLaterState
          ? "This video has been added to your Watch Later playlist"
          : "This video has been removed from your Watch Later playlist",
      })
    } catch (error) {
      // Revert state on error
      setIsInWatchLater(!newWatchLaterState)
      toast({
        title: "Error",
        description: "Failed to update Watch Later status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">{video.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/channel/${video.user.id}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={video.user.avatar_url || ""} alt={video.user.username} />
              <AvatarFallback>{video.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <Link href={`/channel/${video.user.id}`} className="font-medium hover:underline">
              {video.user.username}
            </Link>
            <p className="text-xs text-muted-foreground">{subscribersCount.toLocaleString()} subscribers</p>
          </div>

          <Button variant={isSubscribed ? "outline" : "default"} size="sm" onClick={handleSubscribe} className="ml-4">
            {isSubscribed ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-muted">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-full ${hasLiked ? "bg-muted-foreground/20" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{likesCount.toLocaleString()}</span>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-r-full">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleWatchLater}>
            <Clock className={`h-4 w-4 mr-2 ${isInWatchLater ? "fill-current" : ""}`} />
            {isInWatchLater ? "Added" : "Watch Later"}
          </Button>

          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 bg-muted/50 rounded-lg p-3">
        <div className="text-sm text-muted-foreground mb-1">
          {video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
        </div>

        <div className={`text-sm ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>{video.description}</div>

        {video.description && video.description.length > 100 && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-xs"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
    </div>
  )
}
