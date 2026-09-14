"use client"

import { usePathname } from "next/navigation"
import { ViewTransition, type ReactNode } from "react"

/**
 * Смена раздела: старая рабочая область гаснет, новая поднимается.
 *
 * Ключ по адресу: при переходе старое дерево размонтируется (exit), новое
 * монтируется (enter) — и обе стороны получают свою анимацию, а колонка
 * разделов и шапка остаются на месте. Один компонент в layout вместо
 * обёртки в каждой из двадцати страниц.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <ViewTransition
      key={pathname}
      enter="acc-page"
      exit="acc-page"
      default="none"
    >
      <div className="min-w-0">{children}</div>
    </ViewTransition>
  )
}
