import { desc, eq } from "drizzle-orm"

import { HistoryList, type HistoryRow } from "@/components/account/history-list"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
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

  const rows = await db
    .select()
    .from(usage)
    .where(eq(usage.userId, user.id))
    .orderBy(desc(usage.period), desc(usage.firstUsedAt))
    .limit(600)

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
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      {/* Формулировка честная: строка появляется при первом обращении к
          компоненту в месяце, а не на каждое копирование. */}
      <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
        {t.lead}
      </p>

      {items.length === 0 ? (
        <p className="text-shell-muted mt-8 text-sm leading-relaxed">
          {t.empty}
        </p>
      ) : (
        <HistoryList locale={locale} rows={items} />
      )}
    </>
  )
}
