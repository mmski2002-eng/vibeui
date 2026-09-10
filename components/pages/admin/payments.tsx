import Link from "next/link"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"

import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { payment, user } from "@/lib/db/schema"

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
            className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-3.5 text-sm transition-colors"
          >
            {t.export}
          </Link>
        }
      />

      <form className="mb-4 flex flex-wrap items-center gap-2" action="">
        <input
          type="search"
          name="q"
          defaultValue={needle}
          placeholder={t.search}
          className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none sm:max-w-sm focus-visible:ring-2"
        />
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="border-shell-border bg-shell-elevated text-shell-fg h-10 rounded-lg border px-3 text-sm outline-none"
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
        <button
          type="submit"
          className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-3.5 text-sm transition-colors"
        >
          {ADMIN_TEXTS.payments.columnStatus}
        </button>
      </form>

      {page.length === 0 ? (
        <p className="text-shell-muted text-sm">{t.empty}</p>
      ) : (
        <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
          {page.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm"
            >
              <span className="text-shell-muted w-24 shrink-0 tabular-nums">
                {(row.paidAt ?? row.createdAt).toLocaleDateString("ru-RU")}
              </span>
              <span className="min-w-0 flex-1">
                <Link
                  href={`/account/admin/users/${row.userId}`}
                  className="text-shell-fg hover:text-shell-accent-text block truncate transition-colors"
                >
                  {row.email ?? row.userId}
                </Link>
                <span className="text-shell-muted block truncate font-mono text-xs">
                  {row.yookassaId}
                </span>
              </span>
              <Pill
                tone={row.status === "succeeded" ? "muted" : "accent"}
              >
                {t.status[statusOf(row.status)]}
              </Pill>
              <span className="text-shell-fg w-20 shrink-0 text-right font-medium tabular-nums">
                {Math.round(Number(row.amount))} ₽
              </span>
              <Link
                href={`/account/admin/payments/${row.id}`}
                className="text-shell-muted hover:text-shell-fg shrink-0 text-xs transition-colors"
              >
                {t.open}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {next ? (
        <Link
          href={`/account/admin/payments?${search.toString()}${search.size ? "&" : ""}before=${next.toISOString()}`}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
        >
          {t.more}
        </Link>
      ) : null}
    </>
  )
}
