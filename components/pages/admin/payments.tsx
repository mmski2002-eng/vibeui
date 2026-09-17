import Link from "next/link"
import { and, count, desc, eq, ilike, or } from "drizzle-orm"
import { Download, Search } from "lucide-react"

import { AdminHeading, INPUT_CLASS } from "@/components/admin/parts"
import { PriceSettings } from "@/components/admin/price-settings"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { Pager } from "@/components/account/ui/pager"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { payment, user } from "@/lib/db/schema"
import { formatDate, formatNumber } from "@/lib/format"
import { getPlans } from "@/lib/plan-prices"
import { PLANS } from "@/lib/plans"
import {
  commissionPercent,
  DEFAULT_COMMISSION_PERCENT,
  DEFAULT_PROMO_PERCENT,
  defaultPromoPercent,
} from "@/lib/promo"

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
 * Платежи как они лежат у нас: с поиском по почте и идентификатору ЮKassa и
 * постраничной навигацией. Смещение (offset), а не курсор: администратору
 * нужно листать взад-вперёд и видеть номер страницы, а таблица платежей —
 * это внутренний инструмент с умеренным числом строк.
 */
export async function AdminPayments({
  query,
  status,
  page = 1,
}: {
  query?: string
  status?: string
  page?: number
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.payments
  const needle = query?.trim()

  const where = and(
    ...[
      status && status !== "all" ? eq(payment.status, status) : undefined,
      needle
        ? or(
            ilike(user.email, `%${needle}%`),
            ilike(payment.yookassaId, `%${needle}%`),
            ilike(payment.promoCode, `%${needle}%`),
          )
        : undefined,
    ].filter(Boolean),
  )

  const [rows, totalRows, plans, promoPercent, commission] = await Promise.all([
    db
      .select({
        id: payment.id,
        createdAt: payment.createdAt,
        paidAt: payment.paidAt,
        amount: payment.amount,
        status: payment.status,
        yookassaId: payment.yookassaId,
        userId: payment.userId,
        email: user.email,
        promoCode: payment.promoCode,
        promoPercent: payment.promoPercent,
        listAmount: payment.listAmount,
      })
      .from(payment)
      .leftJoin(user, eq(user.id, payment.userId))
      .where(where)
      .orderBy(desc(payment.createdAt))
      .limit(PAGE)
      .offset((page - 1) * PAGE),
    db
      .select({ value: count() })
      .from(payment)
      .leftJoin(user, eq(user.id, payment.userId))
      .where(where),
    getPlans(),
    defaultPromoPercent(),
    commissionPercent(),
  ])

  const rub = (price: string) => String(Math.round(Number(price)))

  const total = totalRows[0]?.value ?? 0
  const hasNext = page * PAGE < total
  const sum = rows
    .filter((row) => row.status === "succeeded")
    .reduce((acc, row) => acc + Number(row.amount), 0)

  const search = new URLSearchParams()

  if (needle) search.set("q", needle)
  if (status && status !== "all") search.set("status", status)

  const pageHref = (target: number) => {
    const p = new URLSearchParams(search)
    if (target > 1) p.set("page", String(target))
    const qs = p.toString()

    return `/account/admin/payments${qs ? `?${qs}` : ""}`
  }

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

      <PriceSettings
        monthly={rub(plans.monthly.price)}
        yearly={rub(plans.yearly.price)}
        promoPercent={String(promoPercent)}
        commissionPercent={String(commission)}
        defaults={{
          monthly: rub(PLANS.monthly.price),
          yearly: rub(PLANS.yearly.price),
          promoPercent: String(DEFAULT_PROMO_PERCENT),
          commissionPercent: String(DEFAULT_COMMISSION_PERCENT),
        }}
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
          { key: "promo", label: t.columnPromo, className: "w-36", hideBelow: "md" },
          { key: "amount", label: t.columnAmount, align: "right", className: "w-28" },
          { key: "open", label: "", align: "right", className: "w-24", hideBelow: "sm" },
        ]}
        rows={rows.map((row) => {
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
              row.promoCode ? (
                <CellStack
                  key="promo"
                  primary={row.promoCode}
                  secondary={
                    row.promoPercent !== null
                      ? `−${row.promoPercent} %${row.listAmount ? ` · ${formatNumber(Number(row.listAmount), "rub")}` : ""}`
                      : undefined
                  }
                  mono
                />
              ) : (
                <span key="promo" className="text-shell-muted text-xs">—</span>
              ),
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

      <Pager page={page} hasNext={hasNext} total={total} perPage={PAGE} href={pageHref} />
    </>
  )
}
