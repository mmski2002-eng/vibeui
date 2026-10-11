import "server-only"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { adminNotification, user } from "@/lib/db/schema"

// Уведомление — побочный эффект: его сбой не должен ронять обращение или оплату.
export async function notifyOwner(title: string, lines: string[]) {
  try {
    await db.insert(adminNotification).values({
      id: randomUUID(),
      title,
      body: lines.join("\n"),
    })
  } catch (error) {
    console.error("notifyOwner failed:", error)
  }
}

export async function notifyPayment(input: {
  userId: string
  plan: string
  amount: string
  currency: string
  promoCode?: string | null
  partnerId?: string | null
  source: string
}) {
  const emailOf = async (id: string) =>
    (
      await db
        .select({ email: user.email })
        .from(user)
        .where(eq(user.id, id))
        .limit(1)
    )[0]?.email ?? id

  try {
    await notifyOwner("💰 Оплата", [
      `Кто: ${await emailOf(input.userId)}`,
      `Тариф: ${input.plan}`,
      `Сумма: ${input.amount} ${input.currency}`,
      `Способ: ${input.source}`,
      ...(input.promoCode ? [`Промокод: ${input.promoCode}`] : []),
      ...(input.partnerId ? [`Партнёр: ${await emailOf(input.partnerId)}`] : []),
    ])
  } catch (error) {
    console.error("notifyPayment failed:", error)
  }
}
