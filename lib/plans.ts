/**
 * Тарифы. Цена лежит в коде, а не в базе: планов два, меняются они редко, а
 * админки для них пока нет — заводить таблицу ради двух строк рано.
 */
export const PLANS = {
  monthly: {
    id: "monthly",
    title: "Pro на месяц",
    price: "690.00",
    period: "мес",
    days: 30,
  },
  yearly: {
    id: "yearly",
    title: "Pro на год",
    price: "5900.00",
    period: "год",
    days: 365,
    /** Сколько месяцев экономии — считаем от месячной цены. */
    note: "два месяца в подарок",
  },
} as const

export type PlanId = keyof typeof PLANS

export function isPlanId(value: string): value is PlanId {
  return value in PLANS
}

/** Дни, которые начисляются за приглашение: обоим, но по-разному. */
export const REFERRAL_DAYS = { inviter: 14, invited: 7 }
