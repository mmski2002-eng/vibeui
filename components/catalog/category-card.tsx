import Link from "next/link"

import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { CategoryCard as Card } from "@/registry/index"

/**
 * Карточка категории на витрине. Обложка — превью настоящего item'а из этой
 * категории, а не картинка: витрина показывает, что внутри, теми же файлами,
 * которые получает пользователь.
 *
 * Обложка неинтерактивна (`inert`): вся карточка — одна ссылка в категорию,
 * и нажатие на кнопку внутри превью должно вести туда же, а не срабатывать.
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
    <article className="bg-shell border-shell-card hover:border-shell-border-strong relative flex h-full w-full flex-col overflow-hidden rounded-xl border p-0.5 shadow-sm shadow-black/5 transition-colors">
      {/* Кадр одной пропорции у всех категорий: обложки берутся у разных
          item'ов, и без общей рамки ряд карточек прыгал бы по высоте. */}
      <div
        data-preview-theme="dark"
        className="border-shell-card bg-shell pointer-events-none relative flex aspect-[16/10] min-w-0 flex-col justify-center overflow-hidden rounded-xl border"
        inert
      >
        {card.coverSlug ? (
          <CatalogThumbnail slug={card.coverSlug} locale={locale} />
        ) : null}
      </div>

      <div className="flex flex-row items-center gap-3 py-2.5 pr-3 pl-4">
        <h3 className="min-w-0 flex-1 truncate text-base font-medium">
          <Link
            href={localePath(locale, `${base}/${card.slug}`)}
            className="text-shell-fg focus-visible:ring-shell-ring rounded-sm after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
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
