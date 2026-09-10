"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, AlertCircle } from "lucide-react"

const COMPLIANCE_TYPES = ["GDPR", "HIPAA", "SOX", "CCPA", "Data Privacy", "Employment Law"]

export function ComplianceSection() {
  const [checkType, setCheckType] = useState(COMPLIANCE_TYPES[0])
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject for compliance check")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/ai/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkType, subject }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check compliance")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
        return "bg-green-50 border-accent"
      case "non_compliant":
        return "bg-red-50 border-danger"
      case "needs_review":
        return "bg-yellow-50 border-yellow-500"
      default:
        return "bg-neutral-50 border-neutral-200"
    }
  }

  return (
    <div id="compliance-section" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">Compliance Check</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-danger rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Compliance Type</label>
          <select
            id="compliance-type-select"
            value={checkType}
            onChange={(e) => setCheckType(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {COMPLIANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
          <input
            id="compliance-subject-input"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Describe what to check..."
          />
        </div>

        <Button
          id="compliance-submit-button"
          onClick={handleCheck}
          disabled={loading || !subject}
          className="w-full bg-secondary text-white hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Compliance"
          )}
        </Button>
      </div>

      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${getStatusColor(result.status)}`}>
          <p className="text-sm font-medium text-neutral-700 mb-2">Status</p>
          <p className="text-lg font-bold text-primary capitalize mb-3">{result.status.replace(/_/g, " ")}</p>
          <p className="text-neutral-700 text-sm whitespace-pre-wrap">{result.result}</p>
        </div>
      )}
    </div>
  )
}
