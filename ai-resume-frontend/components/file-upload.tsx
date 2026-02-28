"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  label?: string
  onFileSelected?: (file: File | null) => void
}

export function FileUpload({ label = "Upload File", onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => onFileSelected?.(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-4 py-5 font-semibold text-sm shadow-lg hover:shadow-[0_0_18px] hover:shadow-[color:var(--accent-cyan)]"
        style={{ backgroundColor: "var(--accent-cyan)", color: "var(--primary-foreground)" }}
      >
        {label}
      </Button>
    </div>
  )
}
