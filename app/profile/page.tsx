import { ProfileForm } from "@/components/profile-form"
import { getUserProfile } from "@/lib/supabase/queries"
import { createServerClient } from "@/lib/supabase/server"
import { SignInForm } from "@/components/sign-in-form"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container max-w-3xl py-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <div className="p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Sign in to view your profile</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to view and edit your profile.</p>
          <SignInForm returnUrl="/profile" />
        </div>
      </div>
    )
  }

  const profile = await getUserProfile(session.user.id)

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
