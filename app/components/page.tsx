import { BlockCard } from "@/components/block-card"
import { CatalogFilter } from "@/components/catalog-filter"
import { SiteHeader } from "@/components/site-header"
import { CATEGORIES } from "@/registry/categories"
import { getBlocks, getUsedCategories } from "@/registry/index"

export const metadata = {
  title: "Каталог",
  description:
    "Каталог AI-native UI-блоков VibeUI: live preview, готовый код и инструкция для AI-агента.",
}

// Правила фильтра выводятся из списка категорий, а не пишутся руками: клиент
// переключает только data-catalog-filter на обёртке.
const FILTER_STYLES = CATEGORIES.map(
  (category) =>
    `[data-catalog-filter="${category.slug}"] li[data-category]:not([data-category="${category.slug}"]){display:none}`,
).join("")

export default function ComponentsPage() {
  const blocks = getBlocks()
  const categories = getUsedCategories()

  return (
    <>
      <SiteHeader />
      <style href="vibeui-catalog-filter" precedence="medium">
        {FILTER_STYLES}
      </style>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Каталог блоков
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
            Готовые секции лендинга. Каждая ставится одной командой, не зависит
            от темы вашего проекта и приходит с инструкцией для AI-агента —
            откройте любой блок и нажмите Copy for AI.
          </p>
        </header>

        <CatalogFilter categories={categories} total={blocks.length}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block) => (
              <li key={block.name} data-category={block.categories?.[0]}>
                <BlockCard block={block} />
              </li>
            ))}
          </ul>
        </CatalogFilter>
      </main>
    </>
  )
}
