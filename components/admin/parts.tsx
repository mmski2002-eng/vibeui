import Link from "next/link"
import type { ReactNode } from "react"

/** Плитка с числом. Подпись сверху, значение крупно, пояснение мелко. */
export function Metric({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note?: string
  accent?: boolean
}) {
  return (
    <div className="border-shell-border bg-shell-panel min-w-0 rounded-xl border p-4">
      <p className="text-shell-muted truncate text-xs">{label}</p>
      <p
        className={`mt-1.5 text-2xl font-semibold tabular-nums ${
          accent ? "text-shell-accent-text" : "text-shell-fg"
        }`}
      >
        {value}
      </p>
      {note ? (
        <p className="text-shell-muted mt-1 text-xs leading-snug">{note}</p>
      ) : null}
    </div>
  )
}

export function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mt-8 first:mt-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-shell-fg font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * Столбики по дням. Своя разметка вместо библиотеки графиков: ряд чисел за
 * три месяца — это тридцать `span`, а не повод тянуть в бандл рисовалку.
 */
export function DayBars({
  data,
  label,
}: {
  data: { day: string; value: number }[]
  label: string
}) {
  const top = Math.max(1, ...data.map((row) => row.value))

  return (
    <div
      role="img"
      aria-label={`${label}: ${data.reduce((sum, row) => sum + row.value, 0)}`}
      className="border-shell-border bg-shell-panel flex h-24 items-end gap-[3px] rounded-xl border p-3"
    >
      {data.length === 0 ? null : (
        data.map((row) => (
          <span
            key={row.day}
            title={`${row.day}: ${row.value}`}
            className="bg-shell-accent/70 min-w-[3px] flex-1 rounded-sm"
            style={{ height: `${Math.max(4, (row.value / top) * 100)}%` }}
          />
        ))
      )}
    </div>
  )
}

/** Список «текст — число», одинаковый у топа запросов и пустых запросов. */
export function Ranked({
  rows,
  empty,
}: {
  rows: { query: string; value: number }[]
  empty: string
}) {
  if (rows.length === 0) {
    return <p className="text-shell-muted text-sm">{empty}</p>
  }

  return (
    <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-xl border">
      {rows.map((row) => (
        <li
          key={row.query}
          className="flex items-baseline justify-between gap-4 px-3.5 py-2 text-sm"
        >
          <span className="text-shell-fg min-w-0 truncate">{row.query}</span>
          <span className="text-shell-muted shrink-0 tabular-nums">
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Переключатель периода: ссылки, а не кнопки — период уезжает в адрес. */
export function PeriodSwitch({
  base,
  current,
  labels,
}: {
  base: string
  current: number
  labels: Record<number, string>
}) {
  return (
    <div className="border-shell-border flex items-center gap-0.5 rounded-lg border p-0.5">
      {[7, 30, 90].map((days) => (
        <Link
          key={days}
          href={`${base}?period=${days}`}
          aria-current={days === current ? "true" : undefined}
          className={`h-8 rounded-md px-2.5 text-sm leading-8 transition-colors ${
            days === current
              ? "bg-shell-elevated text-shell-fg font-medium"
              : "text-shell-muted hover:text-shell-fg"
          }`}
        >
          {labels[days]}
        </Link>
      ))}
    </div>
  )
}

export function AdminHeading({
  title,
  lead,
  action,
}: {
  title: string
  lead?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {lead ? (
          <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
            {lead}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

/** Значок статуса: одинаковый у платежей, обращений и пользователей. */
export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode
  tone?: "muted" | "accent" | "solid"
}) {
  const style =
    tone === "solid"
      ? "bg-shell-accent text-shell-accent-fg"
      : tone === "accent"
        ? "border-shell-accent/50 text-shell-accent-text border"
        : "border-shell-border text-shell-muted border"

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {children}
    </span>
  )
}
