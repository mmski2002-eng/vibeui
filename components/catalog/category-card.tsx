import Link from "next/link"

import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { CategoryCover } from "@/components/catalog/category-cover"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { CategoryCard as Card } from "@/registry/index"

/**
 * Карточка категории на витрине. Обложка — превью настоящего item'а из этой
 * категории, а не картинка: витрина показывает, что внутри, теми же файлами,
 * которые получает пользователь.
 *
 * Обложка живая: анимации внутри неё начинаются от руки, и в мёртвом кадре
 * выглядели бы сломанными. Переход в категорию берёт на себя сам кадр —
 * см. CategoryCover.
 */
export function CategoryCard({
  card,
  locale,
  base,
}: {
  card: Card
  locale: Locale
  base: string
}) {
  const t = getDictionary(locale)

  return (
    <article className="bg-shell border-shell-card hover:border-shell-accent-line relative flex h-full w-full flex-col overflow-hidden rounded-xl border p-0.5 shadow-sm shadow-black/5 transition-colors">
      {/* Кадр одной пропорции у всех категорий: обложки берутся у разных
          item'ов, и без общей рамки ряд карточек прыгал бы по высоте. */}
      <CategoryCover href={localePath(locale, `${base}/${card.slug}`)}>
        {card.coverSlug ? (
          <CatalogThumbnail slug={card.coverSlug} locale={locale} />
        ) : null}
      </CategoryCover>

      <div className="flex flex-row items-center gap-3 py-2.5 pr-3 pl-4">
        <h3 className="min-w-0 flex-1 truncate text-base font-medium">
          <Link
            href={localePath(locale, `${base}/${card.slug}`)}
            className="text-shell-fg focus-visible:ring-shell-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {card.label}
          </Link>
        </h3>
        <span className="text-shell-muted shrink-0 text-xs">
          {t.catalog.count(card.count)}
        </span>
      </div>
    </article>
  )
}
