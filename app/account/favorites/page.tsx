import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { favorite } from "@/lib/db/schema"
import { getCatalogItem, itemBasePath } from "@/registry/index"
import { getItemKind } from "@/registry/index"
import { requireUser } from "@/lib/session"

export default async function FavoritesPage() {
  const user = await requireUser()
  const rows = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, user.id))
    .orderBy(desc(favorite.createdAt))

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Избранное
      </h1>

      {rows.length === 0 ? (
        <p className="text-shell-muted mt-4 text-sm leading-relaxed">
          Пока пусто. Сердечко на карточке в каталоге кладёт компонент сюда.
        </p>
      ) : (
        <ul className="mt-6 grid gap-2">
          {rows.map((row) => {
            const item = getCatalogItem(row.itemName)
            const kind = getItemKind(row.itemName) ?? "component"

            return (
              <li key={row.itemName}>
                <Link
                  href={`${itemBasePath(kind)}/${row.itemName}`}
                  className="border-shell-border bg-shell-panel hover:border-shell-accent flex items-center justify-between rounded-xl border px-4 py-3 transition-colors"
                >
                  <span className="text-shell-fg text-sm font-medium">
                    {item?.title ?? row.itemName}
                  </span>
                  <span className="text-shell-muted font-mono text-xs">
                    {row.itemName}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
