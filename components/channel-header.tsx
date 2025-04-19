"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { toggleSubscription } from "@/lib/actions"

interface Channel {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  subscribers_count: number
  user_has_subscribed?: boolean
}

export function ChannelHeader({ channel }: { channel: Channel }) {
  const { session } = useSupabase()
  const [isSubscribed, setIsSubscribed] = useState(channel.user_has_subscribed || false)
  const [subscribersCount, setSubscribersCount] = useState(channel.subscribers_count)

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = "/login"
      return
    }

    const newSubscriptionState = !isSubscribed
    setIsSubscribed(newSubscriptionState)
    setSubscribersCount((prev) => (newSubscriptionState ? prev + 1 : prev - 1))

    await toggleSubscription({
      channelId: channel.id,
      subscribed: newSubscriptionState,
    })
  }

  return (
    <div>
      <div className="h-32 bg-muted">
        {channel.banner_url && (
          <img
            src={channel.banner_url || "/placeholder.svg"}
            alt={`${channel.username}'s banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={channel.avatar_url || ""} alt={channel.username} />
            <AvatarFallback>{channel.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{channel.username}</h1>
            {channel.full_name && <p className="text-muted-foreground">{channel.full_name}</p>}
            <p className="text-sm text-muted-foreground">{subscribersCount.toLocaleString()} subscribers</p>
            {channel.bio && <p className="text-sm mt-2 line-clamp-2">{channel.bio}</p>}
          </div>

          <Button variant={isSubscribed ? "outline" : "default"} onClick={handleSubscribe}>
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
      </div>
    </div>
  )
}
