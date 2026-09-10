import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { and, count, desc, eq } from "drizzle-orm"

import { CopyItemLink } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { db } from "@/lib/db"
import { favorite, usage } from "@/lib/db/schema"
import {
  FREE_MONTHLY_LIMIT,
  currentPeriod,
  getUsedCount,
} from "@/lib/entitlements"
import { localePath, type Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Первое число следующего месяца — день, когда лимит обнулится. */
function nextReset(locale: Locale) {
  const now = new Date()
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  )

  return next.toLocaleDateString(locale === "en" ? "en-GB" : "ru-RU", {
    day: "numeric",
    month: "long",
  })
}

function shortDate(value: Date, locale: Locale) {
  return value.toLocaleDateString(locale === "en" ? "en-GB" : "ru-RU", {
    day: "numeric",
    month: "short",
  })
}

/**
 * Обзор кабинета: сначала работа, потом ограничения.
 *
 * Раньше первым экраном шла лента лимита с числом во всю высоту, и человек,
 * пришедший продолжить работу, читал про то, чего ему нельзя. Теперь сверху
 * стоит компонент, с которым он работал последним, — с живым превью и двумя
 * действиями, а лимит ужат до строки со шкалой.
 */
export async function AccountOverview({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].overview

  const [state, used, recent, saved, savedTotal] = await Promise.all([
    getSubscriptionState(user.id),
    getUsedCount(user.id),
    db
      .select()
      .from(usage)
      .where(and(eq(usage.userId, user.id), eq(usage.period, currentPeriod())))
      .orderBy(desc(usage.firstUsedAt))
      .limit(6),
    db
      .select()
      .from(favorite)
      .where(eq(favorite.userId, user.id))
      .orderBy(desc(favorite.createdAt))
      .limit(3),
    db
      .select({ value: count() })
      .from(favorite)
      .where(eq(favorite.userId, user.id)),
  ])

  const savedCount = savedTotal[0]?.value ?? 0
  const pro = isProState(state)
  // Продолжаем с последнего взятого, а если истории нет — с последнего
  // сохранённого: обе вещи человек уже выбрал сам.
  const resume = recent[0]?.itemName ?? saved[0]?.itemName
  const resumeItem = resume ? getCatalogItem(resume) : undefined
  const fresh = recent.length === 0 && savedCount === 0

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h1>
          <p className="text-shell-muted mt-1.5 text-sm">{t.lead}</p>
        </div>
        <Link
          href={localePath(locale, "/components")}
          className="border-shell-border text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {ACCOUNT_TEXTS[locale].nav.catalog}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid content-start gap-6">
          {fresh ? (
            <section className="border-shell-border bg-shell-panel rounded-2xl border p-6 sm:p-7">
              <h2 className="text-shell-fg text-lg font-medium">
                {t.startTitle}
              </h2>
              <ol className="text-shell-muted mt-4 grid gap-2.5 text-sm">
                {t.startSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="border-shell-border text-shell-fg mt-px flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link
                href={localePath(locale, "/components")}
                className="bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring mt-6 inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-shell-accent-deep focus-visible:ring-2 focus-visible:outline-none"
              >
                {t.startAction}
              </Link>
            </section>
          ) : resume ? (
            <section className="border-shell-card-strong bg-shell overflow-hidden rounded-2xl border">
              <div className="border-shell-border flex items-center justify-between gap-4 border-b px-5 py-3">
                <h2 className="text-shell-fg text-sm font-medium">
                  {t.resume}
                </h2>
                {recent[0] ? (
                  <span className="text-shell-muted text-xs tabular-nums">
                    {t.taken} {shortDate(recent[0].firstUsedAt, locale)}
                  </span>
                ) : null}
              </div>
              <div className="bg-preview-surface flex min-h-56 items-center justify-center">
                <CatalogThumbnail slug={resume} locale={locale} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-shell-fg truncate font-medium">
                    {resumeItem?.title ?? resume}
                  </p>
                  <p className="text-shell-muted truncate font-mono text-xs">
                    {resume}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={localePath(
                      locale,
                      `${itemBasePath(getItemKind(resume) ?? "component")}/${resume}`,
                    )}
                    className="bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold transition-colors hover:bg-shell-accent-deep focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {t.open}
                  </Link>
                  <CopyItemLink
                    url={getItemDocUrl(resume)}
                    locale={locale}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {savedCount > 0 ? (
            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-shell-fg font-medium">{t.savedTitle}</h2>
                <Link
                  href={localePath(locale, "/account/favorites")}
                  className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
                >
                  {t.savedAll}
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((row) => {
                  const item = getCatalogItem(row.itemName)
                  const kind = getItemKind(row.itemName) ?? "component"

                  return (
                    <li
                      key={row.itemName}
                      className="border-shell-border bg-shell overflow-hidden rounded-xl border"
                    >
                      <div className="bg-preview-surface flex min-h-32 items-center justify-center">
                        <CatalogThumbnail
                          slug={row.itemName}
                          locale={locale}
                        />
                      </div>
                      <Link
                        href={localePath(
                          locale,
                          `${itemBasePath(kind)}/${row.itemName}`,
                        )}
                        className="border-shell-border text-shell-fg hover:text-shell-accent-text block truncate border-t px-3 py-2.5 text-sm transition-colors"
                      >
                        {item?.title ?? row.itemName}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="text-shell-fg font-medium">{t.recentTitle}</h2>
              {recent.length > 0 ? (
                <Link
                  href={localePath(locale, "/account/history")}
                  className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
                >
                  {t.recentAll}
                </Link>
              ) : null}
            </div>

            {recent.length === 0 ? (
              <p className="text-shell-muted text-sm leading-relaxed">
                {t.recentEmpty}
              </p>
            ) : (
              <ul className="grid gap-0.5">
                {recent.map((row) => {
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
                          {shortDate(row.firstUsedAt, locale)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="grid content-start gap-4">
          {pro ? (
            <aside className="border-shell-accent/40 bg-shell-panel rounded-2xl border p-5">
              <p className="text-shell-accent-text text-sm font-semibold">
                {t.proTitle}
              </p>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {t.proNote}
              </p>
              {"until" in state ? (
                <p className="text-shell-muted mt-3 text-sm">
                  {t.proUntil(
                    state.until.toLocaleDateString(
                      locale === "en" ? "en-GB" : "ru-RU",
                    ),
                  )}
                </p>
              ) : null}
              <Link
                href={localePath(locale, "/account/subscription")}
                className="border-shell-border-strong text-shell-fg hover:border-shell-accent mt-4 inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors"
              >
                {t.manage}
              </Link>
            </aside>
          ) : (
            <aside className="border-shell-border bg-shell-panel rounded-2xl border p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-shell-fg font-medium tabular-nums">
                  {t.limitLeft(
                    Math.max(0, FREE_MONTHLY_LIMIT - used),
                    FREE_MONTHLY_LIMIT,
                  )}
                </p>
              </div>
              {/* Одна полоса вместо ста делений: на телефоне сетка занимала
                  пять рядов ради одного числа. */}
              <div
                role="img"
                aria-label={t.limitLeft(
                  Math.max(0, FREE_MONTHLY_LIMIT - used),
                  FREE_MONTHLY_LIMIT,
                )}
                className="bg-shell-elevated mt-3 h-2 overflow-hidden rounded-full"
              >
                <span
                  className="bg-shell-accent block h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (used / FREE_MONTHLY_LIMIT) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-shell-muted mt-3 text-sm">
                {t.limitResets(nextReset(locale))}
              </p>
              <p className="text-shell-muted mt-3 text-xs leading-relaxed">
                {t.limitNote}
              </p>
              <Link
                href={localePath(locale, "/pricing")}
                className="text-shell-accent-text mt-4 inline-block text-sm font-medium hover:underline"
              >
                {t.upgrade}
              </Link>
            </aside>
          )}

          {savedCount === 0 ? (
            <aside className="border-shell-border bg-shell-panel rounded-2xl border p-5">
              <p className="text-shell-fg font-medium">{t.savedTitle}</p>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {t.savedEmpty}
              </p>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  )
}
