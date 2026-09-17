import "server-only"

import { cookies } from "next/headers"
import { and, count, eq, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { partnerInvite, payment, setting } from "@/lib/db/schema"
import { resolveCode } from "@/lib/partners"
import type { Plans } from "@/lib/plan-prices"
import type { PlanId } from "@/lib/plans"
import type { PromoCheck } from "@/lib/promo.shared"

export type { PromoCheck, PromoFailure } from "@/lib/promo.shared"

/**
 * Промокоды блогеров.
 *
 * Код — ник партнёра, живёт в `partner_invite` рядом с признаком партнёра.
 * Скидка одна на всех (`promo.percent` в настройках) с переопределением у
 * конкретного блогера, действует только на первый платёж и считается здесь,
 * на сервере: браузер присылает только код.
 */

export const PROMO_PERCENT_KEY = "promo.percent"
export const DEFAULT_PROMO_PERCENT = 30

/**
 * Комиссия блогера: доля от собранной по его коду суммы, которую он
 * зарабатывает. Отдельна от скидки покупателю (`promo.percent`): та уменьшает
 * цену, эта — вознаграждение партнёра. Считается на первый платёж, потому что
 * только он несёт `partner_id`.
 */
export const COMMISSION_PERCENT_KEY = "commission.percent"
export const DEFAULT_COMMISSION_PERCENT = 30

export async function commissionPercent(): Promise<number> {
  try {
    const [row] = await db
      .select({ value: setting.value })
      .from(setting)
      .where(eq(setting.key, COMMISSION_PERCENT_KEY))
      .limit(1)
    const percent = Number(row?.value)

    return isPromoPercent(percent) ? percent : DEFAULT_COMMISSION_PERCENT
  } catch {
    return DEFAULT_COMMISSION_PERCENT
  }
}

/** Ник: латиница, цифры, «-» и «_», от 3 до 24 символов. Хранится в нижнем. */
const CODE = /^[a-z0-9][a-z0-9_-]{2,23}$/

export function normalizePromo(raw: string | null | undefined): string | null {
  const code = (raw ?? "").trim().toLowerCase()

  return CODE.test(code) ? code : null
}

/** Процент допустим от 1 до 90: нулевая скидка — это отсутствие кода. */
export function isPromoPercent(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 90
}

export async function defaultPromoPercent(): Promise<number> {
  try {
    const [row] = await db
      .select({ value: setting.value })
      .from(setting)
      .where(eq(setting.key, PROMO_PERCENT_KEY))
      .limit(1)
    const percent = Number(row?.value)

    return isPromoPercent(percent) ? percent : DEFAULT_PROMO_PERCENT
  } catch {
    return DEFAULT_PROMO_PERCENT
  }
}

/**
 * Цена со скидкой, рублями без копеек, в формате кассы `"NNNN.00"`.
 *
 * Итог прилипает к «…90», как все цены витрины: от 690 ни один целый
 * процент не даёт круглой цены, а 490 читается как цена, а не как остаток
 * от вычитания. Одна функция и для витрины, и для кассы — чек совпадает с
 * тем, что человек видел.
 */
export function applyDiscount(price: string, percent: number): string {
  const list = Math.round(Number(price))

  if (!isPromoPercent(percent) || !Number.isFinite(list) || list <= 0) {
    return price
  }

  const target = (list * (100 - percent)) / 100
  const snapped = Math.max(90, Math.round(target / 100) * 100 - 10)
  const discounted = snapped < list ? snapped : list

  return `${discounted}.00`
}

export function promoPrices(
  plans: Plans,
  percent: number,
): Record<PlanId, string> {
  return {
    monthly: applyDiscount(plans.monthly.price, percent),
    yearly: applyDiscount(plans.yearly.price, percent),
    "enterprise-monthly": applyDiscount(
      plans["enterprise-monthly"].price,
      percent,
    ),
    "enterprise-yearly": applyDiscount(
      plans["enterprise-yearly"].price,
      percent,
    ),
  }
}

export type ResolvedPromo = {
  code: string
  inviteId: string
  partnerId: string
  percent: number
}

/**
 * Что стоит за кодом: действующий промокод партнёра, который уже
 * зарегистрировался. Отключённый код и код незанятого приглашения — null,
 * без различия для внешнего мира.
 */
export async function resolvePromo(raw: string): Promise<ResolvedPromo | null> {
  const code = normalizePromo(raw)

  if (!code) return null

  const [row] = await db
    .select({
      inviteId: partnerInvite.id,
      partnerId: partnerInvite.claimedBy,
      percent: partnerInvite.promoPercent,
      active: partnerInvite.promoActive,
    })
    .from(partnerInvite)
    .where(eq(partnerInvite.promoCode, code))
    .limit(1)

  if (!row || !row.active || !row.partnerId) return null

  const percent =
    row.percent !== null && isPromoPercent(row.percent)
      ? row.percent
      : await defaultPromoPercent()

  return { code, inviteId: row.inviteId, partnerId: row.partnerId, percent }
}

/** Первый платёж — ни одного успешного до сих пор. */
export async function isFirstPayment(userId: string): Promise<boolean> {
  const [row] = await db
    .select({ value: count() })
    .from(payment)
    .where(and(eq(payment.userId, userId), eq(payment.status, "succeeded")))

  return (row?.value ?? 0) === 0
}

/**
 * Проверка кода для витрины и кассы. Без пользователя (аноним) проверяется
 * только сам код: свой код и первый платёж известны лишь после входа.
 */
export async function checkPromo(
  raw: string,
  plans: Plans,
  userId: string | null,
): Promise<PromoCheck> {
  if (!normalizePromo(raw)) return { ok: false, reason: "invalid" }

  const promo = await resolvePromo(raw)

  if (!promo) return { ok: false, reason: "not_found" }
  if (userId && promo.partnerId === userId) return { ok: false, reason: "own" }
  if (userId && !(await isFirstPayment(userId))) {
    return { ok: false, reason: "not_first" }
  }

  const prices = promoPrices(plans, promo.percent)

  return {
    ok: true,
    code: promo.code,
    percent: promo.percent,
    prices: {
      monthly: Number(prices.monthly),
      yearly: Number(prices.yearly),
      "enterprise-monthly": Number(prices["enterprise-monthly"]),
      "enterprise-yearly": Number(prices["enterprise-yearly"]),
    },
  }
}

/**
 * Код партнёра из куки `/i/<код>`: человек пришёл по ссылке блогера, и
 * промокод ему подставляется сам. Нет куки, нет партнёра или код выключен —
 * null, поле остаётся пустым.
 */
export async function promoFromReferralCookie(): Promise<string | null> {
  const ref = (await cookies()).get("vibeui_ref")?.value

  if (!ref) return null

  const resolved = await resolveCode(ref)

  if (resolved?.kind !== "referral") return null

  const promo = await partnerPromo(resolved.partnerId)

  return promo?.active && promo.code ? promo.code : null
}

/** Промокод партнёра для его кабинета и админки. */
export async function partnerPromo(partnerId: string) {
  const [row] = await db
    .select({
      code: partnerInvite.promoCode,
      percent: partnerInvite.promoPercent,
      active: partnerInvite.promoActive,
    })
    .from(partnerInvite)
    .where(eq(partnerInvite.claimedBy, partnerId))
    .limit(1)

  if (!row) return null

  return {
    code: row.code,
    active: row.active,
    percent:
      row.percent !== null && isPromoPercent(row.percent)
        ? row.percent
        : await defaultPromoPercent(),
    custom: row.percent !== null,
  }
}

/**
 * Оплаты по промокоду партнёра: сколько, на какую сумму, сколько скидок и
 * заработанная комиссия (доля партнёра от собранной суммы).
 */
export async function promoStats(partnerId: string) {
  const [row] = await db
    .select({
      payments: count(),
      revenue: sql<string>`coalesce(sum(${payment.amount}::numeric), 0)`,
      discount: sql<string>`coalesce(sum(coalesce(${payment.listAmount}::numeric, ${payment.amount}::numeric) - ${payment.amount}::numeric), 0)`,
    })
    .from(payment)
    .where(
      and(eq(payment.partnerId, partnerId), eq(payment.status, "succeeded")),
    )

  const revenue = Number(row?.revenue ?? 0)
  const percent = await commissionPercent()

  return {
    payments: Number(row?.payments ?? 0),
    revenue,
    discount: Number(row?.discount ?? 0),
    commissionPercent: percent,
    commission: Math.round((revenue * percent) / 100),
  }
}
