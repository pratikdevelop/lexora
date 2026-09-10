import { DashboardNav } from "@/components/dashboard-nav"
import { ContractReviewSection } from "@/components/contract-review-section"
import { createClient, getOrCreateProfile } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ContractsPage() {
  let profile = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user?.id) {
      profile = await getOrCreateProfile(data.session.user.id)
    }
  } catch {
    // fallback
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-secondary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-primary">Contract Analysis & Review</h1>
          <p className="text-neutral-600 mt-1">Upload agreements for automated clause analysis and risk scoring.</p>
        </div>
        <ContractReviewSection />
      </div>
    </div>
  )
}
