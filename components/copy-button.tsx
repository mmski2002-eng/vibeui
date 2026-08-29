"use client"

import { useState } from "react"

type CopyButtonProps = {
  value: string | null
  label: string
  copiedLabel?: string
  variant?: "primary" | "secondary"
  className?: string
}

type CopyState = "idle" | "copied" | "failed"

const VARIANTS = {
  primary:
    "bg-foreground text-background border-foreground hover:opacity-90 shadow-sm ",
  secondary: "hover:bg-muted ",
}

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  variant = "secondary",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle")

  async function copy() {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
    } catch {
      setState("failed")
    }

    window.setTimeout(() => setState("idle"), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className={
        "focus-visible:ring-ring inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 " +
        (state === "failed"
          ? "border-destructive text-destructive "
          : VARIANTS[variant]) +
        (className ?? "")
      }
    >
      {state === "copied"
        ? copiedLabel
        : state === "failed"
          ? "Copy failed"
          : label}
    </button>
  )
}
