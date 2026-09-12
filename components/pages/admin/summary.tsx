import {
  AdminHeading,
  DayBars,
  Metric,
  PeriodSwitch,
  Ranked,
  Section,
} from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import {
  discoveryStats,
  moneyStats,
  peopleStats,
  periodStart,
  type Period,
} from "@/lib/admin-stats"

function money(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`
}

function share(part: number, whole: number) {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—"
}

/**
 * Сводка: деньги, люди, поиск и приглашения.
 *
 * Никаких выдуманных показателей: каждое число здесь — это запрос к базе.
 * Там, где данных нет, так и написано; нулями достижения не рисуем.
 */
export async function AdminSummary({ period }: { period: Period }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.summary
  const [money$, people, discovery] = await Promise.all([
    moneyStats(period),
    peopleStats(period),
    discoveryStats(period),
  ])

  const since = periodStart(period).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  })

  return (
    <>
      <AdminHeading
        title={t.title}
        lead={t.lead}
        action={
          <PeriodSwitch
            base="/account/admin"
            current={period}
            labels={t.periods}
          />
        }
      />

      <p className="text-shell-muted -mt-2 mb-6 text-xs">{t.since(since)}</p>

      <Section title={t.money}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label={t.revenue}
            value={money(money$.revenue)}
            note={t.versus(money(money$.revenueBefore))}
            accent={money$.revenue > 0}
          />
          <Metric label={t.payments} value={String(money$.payments)} />
          <Metric label={t.average} value={money(money$.average)} />
          <Metric label={t.activeSubs} value={String(money$.activeSubs)} />
          <Metric label={t.cancelling} value={String(money$.cancelling)} />
          <Metric
            label={t.stuck}
            value={String(money$.stuck)}
            note={t.stuckNote}
            accent={money$.stuck > 0}
          />
          <Metric
            label={t.failing}
            value={String(money$.failing)}
            accent={money$.failing > 0}
          />
        </div>
      </Section>

      <Section title={t.people}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Metric label={t.signups} value={String(people.signups)} />
          <Metric
            label={t.verified}
            value={share(people.verified, people.signups)}
            note={`${people.verified} из ${people.signups}`}
          />
          <Metric label={t.active} value={String(people.active)} />
          <Metric
            label={t.exhausted}
            value={String(people.exhausted)}
            accent={people.exhausted > 0}
          />
          <Metric label={t.newPro} value={String(people.newPro)} />
          <Metric label={t.churn} value={String(people.churn)} />
        </div>

        <div className="mt-3">
          {people.byDay.length > 0 ? (
            <DayBars data={people.byDay} label={t.signups} />
          ) : (
            <p className="text-shell-muted text-sm">{t.noData}</p>
          )}
        </div>
      </Section>

      <Section title={t.discovery}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label={t.visits} value={String(discovery.visits)} />
          <Metric label={t.invited} value={String(discovery.invited)} />
          <Metric label={t.invitedPaid} value={String(discovery.invitedPaid)} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
              {t.topQueries}
            </p>
            <Ranked rows={discovery.top} empty={t.noData} />
          </div>
          <div>
            <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
              {t.emptyQueries}
            </p>
            <Ranked rows={discovery.empty} empty={t.noData} />
          </div>
        </div>
      </Section>
    </>
  )
}
