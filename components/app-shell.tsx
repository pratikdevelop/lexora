"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Bell, ChevronDown, CircleHelp, FileText, Folder, LayoutDashboard, LogOut, Menu, Search, Settings, ShieldCheck, Sparkles, Users, X, BarChart3, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { demoNotice, getInitials, managementItems, navItems } from "@/lib/domain"

const iconMap = { LayoutDashboard, FileText, Search, Sparkles, ShieldCheck, Folder, BarChart3, Users, CreditCard, Settings }

export function AppShell({ children, profile }: { children: React.ReactNode; profile?: { full_name?: string | null; email?: string | null } | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const displayName = profile?.full_name || "Maya Chen"
  const links = [...navItems, ...managementItems]
  const logout = async () => { await supabase.auth.signOut(); router.push("/") }
  return <div className="min-h-screen bg-muted/35 text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-16 items-center justify-between px-5"><Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>Lexora</Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></Button></div><Separator /><div className="flex items-center gap-3 px-4 py-4"><div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">NL</div><div className="min-w-0"><p className="truncate text-sm font-medium">Northstar Labs</p><p className="text-xs text-muted-foreground">Professional workspace</p></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div><nav className="flex-1 overflow-y-auto px-3 py-2"><p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p><div className="flex flex-col gap-1">{navItems.map((item) => { const Icon = iconMap[item.icon as keyof typeof iconMap]; const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4" />{item.label}</Link> })}</div><p className="px-3 pb-2 pt-7 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Manage</p><div className="flex flex-col gap-1">{managementItems.map((item) => { const Icon = iconMap[item.icon as keyof typeof iconMap]; const active = pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4" />{item.label}</Link> })}</div></nav><div className="border-t border-border p-3"><div className="flex items-center gap-3 rounded-lg p-2"><Avatar className="size-8"><AvatarFallback>{getInitials(displayName)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{displayName}</p><p className="truncate text-xs text-muted-foreground">{profile?.email || "demo@northstarlabs.com"}</p></div><button onClick={logout} className="text-muted-foreground hover:text-foreground" aria-label="Sign out"><LogOut className="size-4" /></button></div></div></aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
    <div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button><div className="relative hidden max-w-md flex-1 sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-9 border-0 bg-muted pl-9 shadow-none" placeholder="Search workspace" aria-label="Search workspace" /></div><div className="ml-auto flex items-center gap-1"><Button variant="ghost" size="icon" aria-label="Help"><CircleHelp /></Button><Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button><Separator orientation="vertical" className="mx-2 h-6" /><Avatar className="size-8"><AvatarFallback>{getInitials(displayName)}</AvatarFallback></Avatar></div></header><div className="border-b border-border bg-primary/5 px-4 py-2 text-center text-xs text-muted-foreground sm:px-6">{demoNotice}</div><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main></div>
  </div>
}
