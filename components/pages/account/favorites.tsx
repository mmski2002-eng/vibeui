import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import {
  FavoritesGrid,
  type FavoriteCard,
} from "@/components/account/favorites-grid"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { db } from "@/lib/db"
import { favorite } from "@/lib/db/schema"
import { localePath, type Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { KINDS } from "@/registry/categories"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Подпись типа: «Компоненты» → «Компонент» в единственном числе не нужен —
 *  фильтр читается как ярлык группы, а не как счётчик. */
function kindLabel(kind: string, locale: Locale) {
  const found = KINDS.find((entry) => entry.slug === kind)

  if (!found) return kind

  return locale === "en"
    ? kind === "block"
      ? "Blocks"
      : kind === "animation"
        ? "Animations"
        : "Components"
    : found.label
}

export async function AccountFavorites({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].favorites

  const rows = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, user.id))
    .orderBy(desc(favorite.createdAt))

  const cards: FavoriteCard[] = rows.map((row) => {
    const item = getCatalogItem(row.itemName)
    const kind = getItemKind(row.itemName) ?? "component"

    return {
      name: row.itemName,
      title: item?.title ?? row.itemName,
      kind,
      kindLabel: kindLabel(kind, locale),
      href: `${itemBasePath(kind)}/${row.itemName}`,
      docUrl: getItemDocUrl(row.itemName),
      // Превью рендерит сервер: это тот же компонент, что и в каталоге, и
      // клиентской панели незачем знать про реестр.
      preview: <CatalogThumbnail slug={row.itemName} locale={locale} />,
    }
  })

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h1>
          <p className="text-shell-muted mt-1.5 max-w-xl text-sm leading-relaxed">
            {t.lead}
          </p>
        </div>
        {rows.length > 0 ? (
          <p className="text-shell-muted text-sm tabular-nums">
            {t.count(rows.length)}
          </p>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="border-shell-border mt-8 rounded-2xl border border-dashed p-10 text-center">
          <p className="text-shell-fg text-sm">{t.empty}</p>
          <p className="text-shell-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
            {t.emptyNote}
          </p>
          <Link
            href={localePath(locale, "/components")}
            className="bg-shell-accent text-shell-accent-fg mt-6 inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            {t.emptyAction}
          </Link>
        </div>
      ) : (
        <FavoritesGrid locale={locale} cards={cards} />
      )}
    </>
  )
}
