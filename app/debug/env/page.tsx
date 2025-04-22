import { getBaseUrl, getSupabaseUrl, getSupabaseAnonKey } from "@/lib/env-config"

export default function EnvDebugPage() {
  // Get environment variables
  const baseUrl = getBaseUrl()
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey() ? "Set (hidden for security)" : "Not set"
  const vercelUrl = process.env.VERCEL_URL || "Not set"
  const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "Not set"
  const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION || "Not set"

  // Check for critical environment variables
  const missingVars = []
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>

      <div className="space-y-6">
        {missingVars.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-lg font-medium text-red-800 mb-2">Missing Critical Environment Variables</h2>
            <ul className="list-disc list-inside text-red-700">
              {missingVars.map((variable) => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
            <p className="mt-2 text-red-700">
              These variables are required for the application to function properly. Please add them to your
              environment.
            </p>
          </div>
        )}

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            This page shows the current environment variables configuration. Use this to diagnose issues with URLs and
            redirects.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4">Environment Variables</h2>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">Resolved Base URL:</span>
              <span>{baseUrl}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">NEXT_PUBLIC_BASE_URL:</span>
              <span>{nextPublicBaseUrl}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">VERCEL_URL:</span>
              <span>{vercelUrl}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span>{supabaseUrl || "Not set"}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span>{supabaseAnonKey}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span className="font-medium">REQUIRE_EMAIL_VERIFICATION:</span>
              <span>{requireEmailVerification}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4">How to Fix Missing Environment Variables</h2>

          <div className="space-y-4">
            <p>
              If you're running the application locally, create a <code>.env.local</code> file in the root of your
              project with the following variables:
            </p>

            <pre className="bg-black text-white p-4 rounded-md overflow-x-auto">
              {`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REQUIRE_EMAIL_VERIFICATION=false`}
            </pre>

            <p>If you're deploying to Vercel, add these environment variables in your project settings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
