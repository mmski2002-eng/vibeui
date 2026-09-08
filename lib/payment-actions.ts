"use server"

import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { subscription } from "@/lib/db/schema"
import { PLANS, isPlanId } from "@/lib/plans"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"
import { createCheckout } from "@/lib/yookassa"

/**
 * Начало оплаты. Платёж создаётся на сервере: цена не должна приходить из
 * браузера, иначе её можно назначить самому.
 */
export async function startCheckout(formData: FormData) {
  const planId = String(formData.get("plan"))

  if (!isPlanId(planId)) {
    throw new Error("Неизвестный тариф")
  }

  const user = await requireUser()
  const plan = PLANS[planId]

  const payment = await createCheckout({
    amount: plan.price,
    description: `VibeUI ${plan.title}`,
    email: user.email,
    userId: user.id,
    returnUrl: `${SITE_URL}/account/subscription`,
  })

  const url = payment.confirmation?.confirmation_url

  if (!url) {
    throw new Error("ЮKassa не вернула ссылку подтверждения")
  }

  redirect(url)
}

/** Отмена: доступ живёт до конца оплаченного периода, деньги не трогаем. */
export async function cancelSubscription() {
  const user = await requireUser()

  await db
    .update(subscription)
    .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
    .where(eq(subscription.userId, user.id))
}

export async function resumeSubscription() {
  const user = await requireUser()

  await db
    .update(subscription)
    .set({ cancelAtPeriodEnd: false, updatedAt: new Date() })
    .where(eq(subscription.userId, user.id))
}
