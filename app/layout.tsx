import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Source_Serif_4 } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" })

export const metadata: Metadata = {
  metadataBase: new URL("https://v0-ai-legal-assistant-ruddy.vercel.app"),
  title: { default: "Lexora — AI-powered legal work for modern businesses", template: "%s — Lexora" },
  description: "Understand contracts faster, spot legal risks earlier, and keep legal work moving with Lexora.",
  openGraph: { title: "Lexora — AI-powered legal work for modern businesses", description: "Contract analysis, legal research, and compliance in one trusted workspace.", type: "website" },
  twitter: { card: "summary_large_image", title: "Lexora — AI-powered legal work for modern businesses", description: "Contract analysis, legal research, and compliance in one trusted workspace." },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: "#1f496b", colorScheme: "light" }

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${geist.variable} ${sourceSerif.variable}`}><body className="font-sans">{children}<Analytics /></body></html> }
