import "server-only"

import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { subscription } from "@/lib/db/schema"
import { PLANS, isPlanId, type PlanId } from "@/lib/plans"

/**
 * Одно состояние подписки на весь сайт.
 *
 * Раньше шапка кабинета, обзор и страница оплаты спрашивали базу каждая
 * по-своему: одна брала только активную строку с будущей датой, другая —
 * любую. Из-за этого человек с истёкшим Pro видел «Активна» на одной
 * странице и «Бесплатный» на соседней. Здесь состояние вычисляется один раз
 * и дальше только показывается.
 */
export type SubscriptionState =
  | { kind: "free" }
  /** Оплаченный Pro, продление включено. */
  | { kind: "pro"; plan: PlanId | null; until: Date; renews: true }
  /** Дни, выданные вручную из админки: списаний по ним не бывает. */
  | { kind: "bonus"; until: Date }
  /** Продление отключено: доступ есть, следующего списания не будет. */
  | { kind: "cancelled"; plan: PlanId | null; until: Date }
  /** Оплата не прошла: доступ ещё есть, но нужно вмешательство. */
  | { kind: "past_due"; plan: PlanId | null; until: Date; attempts: number }
  /** Срок кончился: доступ бесплатный, история оплат осталась. */
  | { kind: "expired"; plan: PlanId | null; endedAt: Date }

export type SubscriptionRow = typeof subscription.$inferSelect

/** Строка подписки как есть — нужна страницам, которым важны детали. */
export async function getSubscriptionRow(userId: string) {
  const [row] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  return row
}

export function resolveSubscription(
  row: SubscriptionRow | undefined,
  now = new Date(),
): SubscriptionState {
  if (!row) return { kind: "free" }

  const plan = isPlanId(row.plan) ? row.plan : null
  const active = row.currentPeriodEnd > now

  if (!active || row.status === "expired" || row.status === "canceled") {
    return { kind: "expired", plan, endedAt: row.currentPeriodEnd }
  }

  if (row.status === "past_due") {
    return {
      kind: "past_due",
      plan,
      until: row.currentPeriodEnd,
      attempts: row.failedAttempts,
    }
  }

  // Бонус живёт как обычная подписка, но списаний по нему нет: обещать
  // «следующее списание» здесь было бы враньём.
  if (row.plan === "bonus") {
    return { kind: "bonus", until: row.currentPeriodEnd }
  }

  if (row.cancelAtPeriodEnd) {
    return { kind: "cancelled", plan, until: row.currentPeriodEnd }
  }

  return { kind: "pro", plan, until: row.currentPeriodEnd, renews: true }
}

/** Даёт ли это состояние права Pro прямо сейчас. */
export function isProState(state: SubscriptionState) {
  return state.kind !== "free" && state.kind !== "expired"
}

/** Название тарифа для показа. Бонус тарифом не считается. */
export function planTitle(plan: PlanId | null) {
  return plan ? PLANS[plan].title : "Pro"
}

export async function getSubscriptionState(userId: string) {
  return resolveSubscription(await getSubscriptionRow(userId))
}
