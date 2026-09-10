"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string | null
  label: string
  copiedLabel?: string
  variant?: "primary" | "secondary"
  className?: string
  /** Зовётся после удачного копирования: рядом с кнопкой можно показать,
   *  что делать со скопированным дальше. */
  onCopied?: () => void
}

type CopyState = "idle" | "copied" | "failed"

// Кнопка живёт только внутри тёмной оболочки каталога, поэтому опирается
// на её токены --shell-*, а не на глобальную светлую тему.
const VARIANTS = {
  primary:
    "bg-shell-accent text-shell-accent-fg border-shell-accent hover:opacity-90 ",
  secondary:
    "border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong ",
}

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  variant = "secondary",
  className,
  onCopied,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle")

  async function copy() {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
      onCopied?.()
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
      className={cn(
        "focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        state === "failed"
          ? "border-destructive text-destructive"
          : VARIANTS[variant],
        className,
      )}
    >
      {state === "copied"
        ? copiedLabel
        : state === "failed"
          ? "Copy failed"
          : label}
    </button>
  )
}
