// Helper functions to get environment variables with proper fallbacks

// Get the base URL for the application
export function getBaseUrl() {
  // First priority: explicitly set base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  // Second priority: Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Third priority: localhost for development
  return "http://localhost:3000"
}

// Get the Supabase URL
export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  }
  return url || ""
}

// Get the Supabase anon key
export function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }
  return key || ""
}

// Check if email verification is required
export function isEmailVerificationRequired() {
  // We're bypassing email verification, so always return false
  return process.env.REQUIRE_EMAIL_VERIFICATION === "true"
}
