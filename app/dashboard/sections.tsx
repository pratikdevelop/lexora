import { WorkspaceView } from "@/components/workspace-view"
export function SectionPage({ section }: { section: "research" | "assistant" | "compliance" | "documents" | "reports" | "team" | "billing" | "settings" }) { return <WorkspaceView section={section} /> }
