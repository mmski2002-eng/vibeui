"use client"

import { useState } from "react"

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <code className="border-shell-border bg-shell-elevated text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2 font-mono text-xs">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        }}
        className="bg-shell-accent text-shell-accent-fg inline-flex h-10 shrink-0 items-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        {copied ? "Скопировано" : "Скопировать"}
      </button>
    </div>
  )
}
