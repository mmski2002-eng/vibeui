import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type PagerLabels = {
  prev: string
  next: string
  /** «N–M из T». */
  range: (from: number, to: number, total: number) => string
  page: (page: number) => string
}

export const PAGER_LABELS: Record<"ru" | "en", PagerLabels> = {
  ru: {
    prev: "Назад",
    next: "Вперёд",
    range: (from, to, total) => `${from}–${to} из ${total}`,
    page: (page) => `Стр. ${page}`,
  },
  en: {
    prev: "Back",
    next: "Next",
    range: (from, to, total) => `${from}–${to} of ${total}`,
    page: (page) => `Page ${page}`,
  },
}

/**
 * Постраничная навигация для таблиц кабинета: назад, диапазон, вперёд.
 *
 * Смещение (offset), а не курсор: человеку нужно листать взад-вперёд и
 * видеть, где он, а списки кабинета небольшие — перечитывание пропущенных
 * строк здесь не проблема, в отличие от публичного каталога.
 */
export function Pager({
  page,
  hasNext,
  total,
  perPage,
  href,
  labels = PAGER_LABELS.ru,
}: {
  page: number
  hasNext: boolean
  /** Всего строк — для «N–M из T», если известно. */
  total?: number
  perPage: number
  /** Ссылка на страницу с заданным номером (сохраняет фильтры). */
  href: (page: number) => string
  labels?: PagerLabels
}) {
  if (page <= 1 && !hasNext) {
    return total !== undefined && total > 0 ? (
      <p className="text-shell-muted mt-4 text-xs tabular-nums">{total}</p>
    ) : null
  }

  const from = (page - 1) * perPage + 1
  const to = (page - 1) * perPage + perPage

  return (
    <nav className="mt-4 flex items-center justify-between gap-4">
      <PagerLink href={href(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{labels.prev}</span>
      </PagerLink>

      <span className="text-shell-muted text-xs tabular-nums">
        {total !== undefined
          ? labels.range(from, Math.min(to, total), total)
          : labels.page(page)}
      </span>

      <PagerLink href={href(page + 1)} disabled={!hasNext}>
        <span className="sr-only sm:not-sr-only">{labels.next}</span>
        <ChevronRight className="size-4" aria-hidden="true" />
      </PagerLink>
    </nav>
  )
}

/** Номер страницы из query: всё, что не целое ≥ 1, — первая. */
export function pageNumber(raw: string | undefined): number {
  const value = Number(raw)

  return Number.isInteger(value) && value > 1 ? value : 1
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
