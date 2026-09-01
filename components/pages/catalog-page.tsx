import Link from "next/link"

import { CatalogChrome } from "@/components/catalog/catalog-chrome"
import { CategoryGrid } from "@/components/catalog/catalog-grid"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getCategoryCards, getItemsByKind } from "@/registry/index"

export type CatalogVariant = "home" | "components" | "blocks"

/**
 * Витрина верхнего уровня. Показывает не items, а категории: тысяча карточек
 * на одной странице — это витрина, по которой невозможно выбирать, и
 * мегабайты разметки. Внутрь категории ведёт своя страница.
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
  const categories = getCategoryCards(kind)

  const heading =
    variant === "home" ? (
      <div key="heading" className="border-shell-border mb-6 border-b pb-6">
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
          {t.home.counts(items.length, categories.length)}
        </p>
      </div>
    ) : (
      <div key="heading" className="border-shell-border mb-6 border-b pb-6">
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
      <CatalogChrome
        locale={locale}
        kind={kind}
        categories={categories}
        total={items.length}
        active={null}
        heading={heading}
      >
        <CategoryGrid
          categories={categories}
          locale={locale}
          base={kind === "block" ? "/blocks" : "/components"}
        />
      </CatalogChrome>
    </CatalogShell>
  )
}
