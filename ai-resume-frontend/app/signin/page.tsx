"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    router.push("/candidate")
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-pretty">{"Sign In"}</h1>
        <p className="text-muted-foreground mt-2">{"Access your dashboard to match resumes and jobs."}</p>
      </header>

      <div className="mx-auto max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{"Welcome back"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5" aria-label="Sign in form">
              <div className="space-y-2">
                <Label htmlFor="email">{"Email"}</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{"Password"}</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>

              <Button
                type="button"
                onClick={() => router.push("/candidate")}
                disabled={loading}
                className="w-full px-6 py-5 font-semibold text-base shadow-lg hover:shadow-[0_0_24px] hover:shadow-[color:var(--accent-emerald)]"
                style={{ backgroundColor: "var(--accent-emerald)", color: "var(--primary-foreground)" }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {"Don't have an account? "}
                <Link className="underline" href="/signup">
                  {"Create one"}
                </Link>
                {"."}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
