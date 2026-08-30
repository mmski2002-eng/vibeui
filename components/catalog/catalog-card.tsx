import { CardInteractive } from "@/components/catalog/card-interactive"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { getControls } from "@/lib/controls"
import { localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getItemDocUrl } from "@/lib/site"
import { getCategoryLabel } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

/**
 * Карточка витрины: кадр превью в рамке и узкая строка действий под ним.
 *
 * Оболочка серверная, миниатюра тоже: клиентским становится только то, что
 * держит состояние — подложка, настройка и ссылка, которая это состояние
 * переносит на страницу item'а (см. docs/CONTROLS.md).
 */
export function CatalogCard({
  item,
  locale,
}: {
  item: CatalogItem
  locale: Locale
}) {
  const localized = localizeItem(item, locale)
  const category = localized.categories?.[0]

  return (
    // Ссылка не оборачивает карточку целиком: внутри блока есть свои <a>, а
    // вложенные ссылки — невалидный HTML. Кликабельность даёт растянутый
    // псевдоэлемент заголовка.
    <article className="bg-shell border-shell-border relative flex h-full flex-col overflow-hidden rounded-2xl border p-0.5 shadow-sm shadow-black/5">
      <CardInteractive
        item={localized}
        locale={locale}
        docUrl={getItemDocUrl(localized.name)}
        itemUrl={localePath(locale, `/components/${localized.name}`)}
        title={localized.title ?? localized.name}
        categoryLabel={category ? getCategoryLabel(category) : null}
        configurable={getControls(localized).length > 0}
      >
        <CatalogThumbnail slug={localized.name} />
      </CardInteractive>
    </article>
  )
}
