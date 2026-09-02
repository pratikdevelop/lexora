import { createClient } from "@/lib/supabase/server"
import { performLegalResearch } from "@/lib/ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await request.json()

    const result = await performLegalResearch(query)

    // Save research to database
    const { data, error } = await supabase
      .from("research_queries")
      .insert({
        user_id: user.id,
        query,
        result,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      result,
      researchId: data.id,
    })
  } catch (error) {
    console.error("Error performing research:", error)
    return NextResponse.json({ error: "Failed to perform research" }, { status: 500 })
  }
}
