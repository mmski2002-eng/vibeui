import { desc, eq } from "drizzle-orm"
import { Clock } from "lucide-react"

import { HistoryList, type HistoryRow } from "@/components/account/history-list"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel } from "@/components/account/ui/panel"
import { usageByMonth } from "@/lib/account-stats"
import { db } from "@/lib/db"
import { usage } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Месяц по ключу периода: «2026-09» человек читает плохо. */
function monthTitle(period: string, locale: Locale) {
  const [year, month] = period.split("-").map(Number)

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    locale === "en" ? "en-GB" : "ru-RU",
    { month: "long", year: "numeric" },
  )
}

export async function AccountHistory({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].history

  const [rows, months] = await Promise.all([
    db
      .select()
      .from(usage)
      .where(eq(usage.userId, user.id))
      .orderBy(desc(usage.period), desc(usage.firstUsedAt))
      .limit(600),
    usageByMonth(user.id),
  ])
  const top = Math.max(1, ...months.map((month) => month.value))

  const items: HistoryRow[] = rows.map((row) => {
    const item = getCatalogItem(row.itemName)
    const kind = getItemKind(row.itemName) ?? "component"

    return {
      name: row.itemName,
      title: item?.title ?? row.itemName,
      href: `${itemBasePath(kind)}/${row.itemName}`,
      docUrl: getItemDocUrl(row.itemName),
      period: row.period,
      periodTitle: monthTitle(row.period, locale),
      takenAt: row.firstUsedAt.toLocaleDateString(
        locale === "en" ? "en-GB" : "ru-RU",
        { day: "numeric", month: "short" },
      ),
    }
  })

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />

      {items.length === 0 ? (
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
          <HistoryList locale={locale} rows={items} />
        </>
      )}
    </>
  )
}
