import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Pagination001Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  page?: number
  total?: number
  /** Сколько номеров показывать вокруг текущего. */
  siblings?: number
  /** Как собрать адрес страницы. По умолчанию `?page=N`. */
  hrefOf?: (page: number) => string
  accent?: string
}

// Идея компонента: номера — обычные ссылки, а не кнопки с обработчиком.
// Страницу можно открыть в новой вкладке, скопировать и найти в истории,
// поисковик пройдёт по списку. Окно номеров вокруг текущего считается заранее,
// поэтому ширина блока не скачет при переходе.
const STYLES = `
:where([data-vibeui-block="pagination-001"]){
--vibeui-pagination-001-fg:oklch(0.26 0.016 265);
--vibeui-pagination-001-muted:oklch(0.55 0.014 265);
--vibeui-pagination-001-border:oklch(0.9 0.006 265);
--vibeui-pagination-001-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-001-accent:oklch(0.55 0.2 262);
--vibeui-pagination-001-accent-fg:oklch(1 0 0);
--vibeui-pagination-001-size:2.25rem;
--vibeui-pagination-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-001"]{font-family:var(--vibeui-pagination-001-font)}
[data-vibeui-block="pagination-001"] ul{
display:flex;align-items:center;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="pagination-001"] a,
[data-vibeui-block="pagination-001"] [data-part="gap"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:var(--vibeui-pagination-001-size);height:var(--vibeui-pagination-001-size);
padding:0 0.5rem;border-radius:0.5rem;
font-size:0.875rem;line-height:1;text-decoration:none;
color:var(--vibeui-pagination-001-fg);
font-variant-numeric:tabular-nums;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="pagination-001"] a:hover{background:var(--vibeui-pagination-001-hover)}
[data-vibeui-block="pagination-001"] a:focus-visible{outline:2px solid var(--vibeui-pagination-001-accent);outline-offset:2px}
[data-vibeui-block="pagination-001"] [data-part="gap"]{color:var(--vibeui-pagination-001-muted);cursor:default}
[data-vibeui-block="pagination-001"] [aria-current="page"]{
background:var(--vibeui-pagination-001-accent);color:var(--vibeui-pagination-001-accent-fg);font-weight:600;
}
[data-vibeui-block="pagination-001"] [aria-current="page"]:hover{background:var(--vibeui-pagination-001-accent)}
[data-vibeui-block="pagination-001"] [data-part="edge"]{
border:1px solid var(--vibeui-pagination-001-border);color:var(--vibeui-pagination-001-muted);
}
/* Недоступный край остаётся на месте: без него ряд прыгает на первой странице. */
[data-vibeui-block="pagination-001"] [data-part="edge"][aria-disabled="true"]{
opacity:.4;pointer-events:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-001"] *{animation:none!important;transition:none!important}}
`

/** Окно номеров вокруг текущей страницы с краями и разрывами. */
function windowOf(page: number, total: number, siblings: number) {
  const pages = new Set<number>([1, total])

  for (let index = page - siblings; index <= page + siblings; index += 1) {
    if (index >= 1 && index <= total) {
      pages.add(index)
    }
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const result: (number | "gap")[] = []

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push("gap")
    }

    result.push(value)
  })

  return result
}

/**
 * Постраничная навигация ссылками: окно номеров вокруг текущей страницы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination001({
  page = 4,
  total = 12,
  siblings = 1,
  hrefOf = (value) => `?page=${value}`,
  accent,
  className,
  style,
  ...props
}: Pagination001Props) {
  const palette = {
    ...(accent ? { "--vibeui-pagination-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = windowOf(page, total, siblings)

  return (
    <>
      <style href="vibeui-pagination-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="pagination-001"
        aria-label="Страницы"
        className={className}
        style={palette}
      >
        <ul>
          <li>
            <a
              data-part="edge"
              href={hrefOf(Math.max(1, page - 1))}
              aria-disabled={page === 1 || undefined}
              aria-label="Предыдущая страница"
            >
              ←
            </a>
          </li>
          {items.map((item, index) =>
            item === "gap" ? (
              <li key={`gap-${index}`}>
                <span data-part="gap" aria-hidden="true">
                  …
                </span>
              </li>
            ) : (
              <li key={item}>
                <a
                  href={hrefOf(item)}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </a>
              </li>
            ),
          )}
          <li>
            <a
              data-part="edge"
              href={hrefOf(Math.min(total, page + 1))}
              aria-disabled={page === total || undefined}
              aria-label="Следующая страница"
            >
              →
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}
