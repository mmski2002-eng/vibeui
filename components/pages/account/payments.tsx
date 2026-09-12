import { desc, eq } from "drizzle-orm"

import { PaymentsList, type PaymentRow } from "@/components/account/billing-parts"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { db } from "@/lib/db"
import { payment } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"

function money(amount: string, locale: Locale) {
  const value = Math.round(Number(amount))

  return locale === "en" ? `${value} RUB` : `${value} ₽`
}

/** Статусы ЮKassa приводим к четырём понятным: остальное — «неизвестен». */
function paymentStatus(value: string): PaymentRow["status"] {
  if (value === "succeeded" || value === "pending" || value === "canceled") {
    return value
  }

  return value === "refunded" ? "refunded" : "unknown"
}

/**
 * Оплата: история платежей и чеки. Отдельно от тарифа, потому что чек
 * ищут не тогда, когда думают о подписке, а когда собирают документы.
 */
export async function AccountPayments({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].payments

  const history = await db
    .select()
    .from(payment)
    .where(eq(payment.userId, user.id))
    .orderBy(desc(payment.createdAt))
    .limit(200)

  const rows: PaymentRow[] = history.map((entry) => ({
    id: entry.id,
    date: (entry.paidAt ?? entry.createdAt).toLocaleDateString(
      locale === "en" ? "en-GB" : "ru-RU",
    ),
    amount: money(entry.amount, locale),
    status: paymentStatus(entry.status),
    receiptUrl: entry.receiptUrl,
  }))

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
        {t.lead}
      </p>

      <section className="mt-6">
        <PaymentsList locale={locale} rows={rows} />
      </section>
    </>
  )
}
