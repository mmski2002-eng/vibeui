import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { Clock, Search } from "lucide-react"

import { CopyItemLink } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
import { PAGER_LABELS, Pager } from "@/components/account/ui/pager"
import { Panel } from "@/components/account/ui/panel"
import { usageByMonth } from "@/lib/account-stats"
import { db } from "@/lib/db"
import { usage } from "@/lib/db/schema"
import { localePath, type Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

const PER_PAGE = 30

/** Месяц по ключу периода: «2026-09» человек читает плохо. */
function monthTitle(period: string, locale: Locale) {
  const [year, month] = period.split("-").map(Number)

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    locale === "en" ? "en-GB" : "ru-RU",
    { month: "long", year: "numeric" },
  )
}

/**
 * История: компактные строки, поиск и месяц, страницы.
 *
 * Поиск идёт по названию из реестра, которого в базе нет, поэтому строки
 * пользователя читаются целиком (имя, месяц, дата — дёшево), фильтруются
 * здесь и режутся на страницы. Фильтры и номер страницы живут в адресе.
 */
export async function AccountHistory({
  locale,
  page,
  query,
  period,
}: {
  locale: Locale
  page: number
  query: string
  period: string
}) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].history
  const base = localePath(locale, "/account/history")

  const [rows, months] = await Promise.all([
    db
      .select({
        period: usage.period,
        itemName: usage.itemName,
        firstUsedAt: usage.firstUsedAt,
      })
      .from(usage)
      .where(eq(usage.userId, user.id))
      .orderBy(desc(usage.period), desc(usage.firstUsedAt)),
    usageByMonth(user.id),
  ])
  const top = Math.max(1, ...months.map((month) => month.value))

  const periods = new Map<string, string>()

  for (const row of rows)
    periods.set(row.period, monthTitle(row.period, locale))

  const needle = query.trim().toLowerCase()
  const filtered = rows
    .map((row) => {
      const item = getCatalogItem(row.itemName)
      const kind = getItemKind(row.itemName) ?? "component"

      return {
        name: row.itemName,
        title: item?.title ?? row.itemName,
        href: `${itemBasePath(kind)}/${row.itemName}`,
        docUrl: getItemDocUrl(row.itemName),
        period: row.period,
        takenAt: row.firstUsedAt.toLocaleDateString(
          locale === "en" ? "en-GB" : "ru-RU",
          { day: "numeric", month: "short" },
        ),
      }
    })
    .filter((row) => {
      if (period !== "all" && row.period !== period) return false
      if (!needle) return true

      return (
        row.title.toLowerCase().includes(needle) ||
        row.name.toLowerCase().includes(needle)
      )
    })
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const href = (next: number) => {
    const params = new URLSearchParams()

    if (query) params.set("q", query)
    if (period !== "all") params.set("period", period)
    if (next > 1) params.set("page", String(next))

    const search = params.toString()

    return search ? `${base}?${search}` : base
  }

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />

      {rows.length === 0 ? (
        <EmptyState index={1} icon={<Clock />} title={t.empty} />
      ) : (
        <>
          {/* Полоса активности по месяцам: сколько разных компонентов
              человек брал в каждом. Читается как ритм работы, а не как
              счётчик. */}
          {months.length > 1 ? (
            <Panel index={1} className="mb-6">
              <ol className="flex items-end gap-2">
                {months.map((month, position) => (
                  <li
                    key={month.period}
                    title={`${monthTitle(month.period, locale)}: ${month.value}`}
                    className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                  >
                    <span className="text-shell-fg text-xs font-medium tabular-nums">
                      {month.value}
                    </span>
                    <span className="bg-shell-elevated flex h-16 w-full items-end overflow-hidden rounded-md">
                      <span
                        className="acc-grow-y bg-shell-accent block w-full rounded-md opacity-80"
                        style={{
                          ["--i" as string]: position,
                          height: `${Math.max(6, (month.value / top) * 100)}%`,
                        }}
                      />
                    </span>
                    <span className="text-shell-muted truncate text-[11px]">
                      {monthTitle(month.period, locale).split(" ")[0]}
                    </span>
                  </li>
                ))}
              </ol>
            </Panel>
          ) : null}

          <form
            action={base}
            method="get"
            className="acc-reveal flex flex-wrap items-center gap-3"
            style={{ ["--i" as string]: 2 }}
          >
            <label className="relative min-w-0 flex-1 sm:max-w-xs">
              <span className="sr-only">{t.search}</span>
              <Search
                aria-hidden="true"
                className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={t.searchPlaceholder}
                className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 w-full rounded-lg border pr-3 pl-9 text-sm transition-colors outline-none focus-visible:ring-2"
              />
            </label>

            {periods.size > 1 ? (
              <label className="text-shell-muted flex items-center gap-2 text-sm">
                <span className="sr-only">{t.allMonths}</span>
                <select
                  name="period"
                  defaultValue={period}
                  className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 rounded-lg border px-3 text-sm transition-colors outline-none focus-visible:ring-2"
                >
                  <option value="all">{t.allMonths}</option>
                  {[...periods.entries()].map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <Button type="submit">{t.apply}</Button>
          </form>

          {filtered.length === 0 ? (
            <div className="mt-5">
              <EmptyState compact icon={<Search />} title={t.nothingFound} />
            </div>
          ) : (
            <>
              <ul
                className="border-shell-border bg-shell-panel acc-shadow acc-reveal divide-shell-divider mt-5 divide-y rounded-2xl border"
                style={{ ["--i" as string]: 3 }}
              >
                {pageRows.map((row) => (
                  <li
                    key={`${row.period}-${row.name}`}
                    className="hover:bg-shell-elevated/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={localePath(locale, row.href)}
                        className="text-shell-fg hover:text-shell-accent-text block truncate text-sm transition-colors"
                      >
                        {row.title}
                      </Link>
                      <p className="text-shell-muted truncate font-mono text-xs">
                        {row.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-shell-muted text-xs tabular-nums">
                        {row.takenAt}
                      </span>
                      <CopyItemLink url={row.docUrl} locale={locale} />
                    </div>
                  </li>
                ))}
              </ul>

              <Pager
                page={page}
                hasNext={page * PER_PAGE < filtered.length}
                total={filtered.length}
                perPage={PER_PAGE}
                href={href}
                labels={PAGER_LABELS[locale]}
              />
            </>
          )}
        </>
      )}
    </>
  )
}
