import { createClient } from "@/lib/supabase/server"
import { reviewContract } from "@/lib/ai"
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

    const { contractContent, contractId } = await request.json()
    if (!contractContent) {
      return NextResponse.json({ error: "Contract content is required" }, { status: 400 })
    }

    const review = await reviewContract(contractContent)

    // Parse the review to extract risk level
    const riskMatch = review.match(/low|medium|high/i)
    const riskLevel = riskMatch ? riskMatch[0].toLowerCase() : "medium"

    let reviewId = `rev_${Date.now()}`

    // Save review to database if available
    try {
      const { data, error } = await supabase
        .from("contract_reviews")
        .insert({
          contract_id: contractId || null,
          user_id: userId,
          review_text: review,
          risk_level: riskLevel,
        })
        .select()
        .single()

      if (!error && data?.id) {
        reviewId = data.id
      }
    } catch (dbErr) {
      console.warn("Database storage skipped (offline mode):", dbErr)
    }

    return NextResponse.json({
      review,
      riskLevel,
      reviewId,
    })
  } catch (error) {
    console.error("Error reviewing contract:", error)
    return NextResponse.json({ error: "Failed to review contract" }, { status: 500 })
  }
}
