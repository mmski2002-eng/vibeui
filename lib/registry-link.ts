import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Подписанные временные ссылки на registry-item. Исходник больше не лежит
 * статикой: панель «Исходник компонента» и команда установки получают адрес
 * с подписью, который живёт сутки. Подпись — HMAC от имени и срока, без базы:
 * проверка на скачивании ничего не стоит, а угадать URL нельзя.
 *
 * Лимит и подписка проверяются один раз — на ВЫДАЧЕ ссылки (см. lib/access).
 * Дальше `npx shadcn add` может дёргать адрес сколько угодно в течение суток.
 */
const TTL_MS = 24 * 60 * 60 * 1000

function secret(): string {
  const value =
    process.env.REGISTRY_LINK_SECRET ?? process.env.BETTER_AUTH_SECRET

  if (!value) {
    throw new Error(
      "REGISTRY_LINK_SECRET (или BETTER_AUTH_SECRET) не задан: нечем подписывать ссылки реестра",
    )
  }

  return value
}

function sign(name: string, exp: number): string {
  return createHmac("sha256", secret())
    .update(`${name}.${exp}`)
    .digest("base64url")
}

export type RegistryLink = { exp: number; sig: string }

/** Свежая подпись на сутки. */
export function signRegistryLink(name: string): RegistryLink {
  const exp = Date.now() + TTL_MS

  return { exp, sig: sign(name, exp) }
}

/** Срок жизни подписи в миллисекундах — для подписи «ссылка действует…». */
export const REGISTRY_LINK_TTL_MS = TTL_MS

/** Подпись верна и не истекла. Сравнение по времени постоянное. */
export function verifyRegistryLink(
  name: string,
  exp: number,
  sig: string | null,
): boolean {
  if (!sig || !Number.isFinite(exp) || exp < Date.now()) {
    return false
  }

  const expected = Buffer.from(sign(name, exp))
  const given = Buffer.from(sig)

  return expected.length === given.length && timingSafeEqual(expected, given)
}
