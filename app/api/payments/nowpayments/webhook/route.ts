import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { payment, subscription, user, webhookEvent } from "@/lib/db/schema"
import { nextPeriodEnd } from "@/lib/payment-apply"
import { isPlanId, PLANS } from "@/lib/plans"
import { verifyIpnSignature } from "@/lib/nowpayments"

/**
 * Уведомления NOWPayments (крипто-оплата vibeui.club). Как и у ЮKassa: источник
 * проверяется (подпись IPN нашим секретом), обработчик идемпотентен и отвечает
 * быстро. Права выдаются только на полностью оплаченный инвойс (`finished`).
 *
 * Автосписаний в проекте нет: платёж разовый, продлевает Pro на срок тарифа.
 */

type Ipn = {
  payment_id?: string | number
  payment_status?: string
  order_id?: string
  price_amount?: number | string
  pay_currency?: string
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-nowpayments-sig")

  let body: Ipn
  try {
    body = (await request.json()) as Ipn
  } catch {
    return new Response("bad request\n", { status: 400 })
  }

  // Тело POST-запроса контролирует отправитель — доверяем только подписи.
  if (!verifyIpnSignature(body, signature)) {
    return new Response("forbidden\n", { status: 403 })
  }

  // Прочие статусы (waiting/confirming/…) подтверждаем, но прав не выдаём и в
  // журнал не пишем: тогда финальный `finished` не отсечётся как дубликат.
  if (body.payment_status !== "finished") {
    return new Response("ok\n")
  }

  const paymentId = String(body.payment_id ?? "")

  if (!paymentId) {
    return new Response("ok\n")
  }

  // Идемпотентность: тот же платёж не продлевает подписку дважды.
  const [seen] = await db
    .select({ processedAt: webhookEvent.processedAt })
    .from(webhookEvent)
    .where(eq(webhookEvent.id, paymentId))
    .limit(1)

  if (seen?.processedAt) {
    return new Response("ok\n")
  }

  await db
    .insert(webhookEvent)
    .values({ id: paymentId, type: "nowpayments", payload: body })
    .onConflictDoNothing()

  // Связь платежа с пользователем и тарифом лежит в order_id — он под подписью,
  // подделать нельзя. Формат задаётся при создании инвойса: `<userId>:<planId>`.
  const [userId, planId] = String(body.order_id ?? "").split(":")

  if (userId && planId && isPlanId(planId)) {
    const plan = PLANS[planId]

    const [owner] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (owner) {
      await db
        .insert(payment)
        .values({
          id: randomUUID(),
          userId,
          yookassaId: `np:${paymentId}`,
          amount: String(body.price_amount ?? ""),
          currency: "USD",
          status: "succeeded",
          paidAt: new Date(),
          payload: body,
        })
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
        })
      }
    }
  }

  await db
    .update(webhookEvent)
    .set({ processedAt: new Date() })
    .where(eq(webhookEvent.id, paymentId))

  return new Response("ok\n")
}
