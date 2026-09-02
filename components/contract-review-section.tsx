"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"

export function ContractReviewSection() {
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [contractText, setContractText] = useState("")
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContractFile(file)
      const text = await file.text()
      setContractText(text)
    }
  }

  const handleReview = async () => {
    if (!contractText) {
      setError("Please upload or paste contract content")
      return
    }

    setLoading(true)
    setError(null)
    setReview(null)

    try {
      const response = await fetch("/api/ai/review-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractContent: contractText,
          contractId: null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to review contract")
      }

      setReview(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-accent"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-danger"
      default:
        return "text-neutral-700"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">Contract Review</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-danger rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Upload Contract</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-blue-600"
          />
          {contractFile && <p className="text-sm text-neutral-600 mt-2">Selected: {contractFile.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Or paste contract content</label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none h-32"
            placeholder="Paste your contract text here..."
          />
        </div>

        <Button
          onClick={handleReview}
          disabled={loading || !contractText}
          className="w-full bg-secondary text-white hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Reviewing...
            </>
          ) : (
            "Review Contract"
          )}
        </Button>
      </div>

      {review && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                review.riskLevel === "low"
                  ? "bg-green-50"
                  : review.riskLevel === "medium"
                    ? "bg-yellow-50"
                    : "bg-red-50"
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${getRiskColor(review.riskLevel)}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Risk Level</p>
              <p className={`text-lg font-bold ${getRiskColor(review.riskLevel)} capitalize`}>{review.riskLevel}</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-neutral-700 whitespace-pre-wrap text-sm">{review.review}</p>
          </div>
        </div>
      )}
    </div>
  )
}
