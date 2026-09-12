import "server-only"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { payment, subscription, webhookEvent } from "@/lib/db/schema"
import { PLANS, isPlanId } from "@/lib/plans"

/**
 * Применение успешного платежа: запись платежа и продление подписки.
 *
 * Живёт отдельно от маршрута вебхука, потому что тот же путь нужен
 * администратору: когда уведомление ЮKassa не дошло, он прогоняет
 * сохранённый или заново запрошенный ответ через этот же код. Двух копий
 * логики продления подписки в проекте быть не должно.
 */

/** Продление: от большей из двух дат, чтобы оплата впрок не съедала остаток. */
export function nextPeriodEnd(current: Date | undefined, days: number) {
  const from = current && current > new Date() ? current : new Date()

  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000)
}

/** Подарить дни Pro: подписки может ещё не быть — тогда заводим её. */
export async function grantDays(userId: string, days: number) {
  const [existing] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  const periodEnd = nextPeriodEnd(existing?.currentPeriodEnd, days)

  if (existing) {
    await db
      .update(subscription)
      .set({
        currentPeriodEnd: periodEnd,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(subscription.userId, userId))

    return
  }

  await db.insert(subscription).values({
    id: randomUUID(),
    userId,
    plan: "bonus",
    status: "active",
    currentPeriodEnd: periodEnd,
  })
}

export type ApplyResult =
  | { applied: false; reason: "duplicate" | "not_succeeded" | "no_metadata" }
  | { applied: true; userId: string; plan: string }

/**
 * Разобрать тело уведомления и применить его.
 *
 * Идемпотентность держится на таблице `webhook_event`: второй заход с тем же
 * идентификатором платежа не продлевает подписку. Администратор может
 * попросить применить событие заново — тогда `force` снимает эту защиту, но
 * запись платежа всё равно не задваивается уникальным `yookassa_id`.
 */
export async function applyPaymentEvent(
  body: {
    event?: string
    object?: Record<string, unknown> & {
      id?: string
      status?: string
      amount?: { value?: string }
      metadata?: Record<string, string>
      payment_method?: { id?: string }
      receipt_registration?: string
    }
  },
  options: { force?: boolean } = {},
): Promise<ApplyResult> {
  const object = body?.object

  if (body?.event !== "payment.succeeded" || !object?.id) {
    return { applied: false, reason: "not_succeeded" }
  }

  const [seen] = await db
    .select({ id: webhookEvent.id, processedAt: webhookEvent.processedAt })
    .from(webhookEvent)
    .where(eq(webhookEvent.id, object.id))
    .limit(1)

  if (seen?.processedAt && !options.force) {
    return { applied: false, reason: "duplicate" }
  }

  await db
    .insert(webhookEvent)
    .values({ id: object.id, type: body.event, payload: body })
    .onConflictDoNothing()

  const userId = object.metadata?.userId
  const planId = object.metadata?.plan

  if (!userId || !planId || !isPlanId(planId)) {
    return { applied: false, reason: "no_metadata" }
  }

  const plan = PLANS[planId]

  await db
    .insert(payment)
    .values({
      id: randomUUID(),
      userId,
      yookassaId: object.id,
      amount: object.amount?.value ?? plan.price,
      status: object.status ?? "succeeded",
      paidAt: new Date(),
      receiptStatus: object.receipt_registration ?? null,
      payload: body,
    })
    // Повторное применение не должно плодить строки: один платёж — одна.
    .onConflictDoNothing()

  const [existing] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  const periodEnd = nextPeriodEnd(existing?.currentPeriodEnd, plan.days)

  if (existing) {
    await db
      .update(subscription)
      .set({
        plan: plan.id,
        status: "active",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        failedAttempts: 0,
        paymentMethodId:
          object.payment_method?.id ?? existing.paymentMethodId ?? null,
        updatedAt: new Date(),
      })
      .where(eq(subscription.userId, userId))
  } else {
    await db.insert(subscription).values({
      id: randomUUID(),
      userId,
      plan: plan.id,
      status: "active",
      currentPeriodEnd: periodEnd,
      paymentMethodId: object.payment_method?.id ?? null,
    })
  }


  await db
    .update(webhookEvent)
    .set({ processedAt: new Date() })
    .where(eq(webhookEvent.id, object.id))

  return { applied: true, userId, plan: plan.id }
}
