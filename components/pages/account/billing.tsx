import type { ReactNode } from "react"
import { and, eq } from "drizzle-orm"
import { Receipt, Sparkles } from "lucide-react"

import {
  PendingPayment,
  RenewalButton,
} from "@/components/account/billing-parts"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ButtonLink } from "@/components/account/ui/button"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel } from "@/components/account/ui/panel"
import { StatusPill } from "@/components/account/ui/status-pill"
import { db } from "@/lib/db"
import { payment } from "@/lib/db/schema"
import { FREE_MONTHLY_LIMIT } from "@/lib/entitlements"
import { formatDate, formatNumber } from "@/lib/format"
import { localePath, type Locale } from "@/lib/i18n"
import { PLANS } from "@/lib/plans"
import { requireUser } from "@/lib/session"
import {
  getSubscriptionRow,
  planTitle,
  resolveSubscription,
} from "@/lib/subscription-state"

const DAY = 24 * 60 * 60 * 1000

/**
 * Тариф и оплата одним экраном.
 *
 * Hero-панель говорит, какой тариф и до какого числа; под ней — шкала
 * оплаченного периода и ключевые поля. Бесплатный тариф — нормальное
 * состояние с полноценной карточкой, а не «подписки нет».
 */
export async function AccountBilling({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].billing
  const now = new Date()

  const [row, pendingRows] = await Promise.all([
    getSubscriptionRow(user.id),
    db
      .select({ status: payment.status })
      .from(payment)
      .where(and(eq(payment.userId, user.id), eq(payment.status, "pending")))
      .limit(1),
  ])

  const state = resolveSubscription(row, now)
  const waiting = pendingRows.length > 0
  const active =
    state.kind === "pro" ||
    state.kind === "cancelled" ||
    state.kind === "past_due" ||
    state.kind === "bonus"

  return (
    <>
      <PageHeader
        title={t.title}
        action={
          <ButtonLink
            href={localePath(locale, "/account/payments")}
            icon={<Receipt className="size-4" aria-hidden="true" />}
          >
            {t.payments}
          </ButtonLink>
        }
      />

      {waiting ? <PendingPayment locale={locale} /> : null}

      {!active ? (
        <Panel variant="hero" index={1} className="p-6 sm:p-8">
          <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
            {t.currentPlan}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-shell-fg text-3xl font-semibold tracking-tight">
              {t.freeTitle}
            </p>
            {state.kind === "expired" ? (
              <StatusPill tone="muted">{t.expiredTitle}</StatusPill>
            ) : null}
          </div>
          <p className="text-shell-muted mt-3 max-w-xl text-sm leading-relaxed">
            {state.kind === "expired"
              ? t.expiredNote(formatDate(state.endedAt, locale))
              : t.freeNote(FREE_MONTHLY_LIMIT)}
          </p>
          <ButtonLink
            href={localePath(locale, "/pricing")}
            variant="primary"
            size="lg"
            className="mt-6"
            icon={<Sparkles className="size-4" aria-hidden="true" />}
          >
            {state.kind === "expired" ? t.payAgain : t.choosePlan}
          </ButtonLink>
        </Panel>
      ) : (
        <ActivePlan locale={locale} state={state} now={now} />
      )}
    </>
  )
}

function ActivePlan({
  locale,
  state,
  now,
}: {
  locale: Locale
  state: Exclude<
    ReturnType<typeof resolveSubscription>,
    { kind: "free" } | { kind: "expired" }
  >
  now: Date
}) {
  const t = ACCOUNT_TEXTS[locale].billing
  const plan = "plan" in state ? state.plan : null
  const days = plan ? PLANS[plan].days : 30
  const start = new Date(state.until.getTime() - days * DAY)
  const elapsed = Math.min(
    1,
    Math.max(0, (now.getTime() - start.getTime()) / (days * DAY)),
  )
  const left = Math.max(0, Math.ceil((state.until.getTime() - now.getTime()) / DAY))
  const pastDue = state.kind === "past_due"

  const title =
    state.kind === "bonus"
      ? ACCOUNT_TEXTS[locale].plan.bonus
      : planTitle(state.plan)

  const note =
    state.kind === "bonus"
      ? t.bonusNote
      : state.kind === "cancelled"
        ? t.cancelledNote(formatDate(state.until, locale))
        : state.kind === "past_due"
          ? t.pastDueNote(state.attempts, formatDate(state.until, locale))
          : t.proNote

  return (
    <div className="grid gap-6">
      <Panel
        variant={pastDue ? "warn" : "hero"}
        index={1}
        className="p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
              {t.currentPlan}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-shell-fg text-3xl font-semibold tracking-tight">
                {title}
              </p>
              <StatusPill tone={pastDue ? "warn" : "solid"} dot={!pastDue}>
                {pastDue ? t.pastDueTitle : ACCOUNT_TEXTS[locale].plan.pro}
              </StatusPill>
            </div>
            <p className="text-shell-muted mt-3 max-w-xl text-sm leading-relaxed">
              {note}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {state.kind === "pro" || state.kind === "cancelled" ? (
              <RenewalButton
                locale={locale}
                cancelled={state.kind === "cancelled"}
              />
            ) : null}
            {pastDue ? (
              <ButtonLink href={localePath(locale, "/pricing")} variant="primary">
                {t.payAgain}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {/* Шкала оплаченного периода: где сегодня между началом и концом. */}
        <div className="mt-7">
          <div className="text-shell-muted mb-2 flex items-center justify-between text-xs">
            <span>{t.periodTitle}</span>
            <span className="tabular-nums">
              {left} {locale === "en" ? "d" : "дн."}
            </span>
          </div>
          <div className="bg-shell-elevated relative h-2 overflow-hidden rounded-full">
            <span
              className="acc-grow-x block h-full rounded-full"
              style={{
                width: `${Math.max(1, elapsed * 100)}%`,
                background: pastDue ? "var(--shell-warn)" : "var(--shell-accent)",
              }}
            />
          </div>
          <div className="text-shell-muted mt-2 flex items-center justify-between text-[11px] tabular-nums">
            <span>
              {t.periodStarted} · {formatDate(start, locale)}
            </span>
            <span>
              {t.periodEnds} · {formatDate(state.until, locale)}
            </span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Field index={2} label={t.plan} value={title} />
        <Field
          index={3}
          label={t.price}
          value={
            plan ? formatNumber(Number(PLANS[plan].price), "rub", locale) : "—"
          }
        />
        <Field
          index={4}
          label={t.nextCharge}
          value={
            state.kind === "pro"
              ? formatDate(state.until, locale)
              : t.noRenewal
          }
          small={state.kind !== "pro"}
        />
        <Field
          index={5}
          label={t.renewal}
          value={
            <StatusPill
              tone={state.kind === "pro" ? "ok" : "muted"}
              dot={state.kind === "pro"}
            >
              {state.kind === "pro" ? t.renewalOn : t.renewalOff}
            </StatusPill>
          }
        />
      </div>
    </div>
  )
}

function Field({
  index,
  label,
  value,
  small,
}: {
  index: number
  label: string
  value: ReactNode
  small?: boolean
}) {
  return (
    <Panel index={index} padded={false} className="rounded-xl p-4">
      <p className="text-shell-muted mb-1.5 text-xs font-medium">{label}</p>
      <div
        className={
          small
            ? "text-shell-fg text-sm leading-snug"
            : "text-shell-fg text-lg font-semibold tabular-nums"
        }
      >
        {value}
      </div>
    </Panel>
  )
}
