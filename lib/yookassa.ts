import "server-only"

import { randomUUID } from "node:crypto"

/**
 * Клиент ЮKassa. Отдельный SDK не берём: нужны два вызова из всего API, а
 * зависимость пришлось бы держать в актуальном состоянии ради них двоих.
 *
 * Idempotence-Key обязателен на каждом создании платежа: без него повторный
 * запрос после обрыва связи спишет деньги второй раз.
 */
const API = "https://api.yookassa.ru/v3"

type Money = { value: string; currency: "RUB" }

type Payment = {
  id: string
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled"
  paid: boolean
  amount: Money
  payment_method?: { id: string; saved: boolean }
  confirmation?: { confirmation_url?: string }
  metadata?: Record<string, string>
}

function auth() {
  const shop = process.env.YOOKASSA_SHOP_ID
  const secret = process.env.YOOKASSA_SECRET_KEY

  if (!shop || !secret) {
    throw new Error("ЮKassa не настроена: нет YOOKASSA_SHOP_ID или ключа")
  }

  return `Basic ${Buffer.from(`${shop}:${secret}`).toString("base64")}`
}

async function request(body: unknown): Promise<Payment> {
  const response = await fetch(`${API}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
      Authorization: auth(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(
      `ЮKassa ответила ${response.status}: ${await response.text()}`,
    )
  }

  return response.json()
}

/**
 * Текущее состояние платежа по его идентификатору.
 *
 * Нужно администратору: вебхук мог не дойти (сеть, перезапуск сервиса), а
 * деньги при этом списались. Тогда единственный источник правды — сам
 * платёжный сервис, а не наша таблица.
 */
export async function fetchPayment(id: string): Promise<Payment> {
  const response = await fetch(`${API}/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: auth() },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `ЮKassa ответила ${response.status}: ${await response.text()}`,
    )
  }

  return response.json()
}

/**
 * Чек для самозанятого. `vat_code: 1` — без НДС; предмет расчёта — услуга,
 * способ — полная оплата. Адрес покупателя обязателен: чек уходит на него.
 */
function receipt(email: string, description: string, amount: Money) {
  return {
    customer: { email },
    items: [
      {
        description,
        quantity: "1.00",
        amount,
        vat_code: 1,
        payment_mode: "full_payment",
        payment_subject: "service",
      },
    ],
  }
}

/** Первый платёж: уводит человека на страницу подтверждения ЮKassa. */
export async function createCheckout({
  amount,
  description,
  email,
  userId,
  plan,
  returnUrl,
}: {
  amount: string
  description: string
  email: string
  userId: string
  /** Уходит в metadata: по нему вебхук понимает, какой период выдавать. */
  plan: string
  returnUrl: string
}) {
  const money: Money = { value: amount, currency: "RUB" }

  return request({
    amount: money,
    capture: true,
    confirmation: { type: "redirect", return_url: returnUrl },
    description,
    // Без этого не будет автопродления: сохранённый способ оплаты и есть
    // то, чем списывают следующий период.
    save_payment_method: true,
    metadata: { userId, plan },
    receipt: receipt(email, description, money),
  })
}

/** Автосписание по сохранённому способу оплаты: подтверждение не требуется. */
export async function chargeSaved({
  amount,
  description,
  email,
  userId,
  plan,
  paymentMethodId,
}: {
  amount: string
  description: string
  email: string
  userId: string
  plan: string
  paymentMethodId: string
}) {
  const money: Money = { value: amount, currency: "RUB" }

  return request({
    amount: money,
    capture: true,
    payment_method_id: paymentMethodId,
    description,
    metadata: { userId, plan },
    receipt: receipt(email, description, money),
  })
}

/**
 * Диапазоны, из которых ЮKassa шлёт уведомления. Проверка источника — не
 * паранойя: обработчик выдаёт подписку, и подделанный запрос выдал бы её
 * бесплатно.
 */
export const YOOKASSA_NETWORKS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11/32",
  "77.75.156.35/32",
  "77.75.154.128/25",
  "2a02:5180::/32",
]
