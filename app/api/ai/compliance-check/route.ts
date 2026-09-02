import { createClient } from "@/lib/supabase/server"
import { checkCompliance } from "@/lib/ai"
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

    const { checkType, subject } = await request.json()

    const result = await checkCompliance(checkType, subject)

    // Parse status from result
    const statusMatch = result.match(/compliant|non[_-]compliant|needs review/i)
    const status = statusMatch ? statusMatch[0].toLowerCase().replace(/\s+/g, "_") : "needs_review"

    // Save compliance check to database
    const { data, error } = await supabase
      .from("compliance_checks")
      .insert({
        user_id: user.id,
        check_type: checkType,
        subject,
        status,
        details: { result },
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      result,
      status,
      complianceId: data.id,
    })
  } catch (error) {
    console.error("Error checking compliance:", error)
    return NextResponse.json({ error: "Failed to check compliance" }, { status: 500 })
  }
}
