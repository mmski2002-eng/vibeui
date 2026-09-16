"use server"

import { redirect } from "next/navigation"

import { getPlans } from "@/lib/plan-prices"
import { isPlanId } from "@/lib/plans"
import {
  applyDiscount,
  checkPromo as checkPromoCode,
  isFirstPayment,
  normalizePromo,
  resolvePromo,
  type PromoCheck,
} from "@/lib/promo"
import { SITE_URL } from "@/lib/seo"
import { getSession, requireUser } from "@/lib/session"
import { localePath } from "@/lib/i18n"
import { createCheckout, isYookassaConfigured } from "@/lib/yookassa"

/**
 * Начало оплаты. Платёж создаётся на сервере: цена не должна приходить из
 * браузера, иначе её можно назначить самому. Промокод — тоже только код:
 * скидка считается здесь и уходит в кассу готовой суммой.
 */
export async function startCheckout(formData: FormData) {
  const planId = String(formData.get("plan"))
  const locale = formData.get("locale") === "en" ? "en" : "ru"
  const promoRaw = formData.get("promo")

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

  // Неприменимый код не роняет оплату: платёж идёт по полной цене.
  const promo =
    typeof promoRaw === "string" && normalizePromo(promoRaw)
      ? await resolvePromo(promoRaw)
      : null
  const discounted =
    promo && promo.partnerId !== user.id && (await isFirstPayment(user.id))
      ? promo
      : null
  const amount = discounted
    ? applyDiscount(plan.price, discounted.percent)
    : plan.price

  let url: string | undefined

  try {
    const payment = await createCheckout({
      amount,
      description: discounted
        ? `VibeUI ${plan.title} · промокод ${discounted.code}`
        : `VibeUI ${plan.title}`,
      email: user.email,
      userId: user.id,
      plan: plan.id,
      returnUrl: `${SITE_URL}/account/subscription`,
      metadata: discounted
        ? {
            promo: discounted.code,
            partnerId: discounted.partnerId,
            percent: String(discounted.percent),
            listAmount: plan.price,
          }
        : undefined,
    })

    url = payment.confirmation?.confirmation_url
  } catch (error) {
    console.error("[checkout] касса не ответила", error)
  }

  redirect(url ?? localePath(locale, "/pricing/soon"))
}

/**
 * Проверка промокода с витрины: процент и готовые цены по всем тарифам.
 * Округление живёт в одном месте с кассой, браузер ничего не считает.
 */
export async function checkPromo(code: string): Promise<PromoCheck> {
  const session = await getSession()

  return checkPromoCode(code, await getPlans(), session?.user.id ?? null)
}
