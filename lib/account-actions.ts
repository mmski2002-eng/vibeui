"use server"

import { randomBytes, randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { and, eq, isNull } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite, referral, registryToken } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { hashToken } from "@/lib/token"

/**
 * Новый ключ установки. Показывается один раз — дальше в базе только хеш,
 * поэтому утечка дампа не открывает чужую подписку. Старые ключи гасим:
 * несколько живых ключей на аккаунт нужны редко, а путаницы дают много.
 */
export async function createRegistryToken() {
  const user = await requireUser()
  const token = `vk_${randomBytes(24).toString("base64url")}`

  await db
    .update(registryToken)
    .set({ revokedAt: new Date() })
    .where(
      and(eq(registryToken.userId, user.id), isNull(registryToken.revokedAt)),
    )

  await db.insert(registryToken).values({
    id: randomUUID(),
    userId: user.id,
    tokenHash: hashToken(token),
    prefix: token.slice(0, 11),
  })

  revalidatePath("/account/token")

  return token
}

export async function revokeRegistryToken(id: string) {
  const user = await requireUser()

  await db
    .update(registryToken)
    .set({ revokedAt: new Date() })
    .where(and(eq(registryToken.id, id), eq(registryToken.userId, user.id)))

  revalidatePath("/account/token")
}

export async function toggleFavorite(itemName: string) {
  const user = await requireUser()

  const [existing] = await db
    .select({ itemName: favorite.itemName })
    .from(favorite)
    .where(and(eq(favorite.userId, user.id), eq(favorite.itemName, itemName)))
    .limit(1)

  if (existing) {
    await db
      .delete(favorite)
      .where(and(eq(favorite.userId, user.id), eq(favorite.itemName, itemName)))
  } else {
    await db
      .insert(favorite)
      .values({ userId: user.id, itemName })
      .onConflictDoNothing()
  }

  revalidatePath("/account/favorites")

  return !existing
}

/**
 * Код приглашения. Заводится при первом заходе в раздел, а не при
 * регистрации: большинству он не нужен, а таблица чище.
 */
export async function ensureReferralCode() {
  const user = await requireUser()

  const [existing] = await db
    .select()
    .from(referral)
    .where(eq(referral.userId, user.id))
    .limit(1)

  if (existing) {
    return existing.code
  }

  // Восемь символов из base64url: 48 бит — столкновение практически
  // невозможно, а вставка всё равно защищена первичным ключом.
  const code = randomBytes(6).toString("base64url").slice(0, 8)

  await db.insert(referral).values({ code, userId: user.id })

  return code
}
