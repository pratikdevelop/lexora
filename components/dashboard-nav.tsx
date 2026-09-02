"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Menu, X } from "lucide-react"

export function DashboardNav({ profile }: { profile: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          AI Legal Assistant
        </Link>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard/contracts" className="hover:opacity-80">
            Contracts
          </Link>
          <Link href="/dashboard/research" className="hover:opacity-80">
            Research
          </Link>
          <Link href="/dashboard/compliance" className="hover:opacity-80">
            Compliance
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white text-white hover:bg-white/10 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary p-4 md:hidden space-y-2">
            <Link href="/dashboard/contracts" className="block hover:opacity-80 py-2">
              Contracts
            </Link>
            <Link href="/dashboard/research" className="block hover:opacity-80 py-2">
              Research
            </Link>
            <Link href="/dashboard/compliance" className="block hover:opacity-80 py-2">
              Compliance
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full border-white text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
