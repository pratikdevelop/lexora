import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function getOrCreateProfile(userId: string) {
  const supabase = await createClient()

  // Try to get existing profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

  // If profile doesn't exist, create default one
  if (!profile) {
    const { data: authUser } = await supabase.auth.admin.getUserById(userId)

    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: authUser?.user?.email || "",
        full_name: authUser?.user?.user_metadata?.full_name || "User",
        company_name: authUser?.user?.user_metadata?.company_name || "Company",
        user_type: authUser?.user?.user_metadata?.user_type || "startup",
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating profile:", createError)
      return null
    }

    return newProfile
  }

  return profile
}
