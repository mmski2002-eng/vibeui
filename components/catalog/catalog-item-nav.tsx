import Link from "next/link"

import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import {
  catalogBasePath,
  getCatalogItem,
  getCatalogItems,
  getCategoryLabel,
  getItemKind,
  itemBasePath,
} from "@/registry/index"

const LINK =
  "focus-visible:ring-shell-ring block truncate rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none "

/**
 * Sidebar страницы item'а: соседи по категории и выход обратно в каталог.
 *
 * Раньше здесь лежала вся таксономия, раскрытая до items: 1201 ссылка на
 * каждой странице, 330 КБ разметки и столько же во flight-пейлоаде. Соседи
 * нужны — весь каталог нет: за ним есть страница категории и витрина, и
 * ссылки на них дешевле, чем список из тысячи items, который всё равно
 * прокручивают мимо.
 */
export function CatalogItemNav({
  activeSlug,
  locale,
}: {
  activeSlug: string
  locale: Locale
}) {
  const t = getDictionary(locale)
  const category = getCatalogItem(activeSlug)?.categories?.[0]

  if (!category) {
    return null
  }

  const kind = getItemKind(activeSlug) ?? "component"
  const base = itemBasePath(kind)
  const rootLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.components.title

  const items = getCatalogItems()
    .filter((item) => item.categories?.[0] === category)
    .map((item) => localizeItem(item, locale))

  return (
    <nav aria-label={t.nav.heading} className="space-y-4">
      <Link
        href={localePath(locale, `${base}/${category}`)}
        className="text-shell-muted hover:text-shell-fg focus-visible:ring-shell-ring block rounded-sm px-3 text-xs font-medium tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {getCategoryLabel(category, locale)}
      </Link>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={localePath(locale, `${base}/${item.name}`)}
              aria-current={item.name === activeSlug ? "page" : undefined}
              className={
                LINK +
                (item.name === activeSlug
                  ? "bg-shell-elevated text-shell-fg font-medium"
                  : "text-shell-muted hover:text-shell-fg hover:bg-shell-panel")
              }
            >
              {item.title ?? item.name}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={localePath(locale, catalogBasePath(kind))}
        className={`${LINK}border-shell-border text-shell-muted hover:text-shell-fg hover:bg-shell-panel mt-1 border-t pt-3`}
      >
        {t.nav.all} · {rootLabel}
      </Link>
    </nav>
  )
}
