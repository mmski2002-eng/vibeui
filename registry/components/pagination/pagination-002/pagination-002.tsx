import type { ComponentProps, CSSProperties } from "react"

export type Pagination002Props = Omit<ComponentProps<"nav">, "children"> & {
  /** Номер первой строки на экране: счёт ведут по строкам, а не по страницам. */
  from?: number
  perPage?: number
  total?: number
  prevHref?: string
  nextHref?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Строка счёта. {range} — диапазон строк, {total} — всего. */
  rangeText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: курсорная навигация для длинных списков. Номеров страниц
// нет намеренно: при постоянно меняющихся данных страница №7 завтра покажет
// другие строки, а «строки 41–60 из 214» остаётся правдой. Край списка
// закрывает недоступную кнопку через aria-disabled на ссылке: убирать её
// нельзя, иначе строка навигации прыгает.
const STYLES = `
:where([data-vibeui-block="pagination-002"]){
--vibeui-pagination-002-bg:transparent;
--vibeui-pagination-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-pagination-002-muted:color-mix(in oklab,var(--vibeui-pagination-002-fg) 68%,transparent);
--vibeui-pagination-002-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-pagination-002-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.82 0 265 / 14%));
--vibeui-pagination-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.16 262));
--vibeui-pagination-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-002"]{color-scheme:dark}
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

const LABEL: Record<string, string> = {
  nav: "Навигация по списку",
  prev: "Назад",
  next: "Вперёд",
}

const RANGE_TEXT = "Строки {range} из {total}"

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
 * Курсорная навигация: диапазон строк вместо номеров страниц.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination002({
  from = 41,
  perPage = 20,
  total = 214,
  prevHref = "#",
  nextHref = "#",
  labelText = LABEL,
  rangeText = RANGE_TEXT,
  background = "",
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
    ...(background
      ? {
          "--vibeui-pagination-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pagination-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="pagination"
        data-vibeui-block="pagination-002"
        aria-label={labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <p data-part="range">
          {rangeText.split(/({range}|{total})/).map((part, index) =>
            part === "{range}" ? (
              <b key={index}>
                {from}–{to}
              </b>
            ) : part === "{total}" ? (
              String(total)
            ) : (
              part
            ),
          )}
        </p>
        <div data-part="side">
          <a
            data-part="step"
            data-dir="prev"
            href={prevHref}
            aria-disabled={atStart || undefined}
          >
            <span data-part="arrow" aria-hidden="true" />
            {labelText.prev ?? LABEL.prev}
          </a>
          <a
            data-part="step"
            data-dir="next"
            href={nextHref}
            aria-disabled={atEnd || undefined}
          >
            {labelText.next ?? LABEL.next}
            <span data-part="arrow" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </>
  )
}
