import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "AI Resume & Job Matcher",
  description: "Find the perfect job–resume match in seconds.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="min-h-dvh flex flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
