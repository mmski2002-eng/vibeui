"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination003Props = {
  total?: number
  defaultPage?: number
  siblings?: number
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-pagination-003-bg:transparent;
--vibeui-pagination-003-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-pagination-003-muted:color-mix(in oklab,var(--vibeui-pagination-003-fg) 68%,transparent);
--vibeui-pagination-003-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-pagination-003-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.82 0 265 / 14%));
--vibeui-pagination-003-accent:light-dark(oklch(0.287 0 0),oklch(0.895 0 0));
--vibeui-pagination-003-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-pagination-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-003"]{color-scheme:dark}
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
background:var(--vibeui-pagination-003-accent);color:oklch(from var(--vibeui-pagination-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:650;
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

const LABEL: Record<string, string> = {
  nav: "Страницы результатов",
  prev: "Предыдущая страница",
  next: "Следующая страница",
  prevText: "← Назад",
  nextText: "Вперёд →",
  jumpBack: "Назад на {count} страниц",
  jumpForward: "Вперёд на {count} страниц",
  page: "Страница {page}",
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
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
}: Pagination003Props) {
  const [page, setPage] = useState(Math.min(Math.max(defaultPage, 1), total))

  const palette = {
    ...(accent ? { "--vibeui-pagination-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="pagination"
        data-vibeui-block="pagination-003"
        aria-label={labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="cell"
          data-edge="true"
          disabled={page === 1}
          aria-label={labelText.prev ?? LABEL.prev}
          onClick={() => go(page - 1)}
        >
          {labelText.prevText ?? LABEL.prevText}
        </button>
        {cells.map((value, index) =>
          value === 0 ? (
            <button
              key={`skip-${index}`}
              type="button"
              data-part="cell"
              data-skip="true"
              aria-label={(index < cells.indexOf(page)
                ? (labelText.jumpBack ?? LABEL.jumpBack)
                : (labelText.jumpForward ?? LABEL.jumpForward)
              ).replace("{count}", String(JUMP))}
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
              aria-label={(labelText.page ?? LABEL.page).replace(
                "{page}",
                String(value),
              )}
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
          aria-label={labelText.next ?? LABEL.next}
          onClick={() => go(page + 1)}
        >
          {labelText.nextText ?? LABEL.nextText}
        </button>
      </nav>
    </>
  )
}
