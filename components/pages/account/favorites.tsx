import { desc, eq } from "drizzle-orm"
import { Heart } from "lucide-react"

import {
  FavoritesGrid,
  type FavoriteCard,
} from "@/components/account/favorites-grid"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ButtonLink } from "@/components/account/ui/button"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
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
      <PageHeader
        title={t.title}
        lead={t.lead}
        action={
          rows.length > 0 ? (
            <p className="text-shell-muted text-sm tabular-nums">
              {t.count(rows.length)}
            </p>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          index={1}
          icon={<Heart />}
          title={t.empty}
          note={t.emptyNote}
          action={
            <ButtonLink
              href={localePath(locale, "/components")}
              variant="primary"
            >
              {t.emptyAction}
            </ButtonLink>
          }
        />
      ) : (
        <FavoritesGrid locale={locale} cards={cards} />
      )}
    </>
  )
}
