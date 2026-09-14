import { and, desc, eq, sql } from "drizzle-orm"

import { AdminHeading, INPUT_CLASS } from "@/components/admin/parts"
import { Button, ButtonLink } from "@/components/account/ui/button"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { report } from "@/lib/db/schema"

const PAGE = 40

type Kind = keyof typeof ADMIN_TEXTS.reports.kind
type Status = keyof typeof ADMIN_TEXTS.reports.status

const STATUS_TONE: Record<Status, PillTone> = {
  new: "warn",
  in_progress: "accent",
  answered: "ok",
  closed: "muted",
  spam: "muted",
}

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

      <form
        className="acc-reveal mb-4 flex flex-wrap items-center gap-2"
        action=""
        style={{ ["--i" as string]: 1 }}
      >
        <select name="kind" defaultValue={kind ?? "all"} className={INPUT_CLASS}>
          <option value="all">{ADMIN_TEXTS.payments.all}</option>
          {Object.entries(t.kind).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? "all"} className={INPUT_CLASS}>
          <option value="all">{ADMIN_TEXTS.payments.all}</option>
          {Object.entries(t.status).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <label className="text-shell-muted flex h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="mine"
            value="1"
            defaultChecked={mine}
            className="accent-shell-accent size-4"
          />
          {t.mine}
        </label>
        <Button type="submit">{ADMIN_TEXTS.users.find}</Button>
      </form>

      <DataTable
        index={2}
        caption={t.title}
        empty={t.empty}
        columns={[
          { key: "subject", label: "Обращение" },
          { key: "kind", label: "Тип", className: "w-28", hideBelow: "sm" },
          { key: "status", label: t.setStatus, className: "w-28" },
          { key: "age", label: "Возраст", align: "right", className: "w-24" },
        ]}
        rows={page.map((row) => ({
          id: row.id,
          href: `/account/admin/reports/${row.id}`,
          cells: [
            <CellStack
              key="subject"
              primary={row.subject}
              secondary={`${row.email}${row.itemName ? ` · ${row.itemName}` : ""}`}
            />,
            <StatusPill key="kind">{t.kind[row.kind as Kind] ?? row.kind}</StatusPill>,
            <StatusPill key="status" tone={STATUS_TONE[row.status as Status] ?? "muted"} dot={row.status === "new"}>
              {t.status[row.status as Status] ?? row.status}
            </StatusPill>,
            <span key="age" className="text-shell-muted text-xs tabular-nums">
              {t.age(days(row.createdAt))}
            </span>,
          ],
        }))}
      />

      {next ? (
        <ButtonLink
          href={`/account/admin/reports?${params.toString()}${params.size ? "&" : ""}before=${next.toISOString()}`}
          className="mt-4"
        >
          {t.more}
        </ButtonLink>
      ) : null}
    </>
  )
}
