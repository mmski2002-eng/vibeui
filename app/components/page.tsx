import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogNav } from "@/components/catalog/catalog-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getBlocks, getUsedCategories } from "@/registry/index"

export const metadata = {
  title: "Каталог",
  description:
    "Каталог AI-native UI-блоков VibeUI: live preview, готовый код и инструкция для AI-агента.",
}

export default function ComponentsPage() {
  const blocks = getBlocks()
  const categories = getUsedCategories()

  return (
    <CatalogShell>
      <CatalogNav
        categories={categories}
        total={blocks.length}
        heading={
          <div className="border-shell-border mb-6 border-b pb-6">
            <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
              Каталог блоков
            </h1>
            <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
              Готовые секции лендинга. Каждая ставится одной командой, не
              зависит от темы вашего проекта и приходит с инструкцией для
              AI-агента.
            </p>
          </div>
        }
      >
        <CatalogGrid blocks={blocks} />
      </CatalogNav>
    </CatalogShell>
  )
}
