"use server"

import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { subscription } from "@/lib/db/schema"
import { getPlans } from "@/lib/plan-prices"
import { isPlanId } from "@/lib/plans"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"
import { localePath } from "@/lib/i18n"
import { createCheckout, isYookassaConfigured } from "@/lib/yookassa"

/**
 * Начало оплаты. Платёж создаётся на сервере: цена не должна приходить из
 * браузера, иначе её можно назначить самому.
 */
export async function startCheckout(formData: FormData) {
  const planId = String(formData.get("plan"))
  const locale = formData.get("locale") === "en" ? "en" : "ru"

  if (!isPlanId(planId)) {
    throw new Error("Неизвестный тариф")
  }

  // Пока касса не подключена, кнопка «Оплатить» ведёт не на ошибку, а на
  // страницу с объяснением: пользуйтесь бесплатно.
  if (!isYookassaConfigured()) {
    redirect(localePath(locale, "/pricing/soon"))
  }

  const user = await requireUser()
  const plan = (await getPlans())[planId]
  let url: string | undefined

  try {
    const payment = await createCheckout({
      amount: plan.price,
      description: `VibeUI ${plan.title}`,
      email: user.email,
      userId: user.id,
      plan: plan.id,
      returnUrl: `${SITE_URL}/account/subscription`,
    })

    url = payment.confirmation?.confirmation_url
  } catch (error) {
    console.error("[checkout] касса не ответила", error)
  }

  redirect(url ?? localePath(locale, "/pricing/soon"))
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
