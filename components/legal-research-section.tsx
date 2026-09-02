"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Loader2, AlertCircle } from "lucide-react"

export function LegalResearchSection() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResearch = async () => {
    if (!query.trim()) {
      setError("Please enter a research query")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/ai/legal-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to perform research")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">Legal Research</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-danger rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Research Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleResearch()}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g., Non-compete agreements in California..."
          />
        </div>

        <Button
          onClick={handleResearch}
          disabled={loading || !query}
          className="w-full bg-secondary text-white hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Researching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-bold text-primary mb-3">Research Results</h3>
          <p className="text-neutral-700 whitespace-pre-wrap text-sm">{result.result}</p>
        </div>
      )}
    </div>
  )
}
