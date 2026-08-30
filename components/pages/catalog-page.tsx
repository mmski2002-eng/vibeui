import Link from "next/link"

import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogNav } from "@/components/catalog/catalog-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getCatalogNavSections, getItemsByKind } from "@/registry/index"

export type CatalogVariant = "home" | "components" | "blocks"

/**
 * Каталог. Один компонент на три маршрута: `/` и `/components` показывают
 * компоненты с разными заголовками, `/blocks` — блоки. Языковые версии
 * различаются только словарём и префиксом ссылок.
 */
export function CatalogPage({
  locale,
  variant,
}: {
  locale: Locale
  variant: CatalogVariant
}) {
  const t = getDictionary(locale)
  const kind = variant === "blocks" ? "block" : "component"
  const items = getItemsByKind(kind)
  const sections = getCatalogNavSections(kind)
  const categoryCount = sections.reduce(
    (total, section) => total + section.categories.length,
    0,
  )

  const heading =
    variant === "home" ? (
      <div className="border-shell-border mb-6 border-b pb-6">
        <h1 className="text-shell-fg text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {t.home.title}
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
          {t.home.description}{" "}
          <Link
            href={localePath(locale, "/blocks")}
            className="hover:text-shell-fg underline"
          >
            {t.home.blocksLink}
          </Link>
          .
        </p>
        <p className="text-shell-muted mt-4 text-xs">
          {t.home.counts(items.length, categoryCount)}
        </p>
      </div>
    ) : (
      <div className="border-shell-border mb-6 border-b pb-6">
        <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {variant === "blocks" ? t.blocks.title : t.components.title}
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
          {variant === "blocks"
            ? t.blocks.description
            : t.components.description}
        </p>
      </div>
    )

  return (
    <CatalogShell locale={locale}>
      <CatalogNav
        locale={locale}
        sections={sections}
        total={items.length}
        heading={heading}
      >
        <CatalogGrid items={items} locale={locale} />
      </CatalogNav>
    </CatalogShell>
  )
}
