"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/actions"

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [username, setUsername] = useState(profile.username)
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner_url)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateProfile({
        username,
        fullName,
        bio,
        avatarFile,
        bannerFile,
      })

      router.refresh()
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <div className="h-32 bg-muted rounded-lg overflow-hidden">
            {bannerPreview && (
              <img src={bannerPreview || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute -bottom-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={avatarPreview || ""} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button asChild variant="secondary" size="sm">
              <label>
                Change Banner
                <Input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
              </label>
            </Button>
          </div>
        </div>

        <div className="pt-12 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <label>
              Change Avatar
              <Input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
