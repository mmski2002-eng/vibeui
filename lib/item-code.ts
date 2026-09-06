import { ITEM_CODES } from "@/registry/item-codes"

/**
 * Человеческий идентификатор item'а: avatar-001 → AV001. Двухбуквенный код
 * закреплён за префиксом в `registry/item-codes.ts`; для незнакомого префикса
 * берутся его первые две буквы — витрина не должна падать из-за нового
 * каталога, у которого ещё не прогнали `npm run codes`.
 */
export function itemCode(name: string): string {
  const match = /^(.*?)-(\d+)$/.exec(name)
  const prefix = match ? match[1] : name
  const number = match ? match[2] : ""

  return `${ITEM_CODES[prefix] ?? prefix.slice(0, 2).toUpperCase()}${number}`
}
