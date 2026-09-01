"use client"

import { useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Pagination010Props = {
  page?: number
  total?: number
  siblings?: number
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
--vibeui-pagination-010-bg:oklch(1 0 0);
--vibeui-pagination-010-fg:oklch(0.24 0.014 265);
--vibeui-pagination-010-muted:oklch(0.55 0.014 265);
--vibeui-pagination-010-border:oklch(0.91 0.006 265);
--vibeui-pagination-010-track:oklch(0.9 0.006 265);
--vibeui-pagination-010-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-010-accent:oklch(0.55 0.2 262);
--vibeui-pagination-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-pagination-010-accent);color:oklch(1 0 0);font-weight:650;
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
border:0;border-radius:0.5rem;background:var(--vibeui-pagination-010-accent);color:oklch(1 0 0);
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
  accent,
  className,
  style,
}: Pagination010Props) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), total))
  const [openGap, setOpenGap] = useState<string | null>(null)
  const [draft, setDraft] = useState(page)

  const palette = {
    ...(accent ? { "--vibeui-pagination-010-accent": accent } : null),
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
        data-vibeui-block="pagination-010"
        aria-label="Страницы результатов"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="cell"
          disabled={page === 1}
          aria-label="Предыдущая страница"
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
              aria-label={`Страница ${cell.value}`}
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
                aria-label={`Страница от ${cell.from} до ${cell.to}`}
                onChange={(event) => setDraft(Number(event.target.value))}
                onKeyDown={onScrubberKey}
              />
              <output data-part="preview">{draft}</output>
              <button type="button" data-part="go" onClick={commit}>
                Перейти
              </button>
              <button
                type="button"
                data-part="close"
                aria-label="Закрыть ползунок"
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
              aria-label={`Показать страницы с ${cell.from} по ${cell.to}`}
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
          aria-label="Следующая страница"
          onClick={() => setPage(Math.min(page + 1, total))}
        >
          →
        </button>
      </nav>
    </>
  )
}
