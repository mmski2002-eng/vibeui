import type { CSSProperties } from "react"

export type Pagination004Props = {
  page?: number
  total?: number
  label?: string
  /** Строка счётчика. {label}, {page} и {total} подставляются. */
  countText?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  hrefOf?: (page: number) => string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-pagination-004-bg:transparent;
--vibeui-pagination-004-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-pagination-004-muted:color-mix(in oklab,var(--vibeui-pagination-004-fg) 68%,transparent);
--vibeui-pagination-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-pagination-004-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.82 0.02 265 / 14%));
--vibeui-pagination-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.16 262));
--vibeui-pagination-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-004"]{color-scheme:dark}
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

const LABEL: Record<string, string> = {
  nav: "Навигация по страницам",
  prev: "Назад",
  next: "Вперёд",
}

const COUNT_TEXT = "{label} {page} из {total}"

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
 * Пагинация «назад — счётчик — вперёд» без номеров страниц.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Pagination004({
  page = 4,
  total = 12,
  label = "Страница",
  countText = COUNT_TEXT,
  labelText = LABEL,
  hrefOf = (value: number) => `?page=${value}`,
  background = "",
  accent,
  className,
  style,
}: Pagination004Props) {
  const palette = {
    ...(accent ? { "--vibeui-pagination-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="pagination"
        data-vibeui-block="pagination-004"
        aria-label={labelText.nav ?? LABEL.nav}
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
          {labelText.prev ?? LABEL.prev}
        </a>
        <p data-part="count" aria-current="page">
          {countText.split(/({label}|{page}|{total})/).map((part, index) =>
            part === "{page}" ? (
              <span key={index} data-part="now">
                {page}
              </span>
            ) : part === "{label}" ? (
              label
            ) : part === "{total}" ? (
              String(total)
            ) : (
              part
            ),
          )}
        </p>
        <a
          data-part="step"
          data-dir="next"
          href={last ? undefined : hrefOf(page + 1)}
          aria-disabled={last || undefined}
          rel="next"
        >
          {labelText.next ?? LABEL.next}
          <span data-part="arrow" aria-hidden="true" />
        </a>
      </nav>
    </>
  )
}
