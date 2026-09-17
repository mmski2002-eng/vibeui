import "server-only"

import { and, count, desc, eq, gte, sql } from "drizzle-orm"

import { fillDays, lastDays, monthDays } from "@/lib/days"
import { db } from "@/lib/db"
import { favorite, payment, usage } from "@/lib/db/schema"
import { currentPeriod } from "@/lib/entitlements"

/**
 * Числа для обзора пользователя. Всё — агрегаты в SQL с индексами
 * `usage_period_idx` и первичными ключами; выгрузок в память нет.
 */
export async function overviewStats(userId: string, now = new Date()) {
  const period = currentPeriod(now)
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [byDay, allTime, saved, recent, favorites, paid] = await Promise.all([
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${usage.firstUsedAt}), 'YYYY-MM-DD')`,
        value: count(),
      })
      .from(usage)
      .where(and(eq(usage.userId, userId), gte(usage.firstUsedAt, from)))
      .groupBy(sql`date_trunc('day', ${usage.firstUsedAt})`),
    db
      .select({ value: count() })
      .from(usage)
      .where(eq(usage.userId, userId)),
    db
      .select({ value: count() })
      .from(favorite)
      .where(eq(favorite.userId, userId)),
    db
      .select()
      .from(usage)
      .where(and(eq(usage.userId, userId), eq(usage.period, period)))
      .orderBy(desc(usage.firstUsedAt))
      .limit(6),
    db
      .select()
      .from(favorite)
      .where(eq(favorite.userId, userId))
      .orderBy(desc(favorite.createdAt))
      .limit(6),
    db
      .select({
        total: sql<string>`coalesce(sum(cast(${payment.amount} as numeric)), 0)`,
        rows: count(),
      })
      .from(payment)
      .where(and(eq(payment.userId, userId), eq(payment.status, "succeeded"))),
  ])

  const filled = fillDays(lastDays(30, now), byDay)
  const month = fillDays(monthDays(now), byDay)

  return {
    byDay: filled,
    monthByDay: month,
    monthTaken: month.reduce((sum, row) => sum + row.value, 0),
    allTime: allTime[0]?.value ?? 0,
    savedCount: saved[0]?.value ?? 0,
    recent,
    saved: favorites,
    paidTotal: Number(paid[0]?.total ?? 0),
    paidCount: paid[0]?.rows ?? 0,
  }
}

/** Активность по месяцам для истории: сколько разных компонентов в месяц. */
export async function usageByMonth(userId: string, months = 12) {
  const rows = await db
    .select({ period: usage.period, value: count() })
    .from(usage)
    .where(eq(usage.userId, userId))
    .groupBy(usage.period)
    .orderBy(desc(usage.period))
    .limit(months)

  return rows.reverse()
}
