import { AuthDebug } from "@/components/auth-debug"
import { createServerClient } from "@/lib/supabase/server"

export default async function DebugPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            This page helps you debug authentication issues. You can use it to check your session status and
            troubleshoot problems.
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Client-Side Session</h2>
            <AuthDebug />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Server-Side Session</h2>
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
