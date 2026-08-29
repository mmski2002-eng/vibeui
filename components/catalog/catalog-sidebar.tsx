import type { ReactNode } from "react"

/**
 * Левая колонка оболочки. Только рамка и sticky-поведение: содержимое
 * задаёт страница — фильтр категорий в каталоге, список блоков на странице
 * блока. На мобильном колонки нет, её роль играет лента над сеткой.
 */
export function CatalogSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden shrink-0 py-8 lg:sticky lg:top-14 lg:block lg:max-h-[calc(100vh-3.5rem)] lg:w-56 lg:self-start lg:overflow-y-auto">
      {children}
    </aside>
  )
}
