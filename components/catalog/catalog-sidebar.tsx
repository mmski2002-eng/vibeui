import type { ReactNode } from "react"

import { ScrollArea } from "@/components/catalog/scroll-area"

/**
 * Левая колонка страницы item'а: список соседних items. Прокрутка — своей
 * полосой, как на витрине, чтобы колонки на обеих страницах выглядели
 * одинаково. На мобильном колонки нет.
 */
export function CatalogSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="relative hidden shrink-0 lg:sticky lg:top-14 lg:block lg:w-56 lg:self-start">
      <ScrollArea className="max-h-[calc(100vh-3.5rem)]">
        <aside className="py-8">{children}</aside>
      </ScrollArea>
    </div>
  )
}
