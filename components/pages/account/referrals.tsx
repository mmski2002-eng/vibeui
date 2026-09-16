import { notFound } from "next/navigation"
import { Link2, MousePointerClick, Tag, UserPlus, Users, Wallet } from "lucide-react"

import { CopyLink } from "@/components/account/copy-link"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ButtonLink } from "@/components/account/ui/button"
import { AreaChart, Funnel } from "@/components/account/ui/charts"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { Segmented } from "@/components/account/ui/segmented"
import { StatTile } from "@/components/account/ui/stat-tile"
import { StatusPill } from "@/components/account/ui/status-pill"
import { formatDate } from "@/lib/format"
import { localePath, type Locale } from "@/lib/i18n"
import {
  maskEmail,
  partnerCode,
  partnerStats,
  referralsOf,
  referralTotals,
  visitsByCode,
  type PartnerPeriod,
} from "@/lib/partners"
import { partnerPromo, promoStats } from "@/lib/promo"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"

const PAGE = 50

/**
 * Кабинет партнёра: ссылка, динамика, воронка и список приведённых людей.
 *
 * Не партнёру — 404, а не «раздел недоступен»: программа закрытая, и
 * объяснять, как в неё попасть, страница не должна.
 */
export async function AccountReferrals({
  locale,
  before,
  period = 30,
}: {
  locale: Locale
  before?: string
  period?: PartnerPeriod
}) {
  const user = await requireUser(locale)
  const code = await partnerCode(user.id)

  if (!code) {
    notFound()
  }

  const t = ACCOUNT_TEXTS[locale].referrals
  const cursor = before ? new Date(before) : undefined
  const validCursor =
    cursor && !Number.isNaN(cursor.getTime()) ? cursor : undefined

  const [clicks, totals, rows, stats, promo, promoTotals] = await Promise.all([
    visitsByCode(code),
    referralTotals(user.id),
    referralsOf(user.id, { before: validCursor, limit: PAGE + 1 }),
    partnerStats(user.id, code, period),
    partnerPromo(user.id),
    promoStats(user.id),
  ])

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null
  const conversion =
    totals.total > 0 ? Math.round((totals.paid / totals.total) * 100) : 0
  const base = localePath(locale, "/account/referrals")

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        action={
          <Segmented
            name="ref-period"
            current={String(period)}
            items={[30, 90].map((days) => ({
              value: String(days),
              label: t.period[days as PartnerPeriod],
              href: `${base}?period=${days}`,
            }))}
          />
        }
      />

      <div className="grid gap-6">
        <Panel variant="hero" index={0}>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <Link2 className="text-shell-accent-text size-4" aria-hidden="true" />
                {t.linkTitle}
              </span>
            }
            action={
              <span className="text-shell-muted font-mono text-xs">
                {t.code}: <span className="text-shell-fg">{code}</span>
              </span>
            }
          />
          <CopyLink url={`${SITE_URL}/i/${code}`} locale={locale} />
        </Panel>

        <Panel index={1}>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <Tag className="text-shell-accent-text size-4" aria-hidden="true" />
                {t.promoTitle}
              </span>
            }
            note={t.promoLead}
            action={
              promo?.code && promo.active ? (
                <span className="text-shell-muted text-xs tabular-nums">
                  {t.promoPayments}: <span className="text-shell-fg">{promoTotals.payments}</span> ·{" "}
                  {t.promoRevenue}:{" "}
                  <span className="text-shell-fg">
                    {promoTotals.revenue.toLocaleString(locale === "en" ? "en-GB" : "ru-RU")} ₽
                  </span>
                </span>
              ) : null
            }
          />
          {promo?.code && promo.active ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-shell-accent-line bg-shell-accent-soft text-shell-fg inline-flex h-11 items-center rounded-lg border px-4 font-mono text-lg font-semibold tracking-wide">
                {promo.code}
              </span>
              <span className="text-shell-muted text-sm">
                {t.promoDiscount(promo.percent)}
              </span>
            </div>
          ) : (
            <p className="text-shell-muted text-sm">{t.promoNone}</p>
          )}
        </Panel>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            index={1}
            label={t.clicks}
            value={stats.current.visits}
            before={stats.previous.visits}
            deltaSuffix={t.versus}
            locale={locale}
            spark={stats.visitsByDay.map((row) => row.value)}
            icon={<MousePointerClick />}
            note={`${clicks} ${t.allTime}`}
          />
          <StatTile
            index={2}
            label={t.signedUp}
            value={stats.current.signups}
            before={stats.previous.signups}
            deltaSuffix={t.versus}
            locale={locale}
            spark={stats.signupsByDay.map((row) => row.value)}
            tone="accent"
            icon={<UserPlus />}
            note={`${totals.total} ${t.allTime}`}
          />
          <StatTile
            index={3}
            label={t.paid}
            value={stats.current.paid}
            before={stats.previous.paid}
            deltaSuffix={t.versus}
            locale={locale}
            spark={stats.paidByDay.map((row) => row.value)}
            tone="ok"
            icon={<Wallet />}
            note={`${totals.paid} ${t.allTime}`}
          />
          <StatTile
            index={4}
            label={t.conversion}
            value={conversion}
            kind="percent"
            locale={locale}
            icon={<Users />}
            note={`${totals.paid} / ${totals.total}`}
          />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel index={5}>
            <PanelHeader title={t.dynamics} note={t.dynamicsNote} />
            <AreaChart
              data={stats.visitsByDay}
              second={stats.signupsByDay}
              labels={[t.clicks, t.signedUp]}
              locale={locale}
              index={6}
              secondTone="ok"
            />
          </Panel>

          <Panel index={6}>
            <PanelHeader title={t.funnelTitle} note={t.funnelNote} />
            <Funnel
              locale={locale}
              index={7}
              steps={[
                { label: t.clicks, value: stats.current.visits },
                { label: t.signedUp, value: stats.current.signups },
                { label: t.paid, value: stats.current.paid },
              ]}
            />
          </Panel>
        </div>

        <section>
          <h2 className="text-shell-fg acc-reveal mb-3 font-semibold" style={{ ["--i" as string]: 7 }}>
            {t.listTitle}
          </h2>
          <DataTable
            index={8}
            caption={t.listTitle}
            empty={t.listEmpty}
            columns={[
              { key: "person", label: t.columnPerson },
              { key: "status", label: t.columnStatus, className: "w-36" },
              { key: "date", label: t.columnDate, align: "right", className: "w-32" },
            ]}
            rows={page.map((referral) => ({
              id: referral.id,
              cells: [
                <CellStack
                  key="person"
                  primary={maskEmail(referral.email)}
                  secondary={referral.name}
                />,
                <StatusPill key="status" tone={referral.firstPaidAt ? "ok" : "muted"} dot={Boolean(referral.firstPaidAt)}>
                  {referral.firstPaidAt ? t.paidLabel : t.notPaid}
                </StatusPill>,
                <span key="date" className="text-shell-muted text-xs tabular-nums">
                  {formatDate(referral.createdAt, locale)}
                </span>,
              ],
            }))}
          />

          {next ? (
            <ButtonLink
              href={`${base}?period=${period}&before=${next.toISOString()}`}
              className="mt-4"
            >
              {t.more}
            </ButtonLink>
          ) : null}
        </section>

        <Panel variant="soft" index={9}>
          <PanelHeader title={t.howTitle} />
          <ol className="text-shell-muted grid gap-2 text-sm leading-relaxed">
            {t.how.map((line, position) => (
              <li key={line} className="flex gap-2.5">
                <span className="text-shell-accent-text shrink-0 tabular-nums">
                  {position + 1}.
                </span>
                {line}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  )
}
