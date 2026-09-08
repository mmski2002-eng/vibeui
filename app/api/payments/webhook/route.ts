import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  payment,
  referralReward,
  subscription,
  user,
  webhookEvent,
} from "@/lib/db/schema"
import { PLANS, REFERRAL_DAYS, isPlanId } from "@/lib/plans"
import { YOOKASSA_NETWORKS } from "@/lib/yookassa"

/**
 * Уведомления ЮKassa. Три обязательных свойства обработчика: он проверяет
 * источник, он идемпотентен и он отвечает быстро — иначе ЮKassa будет
 * повторять доставку, а повтор не должен продлевать подписку дважды.
 */

function inNetwork(ip: string, cidr: string) {
  const [range, bits] = cidr.split("/")

  // IPv6 сверяем по префиксу строкой: единственная сеть в списке — /32,
  // разбирать полноценную арифметику ради неё незачем.
  if (range.includes(":")) {
    return ip.startsWith(range.replace("::", ""))
  }

  if (ip.includes(":")) {
    return false
  }

  const toInt = (value: string) =>
    value.split(".").reduce((sum, part) => sum * 256 + Number(part), 0)
  const mask = bits === "32" ? -1 : ~((1 << (32 - Number(bits))) - 1)

  return (toInt(ip) & mask) === (toInt(range) & mask)
}

function trusted(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? ""
  const ip = forwarded.split(",")[0]?.trim()

  if (!ip) {
    return false
  }

  return YOOKASSA_NETWORKS.some((network) => inNetwork(ip, network))
}

/** Продление: от большей из двух дат, чтобы оплата впрок не съедала остаток. */
function nextPeriodEnd(current: Date | undefined, days: number) {
  const from = current && current > new Date() ? current : new Date()

  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000)
}

export async function POST(request: Request) {
  if (!trusted(request)) {
    return new Response("forbidden\n", { status: 403 })
  }

  const body = await request.json()
  const event = body?.event as string | undefined
  const object = body?.object

  if (event !== "payment.succeeded" || !object?.id) {
    // Прочие события нам сейчас не нужны, но ответить надо: иначе ЮKassa
    // будет слать их снова.
    return new Response("ok\n")
  }

  const [seen] = await db
    .select({ id: webhookEvent.id })
    .from(webhookEvent)
    .where(eq(webhookEvent.id, object.id))
    .limit(1)

  if (seen) {
    return new Response("ok\n")
  }

  await db
    .insert(webhookEvent)
    .values({ id: object.id, type: event, payload: body })
    .onConflictDoNothing()

  const userId = object.metadata?.userId as string | undefined
  const planId = object.metadata?.plan as string | undefined

  if (!userId || !planId || !isPlanId(planId)) {
    return new Response("ok\n")
  }

  const plan = PLANS[planId]

  await db.insert(payment).values({
    id: randomUUID(),
    userId,
    yookassaId: object.id,
    amount: object.amount?.value ?? plan.price,
    status: object.status ?? "succeeded",
    paidAt: new Date(),
    receiptStatus: object.receipt_registration ?? null,
    payload: body,
  })

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

  await rewardInviter(userId, object.id)

  await db
    .update(webhookEvent)
    .set({ processedAt: new Date() })
    .where(eq(webhookEvent.id, object.id))

  return new Response("ok\n")
}

/**
 * Начисление за приглашение. Только за первый платёж приглашённого: строка
 * в `referral_reward` уникальна по платежу, повторная обработка ничего не
 * добавит.
 */
async function rewardInviter(invitedId: string, paymentId: string) {
  const [invited] = await db
    .select({ invitedBy: user.invitedBy })
    .from(user)
    .where(eq(user.id, invitedId))
    .limit(1)

  const inviterId = invited?.invitedBy

  if (!inviterId || inviterId === invitedId) {
    return
  }

  const [already] = await db
    .select({ id: referralReward.id })
    .from(referralReward)
    .where(eq(referralReward.invitedId, invitedId))
    .limit(1)

  if (already) {
    return
  }

  await db.insert(referralReward).values({
    id: randomUUID(),
    inviterId,
    invitedId,
    paymentId,
    daysGranted: REFERRAL_DAYS.inviter,
  })

  await grantDays(inviterId, REFERRAL_DAYS.inviter)
  await grantDays(invitedId, REFERRAL_DAYS.invited)
}

/** Подарить дни Pro: подписки может ещё не быть — тогда заводим её. */
async function grantDays(userId: string, days: number) {
  const [existing] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)

  const periodEnd = nextPeriodEnd(existing?.currentPeriodEnd, days)

  if (existing) {
    await db
      .update(subscription)
      .set({ currentPeriodEnd: periodEnd, status: "active" })
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
