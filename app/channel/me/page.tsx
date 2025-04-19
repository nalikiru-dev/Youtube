import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function MyChannelPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Redirect to the user's channel page
  redirect(`/channel/${session.user.id}`)
}
