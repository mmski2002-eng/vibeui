"use server"

import { randomBytes, randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { and, eq, isNull } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite, referral, registryToken, user } from "@/lib/db/schema"
import { isPro } from "@/lib/entitlements"
import { requireUser } from "@/lib/session"
import { hashToken } from "@/lib/token"

/**
 * Обновление страницы в обеих языковых ветках: кабинет живёт по двум
 * адресам, и правка, сделанная из английской версии, обязана быть видна в
 * русской — это один и тот же аккаунт.
 */
function refreshAccount(path: string) {
  revalidatePath(path)
  revalidatePath(`/en${path}`)
}

/**
 * Новый ключ установки. Показывается один раз — дальше в базе только хеш,
 * поэтому утечка дампа не открывает чужую подписку. Старые ключи гасим:
 * несколько живых ключей на аккаунт нужны редко, а путаницы дают много.
 */
export async function createRegistryToken() {
  const user = await requireUser()

  // Право проверяет сервер, а не спрятанная кнопка: серверное действие
  // вызывается по имени, и «не показали в интерфейсе» защитой не является.
  if (!(await isPro(user.id))) {
    throw new Error("Registry token requires an active subscription")
  }

  const token = `vk_${randomBytes(24).toString("base64url")}`

  // Отзыв старого и выпуск нового — одна транзакция: при обрыве посередине
  // человек оставался без единого действующего ключа.
  await db.transaction(async (tx) => {
    await tx
      .update(registryToken)
      .set({ revokedAt: new Date() })
      .where(
        and(eq(registryToken.userId, user.id), isNull(registryToken.revokedAt)),
      )

    await tx.insert(registryToken).values({
      id: randomUUID(),
      userId: user.id,
      tokenHash: hashToken(token),
      prefix: token.slice(0, 11),
    })
  })

  refreshAccount("/account/token")

  return token
}

export async function revokeRegistryToken(id: string) {
  const user = await requireUser()

  await db
    .update(registryToken)
    .set({ revokedAt: new Date() })
    .where(and(eq(registryToken.id, id), eq(registryToken.userId, user.id)))

  refreshAccount("/account/token")
}

/**
 * Явно поставить или снять избранное. Кабинет удаляет карточку и предлагает
 * вернуть её: переключателем «как получится» отмена работала бы наугад —
 * между двумя нажатиями состояние мог изменить соседний таб.
 */
export async function setFavorite(itemName: string, favored: boolean) {
  const user = await requireUser()

  if (favored) {
    await db
      .insert(favorite)
      .values({ userId: user.id, itemName })
      .onConflictDoNothing()
  } else {
    await db
      .delete(favorite)
      .where(and(eq(favorite.userId, user.id), eq(favorite.itemName, itemName)))
  }

  refreshAccount("/account/favorites")
  refreshAccount("/account")

  return favored
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

  refreshAccount("/account/favorites")

  return !existing
}

/**
 * Имя и язык аккаунта. Язык нужен письмам: они уходят из фоновых задач, где
 * ни запроса, ни его заголовков уже нет, — поэтому меняется он здесь, а не
 * переключателем языка в шапке сайта.
 */
export async function updateProfile(input: {
  name?: string
  locale?: "ru" | "en"
}) {
  const current = await requireUser()
  const name = input.name?.trim()

  if (name !== undefined && (name.length === 0 || name.length > 60)) {
    throw new Error("Name must be 1-60 characters")
  }

  await db
    .update(user)
    .set({
      ...(name === undefined ? {} : { name }),
      ...(input.locale ? { locale: input.locale } : {}),
      updatedAt: new Date(),
    })
    .where(eq(user.id, current.id))

  refreshAccount("/account/security")
  refreshAccount("/account")
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
