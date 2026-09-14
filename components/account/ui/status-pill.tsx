import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type PillTone = "ok" | "warn" | "danger" | "accent" | "muted" | "solid"

const TONE: Record<PillTone, string> = {
  ok: "border-shell-ok/30 bg-shell-ok-soft text-shell-ok",
  warn: "border-shell-warn/30 bg-shell-warn-soft text-shell-warn",
  danger: "border-shell-danger/30 bg-shell-danger-soft text-shell-danger",
  accent: "border-shell-accent-line bg-shell-accent-soft text-shell-accent-text",
  muted: "border-shell-border bg-transparent text-shell-muted",
  solid: "border-transparent bg-shell-accent text-shell-accent-fg",
}

/**
 * Значок статуса. Цвет говорит о смысле: зелёный — всё хорошо, янтарный —
 * ждём или внимание, красный — не прошло. Оранжевый остался тарифу Pro.
 */
export function StatusPill({
  tone = "muted",
  dot,
  className,
  children,
}: {
  tone?: PillTone
  /** Точка перед текстом — для «живых» статусов вроде «Активна». */
  dot?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  )
}
