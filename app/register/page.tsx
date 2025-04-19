import { redirect } from "next/navigation"

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const redirectTo = searchParams.redirectTo || "/"
  redirect(`/auth/signup?returnUrl=${encodeURIComponent(redirectTo)}`)
}
