import type { LucideIcon } from "lucide-react"
import { Video, Search, User, FileVideo } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: "video" | "search" | "user" | "file"
  children?: ReactNode
}

export function EmptyState({ title, description, icon = "video", children }: EmptyStateProps) {
  const icons: Record<string, LucideIcon> = {
    video: Video,
    search: Search,
    user: User,
    file: FileVideo,
  }

  const Icon = icons[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
      {children}
    </div>
  )
}
