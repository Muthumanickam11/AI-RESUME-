import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type CandidateRow = {
  name: string
  score: number
  missingKeywords?: string[]
}

function badgeClass(score: number) {
  // 3 ranges mapped to our allowed accents/colors
  if (score >= 80)
    return (
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-background" +
      " " +
      "bg-[var(--accent-emerald)]"
    )
  if (score >= 50)
    return (
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-background" +
      " " +
      "bg-[var(--accent-cyan)]"
    )
  return (
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-background" +
    " " +
    "bg-[var(--brand-pink)]"
  )
}

export function CandidateTable({ rows }: { rows: CandidateRow[] }) {
  return (
    <Table>
      <TableCaption>{rows.length ? "Ranked by best match" : "No results yet"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Missing Keywords</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, idx) => (
          <TableRow key={idx} className="hover:bg-muted/40">
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell>
              <span className={badgeClass(r.score)}>{r.score}</span>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {r.missingKeywords?.length ? r.missingKeywords.join(", ") : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
