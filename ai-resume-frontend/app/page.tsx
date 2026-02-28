import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="brand-gradient">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="text-center text-balance">
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              {"AI Resume & Job Matcher"}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">{"Find the perfect job–resume match in seconds."}</p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="px-6 py-5 font-semibold text-base shadow-lg ring-1 ring-white/10 hover:shadow-[0_0_24px] hover:shadow-[color:var(--accent-cyan)]"
                style={{ backgroundColor: "var(--accent-cyan)", color: "var(--primary-foreground)" }}
              >
                <Link href="/candidate">Candidate Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="px-6 py-5 font-semibold text-base bg-white text-foreground hover:bg-white/90 shadow-lg"
              >
                <Link href="/recruiter">Recruiter Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature teaser */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-card p-6 shadow-lg">
            <h3 className="font-semibold">Smart Matching</h3>
            <p className="text-muted-foreground mt-2">
              {"Upload a resume and job to instantly see a similarity score and improvement tips."}
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-lg">
            <h3 className="font-semibold">Actionable Suggestions</h3>
            <p className="text-muted-foreground mt-2">
              {"Surface missing keywords and strengths to refine your resume."}
            </p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-lg">
            <h3 className="font-semibold">Recruiter Ranking</h3>
            <p className="text-muted-foreground mt-2">
              {"Rank multiple resumes against one role with a readable table."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
