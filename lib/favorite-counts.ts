import "server-only"

import { count } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite, favoriteSeed } from "@/lib/db/schema"

/** Сколько раз каждый item добавили в избранное: сид плюс живые отметки. */
export async function getFavoriteCounts(): Promise<Record<string, number>> {
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

  return counts
}
