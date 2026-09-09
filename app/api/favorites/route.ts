import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite } from "@/lib/db/schema"
import { getSession } from "@/lib/session"

/**
 * Избранное текущего пользователя одним списком.
 *
 * Каталог статический, поэтому отметки в него не вшить на сборке: страница
 * одна на всех. Витрина запрашивает список один раз при загрузке и
 * расставляет сердца сама — это дешевле, чем делать динамическими полторы
 * тысячи страниц ради одного признака.
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return Response.json({ items: [] })
  }

  const rows = await db
    .select({ itemName: favorite.itemName })
    .from(favorite)
    .where(eq(favorite.userId, session.user.id))

  return Response.json(
    { items: rows.map((row) => row.itemName) },
    { headers: { "cache-control": "private, no-store" } },
  )
}
