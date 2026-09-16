"use client"

import { usePathname } from "next/navigation"
import { ViewTransition, type ReactNode } from "react"

/**
 * Смена страницы каталога: старая рабочая область гаснет, новая проявляется.
 * Ключ по адресу — при переходе старое дерево размонтируется, новое
 * монтируется, обе стороны получают анимацию. Оболочка вокруг не трогается.
 */
export function CatalogTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <ViewTransition
      key={pathname}
      enter="catalog-page"
      exit="catalog-page"
      default="none"
    >
      <div className="min-w-0">{children}</div>
    </ViewTransition>
  )
}
