import "server-only"

import { headers } from "next/headers"
import { and, eq, isNull } from "drizzle-orm"

import { hashToken } from "@/lib/token"
import { db } from "@/lib/db"
import { registryToken } from "@/lib/db/schema"
import { isPro, spendItem } from "@/lib/entitlements"
import { auth } from "@/lib/auth"
import { isProItem } from "@/registry/index"

export type Access =
  | { allowed: true; pro: boolean; remaining: number }
  | { allowed: false; reason: "pro" | "limit" | "signin" }

/**
 * Кто просит исходник. Сессия — для браузера, Bearer — для shadcn CLI:
 * он ходит по адресу и куки не носит, поэтому у подписчика есть ключ.
 */
async function identify() {
  const requestHeaders = await headers()
  const bearer = requestHeaders.get("authorization")?.replace(/^Bearer\s+/i, "")

  if (bearer) {
    const [row] = await db
      .select({ userId: registryToken.userId, id: registryToken.id })
      .from(registryToken)
      .where(
        and(
          eq(registryToken.tokenHash, hashToken(bearer)),
          isNull(registryToken.revokedAt),
        ),
      )
      .limit(1)

    if (row) {
      // Отметка нужна для диагностики: по ней видно, живой ключ или забытый.
      await db
        .update(registryToken)
        .set({ lastUsedAt: new Date() })
        .where(eq(registryToken.id, row.id))

      return row.userId
    }
  }

  const session = await auth.api.getSession({ headers: requestHeaders })

  return session?.user.id
}

/**
 * Можно ли отдать исходник этого item'а и что после этого осталось.
 * Единая точка для всех трёх каналов раздачи: registry, файл и промпт для
 * агента. Иначе лимит обходится соседней дверью.
 */
export async function resolveAccess(itemName: string): Promise<Access> {
  const userId = await identify()
  const closed = isProItem(itemName)

  // Без аккаунта исходники не отдаются: бесплатный лимит считается на
  // человека, а не на браузер, иначе он обходится очисткой куки.
  if (!userId) {
    return { allowed: false, reason: "signin" }
  }

  const pro = await isPro(userId)

  if (closed && !pro) {
    return { allowed: false, reason: "pro" }
  }

  const spent = await spendItem(userId, itemName)

  if (!spent.allowed) {
    return { allowed: false, reason: "limit" }
  }

  return { allowed: true, pro, remaining: spent.remaining }
}

/** Текст отказа: его читает человек в терминале, поэтому без жаргона. */
export function denialText(reason: "pro" | "limit" | "blocked" | "signin") {
  if (reason === "blocked") {
    return "Доступ к аккаунту закрыт. Напишите нам: https://vibeui.ru/report\n"
  }

  if (reason === "signin") {
    return "Нужен аккаунт: бесплатно и без карты.\nСоздать: https://vibeui.ru/signup\n"
  }

  return reason === "pro"
    ? "Этот компонент входит в подписку Pro.\nОформить: https://vibeui.ru/pricing\n"
    : "Бесплатный лимит на этот месяц исчерпан.\nPro снимает ограничение: https://vibeui.ru/pricing\n"
}
