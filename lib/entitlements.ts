import "server-only"

import { and, count, eq, gt } from "drizzle-orm"

import { db } from "@/lib/db"
import { subscription, usage } from "@/lib/db/schema"

/** Сколько разных компонентов в месяц отдаём бесплатно вошедшему. */
export const FREE_MONTHLY_LIMIT = 100

/** То же для анонима: хватает убедиться, что компоненты настоящие. */
export const ANON_MONTHLY_LIMIT = 10

/** Календарный месяц: по нему же чистятся старые строки расхода. */
export function currentPeriod(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
}

/**
 * Активная подписка или undefined. Право на Pro — это функция от подписки,
 * отдельной таблицы прав нет: дублировать состояние дороже, чем сделать join.
 */
export async function getSubscription(userId: string) {
  const [row] = await db
    .select()
    .from(subscription)
    .where(
      and(
        eq(subscription.userId, userId),
        eq(subscription.status, "active"),
        gt(subscription.currentPeriodEnd, new Date()),
      ),
    )
    .limit(1)

  return row
}

export async function isPro(userId: string) {
  return Boolean(await getSubscription(userId))
}

/** Сколько компонентов израсходовано в этом месяце. */
export async function getUsedCount(userId: string, period = currentPeriod()) {
  const [row] = await db
    .select({ value: count() })
    .from(usage)
    .where(and(eq(usage.userId, userId), eq(usage.period, period)))

  return row?.value ?? 0
}

/**
 * Списать компонент. Повторное обращение к тому же item'у в том же месяце
 * ничего не тратит: иначе человек начинает бояться нажимать кнопку.
 *
 * Возвращает `allowed: false`, когда лимит исчерпан и компонент новый.
 */
export async function spendItem(userId: string, itemName: string) {
  const period = currentPeriod()

  if (await isPro(userId)) {
    return { allowed: true, remaining: Infinity, counted: false }
  }

  const [existing] = await db
    .select({ itemName: usage.itemName })
    .from(usage)
    .where(
      and(
        eq(usage.userId, userId),
        eq(usage.period, period),
        eq(usage.itemName, itemName),
      ),
    )
    .limit(1)

  const used = await getUsedCount(userId, period)

  if (existing) {
    return {
      allowed: true,
      remaining: Math.max(0, FREE_MONTHLY_LIMIT - used),
      counted: false,
    }
  }

  if (used >= FREE_MONTHLY_LIMIT) {
    return { allowed: false, remaining: 0, counted: false }
  }

  // Гонка двух вкладок закрывается первичным ключом: вторая вставка той же
  // пары просто ничего не делает.
  await db
    .insert(usage)
    .values({ userId, period, itemName })
    .onConflictDoNothing()

  return {
    allowed: true,
    remaining: Math.max(0, FREE_MONTHLY_LIMIT - used - 1),
    counted: true,
  }
}
