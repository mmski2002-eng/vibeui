import { CardInteractive } from "@/components/catalog/card-interactive"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { getControls } from "@/lib/controls"
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
export function CatalogCard({ item }: { item: CatalogItem }) {
  const category = item.categories?.[0]

  return (
    // Ссылка не оборачивает карточку целиком: внутри блока есть свои <a>, а
    // вложенные ссылки — невалидный HTML. Кликабельность даёт растянутый
    // псевдоэлемент заголовка.
    <article className="bg-shell border-shell-border relative flex h-full flex-col overflow-hidden rounded-2xl border p-0.5 shadow-sm shadow-black/5">
      <CardInteractive
        item={item}
        docUrl={getItemDocUrl(item.name)}
        itemUrl={`/components/${item.name}`}
        title={item.title ?? item.name}
        categoryLabel={category ? getCategoryLabel(category) : null}
        configurable={getControls(item).length > 0}
      >
        <CatalogThumbnail slug={item.name} />
      </CardInteractive>
    </article>
  )
}
