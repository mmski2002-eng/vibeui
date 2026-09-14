import Link from "next/link"
import type { ReactNode } from "react"

import { Delta, Sparkline, type Tone } from "@/components/account/ui/charts"
import { CountUp } from "@/components/account/ui/count-up"
import { formatNumber, type NumberKind } from "@/lib/format"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Плитка с числом. Подпись, значение крупно, под ним — изменение к
 * прошлому периоду и мини-график, если есть ряд по дням.
 *
 * Число набегает при появлении, линия рисуется. Плитка-ссылка ведёт к
 * списку, из которого число посчитано: «зависшие платежи: 3» → список.
 */
export function StatTile({
  label,
  value,
  kind = "int",
  locale = "ru",
  before,
  deltaSuffix,
  invertDelta,
  note,
  spark,
  tone,
  href,
  index,
  icon,
  className,
}: {
  label: string
  value: number | string
  kind?: NumberKind
  locale?: Locale
  /** Значение за прошлый период — для стрелки изменения. */
  before?: number
  deltaSuffix?: string
  invertDelta?: boolean
  note?: ReactNode
  spark?: number[]
  /** Цвет числа и линии. По умолчанию — нейтральный текст. */
  tone?: Tone
  href?: string
  index?: number
  icon?: ReactNode
  className?: string
}) {
  const numeric = typeof value === "number"
  const color =
    tone === "accent"
      ? "text-shell-accent-text"
      : tone === "ok"
        ? "text-shell-ok"
        : tone === "warn"
          ? "text-shell-warn"
          : tone === "danger"
            ? "text-shell-danger"
            : "text-shell-fg"

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-shell-muted truncate text-xs font-medium">{label}</p>
        {icon ? (
          <span className="text-shell-muted shrink-0 [&>svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-1.5 text-[1.65rem] leading-none font-semibold tracking-tight tabular-nums",
          color,
        )}
      >
        {numeric ? (
          <CountUp value={value} kind={kind} locale={locale} />
        ) : (
          value
        )}
      </p>
      {before !== undefined && numeric ? (
        <p className="mt-2 flex min-h-4 items-center">
          <Delta
            value={value}
            before={before}
            suffix={deltaSuffix}
            invert={invertDelta}
          />
        </p>
      ) : note ? (
        <p className="text-shell-muted mt-2 text-xs leading-snug">{note}</p>
      ) : null}
      {spark && spark.length > 1 ? (
        <div className="mt-3 -mb-1">
          <Sparkline data={spark} tone={tone ?? "accent"} index={index} />
        </div>
      ) : null}
    </>
  )

  const shell = cn(
    "border-shell-border bg-shell-panel acc-shadow block min-w-0 rounded-xl border p-4",
    index !== undefined && "acc-reveal",
    href && "acc-lift",
    className,
  )
  const style =
    index !== undefined ? { ["--i" as string]: index } : undefined

  return href ? (
    <Link
      href={href}
      className={shell}
      style={style}
      title={typeof value === "number" ? formatNumber(value, kind, locale) : undefined}
    >
      {body}
    </Link>
  ) : (
    <div className={shell} style={style}>
      {body}
    </div>
  )
}
