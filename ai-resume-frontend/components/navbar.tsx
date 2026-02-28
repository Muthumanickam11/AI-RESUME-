import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder-logo.png"
              alt="AI Resume Matcher logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <Link href="/" className={cn("font-semibold")}>
              {"AI Resume & Job Matcher"}
            </Link>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/candidate">Candidate</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/recruiter">Recruiter</Link>
            </Button>
            <Button
              asChild
              className="text-sm font-semibold shadow-lg hover:shadow-[0_0_18px] hover:shadow-[color:var(--accent-emerald)]"
              style={{ backgroundColor: "var(--accent-emerald)", color: "var(--primary-foreground)" }}
            >
              <Link href="/candidate">Sign In</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
