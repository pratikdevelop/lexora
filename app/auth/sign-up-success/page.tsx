import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Account Created!</h1>
        <p className="mb-8 opacity-90">
          Check your email to confirm your account. Once confirmed, you can sign in and start using AI Legal Assistant.
        </p>
        <Link href="/auth/login">
          <Button className="bg-white text-primary hover:bg-neutral-100">Go to Sign In</Button>
        </Link>
      </div>
    </div>
  )
}
