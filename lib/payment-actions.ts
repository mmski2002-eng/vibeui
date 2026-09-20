"use server"

import { redirect } from "next/navigation"

import { getPlans } from "@/lib/plan-prices"
import { isPlanId, PLAN_USD, PLANS } from "@/lib/plans"
import { createInvoice, isNowpaymentsConfigured } from "@/lib/nowpayments"
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

/** Домен крипто-оплаты. Ссылки инвойса и IPN обязаны вести на vibeui.club. */
const CLUB_URL = "https://vibeui.club"

/** Описание тарифа в инвойсе NOWPayments — по-английски: платит .club. */
const CRYPTO_DESCRIPTION: Record<string, string> = {
  monthly: "VibeUI PRO — 1 month",
  yearly: "VibeUI PRO — 1 year",
  "enterprise-monthly": "VibeUI Enterprise — 1 month",
  "enterprise-yearly": "VibeUI Enterprise — 1 year",
}

/**
 * Начало крипто-оплаты (vibeui.club). Цена — в долларах из кода, не из
 * браузера. `order_id` = `<userId>:<planId>`: по нему webhook после проверки
 * подписи понимает, кому и какой период выдать. Уводит на hosted-страницу
 * NOWPayments; чем платить (USDC/USDT/ETH), человек выбирает уже там.
 */
export async function startCryptoCheckout(formData: FormData) {
  const planId = String(formData.get("plan"))

  if (!isPlanId(planId)) {
    throw new Error("Неизвестный тариф")
  }

  // Крипто-касса не подключена — не роняем кнопку, возвращаем на тарифы.
  if (!isNowpaymentsConfigured()) {
    redirect("/en/pricing")
  }

  const user = await requireUser("en")
  const plan = PLANS[planId]

  let url: string | undefined

  try {
    const invoice = await createInvoice({
      amountUsd: PLAN_USD[planId],
      orderId: `${user.id}:${planId}`,
      orderDescription: CRYPTO_DESCRIPTION[planId] ?? `VibeUI ${plan.id}`,
      ipnCallbackUrl: `${CLUB_URL}/api/payments/nowpayments/webhook`,
      successUrl: `${CLUB_URL}/en/account/subscription`,
      cancelUrl: `${CLUB_URL}/en/pricing`,
    })

    url = invoice.invoice_url
  } catch (error) {
    console.error("[crypto] NOWPayments не ответил", error)
  }

  redirect(url ?? "/en/pricing")
}

/**
 * Проверка промокода с витрины: процент и готовые цены по всем тарифам.
 * Округление живёт в одном месте с кассой, браузер ничего не считает.
 */
export async function checkPromo(code: string): Promise<PromoCheck> {
  const session = await getSession()

  return checkPromoCode(code, await getPlans(), session?.user.id ?? null)
}
