import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { ContractReviewSection } from "@/components/contract-review-section"
import { LegalResearchSection } from "@/components/legal-research-section"
import { ComplianceSection } from "@/components/compliance-section"
import { getOrCreateProfile } from "@/lib/supabase/server"

export default async function Dashboard() {
  let session = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    session = data?.session
  } catch (err) {
    console.warn("Session check skipped:", err)
  }

  let profile = null
  if (session?.user?.id) {
    profile = await getOrCreateProfile(session.user.id)
  }

  if (!profile) {
    profile = {
      id: "demo-user",
      email: "counsel@lexora.legal",
      full_name: "Legal Counsel",
      company_name: "Lexora Legal Corp",
      user_type: "startup",
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardNav profile={profile} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome back, {profile?.full_name || "User"}</h1>
          <p className="text-neutral-600">
            {profile?.company_name} • {profile?.user_type?.replace(/_/g, " ")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ContractReviewSection />
            <LegalResearchSection />
          </div>

          <div>
            <ComplianceSection />
          </div>
        </div>
      </div>
    </div>
  )
}
