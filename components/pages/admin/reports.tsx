import Link from "next/link"
import { and, desc, eq, sql } from "drizzle-orm"

import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { report } from "@/lib/db/schema"

const PAGE = 40

type Kind = keyof typeof ADMIN_TEXTS.reports.kind
type Status = keyof typeof ADMIN_TEXTS.reports.status

function days(from: Date) {
  return Math.floor((Date.now() - from.getTime()) / (24 * 60 * 60 * 1000))
}

/**
 * Очередь обращений. Возраст важнее даты: «пять дней без ответа» читается
 * сразу, а «3 сентября» надо ещё пересчитать в голове.
 */
export async function AdminReports({
  kind,
  status,
  mine,
  before,
  adminEmail,
}: {
  kind?: string
  status?: string
  mine?: boolean
  before?: string
  adminEmail?: string
}) {
  const admin = await requireAdmin()
  const t = ADMIN_TEXTS.reports
  const cursor = before ? new Date(before) : null

  const filters = [
    kind && kind !== "all" ? eq(report.kind, kind) : undefined,
    status && status !== "all" ? eq(report.status, status) : undefined,
    mine ? eq(report.assigneeEmail, adminEmail ?? admin.email) : undefined,
    cursor && !Number.isNaN(cursor.getTime())
      ? sql`${report.createdAt} < ${cursor}`
      : undefined,
  ].filter(Boolean)

  const rows = await db
    .select()
    .from(report)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(report.createdAt))
    .limit(PAGE + 1)

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null

  const params = new URLSearchParams()

  if (kind && kind !== "all") params.set("kind", kind)
  if (status && status !== "all") params.set("status", status)
  if (mine) params.set("mine", "1")

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      <form className="mb-4 flex flex-wrap items-center gap-2" action="">
        <select
          name="kind"
          defaultValue={kind ?? "all"}
          className="border-shell-border bg-shell-elevated text-shell-fg h-10 rounded-lg border px-3 text-sm outline-none"
        >
          <option value="all">{ADMIN_TEXTS.payments.all}</option>
          {Object.entries(t.kind).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="border-shell-border bg-shell-elevated text-shell-fg h-10 rounded-lg border px-3 text-sm outline-none"
        >
          <option value="all">{ADMIN_TEXTS.payments.all}</option>
          {Object.entries(t.status).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <label className="text-shell-muted flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="mine"
            value="1"
            defaultChecked={mine}
            className="accent-shell-accent size-4"
          />
          {t.mine}
        </label>
        <button
          type="submit"
          className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-3.5 text-sm transition-colors"
        >
          {ADMIN_TEXTS.reports.setStatus}
        </button>
      </form>

      {page.length === 0 ? (
        <p className="text-shell-muted text-sm">{t.empty}</p>
      ) : (
        <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
          {page.map((row) => (
            <li key={row.id}>
              <Link
                href={`/account/admin/reports/${row.id}`}
                className="hover:bg-shell-elevated flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm transition-colors"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-shell-fg block truncate font-medium">
                    {row.subject}
                  </span>
                  <span className="text-shell-muted block truncate text-xs">
                    {row.email}
                    {row.itemName ? ` · ${row.itemName}` : ""}
                  </span>
                </span>
                <Pill>{t.kind[row.kind as Kind] ?? row.kind}</Pill>
                <Pill tone={row.status === "new" ? "accent" : "muted"}>
                  {t.status[row.status as Status] ?? row.status}
                </Pill>
                <span className="text-shell-muted w-20 shrink-0 text-right text-xs tabular-nums">
                  {t.age(days(row.createdAt))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {next ? (
        <Link
          href={`/account/admin/reports?${params.toString()}${params.size ? "&" : ""}before=${next.toISOString()}`}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
        >
          {t.more}
        </Link>
      ) : null}
    </>
  )
}
