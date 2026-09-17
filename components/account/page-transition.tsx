"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Смена раздела: меняется только рабочая область, колонка разделов и шапка
 * стоят на месте. Ключ по адресу перезапускает анимацию входа при переходе.
 *
 * Общий view-transition документа здесь не запускаем: его снимок захватывал
 * и колонку разделов, и шапку — всё, что вне именованной границы, — и смена
 * раздела читалась как перезагрузка страницы. Обычная CSS-анимация трогает
 * только правую область.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="acc-page-in min-w-0">
      {children}
    </div>
  )
}
