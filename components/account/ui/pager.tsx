import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Постраничная навигация для админ-таблиц: назад, номер страницы, вперёд.
 *
 * Смещение (offset), а не курсор: администратору нужно листать взад-вперёд и
 * видеть номер страницы, а таблицы пользователей и платежей небольшие —
 * перечитывание пропущенных строк здесь не проблема, в отличие от публичного
 * каталога.
 */
export function Pager({
  page,
  hasNext,
  total,
  perPage,
  href,
}: {
  page: number
  hasNext: boolean
  /** Всего строк — для «N–M из T», если известно. */
  total?: number
  perPage: number
  /** Ссылка на страницу с заданным номером (сохраняет фильтры). */
  href: (page: number) => string
}) {
  if (page <= 1 && !hasNext) {
    return total !== undefined && total > 0 ? (
      <p className="text-shell-muted mt-4 text-xs tabular-nums">
        {total}
      </p>
    ) : null
  }

  const from = (page - 1) * perPage + 1
  const to = (page - 1) * perPage + perPage

  return (
    <nav className="mt-4 flex items-center justify-between gap-4">
      <PagerLink href={href(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Назад</span>
      </PagerLink>

      <span className="text-shell-muted text-xs tabular-nums">
        {total !== undefined
          ? `${from}–${Math.min(to, total)} из ${total}`
          : `Стр. ${page}`}
      </span>

      <PagerLink href={href(page + 1)} disabled={!hasNext}>
        <span className="sr-only sm:not-sr-only">Вперёд</span>
        <ChevronRight className="size-4" aria-hidden="true" />
      </PagerLink>
    </nav>
  )
}

function PagerLink({
  href,
  disabled,
  children,
}: {
  href: string
  disabled?: boolean
  children: React.ReactNode
}) {
  const base =
    "acc-press inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium"

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          base,
          "border-shell-border text-shell-muted pointer-events-none opacity-40",
        )}
      >
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        base,
        "border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated",
      )}
    >
      {children}
    </Link>
  )
}
