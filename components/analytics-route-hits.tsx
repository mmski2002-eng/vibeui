"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    ym?: (id: number, action: string, ...rest: unknown[]) => void
    gtag?: (command: string, ...rest: unknown[]) => void
  }
}

/**
 * Переходы внутри приложения. Обе системы считают просмотр только при
 * загрузке документа, а роутер Next меняет URL без неё — первый хит пропускаем
 * (его отправил сам счётчик), дальше сообщаем о каждом новом адресе.
 */
export function RouteHits({
  metrikaId,
  gaId,
}: {
  metrikaId?: string
  gaId?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = useRef(true)

  useEffect(() => {
    if (initial.current) {
      initial.current = false

      return
    }

    const query = searchParams.toString()
    const url = pathname + (query ? `?${query}` : "")

    if (metrikaId) {
      window.ym?.(Number(metrikaId), "hit", url)
    }

    if (gaId) {
      window.gtag?.("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
      })
    }
  }, [pathname, searchParams, metrikaId, gaId])

  return null
}
