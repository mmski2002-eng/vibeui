/**
 * Тарифы. Цена лежит в коде, а не в базе: планов четыре, меняются они редко,
 * а админки для них пока нет — заводить таблицу ради четырёх строк рано.
 *
 * Энтерпрайз — тот же Pro вдвое дороже плюс респект от создателя. Это
 * шутка витрины, но платёж настоящий: доступ он даёт тот же, что Pro.
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
    /** Против двенадцати месячных платежей: 5900 вместо 8280. */
    note: "на 29 % дешевле помесячной",
  },
  "enterprise-monthly": {
    id: "enterprise-monthly",
    title: "Энтерпрайз на месяц",
    price: "1380.00",
    period: "мес",
    days: 30,
  },
  "enterprise-yearly": {
    id: "enterprise-yearly",
    title: "Энтерпрайз на год",
    price: "11800.00",
    period: "год",
    days: 365,
  },
} as const

export type PlanId = keyof typeof PLANS

export function isPlanId(value: string): value is PlanId {
  return value in PLANS
}

