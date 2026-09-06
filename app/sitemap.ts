import type { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "features", "solutions", "pricing", "security", "about", "contact", "blog", "terms", "privacy", "legal-disclaimer", "auth/login", "auth/sign-up"]; return routes.map((route) => ({ url: `https://v0-ai-legal-assistant-ruddy.vercel.app/${route}`, lastModified: new Date() })) }
