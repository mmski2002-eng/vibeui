import "server-only"

import { inArray } from "drizzle-orm"

import { db } from "@/lib/db"
import { setting } from "@/lib/db/schema"
import { PLANS, type PlanId } from "@/lib/plans"

/**
 * Цены тарифов с учётом правок администратора. В коде лежат значения по
 * умолчанию, в базе — только переопределения для Pro; энтерпрайз считается
 * от Pro вдвое, как и задумано витриной.
 *
 * Без базы (сборка в CI, где её нет) возвращаются цены из кода: витрина
 * не должна падать из-за настройки.
 */
export const PRICE_KEYS = {
  monthly: "price.monthly",
  yearly: "price.yearly",
} as const

export type Plan = {
  id: PlanId
  title: string
  price: string
  period: string
  days: number
  note?: string
}

export type Plans = Record<PlanId, Plan>

function rubles(value: string | undefined, fallback: string) {
  const amount = Number(value)

  return value && Number.isInteger(amount) && amount > 0 ? `${amount}.00` : fallback
}

export async function getPlans(): Promise<Plans> {
  let rows: { key: string; value: string }[] = []

  try {
    rows = await db
      .select({ key: setting.key, value: setting.value })
      .from(setting)
      .where(inArray(setting.key, Object.values(PRICE_KEYS)))
  } catch {
    return PLANS
  }

  const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  const monthly = rubles(byKey[PRICE_KEYS.monthly], PLANS.monthly.price)
  const yearly = rubles(byKey[PRICE_KEYS.yearly], PLANS.yearly.price)
  const double = (price: string) => `${Number(price) * 2}.00`

  return {
    monthly: { ...PLANS.monthly, price: monthly },
    yearly: { ...PLANS.yearly, price: yearly },
    "enterprise-monthly": { ...PLANS["enterprise-monthly"], price: double(monthly) },
    "enterprise-yearly": { ...PLANS["enterprise-yearly"], price: double(yearly) },
  }
}
