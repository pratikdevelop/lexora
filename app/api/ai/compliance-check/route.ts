import { createClient } from "@/lib/supabase/server"
import { checkCompliance } from "@/lib/ai"
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

    const { checkType, subject } = await request.json()
    if (!checkType || !subject) {
      return NextResponse.json({ error: "Missing checkType or subject" }, { status: 400 })
    }

    const result = await checkCompliance(checkType, subject)

    // Parse status from result
    const statusMatch = result.match(/compliant|non[_-]compliant|needs review/i)
    const status = statusMatch ? statusMatch[0].toLowerCase().replace(/\s+/g, "_") : "needs_review"

    let complianceId = `comp_${Date.now()}`

    // Save compliance check to database if available
    try {
      const { data, error } = await supabase
        .from("compliance_checks")
        .insert({
          user_id: userId,
          check_type: checkType,
          subject,
          status,
          details: { result },
        })
        .select()
        .single()

      if (!error && data?.id) {
        complianceId = data.id
      }
    } catch (dbErr) {
      console.warn("Database storage skipped (offline mode):", dbErr)
    }

    return NextResponse.json({
      result,
      status,
      complianceId,
    })
  } catch (error) {
    console.error("Error checking compliance:", error)
    return NextResponse.json({ error: "Failed to check compliance" }, { status: 500 })
  }
}
