import "server-only"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { payment, subscription, webhookEvent } from "@/lib/db/schema"
import { getPlans } from "@/lib/plan-prices"
import { isPlanId } from "@/lib/plans"
import { fetchPayment } from "@/lib/yookassa"

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
  | {
      applied: false
      reason: "duplicate" | "not_succeeded" | "no_metadata" | "unverified"
    }
  | { applied: true; userId: string; plan: string }

/**
 * Разобрать тело уведомления и применить его.
 *
 * Идемпотентность держится на таблице `webhook_event`: второй заход с тем же
 * идентификатором платежа не продлевает подписку. Администратор может
 * попросить применить событие заново — тогда `force` снимает эту защиту, но
 * запись платежа всё равно не задваивается уникальным `yookassa_id`.
 *
 * `verify` обязателен для вебхука: тело POST-запроса контролирует
 * отправитель, а подлинность источника по IP ненадёжна (за обратным прокси
 * IP берётся из заголовка, который можно подделать). Поэтому статус, сумму,
 * план и владельца берём не из присланного тела, а из ответа ЮKassa по
 * `object.id` — единственного источника правды о деньгах. Событие с
 * выдуманным `id` в ЮKassa не найдётся, и Pro никто не получит.
 */
export async function applyPaymentEvent(
  body: {
    event?: string
    object?: Record<string, unknown> & {
      id?: string
      status?: string
      amount?: { value?: string }
      metadata?: Record<string, string>
      payment_method?: { id?: string; saved?: boolean }
      receipt_registration?: string
    }
  },
  options: { force?: boolean; verify?: boolean } = {},
): Promise<ApplyResult> {
  const object = body?.object

  if (body?.event !== "payment.succeeded" || !object?.id) {
    return { applied: false, reason: "not_succeeded" }
  }

  const id = object.id

  // Источник полей платежа. По умолчанию — присланное тело; при verify —
  // ответ ЮKassa по этому id: сумма, статус, план и владелец берутся оттуда,
  // тело в расчёт не идёт. Событие с выдуманным id в ЮKassa не найдётся.
  let source: {
    status?: string
    amount?: { value?: string }
    metadata?: Record<string, string>
    payment_method?: { id?: string; saved?: boolean }
    receipt_registration?: string
  } = object

  if (options.verify) {
    let real
    try {
      real = await fetchPayment(id)
    } catch {
      return { applied: false, reason: "unverified" }
    }

    if (!real || real.id !== id || real.status !== "succeeded") {
      return { applied: false, reason: "unverified" }
    }

    source = {
      status: real.status,
      amount: real.amount,
      metadata: real.metadata,
      payment_method: real.payment_method,
    }
  }

  // В БД кладём проверенный объект, а не присланное тело: администратор
  // потом применяет платёж заново из сохранённого payload (без verify), и
  // доверять там можно только тому, что уже сверено с ЮKassa.
  const stored = options.verify
    ? { event: body.event, object: { id, ...source } }
    : body

  const [seen] = await db
    .select({ id: webhookEvent.id, processedAt: webhookEvent.processedAt })
    .from(webhookEvent)
    .where(eq(webhookEvent.id, id))
    .limit(1)

  if (seen?.processedAt && !options.force) {
    return { applied: false, reason: "duplicate" }
  }

  await db
    .insert(webhookEvent)
    .values({ id, type: body.event, payload: stored })
    .onConflictDoNothing()

  const userId = source.metadata?.userId
  const planId = source.metadata?.plan

  if (!userId || !planId || !isPlanId(planId)) {
    return { applied: false, reason: "no_metadata" }
  }

  const plan = (await getPlans())[planId]

  await db
    .insert(payment)
    .values({
      id: randomUUID(),
      userId,
      yookassaId: id,
      amount: source.amount?.value ?? plan.price,
      status: source.status ?? "succeeded",
      paidAt: new Date(),
      receiptStatus: source.receipt_registration ?? null,
      payload: stored,
    })
    // Повторное применение не должно плодить строки: один платёж — одна.
    .onConflictDoNothing()

  const [existing] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  // Списывать потом можно только сохранённым способом: у СБП и разовой
  // карты id тоже есть, но `saved: false`, и попытка продления по нему
  // вернёт отказ — три отказа подряд и подписка закрылась бы сама.
  const savedMethodId = source.payment_method?.saved
    ? (source.payment_method.id ?? null)
    : null
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
        paymentMethodId: savedMethodId ?? existing.paymentMethodId ?? null,
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
      paymentMethodId: savedMethodId,
    })
  }


  await db
    .update(webhookEvent)
    .set({ processedAt: new Date() })
    .where(eq(webhookEvent.id, id))

  return { applied: true, userId, plan: plan.id }
}
