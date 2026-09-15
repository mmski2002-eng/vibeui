import Link from "next/link"
import {
  ArrowUpRight,
  Clock,
  Heart,
  Infinity as InfinityIcon,
  Layers,
  Sparkles,
  Timer,
} from "lucide-react"

import { CopyItemLink } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ButtonLink } from "@/components/account/ui/button"
import { Bars, Ring } from "@/components/account/ui/charts"
import { CountUp } from "@/components/account/ui/count-up"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { StatTile } from "@/components/account/ui/stat-tile"
import { StatusPill } from "@/components/account/ui/status-pill"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { overviewStats } from "@/lib/account-stats"
import { FREE_MONTHLY_LIMIT, getUsedCount } from "@/lib/entitlements"
import { formatDay } from "@/lib/format"
import { localePath, type Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

const DAY = 24 * 60 * 60 * 1000

/** Первое число следующего месяца — день, когда лимит обнулится. */
function nextReset(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
}

function daysUntil(date: Date, now = new Date()) {
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / DAY))
}

/**
 * Обзор кабинета: состояние, цифры, продолжение работы.
 *
 * Первый экран — hero-панель с тарифом и кольцом лимита: это то, что
 * человек проверяет первым делом. Под ней — ряд плиток с динамикой,
 * дальше — компонент, с которым он работал последним, и активность.
 */
export async function AccountOverview({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].overview
  const now = new Date()

  const [state, used, stats] = await Promise.all([
    getSubscriptionState(user.id),
    getUsedCount(user.id),
    overviewStats(user.id, now),
  ])

  const pro = isProState(state)
  const left = Math.max(0, FREE_MONTHLY_LIMIT - used)
  const reset = nextReset(now)
  const until = "until" in state ? state.until : null
  const resume = stats.recent[0]?.itemName ?? stats.saved[0]?.itemName
  const resumeItem = resume ? getCatalogItem(resume) : undefined
  const fresh = stats.recent.length === 0 && stats.savedCount === 0
  const dateTag = locale === "en" ? "en-GB" : "ru-RU"

  return (
    <div className="grid gap-6">
      <PageHeader
        title={t.title}
        lead={t.lead}
        action={
          <ButtonLink
            href={localePath(locale, "/components")}
            icon={<ArrowUpRight className="size-4" aria-hidden="true" />}
          >
            {ACCOUNT_TEXTS[locale].nav.catalog}
          </ButtonLink>
        }
      />

      <Panel variant="hero" index={0} className="p-5 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {pro ? (
              <Ring value={1} max={1} tone="accent" label={t.noLimit}>
                <InfinityIcon
                  className="text-shell-accent-text size-7"
                  aria-hidden="true"
                />
              </Ring>
            ) : (
              <Ring
                value={left}
                max={FREE_MONTHLY_LIMIT}
                tone={left < 10 ? "warn" : "accent"}
                label={t.limitLeft(left, FREE_MONTHLY_LIMIT)}
              >
                <span className="text-shell-fg text-2xl leading-none font-semibold tabular-nums">
                  <CountUp value={left} locale={locale} />
                </span>
                <span className="text-shell-muted mt-1 text-[11px]">
                  {t.of(FREE_MONTHLY_LIMIT)}
                </span>
              </Ring>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={pro ? "solid" : "muted"} dot={pro}>
                  {state.kind === "bonus"
                    ? ACCOUNT_TEXTS[locale].plan.bonus
                    : pro
                      ? ACCOUNT_TEXTS[locale].plan.pro
                      : ACCOUNT_TEXTS[locale].plan.free}
                </StatusPill>
                {!pro && left < 10 ? (
                  <StatusPill tone="warn">{t.limitTitle}</StatusPill>
                ) : null}
              </div>
              <p className="text-shell-fg mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                {pro ? t.planPro : t.planFree}
              </p>
              <p className="text-shell-muted mt-1 max-w-md text-sm leading-relaxed">
                {pro
                  ? until
                    ? t.proUntil(until.toLocaleDateString(dateTag))
                    : t.proNote
                  : t.limitResets(
                      reset.toLocaleDateString(dateTag, {
                        day: "numeric",
                        month: "long",
                      }),
                    )}
              </p>
              {!pro ? (
                <p className="text-shell-muted mt-1 max-w-md text-xs leading-relaxed">
                  {t.limitNote}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
            {pro ? (
              <ButtonLink href={localePath(locale, "/account/subscription")}>
                {t.manage}
              </ButtonLink>
            ) : (
              <ButtonLink
                href={localePath(locale, "/pricing")}
                variant="primary"
                icon={<Sparkles className="size-4" aria-hidden="true" />}
              >
                {t.upgrade}
              </ButtonLink>
            )}
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          index={1}
          label={t.monthTaken}
          value={stats.monthTaken}
          locale={locale}
          spark={stats.monthByDay.map((row) => row.value)}
          tone="accent"
          icon={<Layers />}
        />
        <StatTile
          index={2}
          label={t.allTime}
          value={stats.allTime}
          locale={locale}
          icon={<Clock />}
          href={localePath(locale, "/account/history")}
        />
        <StatTile
          index={3}
          label={t.savedCount}
          value={stats.savedCount}
          locale={locale}
          icon={<Heart />}
          href={localePath(locale, "/account/favorites")}
        />
        <StatTile
          index={4}
          label={pro ? t.daysLeft : t.daysToReset}
          value={daysUntil(pro && until ? until : reset, now)}
          locale={locale}
          icon={<Timer />}
          href={localePath(locale, "/account/subscription")}
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid content-start gap-6">
          {fresh ? (
            <Panel index={5}>
              <PanelHeader title={t.startTitle} />
              <ol className="text-shell-muted grid gap-2.5 text-sm">
                {t.startSteps.map((step, position) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="border-shell-border text-shell-fg mt-px flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums">
                      {position + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <ButtonLink
                href={localePath(locale, "/components")}
                variant="primary"
                size="lg"
                className="mt-6"
              >
                {t.startAction}
              </ButtonLink>
            </Panel>
          ) : resume ? (
            <Panel index={5} padded={false} className="overflow-hidden">
              <div className="border-shell-divider flex items-center justify-between gap-4 border-b px-5 py-3">
                <h2 className="text-shell-fg text-sm font-semibold">
                  {t.resume}
                </h2>
                {stats.recent[0] ? (
                  <span className="text-shell-muted text-xs tabular-nums">
                    {t.taken} {formatDay(stats.recent[0].firstUsedAt, locale)}
                  </span>
                ) : null}
              </div>
              <div className="bg-preview-surface flex min-h-56 flex-col">
                <CatalogThumbnail slug={resume} locale={locale} />
              </div>
              <div className="border-shell-divider flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
                <div className="min-w-0">
                  <p className="text-shell-fg truncate font-medium">
                    {resumeItem?.title ?? resume}
                  </p>
                  <p className="text-shell-muted truncate font-mono text-xs">
                    {resume}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ButtonLink
                    href={localePath(
                      locale,
                      `${itemBasePath(getItemKind(resume) ?? "component")}/${resume}`,
                    )}
                    variant="primary"
                    size="sm"
                  >
                    {t.open}
                  </ButtonLink>
                  <CopyItemLink url={getItemDocUrl(resume)} locale={locale} />
                </div>
              </div>
            </Panel>
          ) : null}

          <Panel index={6}>
            <PanelHeader
              title={t.activity}
              note={t.activityNote}
              action={
                stats.recent.length > 0 ? (
                  <Link
                    href={localePath(locale, "/account/history")}
                    className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
                  >
                    {t.recentAll}
                  </Link>
                ) : null
              }
            />
            <Bars data={stats.byDay} locale={locale} height={120} index={7} />
          </Panel>

          {stats.savedCount > 0 ? (
            <section className="acc-reveal" style={{ ["--i" as string]: 8 }}>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-shell-fg font-semibold">{t.savedTitle}</h2>
                <Link
                  href={localePath(locale, "/account/favorites")}
                  className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
                >
                  {t.savedAll}
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.saved.map((row, position) => {
                  const item = getCatalogItem(row.itemName)
                  const kind = getItemKind(row.itemName) ?? "component"

                  return (
                    <Panel
                      key={row.itemName}
                      as="li"
                      index={9 + position}
                      padded={false}
                      className="acc-lift overflow-hidden"
                    >
                      <div className="bg-preview-surface flex min-h-40 flex-col">
                        <CatalogThumbnail slug={row.itemName} locale={locale} />
                      </div>
                      <Link
                        href={localePath(
                          locale,
                          `${itemBasePath(kind)}/${row.itemName}`,
                        )}
                        className="border-shell-divider text-shell-fg hover:text-shell-accent-text block truncate border-t px-3 py-2.5 text-sm transition-colors"
                      >
                        {item?.title ?? row.itemName}
                      </Link>
                    </Panel>
                  )
                })}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="grid content-start gap-4">
          <Panel index={6}>
            <PanelHeader
              title={t.recentTitle}
              action={
                stats.recent.length > 0 ? (
                  <Link
                    href={localePath(locale, "/account/history")}
                    className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
                  >
                    {t.recentAll}
                  </Link>
                ) : null
              }
            />
            {stats.recent.length === 0 ? (
              <EmptyState
                compact
                icon={<Clock />}
                title={t.recentEmpty}
              />
            ) : (
              <ul className="grid gap-0.5">
                {stats.recent.map((row) => {
                  const item = getCatalogItem(row.itemName)
                  const kind = getItemKind(row.itemName) ?? "component"

                  return (
                    <li key={row.itemName}>
                      <Link
                        href={localePath(
                          locale,
                          `${itemBasePath(kind)}/${row.itemName}`,
                        )}
                        className="hover:bg-shell-elevated -mx-2 flex items-baseline justify-between gap-4 rounded-lg px-2 py-2 transition-colors"
                      >
                        <span className="min-w-0">
                          <span className="text-shell-fg block truncate text-sm">
                            {item?.title ?? row.itemName}
                          </span>
                          <span className="text-shell-muted block truncate font-mono text-xs">
                            {row.itemName}
                          </span>
                        </span>
                        <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                          {formatDay(row.firstUsedAt, locale)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          {stats.savedCount === 0 ? (
            <Panel index={7} variant="soft">
              <p className="text-shell-fg font-medium">{t.savedTitle}</p>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {t.savedEmpty}
              </p>
            </Panel>
          ) : null}

          {!pro ? (
            <Panel index={8} variant="soft">
              <p className="text-shell-accent-text flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="size-4" aria-hidden="true" />
                {t.proTitle}
              </p>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {t.proNote}
              </p>
              <Link
                href={localePath(locale, "/pricing")}
                className="text-shell-accent-text mt-3 inline-block text-sm font-medium hover:underline"
              >
                {t.upgrade}
              </Link>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  )
}
