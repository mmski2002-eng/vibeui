import { createHash } from "node:crypto"

/**
 * Хеш ключа установки. В базе лежит только он: утечка дампа не должна
 * открывать чужую подписку.
 *
 * Отдельный модуль, потому что функция нужна и серверным действиям, и
 * проверке доступа, а в файле с "use server" синхронным экспортам не место.
 */
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}
