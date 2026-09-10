import "server-only"

import { randomUUID } from "node:crypto"
import { lt } from "drizzle-orm"

import { db } from "@/lib/db"
import { searchQuery } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { getSession } from "@/lib/session"

/** Сколько дней держим запросы. Строка запроса может содержать что угодно —
 *  включая случайно вставленный чужой текст, — поэтому срок короткий. */
export const SEARCH_LOG_DAYS = 180

/**
 * Запомнить запрос и число находок.
 *
 * Пишем только со страницы выдачи: подсказки под полем стреляют на каждое
 * нажатие клавиши, и складывать их в базу — верный способ засорить её
 * обрывками слов. Ошибку записи глотаем: поиск важнее статистики о поиске.
 */
export async function rememberQuery(
  query: string,
  locale: Locale,
  results: number,
) {
  const needle = query.trim().slice(0, 200)

  if (needle.length < 2) return

  try {
    const session = await getSession()

    await db.insert(searchQuery).values({
      id: randomUUID(),
      query: needle,
      locale,
      results,
      userId: session?.user.id ?? null,
    })
  } catch {
    // База недоступна или таблицы ещё нет (миграция не применена) — выдача
    // должна работать в любом случае.
  }
}

/** Чистка старых записей. Вызывается ночным заданием вместе с продлениями. */
export async function pruneSearchLog(days = SEARCH_LOG_DAYS) {
  const edge = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  await db.delete(searchQuery).where(lt(searchQuery.createdAt, edge))
}
