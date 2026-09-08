import Link from "next/link"
import { notFound } from "next/navigation"

import { CatalogChrome } from "@/components/catalog/catalog-chrome"
import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { JsonLd } from "@/components/json-ld"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { breadcrumbs } from "@/lib/seo"
import type { ItemKind } from "@/registry/categories"
import {
  catalogBasePath,
  getCategoryCards,
  getCategoryLabel,
  getItemsByCategory,
  getItemsByKind,
  isWideCategory,
} from "@/registry/index"

/**
 * Страница категории: все items одного типа секции. Сюда ведут карточки с
 * витрины и список слева.
 */
export function CategoryPage({
  locale,
  kind,
  category,
}: {
  locale: Locale
  kind: ItemKind
  category: string
}) {
  const items = getItemsByCategory(kind, category)

  if (items.length === 0) {
    notFound()
  }

  const t = getDictionary(locale)
  const categories = getCategoryCards(kind, locale)
  const base = catalogBasePath(kind)
  const rootLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.topbar.components
  const label = getCategoryLabel(category, locale)

  const heading = (
    <div key="heading" className="border-shell-border mb-6 border-b pb-6">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="text-shell-muted flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href={localePath(locale, base)}
              className="hover:text-shell-fg"
            >
              {rootLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-shell-fg font-medium">{label}</li>
        </ol>
      </nav>

      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {label}
      </h1>
      <p className="text-shell-muted mt-2 text-sm">
        {t.catalog.count(items.length)}
      </p>
    </div>
  )

  return (
    <CatalogShell locale={locale}>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: rootLabel, path: base },
          { name: label, path: `${base}/${category}` },
        ])}
      />
      <CatalogChrome
        locale={locale}
        kind={kind}
        categories={categories}
        total={getItemsByKind(kind).length}
        active={category}
        heading={heading}
      >
        <CatalogGrid
          items={items}
          locale={locale}
          single={kind === "block" || isWideCategory(category)}
        />
      </CatalogChrome>
    </CatalogShell>
  )
}
