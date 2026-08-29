import Link from "next/link"

import { getBlocks, getUsedCategories } from "@/registry/index"

/**
 * Sidebar страницы блока: те же категории, что и в каталоге, но раскрытые
 * до самих блоков — со страницы блока нужен переход к соседнему блоку,
 * а не фильтр. Данные те же, из registry.
 */
export function CatalogBlockNav({ activeSlug }: { activeSlug: string }) {
  const blocks = getBlocks()

  return (
    <nav aria-label="Блоки каталога" className="space-y-5">
      {getUsedCategories().map((category) => (
        <div key={category.slug}>
          <p className="text-shell-muted mb-2 px-3 text-xs font-medium tracking-wide uppercase">
            {category.label}
          </p>
          <ul className="space-y-1">
            {blocks
              .filter((block) => block.categories?.[0] === category.slug)
              .map((block) => (
                <li key={block.name}>
                  <Link
                    href={`/components/${block.name}`}
                    aria-current={
                      block.name === activeSlug ? "page" : undefined
                    }
                    className={
                      "focus-visible:ring-shell-ring block truncate rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                      (block.name === activeSlug
                        ? "bg-shell-elevated text-shell-fg font-medium"
                        : "text-shell-muted hover:text-shell-fg hover:bg-shell-panel")
                    }
                  >
                    {block.title ?? block.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
