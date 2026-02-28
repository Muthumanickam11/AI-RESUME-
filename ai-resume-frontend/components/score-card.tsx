"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function ScoreCard({ score, accent = "cyan" }: { score: number; accent?: "cyan" | "emerald" }) {
  const value = Math.min(Math.max(score, 0), 100)
  const remainder = 100 - value
  const data = [
    { name: "Score", value },
    { name: "Remaining", value: remainder },
  ]
  const color = accent === "cyan" ? "var(--accent-cyan)" : "var(--accent-emerald)"

  return (
    <div className="flex items-center gap-6">
      <div className="h-36 w-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={68}
              stroke="transparent"
              startAngle={90}
              endAngle={-270}
            >
              <Cell key="score" fill={color} />
              <Cell key="remain" fill="color-mix(in oklab, var(--muted) 85%, var(--foreground))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{"Match Score"}</p>
        <p className="text-4xl font-bold">{value}%</p>
        <p className="text-sm text-muted-foreground mt-1">{"Higher is better."}</p>
      </div>
    </div>
  )
}
