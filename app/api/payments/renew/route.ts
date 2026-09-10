import { and, eq, isNotNull, lt } from "drizzle-orm"

import { db } from "@/lib/db"
import { subscription, user } from "@/lib/db/schema"
import { sendMail } from "@/lib/mail"
import { PLANS, isPlanId } from "@/lib/plans"
import { pruneSearchLog } from "@/lib/search-log"
import { chargeSaved } from "@/lib/yookassa"

/**
 * Продление подписок. Дёргается таймером на сервере, а не изнутри
 * приложения: процесс Next один, и фоновый цикл в нём переживёт не каждый
 * релиз — таймер systemd переживает.
 *
 * Само списание идёт по сохранённому способу оплаты; подписку продлевает не
 * этот обработчик, а вебхук `payment.succeeded` — так продление и первая
 * оплата идут одним путём, и двойной логики не появляется.
 */
export const dynamic = "force-dynamic"

/** Сколько раз пробуем списать, прежде чем признать подписку истёкшей. */
const MAX_ATTEMPTS = 3

export async function POST(request: Request) {
  const key = request.headers.get("x-cron-key")

  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return new Response("forbidden\n", { status: 403 })
  }

  const now = new Date()
  const due = await db
    .select({
      subscription,
      email: user.email,
    })
    .from(subscription)
    .innerJoin(user, eq(user.id, subscription.userId))
    .where(
      and(
        eq(subscription.status, "active"),
        lt(subscription.currentPeriodEnd, now),
        isNotNull(subscription.paymentMethodId),
      ),
    )

  // Заодно чистим лог поисковых запросов: отдельный таймер ради одной
  // операции в сутки заводить незачем.
  await pruneSearchLog()

  let charged = 0
  let closed = 0

  for (const row of due) {
    const current = row.subscription

    // Отменённая подписка просто дорабатывает оплаченный период.
    if (current.cancelAtPeriodEnd) {
      await db
        .update(subscription)
        .set({ status: "expired", updatedAt: now })
        .where(eq(subscription.id, current.id))
      closed += 1
      continue
    }

    const plan = isPlanId(current.plan) ? PLANS[current.plan] : PLANS.monthly

    try {
      await chargeSaved({
        amount: plan.price,
        description: `VibeUI ${plan.title}`,
        email: row.email,
        userId: current.userId,
        paymentMethodId: current.paymentMethodId as string,
      })
      charged += 1
    } catch {
      const attempts = current.failedAttempts + 1
      const exhausted = attempts >= MAX_ATTEMPTS

      await db
        .update(subscription)
        .set({
          failedAttempts: attempts,
          status: exhausted ? "expired" : "past_due",
          updatedAt: now,
        })
        .where(eq(subscription.id, current.id))

      await sendMail({
        to: row.email,
        subject: exhausted
          ? "Подписка VibeUI приостановлена"
          : "Не удалось продлить подписку VibeUI",
        text: exhausted
          ? "Списание не прошло три раза подряд, доступ к Pro приостановлен.\nОплатить снова: https://vibeui.ru/pricing\n\nVibeUI — vibeui.ru"
          : "Не получилось списать оплату за подписку. Попробуем ещё раз в ближайшие сутки.\nПроверить способ оплаты: https://vibeui.ru/account/subscription\n\nVibeUI — vibeui.ru",
      })

      if (exhausted) {
        closed += 1
      }
    }
  }

  return Response.json({ due: due.length, charged, closed })
}
