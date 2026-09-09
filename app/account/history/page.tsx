import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { usage } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Месяц по ключу периода: «2026-09» человек читает плохо. */
function monthTitle(period: string) {
  const [year, month] = period.split("-").map(Number)

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  })
}

export default async function HistoryPage() {
  const user = await requireUser()
  const rows = await db
    .select()
    .from(usage)
    .where(eq(usage.userId, user.id))
    .orderBy(desc(usage.period), desc(usage.firstUsedAt))
    .limit(400)

  // Группируем по месяцам: журнал читают вопросом «что я брал в сентябре».
  const months = new Map<string, typeof rows>()

  for (const row of rows) {
    months.set(row.period, [...(months.get(row.period) ?? []), row])
  }

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Журнал
      </h1>
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        Всё, что вы копировали или устанавливали. Здесь удобно найти компонент,
        который брали для прошлого проекта.
      </p>

      {rows.length === 0 ? (
        <p className="text-shell-muted mt-8 text-sm leading-relaxed">
          Записей пока нет. Первый скопированный компонент появится здесь.
        </p>
      ) : (
        <div className="mt-8 grid gap-8">
          {[...months.entries()].map(([period, items]) => (
            <section key={period}>
              <div className="border-shell-border mb-3 flex items-baseline justify-between border-b pb-2">
                <h2 className="text-shell-fg text-sm font-medium">
                  {monthTitle(period)}
                </h2>
                <span className="text-shell-muted text-xs tabular-nums">
                  {items.length}
                </span>
              </div>
              <ul className="grid gap-1">
                {items.map((row) => {
                  const item = getCatalogItem(row.itemName)
                  const kind = getItemKind(row.itemName) ?? "component"

                  return (
                    <li key={row.itemName}>
                      <Link
                        href={`${itemBasePath(kind)}/${row.itemName}`}
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
                          {row.firstUsedAt.toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
