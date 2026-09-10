import { createClient } from "@/lib/supabase/server"
import { performLegalResearch } from "@/lib/ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    let userId = "demo-user"
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
      }
    } catch {
      // Fallback to demo user
    }

    const { query } = await request.json()
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const result = await performLegalResearch(query)

    let researchId = `res_${Date.now()}`

    // Save research to database if available
    try {
      const { data, error } = await supabase
        .from("research_queries")
        .insert({
          user_id: userId,
          query,
          result,
        })
        .select()
        .single()

      if (!error && data?.id) {
        researchId = data.id
      }
    } catch (dbErr) {
      console.warn("Database storage skipped (offline mode):", dbErr)
    }

    return NextResponse.json({
      result,
      researchId,
    })
  } catch (error) {
    console.error("Error performing research:", error)
    return NextResponse.json({ error: "Failed to perform research" }, { status: 500 })
  }
}
