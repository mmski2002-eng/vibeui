"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination003Props = {
  total?: number
  defaultPage?: number
  siblings?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пагинация, где «…» — не подпись, а кнопка. Свёрнутая середина
// обычно тупик: до тридцатой страницы приходится идти по одной. Здесь многоточие
// перепрыгивает через пропущенный кусок, поэтому длинный список проходится за
// несколько нажатий, а ряд при этом остаётся одной ширины.
const STYLES = `
:where([data-vibeui-block="pagination-003"]){
--vibeui-pagination-003-bg:oklch(1 0 0);
--vibeui-pagination-003-fg:oklch(0.24 0.014 265);
--vibeui-pagination-003-muted:oklch(0.55 0.014 265);
--vibeui-pagination-003-border:oklch(0.91 0.006 265);
--vibeui-pagination-003-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-003-accent:oklch(0.55 0.2 262);
--vibeui-pagination-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-003"]{
box-sizing:border-box;width:100%;max-width:32rem;padding:0.5rem;
display:flex;align-items:center;justify-content:center;gap:0.25rem;flex-wrap:wrap;
background:var(--vibeui-pagination-003-bg);color:var(--vibeui-pagination-003-fg);
border:1px solid var(--vibeui-pagination-003-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-003-font);
}
[data-vibeui-block="pagination-003"] [data-part="cell"]{
appearance:none;cursor:pointer;
min-width:2rem;height:2rem;padding:0 0.375rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1px solid transparent;border-radius:0.5rem;background:none;
font:inherit;font-size:0.8125rem;color:inherit;
font-variant-numeric:tabular-nums;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="pagination-003"] [data-part="cell"]:hover:not(:disabled){background:var(--vibeui-pagination-003-hover)}
[data-vibeui-block="pagination-003"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-pagination-003-accent);outline-offset:1px}
[data-vibeui-block="pagination-003"] [data-part="cell"]:disabled{color:var(--vibeui-pagination-003-muted);cursor:default;opacity:.55}
/* Текущая страница: заливка плюс жирность — цвет один не отличает её от наведения. */
[data-vibeui-block="pagination-003"] [data-part="cell"][aria-current="page"]{
background:var(--vibeui-pagination-003-accent);color:oklch(1 0 0);font-weight:650;
}
/* Многоточие превращается в стрелку прыжка, когда до него дотянулись. */
[data-vibeui-block="pagination-003"] [data-skip="true"]{color:var(--vibeui-pagination-003-muted)}
[data-vibeui-block="pagination-003"] [data-skip="true"] [data-part="jump"]{display:none}
[data-vibeui-block="pagination-003"] [data-skip="true"]:hover [data-part="dots"],
[data-vibeui-block="pagination-003"] [data-skip="true"]:focus-visible [data-part="dots"]{display:none}
[data-vibeui-block="pagination-003"] [data-skip="true"]:hover [data-part="jump"],
[data-vibeui-block="pagination-003"] [data-skip="true"]:focus-visible [data-part="jump"]{display:inline;color:var(--vibeui-pagination-003-accent)}
[data-vibeui-block="pagination-003"] [data-edge="true"]{padding:0 0.625rem;color:var(--vibeui-pagination-003-muted)}
[data-vibeui-block="pagination-003"] [data-edge="true"]:hover:not(:disabled){color:var(--vibeui-pagination-003-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-003"] *{animation:none!important;transition:none!important}}
`

const JUMP = 5

/**
 * Окно номеров вокруг текущей страницы: первая, последняя, соседи и разрывы.
 * Разрыв отмечается нулём — на его месте рисуется кнопка прыжка.
 */
function windowOf(page: number, total: number, siblings: number) {
  const pages = new Set<number>([1, total])

  for (let step = -siblings; step <= siblings; step += 1) {
    const value = page + step

    if (value >= 1 && value <= total) {
      pages.add(value)
    }
  }

  const sorted = [...pages].sort((left, right) => left - right)
  const result: number[] = []

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push(0)
    }

    result.push(value)
  })

  return result
}

/**
 * Пагинация со свёрткой середины, где «…» перепрыгивает через пропущенное.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination003({
  total = 24,
  defaultPage = 7,
  siblings = 1,
  accent,
  className,
  style,
}: Pagination003Props) {
  const [page, setPage] = useState(Math.min(Math.max(defaultPage, 1), total))

  const palette = {
    ...(accent ? { "--vibeui-pagination-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  function go(value: number) {
    setPage(Math.min(Math.max(value, 1), total))
  }

  const cells = windowOf(page, total, siblings)

  return (
    <>
      <style href="vibeui-pagination-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-003"
        aria-label="Страницы результатов"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="cell"
          data-edge="true"
          disabled={page === 1}
          aria-label="Предыдущая страница"
          onClick={() => go(page - 1)}
        >
          ← Назад
        </button>
        {cells.map((value, index) =>
          value === 0 ? (
            <button
              key={`skip-${index}`}
              type="button"
              data-part="cell"
              data-skip="true"
              aria-label={
                index < cells.indexOf(page)
                  ? `Назад на ${JUMP} страниц`
                  : `Вперёд на ${JUMP} страниц`
              }
              onClick={() =>
                go(index < cells.indexOf(page) ? page - JUMP : page + JUMP)
              }
            >
              <span data-part="dots">…</span>
              <span data-part="jump">
                {index < cells.indexOf(page) ? "«" : "»"}
              </span>
            </button>
          ) : (
            <button
              key={value}
              type="button"
              data-part="cell"
              aria-current={value === page ? "page" : undefined}
              aria-label={`Страница ${value}`}
              onClick={() => go(value)}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          data-part="cell"
          data-edge="true"
          disabled={page === total}
          aria-label="Следующая страница"
          onClick={() => go(page + 1)}
        >
          Вперёд →
        </button>
      </nav>
    </>
  )
}
