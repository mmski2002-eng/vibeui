import { applyPaymentEvent } from "@/lib/payment-apply"
import { YOOKASSA_NETWORKS } from "@/lib/yookassa"

/**
 * Уведомления ЮKassa. Три обязательных свойства обработчика: он проверяет
 * источник, он идемпотентен и он отвечает быстро — иначе ЮKassa будет
 * повторять доставку, а повтор не должен продлевать подписку дважды.
 *
 * Сама обработка живёт в `lib/payment-apply.ts`: тем же кодом администратор
 * применяет событие вручную, когда уведомление до нас не дошло.
 */

function inNetwork(ip: string, cidr: string) {
  const [range, bits] = cidr.split("/")

  // IPv6 сверяем по префиксу строкой: единственная сеть в списке — /32,
  // разбирать полноценную арифметику ради неё незачем.
  if (range.includes(":")) {
    return ip.startsWith(range.replace("::", ""))
  }

  if (ip.includes(":")) {
    return false
  }

  const toInt = (value: string) =>
    value.split(".").reduce((sum, part) => sum * 256 + Number(part), 0)
  const mask = bits === "32" ? -1 : ~((1 << (32 - Number(bits))) - 1)

  return (toInt(ip) & mask) === (toInt(range) & mask)
}

function trusted(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? ""
  const ip = forwarded.split(",")[0]?.trim()

  if (!ip) {
    return false
  }

  return YOOKASSA_NETWORKS.some((network) => inNetwork(ip, network))
}

export async function POST(request: Request) {
  if (!trusted(request)) {
    return new Response("forbidden\n", { status: 403 })
  }

  // Прочие события нам сейчас не нужны, но ответить надо: иначе ЮKassa будет
  // слать их снова.
  await applyPaymentEvent(await request.json())

  return new Response("ok\n")
}
