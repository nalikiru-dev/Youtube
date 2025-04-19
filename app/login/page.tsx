import { redirect } from "next/navigation"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const redirectTo = searchParams.redirectTo || "/"
  redirect(`/auth/signin?returnUrl=${encodeURIComponent(redirectTo)}`)
}
