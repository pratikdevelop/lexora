export type ContractStatus = "Uploaded" | "Processing" | "Analyzing" | "Completed" | "Failed"
export type RiskLevel = "Low" | "Medium" | "High" | "Critical"
export type FindingSeverity = "low" | "medium" | "high" | "critical"

export interface Organization { id: string; name: string; plan: "Free" | "Starter" | "Professional" | "Business" | "Enterprise" }
export interface Membership { id: string; userId: string; organizationId: string; role: "Owner" | "Admin" | "Lawyer" | "Member" }
export interface Contract {
  id: string; organizationId: string; title: string; fileType: "PDF" | "DOCX" | "TXT"; status: ContractStatus
  riskLevel?: RiskLevel; riskScore?: number; updatedAt: string; createdAt: string; pages?: number
}
export interface RiskFinding { id: string; severity: FindingSeverity; title: string; originalClause: string; explanation: string; impact: string; recommendation: string; confidence: number; source?: string }
export interface ContractAnalysis { contractId: string; summary: string; riskScore: number; findings: RiskFinding[]; completedAt: string }
export interface ResearchSource { id: string; title: string; jurisdiction: string; date: string; citation: string; passage: string }
export interface UsageRecord { label: string; used: number; limit: number; unit: string }

export const demoOrganization: Organization = { id: "demo-org", name: "Northstar Labs", plan: "Professional" }
export const demoContracts: Contract[] = [
  { id: "nda-2026", organizationId: "demo-org", title: "Northstar Labs — Mutual NDA", fileType: "PDF", status: "Completed", riskLevel: "Medium", riskScore: 58, updatedAt: "Today, 9:42 AM", createdAt: "Mar 12, 2026", pages: 8 },
  { id: "msa-2026", organizationId: "demo-org", title: "Aster Digital — Master Services Agreement", fileType: "DOCX", status: "Analyzing", riskLevel: "High", riskScore: 76, updatedAt: "Yesterday", createdAt: "Mar 11, 2026", pages: 24 },
  { id: "dpa-2026", organizationId: "demo-org", title: "Personal Data Processing Addendum", fileType: "PDF", status: "Processing", updatedAt: "Mar 10, 2026", createdAt: "Mar 10, 2026", pages: 12 },
]
export const demoUsage: UsageRecord[] = [
  { label: "Contract analyses", used: 18, limit: 50, unit: "this month" },
  { label: "AI assistant messages", used: 142, limit: 500, unit: "this month" },
]
export const demoFindings: RiskFinding[] = [
  { id: "liability", severity: "high", title: "Unlimited liability", originalClause: "Each party shall be liable for all losses arising from or related to this Agreement.", explanation: "This clause does not cap exposure or exclude indirect damages.", impact: "A dispute could create financial exposure that is disproportionate to the contract value.", recommendation: "Negotiate a liability cap tied to fees paid in the prior 12 months and carve out only defined exceptions.", confidence: 0.94, source: "Section 9.2" },
  { id: "termination", severity: "medium", title: "Asymmetric termination rights", originalClause: "Customer may terminate for convenience upon 30 days' notice.", explanation: "The counterparty has no equivalent convenience termination right.", impact: "Your team may be locked into delivery obligations while the customer can exit quickly.", recommendation: "Add mutual termination rights and a wind-down payment for committed work.", confidence: 0.88, source: "Section 12.1" },
]
export const demoAnalysis: ContractAnalysis = { contractId: "nda-2026", summary: "A mutual confidentiality agreement between Northstar Labs and Aster Digital. The core protections are present, but liability language and termination mechanics merit review before signature.", riskScore: 58, findings: demoFindings, completedAt: "Today, 9:42 AM" }

export function isDemoMode() { return process.env.NEXT_PUBLIC_DEMO_MODE !== "false" }

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Contracts", href: "/dashboard/contracts", icon: "FileText" },
  { label: "Legal research", href: "/dashboard/research", icon: "Search" },
  { label: "AI assistant", href: "/dashboard/assistant", icon: "Sparkles" },
  { label: "Compliance", href: "/dashboard/compliance", icon: "ShieldCheck" },
  { label: "Documents", href: "/dashboard/documents", icon: "Folder" },
  { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
]
export const managementItems = [
  { label: "Team", href: "/dashboard/team", icon: "Users" },
  { label: "Billing", href: "/dashboard/billing", icon: "CreditCard" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
]
export const legalDisclaimer = "Lexora provides AI-generated legal information and document analysis for informational purposes only. It is not a substitute for advice from a qualified attorney.";

export function formatRisk(level?: RiskLevel) { return level ?? "Not assessed" }
export function riskTone(level?: RiskLevel) { return level === "Critical" || level === "High" ? "destructive" : level === "Medium" ? "warning" : "success" }
export function statusTone(status: ContractStatus) { return status === "Failed" ? "destructive" : status === "Completed" ? "success" : "info" }

export type ServiceResult<T> = { data: T | null; error: string | null; demo: boolean }
export type DashboardService = { listContracts: () => Promise<ServiceResult<Contract[]>>; getAnalysis: (id: string) => Promise<ServiceResult<ContractAnalysis>> }
export const contractService: DashboardService = {
  async listContracts() { return { data: demoContracts, error: null, demo: isDemoMode() } },
  async getAnalysis(id) { return { data: { ...demoAnalysis, contractId: id }, error: null, demo: isDemoMode() } },
}

export const featureCards = [
  ["Contract intelligence", "Move from upload to informed action with clause-level risk analysis, summaries, and negotiation guidance.", "FileText"],
  ["Research with sources", "Find relevant authorities, organize research, and keep every answer anchored to a source.", "Search"],
  ["Compliance workflows", "Turn recurring compliance checks into visible, accountable work for your team.", "ShieldCheck"],
]

export const faqItems = [
  ["Is Lexora legal advice?", "No. Lexora provides AI-generated legal information and document analysis for informational purposes. Always consult qualified counsel for advice on a specific matter."],
  ["What file types can I analyze?", "The workspace is designed for PDF and DOCX contracts, with validation and extraction boundaries ready for production document services."],
  ["Can my team collaborate?", "Yes. Organizations, memberships, roles, audit events, and permissions are modeled from the start so workspaces can grow with your team."],
]

export const landingStats = ["Clause-level findings", "Source-aware research", "Organization-ready"]

export const dateLabel = (value: string) => value

export function getInitials(name?: string | null) { return (name || "Lexora").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() }

export function cnText(value: string) { return value }

export function getContractById(id: string) { return demoContracts.find((contract) => contract.id === id) ?? demoContracts[0] }

export function getFindingLabel(severity: FindingSeverity) { return severity === "critical" ? "Critical risk" : `${severity[0].toUpperCase()}${severity.slice(1)} risk` }

export const demoActivity = ["NDA analysis completed", "Aster Digital MSA added", "Risk report exported"]
export const demoResearchSources: ResearchSource[] = [
  { id: "source-1", title: "Restatement (Second) of Contracts § 208", jurisdiction: "United States", date: "1981", citation: "Restatement (Second) of Contracts § 208 (Am. L. Inst. 1981)", passage: "A term is unconscionable when it is so one-sided that it is unreasonable to enforce it." },
  { id: "source-2", title: "Uniform Commercial Code § 2-302", jurisdiction: "United States", date: "2024", citation: "U.C.C. § 2-302 (2024)", passage: "The court may refuse to enforce a contract or clause that it finds to have been unconscionable at the time it was made." },
]

export const demoReportTypes = ["Contract review", "Risk assessment", "Compliance report", "Research summary"]
export const demoComplianceItems = ["Privacy & data protection", "Security controls", "Employment practices", "Contractual obligations"]
export const demoTeam = [
  { name: "Maya Chen", email: "maya@northstarlabs.com", role: "Owner", activity: "Active today" },
  { name: "Jordan Lee", email: "jordan@northstarlabs.com", role: "Lawyer", activity: "Active yesterday" },
]
export const demoAuditLog = [
  { action: "Analysis completed", actor: "Maya Chen", time: "Today, 9:42 AM" },
  { action: "Document uploaded", actor: "Maya Chen", time: "Today, 9:18 AM" },
  { action: "Member invited", actor: "Jordan Lee", time: "Mar 10, 2026" },
]

export const appName = "Lexora"
export const appTagline = "AI-powered legal work for modern businesses."
export const appDescription = "Understand contracts faster. Spot legal risks earlier. Lexora brings contract analysis, research, and compliance into one trusted workspace."
export const publicNav = ["Features", "Solutions", "Pricing", "Security", "About"]
export const pricingPlans = [
  { name: "Free", price: "$0", description: "For exploring the workspace", features: ["3 contract analyses / month", "AI assistant basics", "Personal workspace"] },
  { name: "Professional", price: "$49", description: "For teams doing legal work every week", features: ["50 contract analyses / month", "Source-aware research", "Reports and team roles"] },
  { name: "Business", price: "Custom", description: "For organizations scaling legal operations", features: ["Shared workspaces", "Advanced controls", "Priority support"] },
]

export const emptyStateCopy = { contracts: { title: "No contracts yet", description: "Upload your first contract to begin a structured review.", action: "Upload contract" }, reports: { title: "No reports generated", description: "Create a report when your team is ready to share a review." } }
export const pageDescriptions: Record<string, string> = { contracts: "Review agreements, track risk, and move work forward with confidence.", research: "Search and organize legal information with source-aware AI assistance.", assistant: "Ask focused questions with document context and references in view.", compliance: "Make compliance work visible, accountable, and easier to repeat.", documents: "Keep legal documents organized with secure, workspace-aware controls.", reports: "Turn analysis into clear reports your team can act on.", team: "Manage members, roles, and workspace activity.", billing: "Manage your plan, usage, and billing preferences.", settings: "Control profile, security, privacy, and workspace preferences." }

export const routeCards = [
  { label: "Upload contract", href: "/dashboard/contracts", icon: "Upload" },
  { label: "Ask Legal AI", href: "/dashboard/assistant", icon: "Sparkles" },
  { label: "Start research", href: "/dashboard/research", icon: "Search" },
  { label: "Run compliance check", href: "/dashboard/compliance", icon: "ShieldCheck" },
]

export const contractSummaryFields = ["Parties", "Effective date", "Termination", "Payment terms", "Renewal", "Confidentiality", "Liability", "Indemnification", "Governing law", "Dispute resolution", "Intellectual property", "Data protection"]
export const riskLegend: RiskLevel[] = ["Low", "Medium", "High", "Critical"]
export const supportedFileTypes = ["PDF", "DOCX"]
export const productPromise = ["Upload once", "Understand the risk", "Act with clarity"]
export const footerLinks = { Product: ["Features", "Solutions", "Pricing", "Security"], Company: ["About", "Contact", "Blog"], Legal: ["Terms", "Privacy", "Legal disclaimer"] }
export const helpText = "Need help? Our team is here to help you get started."
export const demoNotice = "Demo workspace · Sample data is clearly labeled and separate from production records."
