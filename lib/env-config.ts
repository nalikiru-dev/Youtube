// Helper functions to get environment variables with proper fallbacks

// Get the base URL for the application
export function getBaseUrl() {
  // For Vercel deployments, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // For local development
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

// Get the Supabase URL
export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ""
}

// Get the Supabase anon key
export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
}

// Check if email verification is required
export function isEmailVerificationRequired() {
  // We're bypassing email verification, so always return false
  return false
}
