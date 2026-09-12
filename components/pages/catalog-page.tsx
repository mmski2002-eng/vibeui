import Link from "next/link"

import { CategoryGrid } from "@/components/catalog/catalog-grid"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import {
  catalogBasePath,
  getCategoryCards,
  getItemsByKind,
} from "@/registry/index"
import type { ItemKind } from "@/registry/categories"

export type CatalogVariant = "home" | "components" | "blocks" | "animations"

const VARIANT_KIND: Record<Exclude<CatalogVariant, "home">, ItemKind> = {
  components: "component",
  blocks: "block",
  animations: "animation",
}

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
  const kind: ItemKind =
    variant === "home" ? "component" : VARIANT_KIND[variant]
  const items = getItemsByKind(kind)
  const categories = getCategoryCards(kind, locale)

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
          {t[variant].title}
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
          {t[variant].description}
        </p>
      </div>
    )

  // Оболочка и меню живут в layout раздела: страница отдаёт только
  // заголовок и сетку. order-2 ставит сетку после мобильной ленты категорий.
  return (
    <>
      {heading}
      <div className="order-2">
        <CategoryGrid
          categories={categories}
          locale={locale}
          base={catalogBasePath(kind)}
        />
      </div>
    </>
  )
}
