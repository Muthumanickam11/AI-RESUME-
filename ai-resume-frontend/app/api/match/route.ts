import { NextResponse } from "next/server"

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? []
}

function scoreFromTokens(job: string, resumeHint: string) {
  const jobTokens = new Set(tokenize(job))
  const resTokens = new Set(tokenize(resumeHint))
  if (jobTokens.size === 0 || resTokens.size === 0) return 0

  let overlap = 0
  for (const t of jobTokens) if (resTokens.has(t)) overlap++
  const raw = Math.round((overlap / jobTokens.size) * 100)
  return Math.max(0, Math.min(100, raw))
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData()
    const job = (fd.get("job")?.toString() ?? "").slice(0, 50_000)
    const resumeFile = fd.get("resume") as File | null
    const external = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim()

    // Proxy to external API if configured
    if (external) {
      const out = new FormData()
      if (job) out.append("job_text", job)
      if (resumeFile) out.append("file", resumeFile, resumeFile.name)

      const resp = await fetch(`${external.replace(/\/+$/, "")}/match/score-direct`, {
        method: "POST",
        body: out,
      })

      const ct = resp.headers.get("content-type") || ""
      if (!ct.includes("application/json")) {
        const text = await resp.text()
        return NextResponse.json(
          {
            message: "External API did not return JSON. Please verify your /match endpoint.",
            details: text.slice(0, 500),
          },
          { status: 502 },
        )
      }
      const data = await resp.json()
      return NextResponse.json(data)
    }

    // Local fallback: naive scoring based on filename and job text
    const resumeHint = resumeFile ? `${resumeFile.name}` : "resume"
    const score = scoreFromTokens(job, resumeHint)

    // Very simple positives/improvements based on top tokens
    const jobTokens = Array.from(new Set(tokenize(job))).slice(0, 10)
    const positives = jobTokens.filter((t) => resumeHint.toLowerCase().includes(t)).slice(0, 5)
    const improvements = jobTokens.filter((t) => !resumeHint.toLowerCase().includes(t)).slice(0, 5)

    return NextResponse.json({ score, positives, improvements })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to process match." }, { status: 500 })
  }
}
