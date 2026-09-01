import type { CSSProperties } from "react"

export type Pagination004Props = {
  page?: number
  total?: number
  label?: string
  hrefOf?: (page: number) => string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: самая скромная пагинация — две ссылки и счётчик между ними.
// Номера страниц нужны, когда по ним прыгают; в ленте, которую читают подряд,
// они только шумят. Счётчик набран табличными цифрами и держит фиксированную
// ширину, поэтому ссылки по краям не дёргаются при переходе.
const STYLES = `
:where([data-vibeui-block="pagination-004"]){
--vibeui-pagination-004-bg:oklch(1 0 0);
--vibeui-pagination-004-fg:oklch(0.24 0.014 265);
--vibeui-pagination-004-muted:oklch(0.55 0.014 265);
--vibeui-pagination-004-border:oklch(0.91 0.006 265);
--vibeui-pagination-004-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-004-accent:oklch(0.55 0.2 262);
--vibeui-pagination-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-004"]{
box-sizing:border-box;width:100%;max-width:28rem;padding:0.375rem;
display:flex;align-items:center;gap:0.375rem;
background:var(--vibeui-pagination-004-bg);color:var(--vibeui-pagination-004-fg);
border:1px solid var(--vibeui-pagination-004-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-004-font);
}
[data-vibeui-block="pagination-004"] [data-part="step"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
text-decoration:none;color:inherit;font-size:0.875rem;
border:1px solid var(--vibeui-pagination-004-border);
transition:background-color .14s ease;
}
[data-vibeui-block="pagination-004"] [data-part="step"]:hover{background:var(--vibeui-pagination-004-hover)}
[data-vibeui-block="pagination-004"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-004-accent);outline-offset:2px}
/* Край списка гасится, а не исчезает: пропавшая ссылка сдвинула бы счётчик. */
[data-vibeui-block="pagination-004"] [data-part="step"][aria-disabled="true"]{
color:var(--vibeui-pagination-004-muted);pointer-events:none;opacity:.55;
}
[data-vibeui-block="pagination-004"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;
border:1.5px solid currentColor;border-right:0;border-bottom:0;
transform:rotate(-45deg);
}
[data-vibeui-block="pagination-004"] [data-part="step"][data-dir="next"] [data-part="arrow"]{transform:rotate(135deg)}
[data-vibeui-block="pagination-004"] [data-part="count"]{
flex:1;text-align:center;font-size:0.8125rem;color:var(--vibeui-pagination-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-004"] [data-part="now"]{color:var(--vibeui-pagination-004-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Пагинация «назад — счётчик — вперёд» без номеров страниц.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Pagination004({
  page = 4,
  total = 12,
  label = "Страница",
  hrefOf = (value: number) => `?page=${value}`,
  accent,
  className,
  style,
}: Pagination004Props) {
  const palette = {
    ...(accent ? { "--vibeui-pagination-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const first = page <= 1
  const last = page >= total

  return (
    <>
      <style href="vibeui-pagination-004" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-004"
        aria-label="Навигация по страницам"
        className={className}
        style={palette}
      >
        <a
          data-part="step"
          data-dir="prev"
          href={first ? undefined : hrefOf(page - 1)}
          aria-disabled={first || undefined}
          rel="prev"
        >
          <span data-part="arrow" aria-hidden="true" />
          Назад
        </a>
        <p data-part="count" aria-current="page">
          {label} <span data-part="now">{page}</span> из {total}
        </p>
        <a
          data-part="step"
          data-dir="next"
          href={last ? undefined : hrefOf(page + 1)}
          aria-disabled={last || undefined}
          rel="next"
        >
          Вперёд
          <span data-part="arrow" aria-hidden="true" />
        </a>
      </nav>
    </>
  )
}
