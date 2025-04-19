import { ProfileForm } from "@/components/profile-form"
import { getUserProfile } from "@/lib/supabase/queries"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/login?redirectTo=${encodeURIComponent("/profile")}`)
  }

  const profile = await getUserProfile(session.user.id)

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
