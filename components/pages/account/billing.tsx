import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import {
  PaymentsList,
  PendingPayment,
  RenewalButton,
  type PaymentRow,
} from "@/components/account/billing-parts"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { db } from "@/lib/db"
import { payment } from "@/lib/db/schema"
import { FREE_MONTHLY_LIMIT } from "@/lib/entitlements"
import { localePath, type Locale } from "@/lib/i18n"
import { PLANS } from "@/lib/plans"
import { requireUser } from "@/lib/session"
import {
  getSubscriptionRow,
  planTitle,
  resolveSubscription,
} from "@/lib/subscription-state"

function money(amount: string, locale: Locale) {
  const value = Math.round(Number(amount))

  return locale === "en" ? `${value} RUB` : `${value} ₽`
}

function day(value: Date, locale: Locale) {
  return value.toLocaleDateString(locale === "en" ? "en-GB" : "ru-RU")
}

/** Статусы ЮKassa приводим к четырём понятным: остальное — «неизвестен». */
function paymentStatus(value: string): PaymentRow["status"] {
  if (value === "succeeded" || value === "pending" || value === "canceled") {
    return value
  }

  return value === "refunded" ? "refunded" : "unknown"
}

/**
 * Тариф и оплата одним экраном.
 *
 * Раньше страница читала любую строку подписки и говорила «Активна» даже
 * тогда, когда срок кончился, а бесплатный тариф показывался пунктирной
 * рамкой «Подписки нет» — как ошибка, хотя это нормальное состояние.
 */
export async function AccountBilling({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].billing

  const [row, history] = await Promise.all([
    getSubscriptionRow(user.id),
    db
      .select()
      .from(payment)
      .where(eq(payment.userId, user.id))
      .orderBy(desc(payment.createdAt))
      .limit(50),
  ])

  const state = resolveSubscription(row)
  const waiting = history.some((entry) => entry.status === "pending")

  const payments: PaymentRow[] = history.map((entry) => ({
    id: entry.id,
    // Неоплаченный платёж не имеет paidAt: показываем дату создания, иначе
    // строка выглядит сломанной.
    date: day(entry.paidAt ?? entry.createdAt, locale),
    amount: money(entry.amount, locale),
    status: paymentStatus(entry.status),
  }))

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>

      {waiting ? <PendingPayment locale={locale} /> : null}

      <section className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-6 sm:p-7">
        <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
          {t.currentPlan}
        </p>

        {state.kind === "free" || state.kind === "expired" ? (
          <>
            <p className="text-shell-fg mt-2 text-2xl font-semibold">
              {t.freeTitle}
            </p>
            <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
              {state.kind === "expired"
                ? t.expiredNote(day(state.endedAt, locale))
                : t.freeNote(FREE_MONTHLY_LIMIT)}
            </p>
            <Link
              href={localePath(locale, "/pricing")}
              className="bg-shell-accent text-shell-accent-fg mt-5 inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-shell-accent-deep"
            >
              {state.kind === "expired" ? t.payAgain : t.choosePlan}
            </Link>
          </>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-shell-fg text-2xl font-semibold">
                  {state.kind === "bonus"
                    ? ACCOUNT_TEXTS[locale].plan.bonus
                    : planTitle(state.plan)}
                </p>
                <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
                  {state.kind === "bonus"
                    ? t.bonusNote
                    : state.kind === "cancelled"
                      ? t.cancelledNote(day(state.until, locale))
                      : state.kind === "past_due"
                        ? t.pastDueNote(
                            state.attempts,
                            day(state.until, locale),
                          )
                        : t.proNote}
                </p>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
                  state.kind === "past_due"
                    ? "border-shell-accent text-shell-accent-text border"
                    : "bg-shell-accent text-shell-accent-fg"
                }`}
              >
                {state.kind === "past_due"
                  ? t.pastDueTitle
                  : ACCOUNT_TEXTS[locale].plan.pro}
              </span>
            </div>

            <dl className="text-shell-muted mt-5 grid gap-1.5 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt>{t.until(day(state.until, locale))}</dt>
              </div>
              <div className="flex flex-wrap gap-x-2">
                {/* Про следующее списание говорим только там, где оно и
                    правда произойдёт: у бонуса и отменённого продления
                    списания нет. */}
                <dt>
                  {state.kind === "pro"
                    ? t.renewsOn(
                        day(state.until, locale),
                        state.plan
                          ? money(PLANS[state.plan].price, locale)
                          : "",
                      )
                    : t.noRenewal}
                </dt>
              </div>
            </dl>

            {state.kind === "pro" || state.kind === "cancelled" ? (
              <RenewalButton
                locale={locale}
                cancelled={state.kind === "cancelled"}
              />
            ) : null}

            {state.kind === "past_due" ? (
              <Link
                href={localePath(locale, "/pricing")}
                className="bg-shell-accent text-shell-accent-fg mt-5 inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-shell-accent-deep"
              >
                {t.payAgain}
              </Link>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-shell-fg text-sm font-medium">{t.payments}</h2>
        <PaymentsList locale={locale} rows={payments} />
      </section>
    </>
  )
}
