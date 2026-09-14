import {
  AlertTriangle,
  CreditCard,
  Search,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

import { Ranked } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { AreaChart, Bars, Funnel } from "@/components/account/ui/charts"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { Segmented } from "@/components/account/ui/segmented"
import { StatTile } from "@/components/account/ui/stat-tile"
import { requireAdmin } from "@/lib/admin"
import {
  discoveryStats,
  moneyStats,
  peopleStats,
  periodStart,
  trendStats,
  type Period,
} from "@/lib/admin-stats"
import { formatNumber } from "@/lib/format"

/**
 * Сводка: ключевые числа с динамикой, графики, «требует внимания»,
 * воронка, поиск и приглашения — в порядке чтения сверху вниз.
 *
 * Никаких выдуманных показателей: каждое число здесь — это запрос к базе.
 * Там, где данных нет, так и написано; нулями достижения не рисуем.
 */
export async function AdminSummary({ period }: { period: Period }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.summary
  const [money, people, discovery, trends] = await Promise.all([
    moneyStats(period),
    peopleStats(period),
    discoveryStats(period),
    trendStats(period),
  ])

  const since = periodStart(period).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  })

  return (
    <div className="grid gap-6">
      <PageHeader
        title={t.title}
        lead={t.lead}
        eyebrow={t.since(since)}
        action={
          <Segmented
            name="admin-period"
            current={String(period)}
            items={[7, 30, 90].map((days) => ({
              value: String(days),
              label: t.periods[days as Period],
              href: `/account/admin?period=${days}`,
            }))}
          />
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          index={0}
          label={t.revenue}
          value={money.revenue}
          kind="rub"
          before={money.revenueBefore}
          deltaSuffix={t.versusPeriod}
          spark={trends.revenueByDay.map((row) => row.value)}
          tone="accent"
          icon={<Wallet />}
          href="/account/admin/payments?status=succeeded"
        />
        <StatTile
          index={1}
          label={t.newPro}
          value={people.newPro}
          before={trends.previous.newPro}
          deltaSuffix={t.versusPeriod}
          tone="ok"
          icon={<Sparkles />}
        />
        <StatTile
          index={2}
          label={t.signups}
          value={people.signups}
          before={trends.previous.signups}
          deltaSuffix={t.versusPeriod}
          spark={trends.signupsByDay.map((row) => row.value)}
          icon={<UserPlus />}
          href="/account/admin/users"
        />
        <StatTile
          index={3}
          label={t.active}
          value={people.active}
          before={trends.previous.active}
          deltaSuffix={t.versusPeriod}
          spark={trends.activeByDay.map((row) => row.value)}
          icon={<Users />}
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Panel index={4}>
          <PanelHeader
            title={t.revenueChart}
            action={
              <span className="text-shell-muted text-xs tabular-nums">
                {money.payments} · {formatNumber(money.average, "rub")}
              </span>
            }
          />
          <AreaChart
            data={trends.revenueByDay}
            kind="rub"
            labels={[t.revenue]}
            index={5}
            height={160}
          />
        </Panel>
        <Panel index={5}>
          <PanelHeader title={t.signupsChart} />
          <Bars
            data={trends.signupsByDay}
            label={t.signups}
            index={6}
            height={160}
          />
        </Panel>
      </div>

      <section>
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="text-shell-warn size-4" aria-hidden="true" />
              {t.attention}
            </span>
          }
          note={t.attentionNote}
          className="acc-reveal mb-3"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            index={6}
            label={t.stuck}
            value={money.stuck}
            note={t.stuckNote}
            tone={money.stuck > 0 ? "warn" : undefined}
            href="/account/admin/payments?status=pending"
            icon={<CreditCard />}
          />
          <StatTile
            index={7}
            label={t.failing}
            value={money.failing}
            tone={money.failing > 0 ? "danger" : undefined}
            href="/account/admin/users"
          />
          <StatTile
            index={8}
            label={t.cancelling}
            value={money.cancelling}
            tone={money.cancelling > 0 ? "warn" : undefined}
            note={`${t.activeSubs}: ${money.activeSubs}`}
          />
          <StatTile
            index={9}
            label={t.exhausted}
            value={people.exhausted}
            tone={people.exhausted > 0 ? "accent" : undefined}
            note={`${t.churn}: ${people.churn}`}
          />
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel index={10}>
          <PanelHeader title={t.funnel} note={t.funnelNote} />
          <Funnel
            index={11}
            steps={[
              { label: t.signups, value: trends.funnel.signups },
              { label: t.funnelVerified, value: trends.funnel.verified },
              { label: t.funnelActive, value: trends.funnel.active },
              { label: t.funnelPro, value: trends.funnel.pro },
            ]}
          />
        </Panel>

        <Panel index={11}>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <Search className="text-shell-muted size-4" aria-hidden="true" />
                {t.searchTitle}
              </span>
            }
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-shell-muted mb-2 text-[11px] font-medium tracking-wide uppercase">
                {t.topQueries}
              </p>
              <Ranked rows={discovery.top} empty={t.noData} />
            </div>
            <div>
              <p className="text-shell-muted mb-2 text-[11px] font-medium tracking-wide uppercase">
                {t.emptyQueries}
              </p>
              <Ranked rows={discovery.empty} empty={t.noData} tone="warn" />
            </div>
          </div>
        </Panel>
      </div>

      <Panel index={12}>
        <PanelHeader title={t.referralsTitle} />
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile label={t.visits} value={discovery.visits} />
          <StatTile label={t.invited} value={discovery.invited} />
          <StatTile
            label={t.invitedPaid}
            value={discovery.invitedPaid}
            tone={discovery.invitedPaid > 0 ? "ok" : undefined}
          />
        </div>
      </Panel>
    </div>
  )
}
