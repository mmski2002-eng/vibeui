import Link from "next/link"

import { getCatalogItems, getCatalogNavSections } from "@/registry/index"

/**
 * Sidebar страницы item'а: та же таксономия, что в каталоге, но раскрытая до
 * самих items — отсюда нужен переход к соседнему item'у, а не фильтр.
 * Заголовок типа показывается, только если типов в каталоге больше одного.
 */
export function CatalogItemNav({ activeSlug }: { activeSlug: string }) {
  const items = getCatalogItems()
  const sections = getCatalogNavSections()
  const showKinds = sections.length > 1

  return (
    <nav aria-label="Каталог" className="space-y-5">
      {sections.map((section) => (
        <div key={section.kind} className="space-y-4">
          {showKinds ? (
            <p className="text-shell-fg px-3 text-xs font-semibold tracking-wide uppercase">
              {section.label}
            </p>
          ) : null}

          {section.categories.map((category) => (
            <div key={category.slug}>
              <p className="text-shell-muted mb-2 px-3 text-xs font-medium tracking-wide uppercase">
                {category.label}
              </p>
              <ul className="space-y-1">
                {items
                  .filter((item) => item.categories?.[0] === category.slug)
                  .map((item) => (
                    <li key={item.name}>
                      <Link
                        href={`/components/${item.name}`}
                        aria-current={
                          item.name === activeSlug ? "page" : undefined
                        }
                        className={
                          "focus-visible:ring-shell-ring block truncate rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none " +
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
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}
