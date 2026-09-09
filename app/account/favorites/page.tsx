import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { db } from "@/lib/db"
import { favorite } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

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
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        Отложенные компоненты. Превью живые — это тот самый компонент, который
        поставится в проект.
      </p>

      {rows.length === 0 ? (
        <div className="border-shell-border mt-8 rounded-2xl border border-dashed p-10 text-center">
          <p className="text-shell-fg text-sm">Здесь пока пусто</p>
          <p className="text-shell-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
            Нажмите сердце на карточке в каталоге — компонент отложится сюда, и
            его не придётся искать заново.
          </p>
          <Link
            href="/components"
            className="bg-shell-accent text-shell-accent-fg mt-6 inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            В каталог
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {rows.map((row) => {
            const item = getCatalogItem(row.itemName)
            const kind = getItemKind(row.itemName) ?? "component"

            return (
              <li
                key={row.itemName}
                className="border-shell-card-strong bg-shell overflow-hidden rounded-2xl border"
              >
                <div className="bg-preview-surface flex min-h-40 items-center justify-center">
                  <CatalogThumbnail slug={row.itemName} locale="ru" />
                </div>
                <div className="border-shell-border flex items-baseline justify-between gap-3 border-t px-4 py-3">
                  <Link
                    href={`${itemBasePath(kind)}/${row.itemName}`}
                    className="text-shell-fg hover:text-shell-accent min-w-0 truncate text-sm transition-colors"
                  >
                    {item?.title ?? row.itemName}
                  </Link>
                  <span className="text-shell-muted shrink-0 font-mono text-xs">
                    {row.itemName}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
