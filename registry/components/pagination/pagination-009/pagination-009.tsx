import type { CSSProperties } from "react"

export type Pagination009Props = {
  page?: number
  total?: number
  hrefOf?: (page: number) => string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пагинация для телефона. Ряд номеров на узком экране нечитаем
// и в него не попасть пальцем, поэтому здесь три крупные цели: назад, вперёд и
// текущая страница, открывающая сетку всех номеров. Сетка — HTML popover: она
// закрывается по Escape и по касанию мимо без единой строки JS.
const STYLES = `
:where([data-vibeui-block="pagination-009"]){
--vibeui-pagination-009-bg:oklch(1 0 0);
--vibeui-pagination-009-fg:oklch(0.24 0.014 265);
--vibeui-pagination-009-muted:oklch(0.55 0.014 265);
--vibeui-pagination-009-border:oklch(0.91 0.006 265);
--vibeui-pagination-009-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-009-accent:oklch(0.55 0.2 262);
--vibeui-pagination-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-009"]{
box-sizing:border-box;width:100%;max-width:20rem;padding:0.375rem;
display:flex;align-items:center;gap:0.375rem;
background:var(--vibeui-pagination-009-bg);color:var(--vibeui-pagination-009-fg);
border:1px solid var(--vibeui-pagination-009-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-009-font);
anchor-name:--vibeui-pagination-009-bar;
}
/* Цели по 2.75rem: меньше пальцем не попасть, это нижняя граница для касания. */
[data-vibeui-block="pagination-009"] [data-part="step"]{
width:2.75rem;height:2.75rem;flex:none;
display:inline-grid;place-items:center;
border:1px solid var(--vibeui-pagination-009-border);border-radius:0.75rem;
text-decoration:none;color:inherit;
}
[data-vibeui-block="pagination-009"] [data-part="step"]:hover{background:var(--vibeui-pagination-009-hover)}
[data-vibeui-block="pagination-009"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-009-accent);outline-offset:2px}
[data-vibeui-block="pagination-009"] [data-part="step"][aria-disabled="true"]{opacity:.4;pointer-events:none}
[data-vibeui-block="pagination-009"] [data-part="arrow"]{
width:0.5rem;height:0.5rem;
border:1.75px solid currentColor;border-right:0;border-bottom:0;transform:rotate(-45deg);
margin-left:0.1875rem;
}
[data-vibeui-block="pagination-009"] [data-part="step"][data-dir="next"] [data-part="arrow"]{transform:rotate(135deg);margin:0 0.1875rem 0 0}
[data-vibeui-block="pagination-009"] [data-part="current"]{
flex:1;height:2.75rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
border:1px solid var(--vibeui-pagination-009-border);border-radius:0.75rem;
background:none;color:inherit;font:inherit;font-size:0.9375rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-009"] [data-part="current"]:focus-visible{outline:2px solid var(--vibeui-pagination-009-accent);outline-offset:2px}
[data-vibeui-block="pagination-009"] [data-part="of"]{color:var(--vibeui-pagination-009-muted);font-size:0.8125rem}
[data-vibeui-block="pagination-009"] [data-part="sheet"]{
position:fixed;inset:auto;margin:0;
width:min(18rem,92vw);max-height:14rem;overflow-y:auto;
padding:0.5rem;box-sizing:border-box;
background:var(--vibeui-pagination-009-bg);color:var(--vibeui-pagination-009-fg);
border:1px solid var(--vibeui-pagination-009-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-009-font);
box-shadow:0 24px 48px -24px oklch(0.2 0.03 265 / 40%);
}
@supports (anchor-name: --a){
[data-vibeui-block="pagination-009"] [data-part="sheet"]{
position-anchor:--vibeui-pagination-009-bar;
position-area:top span-right;margin-bottom:0.5rem;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="pagination-009"] [data-part="grid"]{
margin:0;padding:0;list-style:none;
display:grid;grid-template-columns:repeat(auto-fill,minmax(2.5rem,1fr));gap:0.25rem;
}
[data-vibeui-block="pagination-009"] [data-part="num"]{
height:2.5rem;display:grid;place-items:center;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-009"] [data-part="num"]:hover{background:var(--vibeui-pagination-009-hover)}
[data-vibeui-block="pagination-009"] [data-part="num"]:focus-visible{outline:2px solid var(--vibeui-pagination-009-accent);outline-offset:-2px}
[data-vibeui-block="pagination-009"] [data-part="num"][aria-current="page"]{
background:var(--vibeui-pagination-009-accent);color:oklch(1 0 0);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Компактная пагинация для телефона: крупные стрелки и сетка номеров.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Pagination009({
  page = 3,
  total = 18,
  hrefOf = (value: number) => `?page=${value}`,
  accent,
  className,
  style,
}: Pagination009Props) {
  const palette = {
    ...(accent ? { "--vibeui-pagination-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  const first = page <= 1
  const last = page >= total

  return (
    <>
      <style href="vibeui-pagination-009" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-009"
        aria-label="Навигация по страницам"
        className={className}
        style={palette}
      >
        <a
          data-part="step"
          data-dir="prev"
          href={first ? undefined : hrefOf(page - 1)}
          aria-disabled={first || undefined}
          aria-label="Предыдущая страница"
          rel="prev"
        >
          <span data-part="arrow" aria-hidden="true" />
        </a>
        <button
          type="button"
          data-part="current"
          aria-haspopup="true"
          popoverTarget="vibeui-pagination-009-sheet"
        >
          {page}
          <span data-part="of">из {total}</span>
        </button>
        <a
          data-part="step"
          data-dir="next"
          href={last ? undefined : hrefOf(page + 1)}
          aria-disabled={last || undefined}
          aria-label="Следующая страница"
          rel="next"
        >
          <span data-part="arrow" aria-hidden="true" />
        </a>
        <div
          id="vibeui-pagination-009-sheet"
          data-part="sheet"
          popover="auto"
          aria-label="Все страницы"
        >
          <ul data-part="grid">
            {Array.from({ length: total }, (unused, index) => index + 1).map(
              (value) => (
                <li key={value}>
                  <a
                    data-part="num"
                    href={hrefOf(value)}
                    aria-current={value === page ? "page" : undefined}
                  >
                    {value}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}
