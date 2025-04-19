"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function incrementVideoView(videoId: string) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Increment view count
    await supabase.rpc("increment_video_views", {
      video_uuid: videoId,
    })

    // Add to watch history if user is logged in
    if (session) {
      await supabase.from("watch_history").upsert({
        user_id: session.user.id,
        video_id: videoId,
        watched_at: new Date().toISOString(),
        watch_duration: 0, // This would be updated later with actual watch duration
      })
    }
  } catch (error) {
    console.error("Failed to increment view:", error)
  }
}

export async function toggleLike({ videoId, liked }: { videoId: string; liked: boolean }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    if (liked) {
      await supabase.from("likes").insert({
        user_id: session.user.id,
        video_id: videoId,
      })
    } else {
      await supabase.from("likes").delete().eq("user_id", session.user.id).eq("video_id", videoId)
    }

    revalidatePath(`/video/${videoId}`)
    revalidatePath("/liked-videos")
  } catch (error) {
    console.error("Failed to toggle like:", error)
    throw new Error("Failed to update like status")
  }
}

export async function toggleWatchLater({ videoId, add }: { videoId: string; add: boolean }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    // In a real app, you would have a watch_later table
    // For this example, we'll just simulate the functionality
    console.log(
      `${add ? "Adding" : "Removing"} video ${videoId} ${add ? "to" : "from"} watch later for user ${session.user.id}`,
    )

    revalidatePath("/watch-later")
  } catch (error) {
    console.error("Failed to toggle watch later:", error)
    throw new Error("Failed to update watch later status")
  }
}

export async function toggleCommentLike({ commentId, liked }: { commentId: string; liked: boolean }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    if (liked) {
      await supabase.from("likes").insert({
        user_id: session.user.id,
        comment_id: commentId,
      })
    } else {
      await supabase.from("likes").delete().eq("user_id", session.user.id).eq("comment_id", commentId)
    }
  } catch (error) {
    console.error("Failed to toggle comment like:", error)
    throw new Error("Failed to update comment like status")
  }
}

export async function toggleSubscription({ channelId, subscribed }: { channelId: string; subscribed: boolean }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    if (subscribed) {
      await supabase.from("subscriptions").insert({
        subscriber_id: session.user.id,
        channel_id: channelId,
      })
    } else {
      await supabase.from("subscriptions").delete().eq("subscriber_id", session.user.id).eq("channel_id", channelId)
    }

    revalidatePath(`/channel/${channelId}`)
    revalidatePath("/subscriptions")
  } catch (error) {
    console.error("Failed to toggle subscription:", error)
    throw new Error("Failed to update subscription status")
  }
}

export async function addComment({ videoId, content }: { videoId: string; content: string }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    const { data: comment } = await supabase
      .from("comments")
      .insert({
        user_id: session.user.id,
        video_id: videoId,
        content,
      })
      .select("id")
      .single()

    if (!comment) {
      throw new Error("Failed to add comment")
    }

    // Get the newly created comment with user data
    const { data: newComment } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user:profiles(id, username, avatar_url)
      `)
      .eq("id", comment.id)
      .single()

    revalidatePath(`/video/${videoId}`)

    return {
      ...newComment,
      likes_count: 0,
      user_has_liked: false,
    }
  } catch (error) {
    console.error("Failed to add comment:", error)
    throw new Error("Failed to add comment")
  }
}

export async function uploadVideo({
  userId,
  title,
  description,
  videoFile,
  thumbnailFile,
}: {
  userId: string
  title: string
  description: string
  videoFile: File
  thumbnailFile: File | null
}) {
  try {
    const supabase = createServerClient()

    // Upload video file
    const videoFileName = `${userId}/${Date.now()}-${videoFile.name}`
    const { data: videoData, error: videoError } = await supabase.storage
      .from("videos")
      .upload(videoFileName, videoFile)

    if (videoError) {
      throw new Error("Failed to upload video")
    }

    // Get video URL
    const {
      data: { publicUrl: videoUrl },
    } = supabase.storage.from("videos").getPublicUrl(videoFileName)

    // Upload thumbnail if provided
    let thumbnailUrl = null
    if (thumbnailFile) {
      const thumbnailFileName = `${userId}/${Date.now()}-${thumbnailFile.name}`
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from("thumbnails")
        .upload(thumbnailFileName, thumbnailFile)

      if (!thumbnailError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("thumbnails").getPublicUrl(thumbnailFileName)

        thumbnailUrl = publicUrl
      }
    }

    // Create video record in database
    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        user_id: userId,
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      })
      .select("id")
      .single()

    if (dbError) {
      throw new Error("Failed to create video record")
    }

    revalidatePath("/")
    revalidatePath("/your-videos")

    return video.id
  } catch (error) {
    console.error("Failed to upload video:", error)
    throw new Error("Failed to upload video")
  }
}

export async function updateProfile({
  username,
  fullName,
  bio,
  avatarFile,
  bannerFile,
}: {
  username: string
  fullName: string
  bio: string
  avatarFile: File | null
  bannerFile: File | null
}) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    const userId = session.user.id
    const updates: any = {
      username,
      full_name: fullName,
      bio,
      updated_at: new Date().toISOString(),
    }

    // Upload avatar if provided
    if (avatarFile) {
      const fileName = `${userId}/${Date.now()}-${avatarFile.name}`
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile)

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName)

        updates.avatar_url = publicUrl
      }
    }

    // Upload banner if provided
    if (bannerFile) {
      const fileName = `${userId}/${Date.now()}-${bannerFile.name}`
      const { error: uploadError } = await supabase.storage.from("banners").upload(fileName, bannerFile)

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("banners").getPublicUrl(fileName)

        updates.banner_url = publicUrl
      }
    }

    // Update profile
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId)

    if (error) {
      throw new Error("Failed to update profile")
    }

    revalidatePath("/profile")
    revalidatePath(`/channel/${userId}`)
  } catch (error) {
    console.error("Failed to update profile:", error)
    throw new Error("Failed to update profile")
  }
}

export async function updateWatchDuration({ videoId, duration }: { videoId: string; duration: number }) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    await supabase
      .from("watch_history")
      .update({ watch_duration: duration })
      .eq("user_id", session.user.id)
      .eq("video_id", videoId)
  } catch (error) {
    console.error("Failed to update watch duration:", error)
  }
}
