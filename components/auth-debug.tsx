"use client"

import { useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

export function AuthDebug() {
  const { supabase, session, refreshSession } = useSupabase()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await refreshSession()
      const { data } = await supabase.auth.getUser()
      setUserDetails(data.user)
    } catch (error) {
      console.error("Error refreshing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>View and debug your authentication status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${session ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {session ? "Authenticated" : "Not Authenticated"}
            </span>
          </div>

          {session && (
            <>
              <div className="flex justify-between items-center">
                <span className="font-medium">User ID:</span>
                <span className="text-sm font-mono">{session.user.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Email:</span>
                <span className="text-sm">{session.user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Email Verified:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${session.user.email_confirmed_at ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {session.user.email_confirmed_at ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Session Expires:</span>
                <span className="text-sm">{new Date(session.expires_at * 1000).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              <span>Advanced Details</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{JSON.stringify(userDetails || session, null, 2)}</pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Session
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
