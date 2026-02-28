import { CheckCircle2, AlertTriangle } from "lucide-react"

export function SuggestionsList({
  positives,
  improvements,
}: {
  positives: string[]
  improvements: string[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          <h4 className="font-semibold">Strengths</h4>
        </div>
        <ul className="mt-3 list-disc ps-5 space-y-2">
          {positives.length ? (
            positives.map((item, i) => (
              <li key={i} className="text-sm">
                {item}
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No strengths detected yet.</li>
          )}
        </ul>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          <h4 className="font-semibold">Improvements</h4>
        </div>
        <ul className="mt-3 list-disc ps-5 space-y-2">
          {improvements.length ? (
            improvements.map((item, i) => (
              <li key={i} className="text-sm">
                {item}
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No suggestions yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
