"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { uploadVideo } from "@/lib/actions"

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file is too large. Please select a file under 100MB.")
      return
    }

    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size and type
    if (file.size > 5 * 1024 * 1024) {
      setError("Thumbnail file is too large. Please select an image under 5MB.")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file for the thumbnail.")
      return
    }

    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile || !title.trim()) {
      setError("Please provide a video file and title.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      const videoId = await uploadVideo({
        userId,
        title,
        description,
        videoFile,
        thumbnailFile,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Redirect to the video page
      router.push(`/video/${videoId}`)
    } catch (error: any) {
      console.error("Upload failed:", error)
      setError(error.message || "Upload failed. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Add a title that describes your video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isUploading}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Tell viewers about your video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isUploading}
          />
        </div>

        <div className="grid gap-3">
          <Label>Video</Label>
          {!videoPreview ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop video files to upload</p>
                <p className="text-xs text-muted-foreground mb-4">Your videos will be private until you publish them</p>
                <Button asChild variant="secondary" disabled={isUploading}>
                  <label className="cursor-pointer">
                    SELECT FILE
                    <Input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                      required
                      disabled={isUploading}
                    />
                  </label>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <video src={videoPreview} controls className="w-full aspect-video rounded-lg" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setVideoFile(null)
                  setVideoPreview(null)
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <Label>Thumbnail</Label>
          {!thumbnailPreview ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <p className="text-sm text-muted-foreground mb-2">Upload a thumbnail image</p>
                <Button asChild variant="secondary" size="sm" disabled={isUploading}>
                  <label className="cursor-pointer">
                    SELECT IMAGE
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                      disabled={isUploading}
                    />
                  </label>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <img
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Thumbnail preview"
                className="w-full aspect-video rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setThumbnailFile(null)
                  setThumbnailPreview(null)
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="grid gap-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-sm text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={!videoFile || !title.trim() || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
