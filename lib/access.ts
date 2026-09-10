import "server-only"

import { cookies, headers } from "next/headers"
import { and, eq, isNull } from "drizzle-orm"

import { hashToken } from "@/lib/token"
import { db } from "@/lib/db"
import { registryToken } from "@/lib/db/schema"
import {
  ANON_MONTHLY_LIMIT,
  currentPeriod,
  isPro,
  spendItem,
} from "@/lib/entitlements"
import { auth } from "@/lib/auth"
import { isProItem } from "@/registry/index"

export type Access =
  | { allowed: true; pro: boolean; remaining: number }
  | { allowed: false; reason: "pro" | "limit" }

/** Кука мягкого лимита анонима: месяц и сколько уже взято. */
const ANON_COOKIE = "vibeui_free"

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
 * Мягкий счёт для анонима. Обходится очисткой куки — и это нормально:
 * задача не поймать, а довести до бесплатной регистрации.
 */
async function spendAnonymous() {
  const store = await cookies()
  const period = currentPeriod()
  const raw = store.get(ANON_COOKIE)?.value ?? ""
  const [savedPeriod, savedCount] = raw.split(":")
  const used = savedPeriod === period ? Number(savedCount) || 0 : 0

  if (used >= ANON_MONTHLY_LIMIT) {
    return { allowed: false as const, reason: "limit" as const }
  }

  store.set(ANON_COOKIE, `${period}:${used + 1}`, {
    maxAge: 60 * 60 * 24 * 62,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  })

  return {
    allowed: true as const,
    pro: false,
    remaining: ANON_MONTHLY_LIMIT - used - 1,
  }
}

/**
 * Можно ли отдать исходник этого item'а и что после этого осталось.
 * Единая точка для всех трёх каналов раздачи: registry, файл и промпт для
 * агента. Иначе лимит обходится соседней дверью.
 */
export async function resolveAccess(itemName: string): Promise<Access> {
  const userId = await identify()
  const closed = isProItem(itemName)

  if (!userId) {
    if (closed) {
      return { allowed: false, reason: "pro" }
    }

    return spendAnonymous()
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
export function denialText(reason: "pro" | "limit" | "blocked") {
  if (reason === "blocked") {
    return "Доступ к аккаунту закрыт. Напишите нам: https://vibeui.ru/report\n"
  }

  return reason === "pro"
    ? "Этот компонент входит в подписку Pro.\nОформить: https://vibeui.ru/pricing\n"
    : "Бесплатный лимит на этот месяц исчерпан.\nPro снимает ограничение: https://vibeui.ru/pricing\n"
}
