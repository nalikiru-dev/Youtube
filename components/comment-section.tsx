"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { addComment, toggleCommentLike } from "@/lib/actions"

interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    username: string
    avatar_url: string
  }
  likes_count: number
  user_has_liked?: boolean
}

export function CommentSection({
  videoId,
  comments: initialComments,
}: {
  videoId: string
  comments: Comment[]
}) {
  const { session } = useSupabase()
  const [comments, setComments] = useState(initialComments)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      window.location.href = "/login"
      return
    }

    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      const newComment = await addComment({
        videoId,
        content: commentText,
      })

      setComments([newComment, ...comments])
      setCommentText("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string, currentLiked: boolean) => {
    if (!session) {
      window.location.href = "/login"
      return
    }

    const newLikeState = !currentLiked

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes_count: newLikeState ? comment.likes_count + 1 : Math.max(0, comment.likes_count - 1),
            user_has_liked: newLikeState,
          }
        }
        return comment
      }),
    )

    await toggleCommentLike({
      commentId,
      liked: newLikeState,
    })
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold mb-4">{comments.length} Comments</h2>

      {session && (
        <form onSubmit={handleAddComment} className="flex gap-4 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.user_metadata.avatar_url || ""} />
            <AvatarFallback>{session.user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="resize-none mb-2"
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setCommentText("")}>
                Cancel
              </Button>

              <Button type="submit" size="sm" disabled={!commentText.trim() || isSubmitting}>
                Comment
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatar_url || ""} alt={comment.user.username} />
              <AvatarFallback>{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.user.username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm mt-1">{comment.content}</p>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleLikeComment(comment.id, comment.user_has_liked || false)}
                >
                  <ThumbsUp className={`h-4 w-4 ${comment.user_has_liked ? "fill-current" : ""}`} />
                </Button>

                {comment.likes_count > 0 && (
                  <span className="text-xs text-muted-foreground">{comment.likes_count}</span>
                )}

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Reply
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
