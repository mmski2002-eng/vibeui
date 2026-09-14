import type { ReactNode } from "react"

import { PageHeader } from "@/components/account/ui/page-header"
import { Panel } from "@/components/account/ui/panel"
import { StatTile } from "@/components/account/ui/stat-tile"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { cn } from "@/lib/utils"

/**
 * Детали админки собраны из примитивов кабинета (`components/account/ui`).
 * Здесь остались только обёртки с прежними именами и подписи, специфичные
 * для админки, чтобы карточки платежа, обращения и пользователя не
 * переписывать ради переименования.
 */

/** Плитка с числом: подпись сверху, значение крупно, пояснение мелко. */
export function Metric({
  label,
  value,
  note,
  accent,
  index,
}: {
  label: string
  value: string | number
  note?: string
  accent?: boolean
  index?: number
}) {
  return (
    <StatTile
      label={label}
      value={value}
      note={note}
      tone={accent ? "accent" : undefined}
      index={index}
    />
  )
}

export function Section({
  title,
  action,
  index,
  children,
}: {
  title: string
  action?: ReactNode
  index?: number
  children: ReactNode
}) {
  return (
    <section
      className={cn("mt-8 first:mt-0", index !== undefined && "acc-reveal")}
      style={index !== undefined ? { ["--i" as string]: index } : undefined}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-shell-fg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

/** Список «текст — число» с полосой доли: топ запросов и пустые запросы. */
export function Ranked({
  rows,
  empty,
  tone = "accent",
}: {
  rows: { query: string; value: number }[]
  empty: string
  tone?: "accent" | "warn"
}) {
  if (rows.length === 0) {
    return <p className="text-shell-muted text-sm">{empty}</p>
  }

  const top = Math.max(1, ...rows.map((row) => row.value))

  return (
    <ol className="grid gap-1">
      {rows.map((row, position) => (
        <li
          key={row.query}
          className="relative isolate flex items-baseline justify-between gap-4 overflow-hidden rounded-md px-2.5 py-1.5 text-sm"
        >
          <span
            aria-hidden="true"
            className="acc-grow-x absolute inset-y-0 left-0 -z-10 rounded-md opacity-[0.14]"
            style={{
              ["--i" as string]: position,
              width: `${(row.value / top) * 100}%`,
              background:
                tone === "warn" ? "var(--shell-warn)" : "var(--shell-accent)",
            }}
          />
          <span className="text-shell-fg min-w-0 truncate">{row.query}</span>
          <span className="text-shell-muted shrink-0 text-xs tabular-nums">
            {row.value}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function AdminHeading({
  title,
  lead,
  action,
  eyebrow,
}: {
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
  eyebrow?: ReactNode
}) {
  return (
    <PageHeader title={title} lead={lead} action={action} eyebrow={eyebrow} />
  )
}

/** Значок статуса. Старые тона админки переведены на семантические. */
export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode
  tone?: PillTone
}) {
  return <StatusPill tone={tone}>{children}</StatusPill>
}

/** Панель карточки: заголовок и содержимое. */
export function Card({
  title,
  action,
  index,
  variant,
  children,
}: {
  title?: ReactNode
  action?: ReactNode
  index?: number
  variant?: "default" | "soft" | "danger" | "warn"
  children: ReactNode
}) {
  return (
    <Panel index={index} variant={variant}>
      {title ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-shell-fg text-base font-semibold tracking-tight">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </Panel>
  )
}

export const INPUT_CLASS =
  "border-shell-border bg-shell-panel text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

/** Строка «подпись — значение» для карточек. */
export function Row({
  label,
  children,
  mono,
}: {
  label: ReactNode
  children: ReactNode
  mono?: boolean
}) {
  return (
    <div className="border-shell-divider flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5 text-sm last:border-b-0">
      <dt className="text-shell-muted shrink-0">{label}</dt>
      <dd
        className={cn(
          "text-shell-fg min-w-0 text-right",
          mono && "font-mono text-xs",
        )}
      >
        {children}
      </dd>
    </div>
  )
}
