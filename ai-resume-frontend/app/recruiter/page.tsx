"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CandidateTable, type CandidateRow } from "@/components/candidate-table"
import { postForm } from "@/lib/api"

export default function RecruiterDashboard() {
  const [jobText, setJobText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CandidateRow[]>([])
  const [error, setError] = useState<string | null>(null)

  function onFilesSelected(newFiles: FileList | null) {
    if (!newFiles) return
    setFiles(Array.from(newFiles))
  }

  async function handleRank() {
    setLoading(true)
    setError(null)
    setRows([])
    try {
      const form = new FormData()
      if (jobText.trim()) form.append("job", jobText.trim())
      files.forEach((f) => form.append("resumes", f))

      const data = await postForm<CandidateRow[]>("/api/rank-candidates", form)
      setRows(data)
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || "Failed to rank candidates. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <header aria-labelledby="recruiter-title" className="text-center">
        <h1 id="recruiter-title" className="text-3xl md:text-4xl font-bold text-pretty">
          {"Recruiter Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {"Paste a job description and upload multiple resumes to get a ranked list."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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

            <div className="space-y-2">
              <label htmlFor="resume-files" className="text-sm font-medium">
                {"Upload Resumes (PDF/DOCX)"}
              </label>
              <input
                id="resume-files"
                type="file"
                multiple
                className="block w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) => onFilesSelected(e.target.files)}
                aria-describedby="resume-files-hint"
                accept=".pdf,.doc,.docx"
              />
              <p id="resume-files-hint" className="text-xs text-muted-foreground">
                {"You can select multiple files."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleRank}
                disabled={loading || (!jobText.trim() && files.length === 0)}
                className="px-6 py-5 font-semibold text-base shadow-lg hover:shadow-[0_0_24px] hover:shadow-[color:var(--accent-cyan)]"
                style={{ backgroundColor: "var(--accent-cyan)", color: "var(--primary-foreground)" }}
              >
                {loading ? "Ranking…" : "Rank Candidates"}
              </Button>
              {error ? <p className="text-destructive text-sm">{error}</p> : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <CandidateTable rows={rows} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
