import { desc, eq } from "drizzle-orm"
import { Receipt } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { DataTable } from "@/components/account/ui/data-table"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
import { StatTile } from "@/components/account/ui/stat-tile"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { db } from "@/lib/db"
import { payment } from "@/lib/db/schema"
import { formatDate, formatNumber } from "@/lib/format"
import type { Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"

type Status = keyof (typeof ACCOUNT_TEXTS)["ru"]["billing"]["status"]

/** Статусы ЮKassa приводим к четырём понятным: остальное — «неизвестен». */
function paymentStatus(value: string): Status {
  if (value === "succeeded" || value === "pending" || value === "canceled") {
    return value
  }

  return value === "refunded" ? "refunded" : "unknown"
}

const TONE: Record<Status, PillTone> = {
  succeeded: "ok",
  pending: "warn",
  canceled: "muted",
  refunded: "accent",
  unknown: "muted",
}

/**
 * Оплата: история платежей и чеки. Отдельно от тарифа, потому что чек
 * ищут не тогда, когда думают о подписке, а когда собирают документы.
 */
export async function AccountPayments({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].payments
  const b = ACCOUNT_TEXTS[locale].billing

  const history = await db
    .select()
    .from(payment)
    .where(eq(payment.userId, user.id))
    .orderBy(desc(payment.createdAt))
    .limit(200)

  const paid = history.filter((entry) => entry.status === "succeeded")
  const total = paid.reduce((sum, entry) => sum + Number(entry.amount), 0)
  const year = new Date().getUTCFullYear()
  const thisYear = paid
    .filter((entry) => (entry.paidAt ?? entry.createdAt).getUTCFullYear() === year)
    .reduce((sum, entry) => sum + Number(entry.amount), 0)

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />

      {history.length === 0 ? (
        <EmptyState index={1} icon={<Receipt />} title={t.empty} />
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile
              index={1}
              label={b.paidTotal}
              value={total}
              kind="rub"
              locale={locale}
              note={b.paymentsCount(paid.length)}
            />
            <StatTile
              index={2}
              label={String(year)}
              value={thisYear}
              kind="rub"
              locale={locale}
            />
            <StatTile
              index={3}
              label={b.status.pending}
              value={history.filter((entry) => entry.status === "pending").length}
              locale={locale}
              tone={
                history.some((entry) => entry.status === "pending")
                  ? "warn"
                  : undefined
              }
            />
          </div>

          <DataTable
            index={4}
            caption={t.title}
            empty={t.empty}
            columns={[
              { key: "date", label: b.columnDate, className: "w-32" },
              { key: "status", label: b.columnStatus },
              { key: "amount", label: b.columnAmount, align: "right", className: "w-28" },
              { key: "receipt", label: b.columnReceipt, align: "right", className: "w-36" },
            ]}
            rows={history.map((entry) => {
              const status = paymentStatus(entry.status)

              return {
                id: entry.id,
                cells: [
                  <span key="date" className="text-shell-muted tabular-nums">
                    {formatDate(entry.paidAt ?? entry.createdAt, locale)}
                  </span>,
                  <StatusPill key="status" tone={TONE[status]}>
                    {b.status[status]}
                  </StatusPill>,
                  <span key="amount" className="font-medium tabular-nums">
                    {formatNumber(Number(entry.amount), "rub", locale)}
                  </span>,
                  entry.receiptUrl ? (
                    <a
                      key="receipt"
                      href={entry.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-shell-accent-text inline-flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                      <Receipt className="size-3.5" aria-hidden="true" />
                      {t.receipt}
                    </a>
                  ) : status === "succeeded" ? (
                    <span key="receipt" className="text-shell-muted text-xs">
                      {t.receiptSoon}
                    </span>
                  ) : (
                    <span key="receipt" />
                  ),
                ],
              }
            })}
          />

          <p className="text-shell-muted text-xs leading-relaxed">
            {b.paymentsNote}
          </p>
        </div>
      )}
    </>
  )
}
