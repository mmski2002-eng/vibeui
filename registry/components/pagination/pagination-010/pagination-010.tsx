"use client"

import { useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Pagination010Props = {
  page?: number
  total?: number
  siblings?: number
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: при сотнях страниц многоточие обычно тупик — либо статичная
// подпись, либо прыжок фиксированным шагом. Здесь «…» превращается в ползунок:
// его диапазон — ровно скрытый промежуток, а число под ним живёт, пока палец или
// курсор двигают ручку. Переход подтверждается кнопкой, поэтому мышь и клавиатура
// работают одинаково надёжно.
const STYLES = `
:where([data-vibeui-block="pagination-010"]){
--vibeui-pagination-010-bg:transparent;
--vibeui-pagination-010-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-pagination-010-muted:color-mix(in oklab,var(--vibeui-pagination-010-fg) 68%,transparent);
--vibeui-pagination-010-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-pagination-010-track:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-pagination-010-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.82 0 265 / 14%));
--vibeui-pagination-010-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-pagination-010-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-pagination-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-010"]{color-scheme:dark}
[data-vibeui-block="pagination-010"]{
box-sizing:border-box;width:100%;max-width:34rem;padding:0.5rem;
display:flex;align-items:center;justify-content:center;gap:0.25rem;flex-wrap:wrap;
background:var(--vibeui-pagination-010-bg);color:var(--vibeui-pagination-010-fg);
border:1px solid var(--vibeui-pagination-010-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-010-font);
}
[data-vibeui-block="pagination-010"] [data-part="cell"]{
appearance:none;cursor:pointer;
min-width:2rem;height:2rem;padding:0 0.375rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1px solid transparent;border-radius:0.5rem;background:none;
font:inherit;font-size:0.8125rem;color:inherit;
font-variant-numeric:tabular-nums;
transition:background-color .14s ease;
}
[data-vibeui-block="pagination-010"] [data-part="cell"]:hover:not(:disabled){background:var(--vibeui-pagination-010-hover)}
[data-vibeui-block="pagination-010"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-pagination-010-accent);outline-offset:1px}
[data-vibeui-block="pagination-010"] [data-part="cell"]:disabled{color:var(--vibeui-pagination-010-muted);cursor:default;opacity:.55}
[data-vibeui-block="pagination-010"] [data-part="cell"][aria-current="page"]{
background:var(--vibeui-pagination-010-accent);color:var(--vibeui-pagination-010-accent-fg);font-weight:650;
}
[data-vibeui-block="pagination-010"] [data-part="gap"]{
color:var(--vibeui-pagination-010-muted);letter-spacing:0.05em;
}
[data-vibeui-block="pagination-010"] [data-part="scrubber"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.5rem;border:1px dashed var(--vibeui-pagination-010-border);border-radius:0.625rem;
}
[data-vibeui-block="pagination-010"] input[type="range"]{
width:6rem;accent-color:var(--vibeui-pagination-010-accent);
}
[data-vibeui-block="pagination-010"] [data-part="preview"]{
min-width:1.75rem;text-align:center;font-size:0.8125rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-010"] [data-part="go"]{
appearance:none;cursor:pointer;height:1.75rem;padding:0 0.625rem;box-sizing:border-box;
border:0;border-radius:0.5rem;background:var(--vibeui-pagination-010-accent);color:var(--vibeui-pagination-010-accent-fg);
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="pagination-010"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-pagination-010-accent);outline-offset:2px}
[data-vibeui-block="pagination-010"] [data-part="close"]{
appearance:none;cursor:pointer;width:1.5rem;height:1.5rem;border:0;border-radius:0.375rem;
background:none;color:var(--vibeui-pagination-010-muted);font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="pagination-010"] [data-part="close"]:hover{background:var(--vibeui-pagination-010-hover);color:var(--vibeui-pagination-010-fg)}
[data-vibeui-block="pagination-010"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-pagination-010-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-010"] *{animation:none!important;transition:none!important}}
`

const LABEL: Record<string, string> = {
  nav: "Страницы результатов",
  prev: "Предыдущая страница",
  next: "Следующая страница",
  page: "Страница {page}",
  range: "Страница от {from} до {to}",
  showRange: "Показать страницы с {from} по {to}",
  go: "Перейти",
  close: "Закрыть ползунок",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

type Cell =
  | { kind: "page"; value: number }
  | { kind: "gap"; id: string; from: number; to: number }

/** Окно номеров вокруг текущей страницы; разрыв несёт границы скрытого куска. */
function windowOf(page: number, total: number, siblings: number): Cell[] {
  const pages = new Set<number>([1, total])

  for (let step = -siblings; step <= siblings; step += 1) {
    const value = page + step

    if (value >= 1 && value <= total) {
      pages.add(value)
    }
  }

  const sorted = [...pages].sort((left, right) => left - right)
  const result: Cell[] = []

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1]

    if (index > 0 && value - previous > 1) {
      result.push({
        kind: "gap",
        id: `${previous}-${value}`,
        from: previous + 1,
        to: value - 1,
      })
    }

    result.push({ kind: "page", value })
  })

  return result
}

/**
 * Пагинация со свёрткой середины, где «…» открывает ползунок по скрытым номерам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination010({
  page: initialPage = 53,
  total = 240,
  siblings = 1,
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
}: Pagination010Props) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), total))
  const [openGap, setOpenGap] = useState<string | null>(null)
  const [draft, setDraft] = useState(page)

  const palette = {
    ...(accent ? { "--vibeui-pagination-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function openScrubber(cell: Extract<Cell, { kind: "gap" }>) {
    setOpenGap(cell.id)
    setDraft(Math.round((cell.from + cell.to) / 2))
  }

  function commit() {
    setPage(Math.min(Math.max(draft, 1), total))
    setOpenGap(null)
  }

  function onScrubberKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      commit()
    }

    if (event.key === "Escape") {
      setOpenGap(null)
    }
  }

  const cells = windowOf(page, total, siblings)

  return (
    <>
      <style href="vibeui-pagination-010" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="pagination"
        data-vibeui-block="pagination-010"
        aria-label={labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="cell"
          disabled={page === 1}
          aria-label={labelText.prev ?? LABEL.prev}
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          ←
        </button>
        {cells.map((cell) =>
          cell.kind === "page" ? (
            <button
              key={cell.value}
              type="button"
              data-part="cell"
              aria-current={cell.value === page ? "page" : undefined}
              aria-label={(labelText.page ?? LABEL.page).replace(
                "{page}",
                String(cell.value),
              )}
              onClick={() => setPage(cell.value)}
            >
              {cell.value}
            </button>
          ) : openGap === cell.id ? (
            <span key={cell.id} data-part="scrubber">
              <input
                type="range"
                min={cell.from}
                max={cell.to}
                value={draft}
                aria-label={(labelText.range ?? LABEL.range)
                  .replace("{from}", String(cell.from))
                  .replace("{to}", String(cell.to))}
                onChange={(event) => setDraft(Number(event.target.value))}
                onKeyDown={onScrubberKey}
              />
              <output data-part="preview">{draft}</output>
              <button type="button" data-part="go" onClick={commit}>
                {labelText.go ?? LABEL.go}
              </button>
              <button
                type="button"
                data-part="close"
                aria-label={labelText.close ?? LABEL.close}
                onClick={() => setOpenGap(null)}
              >
                ×
              </button>
            </span>
          ) : (
            <button
              key={cell.id}
              type="button"
              data-part="cell"
              data-part-gap="true"
              aria-label={(labelText.showRange ?? LABEL.showRange)
                .replace("{from}", String(cell.from))
                .replace("{to}", String(cell.to))}
              onClick={() => openScrubber(cell)}
            >
              <span data-part="gap">…</span>
            </button>
          ),
        )}
        <button
          type="button"
          data-part="cell"
          disabled={page === total}
          aria-label={labelText.next ?? LABEL.next}
          onClick={() => setPage(Math.min(page + 1, total))}
        >
          →
        </button>
      </nav>
    </>
  )
}
