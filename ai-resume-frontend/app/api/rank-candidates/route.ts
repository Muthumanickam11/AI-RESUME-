import { NextResponse } from "next/server"

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? []
}

function scoreFromTokens(job: string, hint: string) {
  const jobTokens = new Set(tokenize(job))
  const candTokens = new Set(tokenize(hint))
  if (jobTokens.size === 0 || candTokens.size === 0) return 0

  let overlap = 0
  for (const t of jobTokens) if (candTokens.has(t)) overlap++
  const raw = Math.round((overlap / jobTokens.size) * 100)
  return Math.max(0, Math.min(100, raw))
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData()
    const job = (fd.get("job")?.toString() ?? "").slice(0, 50_000)
    const resumes = fd.getAll("resumes") as File[]
    const external = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim()

    // Proxy if external API is configured
    if (external) {
      const out = new FormData()
      if (job) out.append("job_text", job)
      for (const f of resumes) out.append("files", f, f.name)

      const resp = await fetch(`${external.replace(/\/+$/, "")}/match/rank-direct`, {
        method: "POST",
        body: out,
      })

      const ct = resp.headers.get("content-type") || ""
      if (!ct.includes("application/json")) {
        const text = await resp.text()
        return NextResponse.json(
          {
            message: "External API did not return JSON. Please verify your /rank_candidates endpoint.",
            details: text.slice(0, 500),
          },
          { status: 502 },
        )
      }
      const data = await resp.json()
      return NextResponse.json(data)
    }

    // Local fallback: rank by naive token overlap using filename as hint
    const jobTokens = Array.from(new Set(tokenize(job))).slice(0, 12)
    const rows = resumes.map((f) => {
      const hint = f.name
      const score = scoreFromTokens(job, hint)
      const missing = jobTokens.filter((t) => !hint.toLowerCase().includes(t)).slice(0, 6)
      return { name: f.name, score, missingKeywords: missing }
    })

    // Sort descending by score
    rows.sort((a, b) => b.score - a.score)
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to rank candidates." }, { status: 500 })
  }
}
