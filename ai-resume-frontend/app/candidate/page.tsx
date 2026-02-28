"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { ScoreCard } from "@/components/score-card"
import { SuggestionsList } from "@/components/suggestions-list"
import { postForm } from "@/lib/api"

type MatchResponse = {
  score: number
  positives: string[]
  improvements: string[]
}

function normalizeMatchResponse(payload: any) {
  // unwrap common nesting patterns
  const root = typeof payload === "object" && payload !== null ? (payload.result ?? payload.data ?? payload) : {}

  // extract score from multiple possible keys
  const rawScore = root.score ?? root.matchScore ?? root.match_score ?? root.match ?? 0

  // coerce to number
  let scoreNum = Number(rawScore)
  if (Number.isNaN(scoreNum)) scoreNum = 0

  // if score is a fraction (0–1), convert to percentage
  if (scoreNum > 0 && scoreNum <= 1) {
    scoreNum = scoreNum * 100
  }

  // clamp to 0–100 and round
  const score = Math.max(0, Math.min(100, Math.round(scoreNum)))

  // extract suggestions
  const positives = Array.isArray(root.positives) ? root.positives : Array.isArray(root.strengths) ? root.strengths : []

  const improvementsCandidates =
    root.improvements ?? root.suggestions ?? root.missing ?? root.gaps ?? root.missingKeywords ?? []

  const improvements = Array.isArray(improvementsCandidates) ? improvementsCandidates : []

  return { score, positives, improvements } as const
}

export default function CandidateDashboard() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      if (resumeFile) form.append("resume", resumeFile)
      if (jobText.trim()) form.append("job", jobText.trim())

      let payload: any = await postForm("/api/match", form)

      if (typeof payload === "string") {
        const trimmed = payload.trim()
        if (trimmed.toLowerCase().startsWith("<!doctype html")) {
          throw new Error("Received HTML from the API. Verify your /api/match route returns JSON.")
        }
        try {
          payload = JSON.parse(trimmed)
        } catch {
          throw new Error("API returned non-JSON payload. Please check your /api/match endpoint.")
        }
      }

      console.log("[v0] Raw /api/match response (parsed):", payload)
      const normalized = normalizeMatchResponse(payload)
      console.log("[v0] Normalized response:", normalized)
      setResult(normalized as any)
    } catch (e: any) {
      const message = e?.message || e?.response?.data?.message || "Failed to analyze. Please try again."
      setError(message)
      console.log("[v0] Analyze error:", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <header aria-labelledby="candidate-title" className="text-center">
        <h1 id="candidate-title" className="text-3xl md:text-4xl font-bold text-pretty">
          {"Candidate Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {"Upload your resume and paste a job description to see your match score and suggestions."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload label="Upload Resume (PDF/DOCX)" onFileSelected={(file) => setResumeFile(file)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                aria-label="Job description"
                placeholder="Paste the job description here..."
                className="min-h-[180px]"
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || (!resumeFile && !jobText.trim())}
                  className="px-6 py-5 font-semibold text-base shadow-lg hover:shadow-[0_0_24px] hover:shadow-[color:var(--accent-emerald)]"
                  style={{ backgroundColor: "var(--accent-emerald)", color: "var(--primary-foreground)" }}
                >
                  {loading ? "Analyzing…" : "Analyze Match"}
                </Button>
                {error ? <p className="text-destructive text-sm">{error}</p> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreCard score={result?.score ?? 0} accent="cyan" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <SuggestionsList positives={result?.positives ?? []} improvements={result?.improvements ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
