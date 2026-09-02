import { createClient } from "@/lib/supabase/server"
import { reviewContract } from "@/lib/ai"
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

    const { contractContent, contractId } = await request.json()

    const review = await reviewContract(contractContent)

    // Parse the review to extract risk level
    const riskMatch = review.match(/low|medium|high/i)
    const riskLevel = riskMatch ? riskMatch[0].toLowerCase() : "medium"

    // Save review to database
    const { data, error } = await supabase
      .from("contract_reviews")
      .insert({
        contract_id: contractId,
        user_id: user.id,
        review_text: review,
        risk_level: riskLevel,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      review,
      riskLevel,
      reviewId: data.id,
    })
  } catch (error) {
    console.error("Error reviewing contract:", error)
    return NextResponse.json({ error: "Failed to review contract" }, { status: 500 })
  }
}
