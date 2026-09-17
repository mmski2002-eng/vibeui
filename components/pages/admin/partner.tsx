import Link from "next/link"
import { notFound } from "next/navigation"

import { PartnerPromoForm } from "@/components/admin/partner-actions"
import { AdminHeading, Metric, Pill, Section } from "@/components/admin/parts"
import { AreaChart, Funnel } from "@/components/account/ui/charts"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { CopyLink } from "@/components/account/copy-link"
import { requireAdmin } from "@/lib/admin"
import {
  getInvite,
  listPayouts,
  partnerCode,
  partnerStats,
  payoutTotals,
  referralsOf,
  referralTotals,
  visitsByCode,
  type ReferralRow,
} from "@/lib/partners"
import { defaultPromoPercent, promoStats } from "@/lib/promo"
import { RecordPayoutForm } from "@/components/admin/payout-actions"
import { SITE_URL } from "@/lib/seo"
import { resolveSubscription } from "@/lib/subscription-state"

const PAGE = 50

/** Аналитика по блогеру: обе его ссылки и список приведённых людей. */
export async function AdminPartner({
  id,
  before,
}: {
  id: string
  before?: string
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.partners
  const row = await getInvite(id)

  if (!row) {
    notFound()
  }

  const { invite } = row
  const partnerId = invite.claimedBy
  const cursor = before ? new Date(before) : undefined
  const validCursor =
    cursor && !Number.isNaN(cursor.getTime()) ? cursor : undefined

  const [inviteVisits, code, totals, rows] = await Promise.all([
    visitsByCode(invite.code),
    partnerId ? partnerCode(partnerId) : null,
    partnerId ? referralTotals(partnerId) : { total: 0, paid: 0 },
    partnerId
      ? referralsOf(partnerId, { before: validCursor, limit: PAGE + 1 })
      : [],
  ])
  const [partnerVisits, stats, promo, promoDefault, paidOut, payouts] =
    await Promise.all([
      code ? visitsByCode(code) : 0,
      partnerId && code ? partnerStats(partnerId, code, 90) : null,
      partnerId
        ? promoStats(partnerId)
        : { payments: 0, revenue: 0, discount: 0, commission: 0, commissionPercent: 0 },
      defaultPromoPercent(),
      partnerId ? payoutTotals(partnerId) : { paid: 0, count: 0 },
      partnerId ? listPayouts(partnerId) : [],
    ])

  const pendingPayout = Math.max(0, promo.commission - paidOut.paid)

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null

  return (
    <>
      <AdminHeading
        title={invite.name}
        lead={
          partnerId
            ? `${t.registeredAt} ${invite.claimedAt?.toLocaleDateString("ru-RU") ?? ""} · ${row.partnerEmail}`
            : t.waiting
        }
        action={
          partnerId ? (
            <Link
              href={`/account/admin/users/${partnerId}`}
              className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium"
            >
              {t.account}
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric index={0} label={t.inviteVisits} value={inviteVisits} />
        <Metric index={1} label={t.partnerVisits} value={partnerVisits} />
        <Metric index={2} label={t.referrals} value={totals.total} />
        <Metric
          index={3}
          label={t.paid}
          value={totals.paid}
          accent={totals.paid > 0}
        />
      </div>

      {stats ? (
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel index={4}>
            <PanelHeader title="Динамика за 90 дней" />
            <AreaChart
              data={stats.visitsByDay}
              second={stats.signupsByDay}
              labels={["Переходы", "Регистрации"]}
              secondTone="ok"
              index={5}
            />
          </Panel>
          <Panel index={5}>
            <PanelHeader title="Воронка за 90 дней" />
            <Funnel
              index={6}
              steps={[
                { label: "Переходы", value: stats.current.visits },
                { label: "Регистрации", value: stats.current.signups },
                { label: "Оплатили", value: stats.current.paid },
              ]}
            />
          </Panel>
        </div>
      ) : null}

      <Section
        title={t.promoTitle}
        action={
          <span className="text-shell-muted text-xs tabular-nums">
            {t.promoPayments}:{" "}
            <span className="text-shell-fg">{promo.payments}</span> ·{" "}
            {t.promoRevenue}:{" "}
            <span className="text-shell-fg">{t.rub(promo.revenue)}</span> ·{" "}
            {t.promoDiscount}:{" "}
            <span className="text-shell-fg">{t.rub(promo.discount)}</span> ·{" "}
            {t.promoCommission}:{" "}
            <span className="text-shell-fg">
              {t.rub(promo.commission)} ({promo.commissionPercent} %)
            </span>
          </span>
        }
      >
        <p className="text-shell-muted mb-3 max-w-2xl text-sm leading-relaxed">
          {t.promoNote}
        </p>
        <PartnerPromoForm
          id={invite.id}
          code={invite.promoCode}
          percent={invite.promoPercent}
          active={invite.promoActive}
          defaultPercent={promoDefault}
        />
      </Section>

      <Section
        title={t.payoutTitle}
        action={
          <span className="text-shell-muted text-xs tabular-nums">
            {t.payoutEarned}:{" "}
            <span className="text-shell-fg">{t.rub(promo.commission)}</span> ·{" "}
            {t.payoutPaid}:{" "}
            <span className="text-shell-fg">{t.rub(paidOut.paid)}</span> ·{" "}
            {t.payoutPending}:{" "}
            <span className="text-shell-accent-text">{t.rub(pendingPayout)}</span>
          </span>
        }
      >
        <p className="text-shell-muted mb-3 text-sm">
          {t.payoutInn}:{" "}
          <span className="text-shell-fg">{invite.payoutInn ?? t.payoutNone}</span>{" "}
          · {t.payoutDetails}:{" "}
          <span className="text-shell-fg">
            {invite.payoutDetails ?? t.payoutNone}
          </span>
        </p>
        {partnerId ? <RecordPayoutForm partnerId={partnerId} /> : null}
        {payouts.length > 0 ? (
          <ul className="border-shell-border divide-shell-divider mt-4 divide-y rounded-xl border">
            {payouts.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 text-sm"
              >
                <span className="text-shell-fg font-medium tabular-nums">
                  {t.rub(Number(row.amount))}
                </span>
                {row.note ? (
                  <span className="text-shell-muted min-w-0 flex-1 truncate text-xs">
                    {row.note}
                  </span>
                ) : null}
                <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                  {row.createdAt.toLocaleDateString("ru-RU")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-shell-muted mt-4 text-sm">{t.payoutsEmpty}</p>
        )}
      </Section>

      <Section title={t.inviteLink}>
        <CopyLink url={`${SITE_URL}/?ref=${invite.code}`} />
      </Section>

      {code ? (
        <Section title={t.partnerLink}>
          <CopyLink url={`${SITE_URL}/?ref=${code}`} />
        </Section>
      ) : null}

      <Section title={t.referralsTitle}>
        {page.length === 0 ? (
          <p className="text-shell-muted text-sm">{t.referralsEmpty}</p>
        ) : (
          <ul className="border-shell-border bg-shell-panel acc-shadow acc-reveal divide-shell-divider divide-y rounded-2xl border">
            {page.map((referral) => (
              <ReferralItem key={referral.id} referral={referral} />
            ))}
          </ul>
        )}

        {next ? (
          <Link
            href={`/account/admin/partners/${id}?before=${next.toISOString()}`}
            className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium"
          >
            {t.more}
          </Link>
        ) : null}
      </Section>
    </>
  )
}

function ReferralItem({ referral }: { referral: ReferralRow }) {
  const t = ADMIN_TEXTS.partners
  const state = resolveSubscription(referral.subscription ?? undefined)
  const date = (value: Date) => value.toLocaleDateString("ru-RU")

  const status = !referral.firstPaidAt
    ? t.notPaid
    : state.kind === "expired"
      ? `${t.paidAt(date(referral.firstPaidAt))}, ${t.expired}`
      : "until" in state
        ? `${t.paidAt(date(referral.firstPaidAt))}, ${t.activeUntil(date(state.until))}`
        : t.paidAt(date(referral.firstPaidAt))

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm">
      <Link
        href={`/account/admin/users/${referral.id}`}
        className="min-w-0 flex-1"
      >
        <span className="text-shell-fg block truncate">{referral.email}</span>
        <span className="text-shell-muted block truncate text-xs">
          {referral.name}
        </span>
      </Link>
      <Pill tone={referral.firstPaidAt ? "ok" : "muted"}>{status}</Pill>
      {referral.paidTotal > 0 ? (
        <span className="text-shell-fg shrink-0 text-xs tabular-nums">
          {t.paidTotal}: {t.rub(referral.paidTotal)}
        </span>
      ) : null}
      <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
        {date(referral.createdAt)}
      </span>
    </li>
  )
}
