import Link from "next/link"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { Download, Search } from "lucide-react"

import { AdminHeading, INPUT_CLASS } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button, ButtonLink } from "@/components/account/ui/button"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { payment, user } from "@/lib/db/schema"
import { formatDate, formatNumber } from "@/lib/format"

const PAGE = 50

type Status = keyof typeof ADMIN_TEXTS.payments.status

function statusOf(value: string): Status {
  return value === "succeeded" ||
    value === "pending" ||
    value === "canceled" ||
    value === "refunded"
    ? value
    : "unknown"
}

export const PAYMENT_TONE: Record<Status, PillTone> = {
  succeeded: "ok",
  pending: "warn",
  canceled: "muted",
  refunded: "accent",
  unknown: "danger",
}

/**
 * Платежи как они лежат у нас: с поиском по почте и идентификатору ЮKassa.
 *
 * Пагинация курсором по дате, а не смещением: смещение на длинной таблице
 * заставляет базу перечитывать всё, что пропущено, и на общем сервере это
 * заметно.
 */
export async function AdminPayments({
  query,
  status,
  before,
}: {
  query?: string
  status?: string
  before?: string
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.payments
  const needle = query?.trim()
  const cursor = before ? new Date(before) : null

  const filters = [
    status && status !== "all" ? eq(payment.status, status) : undefined,
    cursor && !Number.isNaN(cursor.getTime())
      ? sql`${payment.createdAt} < ${cursor}`
      : undefined,
    needle
      ? or(
          ilike(user.email, `%${needle}%`),
          ilike(payment.yookassaId, `%${needle}%`),
        )
      : undefined,
  ].filter(Boolean)

  const rows = await db
    .select({
      id: payment.id,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      amount: payment.amount,
      status: payment.status,
      yookassaId: payment.yookassaId,
      userId: payment.userId,
      email: user.email,
    })
    .from(payment)
    .leftJoin(user, eq(user.id, payment.userId))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(payment.createdAt))
    .limit(PAGE + 1)

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null
  const sum = page
    .filter((row) => row.status === "succeeded")
    .reduce((total, row) => total + Number(row.amount), 0)

  const search = new URLSearchParams()

  if (needle) search.set("q", needle)
  if (status && status !== "all") search.set("status", status)

  return (
    <>
      <AdminHeading
        title={t.title}
        lead={t.lead}
        action={
          <Link
            href={`/api/admin/payments.csv?${search.toString()}`}
            prefetch={false}
            className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium"
          >
            <Download className="size-4" aria-hidden="true" />
            {t.export}
          </Link>
        }
      />

      <form
        className="acc-reveal mb-4 flex flex-wrap items-center gap-2"
        action=""
        style={{ ["--i" as string]: 1 }}
      >
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <Search
            aria-hidden="true"
            className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            name="q"
            defaultValue={needle}
            placeholder={t.search}
            className={`${INPUT_CLASS} w-full pl-9`}
          />
        </label>
        <select
          name="status"
          defaultValue={status ?? "all"}
          className={INPUT_CLASS}
        >
          <option value="all">{t.all}</option>
          {Object.entries(t.status)
            .filter(([key]) => key !== "unknown")
            .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
        </select>
        <Button type="submit">{t.find}</Button>
        {sum > 0 ? (
          <span className="text-shell-muted ml-auto text-xs tabular-nums">
            {t.sum}: {formatNumber(sum, "rub")}
          </span>
        ) : null}
      </form>

      <DataTable
        index={2}
        caption={t.title}
        empty={t.empty}
        columns={[
          { key: "date", label: t.columnDate, className: "w-28" },
          { key: "user", label: t.columnUser },
          { key: "status", label: t.columnStatus, className: "w-32" },
          { key: "amount", label: t.columnAmount, align: "right", className: "w-28" },
          { key: "open", label: "", align: "right", className: "w-24", hideBelow: "sm" },
        ]}
        rows={page.map((row) => {
          const status = statusOf(row.status)

          return {
            id: row.id,
            cells: [
              <span key="date" className="text-shell-muted text-xs tabular-nums">
                {formatDate(row.paidAt ?? row.createdAt)}
              </span>,
              <CellStack
                key="user"
                primary={
                  <Link
                    href={`/account/admin/users/${row.userId}`}
                    className="hover:text-shell-accent-text transition-colors"
                  >
                    {row.email ?? row.userId}
                  </Link>
                }
                secondary={row.yookassaId}
                mono
              />,
              <StatusPill key="status" tone={PAYMENT_TONE[status]}>
                {t.status[status]}
              </StatusPill>,
              <span key="amount" className="font-medium tabular-nums">
                {formatNumber(Number(row.amount), "rub")}
              </span>,
              <Link
                key="open"
                href={`/account/admin/payments/${row.id}`}
                className="text-shell-muted hover:text-shell-fg text-xs transition-colors"
              >
                {t.open} →
              </Link>,
            ],
          }
        })}
      />

      {next ? (
        <ButtonLink
          href={`/account/admin/payments?${search.toString()}${search.size ? "&" : ""}before=${next.toISOString()}`}
          className="mt-4"
        >
          {t.more}
        </ButtonLink>
      ) : null}
    </>
  )
}
