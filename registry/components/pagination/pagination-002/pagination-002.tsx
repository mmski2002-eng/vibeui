import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Pagination002Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  /** Номер первой строки на экране: счёт ведут по строкам, а не по страницам. */
  from?: number
  perPage?: number
  total?: number
  prevHref?: string
  nextHref?: string
  accent?: string
}

// Идея компонента: курсорная навигация для длинных списков. Номеров страниц
// нет намеренно: при постоянно меняющихся данных страница №7 завтра покажет
// другие строки, а «строки 41–60 из 214» остаётся правдой. Край списка
// закрывает недоступную кнопку через aria-disabled на ссылке: убирать её
// нельзя, иначе строка навигации прыгает.
const STYLES = `
:where([data-vibeui-block="pagination-002"]){
--vibeui-pagination-002-bg:oklch(1 0 0);
--vibeui-pagination-002-fg:oklch(0.24 0.014 265);
--vibeui-pagination-002-muted:oklch(0.56 0.014 265);
--vibeui-pagination-002-border:oklch(0.9 0.006 265);
--vibeui-pagination-002-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-002-accent:oklch(0.55 0.2 262);
--vibeui-pagination-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-002"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.5rem 0.625rem;
background:var(--vibeui-pagination-002-bg);
border:1px solid var(--vibeui-pagination-002-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-002-font);color:var(--vibeui-pagination-002-fg);
}
/* Счёт по строкам: он остаётся верным, даже когда данные меняются. */
[data-vibeui-block="pagination-002"] [data-part="range"]{
font-size:0.8125rem;color:var(--vibeui-pagination-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-002"] [data-part="range"] b{color:var(--vibeui-pagination-002-fg);font-weight:650}
[data-vibeui-block="pagination-002"] [data-part="side"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="pagination-002"] [data-part="step"]{
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-pagination-002-border);
color:inherit;text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="pagination-002"] [data-part="step"]:hover{background:var(--vibeui-pagination-002-hover)}
[data-vibeui-block="pagination-002"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-002-accent);outline-offset:2px}
/* Край списка: кнопка остаётся на месте, но не работает — строка не прыгает. */
[data-vibeui-block="pagination-002"] [data-part="step"][aria-disabled="true"]{
color:var(--vibeui-pagination-002-muted);pointer-events:none;opacity:.55;
}
[data-vibeui-block="pagination-002"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
}
[data-vibeui-block="pagination-002"] [data-part="step"][data-dir="prev"] [data-part="arrow"]{transform:rotate(135deg)}
[data-vibeui-block="pagination-002"] [data-part="step"][data-dir="next"] [data-part="arrow"]{transform:rotate(-45deg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Курсорная навигация: диапазон строк вместо номеров страниц.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination002({
  from = 41,
  perPage = 20,
  total = 214,
  prevHref = "#",
  nextHref = "#",
  accent,
  className,
  style,
  ...props
}: Pagination002Props) {
  const to = Math.min(from + perPage - 1, total)
  const atStart = from <= 1
  const atEnd = to >= total

  const palette = {
    ...(accent ? { "--vibeui-pagination-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pagination-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="pagination-002"
        aria-label="Навигация по списку"
        className={className}
        style={palette}
      >
        <p data-part="range">
          Строки{" "}
          <b>
            {from}–{to}
          </b>{" "}
          из {total}
        </p>
        <div data-part="side">
          <a
            data-part="step"
            data-dir="prev"
            href={prevHref}
            aria-disabled={atStart || undefined}
          >
            <span data-part="arrow" aria-hidden="true" />
            Назад
          </a>
          <a
            data-part="step"
            data-dir="next"
            href={nextHref}
            aria-disabled={atEnd || undefined}
          >
            Вперёд
            <span data-part="arrow" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </>
  )
}
