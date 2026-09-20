import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Клиент NOWPayments — крипто-оплата на vibeui.club. Отдельного SDK не берём:
 * из всего API нужны создание инвойса и проверка подписи уведомления, ради
 * двух вызовов зависимость держать незачем (как и у ЮKassa).
 *
 * Ключи в окружении: NOWPAYMENTS_API_KEY (создание инвойса) и
 * NOWPAYMENTS_IPN_SECRET (проверка подписи IPN). Без них крипто-оплата
 * выключена — витрина .club живёт бесплатно, как и .ru без ЮKassa.
 */

const API = "https://api.nowpayments.io/v1"

/** Ключи заданы — крипто-платежи можно принимать. */
export function isNowpaymentsConfigured() {
  return Boolean(
    process.env.NOWPAYMENTS_API_KEY && process.env.NOWPAYMENTS_IPN_SECRET,
  )
}

function apiKey() {
  const key = process.env.NOWPAYMENTS_API_KEY

  if (!key) {
    throw new Error("NOWPayments не настроен: нет NOWPAYMENTS_API_KEY")
  }

  return key
}

type Invoice = {
  id: string
  invoice_url: string
  order_id?: string
}

/**
 * Создать инвойс и получить ссылку на hosted-страницу оплаты. Цена — в USD;
 * чем платить (USDC/USDT/ETH на Ethereum или Base) выбирает покупатель на
 * стороне NOWPayments, а нам приходит расчёт в наш payout-кошелёк.
 *
 * `orderId` несёт связь платежа с пользователем и тарифом: webhook разбирает
 * его после проверки подписи, поэтому подделать нельзя.
 */
export async function createInvoice({
  amountUsd,
  orderId,
  orderDescription,
  ipnCallbackUrl,
  successUrl,
  cancelUrl,
}: {
  amountUsd: number
  orderId: string
  orderDescription: string
  ipnCallbackUrl: string
  successUrl: string
  cancelUrl: string
}): Promise<Invoice> {
  const response = await fetch(`${API}/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey(),
    },
    body: JSON.stringify({
      price_amount: amountUsd,
      price_currency: "usd",
      order_id: orderId,
      order_description: orderDescription,
      ipn_callback_url: ipnCallbackUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `NOWPayments ответил ${response.status}: ${await response.text()}`,
    )
  }

  return response.json()
}

/**
 * Текущее состояние платежа по его id — на случай, когда IPN не дошёл. Тот же
 * принцип, что у fetchPayment ЮKassa: правда о деньгах — у платёжного сервиса.
 */
export async function fetchPayment(
  paymentId: string,
): Promise<{ payment_id: string; payment_status: string; order_id?: string }> {
  const response = await fetch(
    `${API}/payment/${encodeURIComponent(paymentId)}`,
    {
      headers: { "x-api-key": apiKey() },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error(
      `NOWPayments ответил ${response.status}: ${await response.text()}`,
    )
  }

  return response.json()
}

/**
 * Рекурсивная сортировка ключей — так NOWPayments считает подпись IPN: они
 * сортируют объект (включая вложенные) и берут HMAC-SHA512 от его JSON. Чтобы
 * подпись сошлась, повторяем ровно тот же порядок.
 */
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortDeep)
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortDeep((value as Record<string, unknown>)[key])

        return result
      }, {})
  }

  return value
}

/**
 * Проверка подписи уведомления. Тело POST-запроса контролирует отправитель,
 * поэтому решение о выдаче Pro принимается только после сверки подписи с
 * нашим IPN-секретом: заголовок `x-nowpayments-sig` должен совпасть с HMAC от
 * отсортированного тела. Сравнение — постоянного времени.
 */
export function verifyIpnSignature(
  body: unknown,
  signature: string | null,
): boolean {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET

  if (!secret || !signature) {
    return false
  }

  const expected = createHmac("sha512", secret)
    .update(JSON.stringify(sortDeep(body)))
    .digest("hex")

  const a = Buffer.from(expected, "hex")
  const b = Buffer.from(signature.trim(), "hex")

  return a.length === b.length && timingSafeEqual(a, b)
}
