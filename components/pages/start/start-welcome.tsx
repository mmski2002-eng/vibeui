"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, MailCheck } from "lucide-react"

import type { StartTexts } from "@/components/pages/start/texts"
import { safeNext } from "@/lib/safe-path"

/**
 * Плашка первого визита: сюда приводит подтверждение почты с `next` — куда
 * человек шёл до регистрации. Без `next` плашки нет: гайд открыли из
 * подвала, пропускать нечего. Отдельного флага «онбординг пройден» в базе
 * нет: подтверждение почты происходит один раз, этого достаточно.
 */
export function StartWelcome({
  text,
  variant,
}: {
  text: StartTexts["welcome"]
  variant: "top" | "bottom"
}) {
  const params = useSearchParams()
  const raw = params.get("next")

  if (!raw) return null

  const next = safeNext(raw)

  if (variant === "bottom") {
    return (
      <Link
        href={next}
        className="border-shell-border text-shell-fg hover:bg-shell-panel hover:border-shell-border-strong focus-visible:ring-shell-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
      >
        {text.done}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    )
  }

  return (
    <aside
      role="status"
      className="border-shell-accent-line bg-shell-accent-soft/60 mb-8 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <MailCheck
          className="text-shell-accent-text mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-shell-fg text-sm font-medium">{text.title}</p>
          <p className="text-shell-muted text-sm">{text.lead}</p>
        </div>
      </div>
      <Link
        href={next}
        className="text-shell-fg hover:text-shell-accent-text inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors"
      >
        {text.skip}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </aside>
  )
}
