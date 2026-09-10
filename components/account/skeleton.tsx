import { ACCOUNT_TEXTS } from "@/components/account/texts"
import type { Locale } from "@/lib/i18n"

/**
 * Каркас раздела на время запроса к базе.
 *
 * Форма повторяет реальную раскладку — заголовок, крупная панель, колонка
 * справа: пустой экран со словом «Загружаем» ощущается как сбой, а каркас
 * той же формы читается как продолжение той же страницы.
 */
export function AccountSkeleton({ locale }: { locale: Locale }) {
  const t = ACCOUNT_TEXTS[locale].common

  return (
    <div aria-busy="true" aria-live="polite" className="grid gap-6">
      <span className="sr-only">{t.loading}</span>

      <div className="grid gap-2">
        <Bar className="h-8 w-56" />
        <Bar className="h-4 w-72" />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid content-start gap-6">
          <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
            <Bar className="h-4 w-32" />
            <Bar className="mt-4 h-40 w-full" />
            <div className="mt-4 flex gap-2">
              <Bar className="h-9 w-24" />
              <Bar className="h-9 w-36" />
            </div>
          </div>

          <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
            <Bar className="h-4 w-40" />
            <div className="mt-4 grid gap-2">
              <Bar className="h-10 w-full" />
              <Bar className="h-10 w-full" />
              <Bar className="h-10 w-3/4" />
            </div>
          </div>
        </div>

        <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
          <Bar className="h-4 w-28" />
          <Bar className="mt-3 h-2 w-full" />
          <Bar className="mt-4 h-4 w-36" />
        </div>
      </div>
    </div>
  )
}

function Bar({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`bg-shell-elevated block animate-pulse rounded-md motion-reduce:animate-none ${className}`}
    />
  )
}
