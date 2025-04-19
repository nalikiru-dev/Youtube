import { createServerClient } from "@/lib/supabase/server"
import { cache } from "react"

export const getVideos = cache(async (limit = 20) => {
  try {
    const supabase = createServerClient()

    const { data: videos, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        thumbnail_url,
        views,
        created_at,
        duration,
        user_id,
        user:profiles(id, username, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching videos:", error)
      return []
    }

    return videos || []
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return []
  }
})

export const getVideoById = cache(async (id: string) => {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: video, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        views,
        created_at,
        duration,
        user_id,
        user:profiles(id, username, avatar_url)
      `)
      .eq("id", id)
      .single()

    if (error || !video) {
      console.error("Error fetching video:", error)
      return null
    }

    // Get subscribers count
    const { count: subscribersCount } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("channel_id", video.user.id)

    // Get likes count
    const { count: likesCount } = await supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("video_id", id)

    // Check if user has liked the video
    let userHasLiked = false
    let userHasSubscribed = false

    if (session) {
      const { data: like } = await supabase
        .from("likes")
        .select("id")
        .eq("video_id", id)
        .eq("user_id", session.user.id)
        .maybeSingle()

      userHasLiked = !!like

      // Check if user has subscribed to the channel
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("channel_id", video.user.id)
        .eq("subscriber_id", session.user.id)
        .maybeSingle()

      userHasSubscribed = !!subscription
    }

    return {
      ...video,
      likes_count: likesCount || 0,
      user_has_liked: userHasLiked,
      user_has_subscribed: userHasSubscribed,
      user: {
        ...video.user,
        subscribers_count: subscribersCount || 0,
      },
    }
  } catch (error) {
    console.error("Failed to fetch video:", error)
    return null
  }
})

export const getVideoComments = cache(async (videoId: string) => {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: comments, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user:profiles(id, username, avatar_url)
      `)
      .eq("video_id", videoId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    if (!comments) return []

    // Get likes count for each comment
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const { count: likesCount } = await supabase
          .from("likes")
          .select("id", { count: "exact", head: true })
          .eq("comment_id", comment.id)

        let userHasLiked = false

        if (session) {
          const { data: like } = await supabase
            .from("likes")
            .select("id")
            .eq("comment_id", comment.id)
            .eq("user_id", session.user.id)
            .maybeSingle()

          userHasLiked = !!like
        }

        return {
          ...comment,
          likes_count: likesCount || 0,
          user_has_liked: userHasLiked,
        }
      }),
    )

    return commentsWithLikes
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return []
  }
})

export const getRecommendedVideos = cache(async (currentVideoId: string, limit = 10) => {
  try {
    const supabase = createServerClient()

    const { data: currentVideo, error: videoError } = await supabase
      .from("videos")
      .select("user_id")
      .eq("id", currentVideoId)
      .single()

    if (videoError || !currentVideo) {
      console.error("Error fetching current video:", videoError)
      return []
    }

    // First try to get videos from the same channel
    const { data: channelVideos } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        thumbnail_url,
        views,
        created_at,
        duration,
        user:profiles(id, username)
      `)
      .eq("user_id", currentVideo.user_id)
      .neq("id", currentVideoId)
      .order("views", { ascending: false })
      .limit(Math.floor(limit / 2))

    // Then get other popular videos
    const { data: popularVideos } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        thumbnail_url,
        views,
        created_at,
        duration,
        user:profiles(id, username)
      `)
      .neq("id", currentVideoId)
      .neq("user_id", currentVideo.user_id)
      .order("views", { ascending: false })
      .limit(limit - (channelVideos?.length || 0))

    const recommendedVideos = [...(channelVideos || []), ...(popularVideos || [])]

    return recommendedVideos
  } catch (error) {
    console.error("Failed to fetch recommended videos:", error)
    return []
  }
})

export const searchVideos = cache(async (query: string) => {
  try {
    const supabase = createServerClient()

    if (!query.trim()) return []

    const { data: videos, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        thumbnail_url,
        views,
        created_at,
        duration,
        user:profiles(id, username, avatar_url)
      `)
      .ilike("title", `%${query}%`)
      .order("views", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error searching videos:", error)
      return []
    }

    return videos || []
  } catch (error) {
    console.error("Failed to search videos:", error)
    return []
  }
})

export const getChannelById = cache(async (id: string) => {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: channel, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error || !channel) {
      console.error("Error fetching channel:", error)
      return null
    }

    // Get subscribers count
    const { count: subscribersCount } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("channel_id", id)

    // Check if user has subscribed to the channel
    let userHasSubscribed = false

    if (session) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("channel_id", id)
        .eq("subscriber_id", session.user.id)
        .maybeSingle()

      userHasSubscribed = !!subscription
    }

    return {
      ...channel,
      subscribers_count: subscribersCount || 0,
      user_has_subscribed: userHasSubscribed,
    }
  } catch (error) {
    console.error("Failed to fetch channel:", error)
    return null
  }
})

export const getChannelVideos = cache(async (channelId: string) => {
  try {
    const supabase = createServerClient()

    const { data: videos, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        thumbnail_url,
        views,
        created_at,
        duration,
        user:profiles(id, username, avatar_url)
      `)
      .eq("user_id", channelId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching channel videos:", error)
      return []
    }

    return videos || []
  } catch (error) {
    console.error("Failed to fetch channel videos:", error)
    return []
  }
})

export const getUserProfile = cache(async (userId: string) => {
  try {
    const supabase = createServerClient()

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return null
  }
})
