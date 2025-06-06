export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string
          content: string
          user_id: string
          video_id: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          video_id: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          video_id?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          video_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
      }
      playlist_videos: {
        Row: {
          id: string
          playlist_id: string
          video_id: string
          position: number
          added_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          video_id: string
          position: number
          added_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          video_id?: string
          position?: number
          added_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          subscriber_id: string
          channel_id: string
          created_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          channel_id: string
          created_at?: string
        }
        Update: {
          id?: string
          subscriber_id?: string
          channel_id?: string
          created_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          video_url: string
          thumbnail_url?: string | null
          duration?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          video_url?: string
          thumbnail_url?: string | null
          duration?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      watch_history: {
        Row: {
          id: string
          user_id: string
          video_id: string
          watched_at: string
          watch_duration: number
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          watched_at?: string
          watch_duration?: number
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          watched_at?: string
          watch_duration?: number
        }
      }
    }
  }
}
