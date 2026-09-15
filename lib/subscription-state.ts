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
  /** Оплаченный Pro: разовый платёж за месяц или год, автосписаний нет. */
  | { kind: "pro"; plan: PlanId | null; until: Date }
  /** Дни, выданные вручную из админки. */
  | { kind: "bonus"; until: Date }
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

  if (row.plan === "bonus") {
    return { kind: "bonus", until: row.currentPeriodEnd }
  }

  return { kind: "pro", plan, until: row.currentPeriodEnd }
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
