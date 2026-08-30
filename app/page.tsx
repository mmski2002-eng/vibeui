import Link from "next/link"

import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogNav } from "@/components/catalog/catalog-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getCatalogNavSections, getItemsByKind } from "@/registry/index"

export default function HomePage() {
  const items = getItemsByKind("component")
  const sections = getCatalogNavSections("component")
  const categoryCount = sections.reduce(
    (total, section) => total + section.categories.length,
    0,
  )

  return (
    <CatalogShell>
      <CatalogNav
        sections={sections}
        total={items.length}
        heading={
          <div className="border-shell-border mb-6 border-b pb-6">
            <h1 className="text-shell-fg text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Выбери дизайн. Отдай ИИ. Получи сайт.
            </h1>
            <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
              Библиотека готовых компонентов для вайбкодинга. Открой компонент,
              нажми Copy for AI — агент поставит его из registry, а не
              пересоздаст похожий по описанию. Целые секции страницы — в{" "}
              <Link href="/blocks" className="hover:text-shell-fg underline">
                блоках
              </Link>
              .
            </p>
            <p className="text-shell-muted mt-4 text-xs">
              items: {items.length} · категорий: {categoryCount} · установка
              одной командой
            </p>
          </div>
        }
      >
        <CatalogGrid items={items} />
      </CatalogNav>
    </CatalogShell>
  )
}
