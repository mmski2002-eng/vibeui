"use client"

import { useEffect } from "react"
import { RotateCw } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import type { Locale } from "@/lib/i18n"

/**
 * Ошибка раздела. Повтор не уводит человека со страницы: `reset()`
 * перерисовывает тот же сегмент, и настройки соседних панелей остаются.
 */
export function AccountError({
  locale,
  error,
  reset,
}: {
  locale: Locale
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = ACCOUNT_TEXTS[locale].common

  useEffect(() => {
    // Текст ошибки нужен в консоли: в интерфейсе он бесполезен, а без него
    // диагностика превращается в гадание по скриншоту.
    console.error("[account]", error)
  }, [error])

  return (
    <div className="border-shell-border bg-shell-panel rounded-2xl border p-6 sm:p-8">
      <h1 className="text-shell-fg text-lg font-medium">{t.errorTitle}</h1>
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        {t.errorNote}
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-shell-border text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring mt-5 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <RotateCw className="size-4" aria-hidden="true" />
        {t.retry}
      </button>
      {error.digest ? (
        <p className="text-shell-muted mt-4 font-mono text-xs">
          {error.digest}
        </p>
      ) : null}
    </div>
  )
}
