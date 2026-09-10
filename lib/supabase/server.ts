import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
  try {
    const supabase = await createClient()

    // Try to get existing profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

    if (profile) {
      return profile
    }

    // Try to retrieve admin user metadata or create
    let fullName = "User"
    let companyName = "Company"
    let userType = "startup"
    let email = "user@example.com"

    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      if (authUser?.user) {
        email = authUser.user.email || email
        fullName = authUser.user.user_metadata?.full_name || fullName
        companyName = authUser.user.user_metadata?.company_name || companyName
        userType = authUser.user.user_metadata?.user_type || userType
      }
    } catch {
      // ignore
    }

    try {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email,
          full_name: fullName,
          company_name: companyName,
          user_type: userType,
        })
        .select()
        .single()

      if (!createError && newProfile) {
        return newProfile
      }
    } catch {
      // ignore
    }

    return {
      id: userId,
      email,
      full_name: fullName,
      company_name: companyName,
      user_type: userType,
    }
  } catch (err) {
    console.warn("Could not query or create Supabase profile, using fallback profile:", err)
    return {
      id: userId,
      email: "counsel@company.com",
      full_name: "Legal Counsel",
      company_name: "Lexora Legal Corp",
      user_type: "startup",
    }
  }
}
