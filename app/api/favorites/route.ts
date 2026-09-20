import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite, favoriteSeed } from "@/lib/db/schema"
import { getSession } from "@/lib/session"

/**
 * Избранное текущего пользователя одним списком плюс счётчики по всем
 * пользователям: сколько раз каждый item добавили.
 *
 * Каталог статический, поэтому отметки в него не вшить на сборке: страница
 * одна на всех. Витрина запрашивает список один раз при загрузке и
 * расставляет сердца сама — это дешевле, чем делать динамическими полторы
 * тысячи страниц ради одного признака.
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getSession()

  const [totals, seeds] = await Promise.all([
    db
      .select({ itemName: favorite.itemName, total: count() })
      .from(favorite)
      .groupBy(favorite.itemName),
    db.select().from(favoriteSeed),
  ])

  const counts: Record<string, number> = {}

  for (const row of seeds) counts[row.itemName] = row.likes
  for (const row of totals) {
    counts[row.itemName] = (counts[row.itemName] ?? 0) + row.total
  }

  if (!session) {
    return Response.json(
      { items: [], counts },
      { headers: { "cache-control": "private, no-store" } },
    )
  }

  const rows = await db
    .select({ itemName: favorite.itemName })
    .from(favorite)
    .where(eq(favorite.userId, session.user.id))

  return Response.json(
    { items: rows.map((row) => row.itemName), counts },
    { headers: { "cache-control": "private, no-store" } },
  )
}
