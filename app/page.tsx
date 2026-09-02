import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="max-w-2xl text-center text-white">
        <h1 className="text-5xl font-bold mb-6">AI Legal Assistant</h1>
        <p className="text-xl mb-8 opacity-90">
          Automate contract review, legal research, and compliance checks. Save time and reduce legal costs for your
          business.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/login">
            <Button className="bg-white text-primary hover:bg-neutral-100">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Create Account
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Contract Review</h3>
            <p className="text-sm opacity-90">AI-powered analysis of contracts with risk assessment</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Legal Research</h3>
            <p className="text-sm opacity-90">Instant legal insights and precedent research</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Compliance Checks</h3>
            <p className="text-sm opacity-90">Automated compliance verification and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
