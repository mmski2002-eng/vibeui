import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Rating007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  value?: number
  count?: number
  breakdown?: number[]
  accent?: string
}

// Идея компонента: показ средней оценки, а не её ввод. Тут нечего нажимать,
// поэтому нет ни кнопок, ни радиокнопок — только текст и полосы, и компонент
// остаётся серверным. Дробная средняя показана полосой закраски поверх серого
// ряда: округлять 4.7 до пяти звёзд — врать в пользу товара. Рядом разбивка по
// оценкам: средняя 4.5 из двух пятёрок и двух четвёрок и средняя 4.5 из
// пятёрок и единиц — это разные товары, и видно это только по разбивке.
const STYLES = `
:where([data-vibeui-block="rating-007"]){
--vibeui-rating-007-surface:oklch(1 0 0);
--vibeui-rating-007-shell:oklch(0.9 0.006 265);
--vibeui-rating-007-fg:oklch(0.23 0.014 265);
--vibeui-rating-007-muted:oklch(0.55 0.014 265);
--vibeui-rating-007-empty:oklch(0.9 0.008 265);
--vibeui-rating-007-track:oklch(0.94 0.005 265);
--vibeui-rating-007-accent:oklch(0.75 0.16 78);
--vibeui-rating-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-rating-007-fill:0%;
}
/* Своя светлая подложка: карточку оценки показывают поверх любого фона. */
[data-vibeui-block="rating-007"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-rating-007-surface);
border:1px solid var(--vibeui-rating-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-007-font);color:var(--vibeui-rating-007-fg);
}
[data-vibeui-block="rating-007"] [data-part="head"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="rating-007"] [data-part="score"]{
font-size:2.25rem;font-weight:750;line-height:1;letter-spacing:-0.03em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-007"] [data-part="meta"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
/* Дробная средняя — полоса поверх серого ряда: округление врёт в пользу товара. */
[data-vibeui-block="rating-007"] [data-part="stars"]{
position:relative;display:inline-block;font-size:1rem;line-height:1;letter-spacing:0.0625rem;
color:var(--vibeui-rating-007-empty);
}
[data-vibeui-block="rating-007"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;overflow:hidden;white-space:nowrap;
width:var(--vibeui-rating-007-fill);color:var(--vibeui-rating-007-accent);
}
[data-vibeui-block="rating-007"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-rating-007-muted)}
/* Разбивка: одинаковая средняя складывается из очень разных отзывов. */
[data-vibeui-block="rating-007"] [data-part="rows"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="rating-007"] [data-part="row"]{
display:grid;grid-template-columns:1.25rem 1fr 2.25rem;align-items:center;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-rating-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-007"] [data-part="bar"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-rating-007-track);overflow:hidden;
}
[data-vibeui-block="rating-007"] [data-part="bar"] span{display:block;height:100%;background:var(--vibeui-rating-007-accent)}
[data-vibeui-block="rating-007"] [data-part="share"]{text-align:right}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BREAKDOWN = [842, 271, 98, 41, 32]

function reviewsWord(count: number) {
  const tail = count % 10
  const teen = count % 100
  if (teen > 10 && teen < 20) return "отзывов"
  if (tail === 1) return "отзыв"
  if (tail > 1 && tail < 5) return "отзыва"
  return "отзывов"
}

/**
 * Показ средней оценки с числом отзывов и разбивкой по звёздам, только чтение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating007({
  value = 4.7,
  count = 1284,
  breakdown = DEFAULT_BREAKDOWN,
  accent,
  className,
  style,
  ...props
}: Rating007Props) {
  const total = breakdown.reduce((sum, item) => sum + item, 0) || 1

  const palette = {
    "--vibeui-rating-007-fill": `${(value / 5) * 100}%`,
    ...(accent ? { "--vibeui-rating-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="rating-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="score">{value.toString().replace(".", ",")}</span>
          <span data-part="meta">
            <span
              data-part="stars"
              role="img"
              aria-label={`${value} из 5 на основе ${count} отзывов`}
            >
              <span aria-hidden="true">★★★★★</span>
              <span data-part="fill" aria-hidden="true">
                ★★★★★
              </span>
            </span>
            <span data-part="count">
              {count.toLocaleString("ru-RU")} {reviewsWord(count)}
            </span>
          </span>
        </div>
        <div data-part="rows">
          {breakdown.map((amount, index) => {
            const stars = 5 - index
            const share = Math.round((amount / total) * 100)
            return (
              <p key={stars} data-part="row">
                <span>{stars}★</span>
                <span data-part="bar">
                  <span style={{ width: `${share}%` }} />
                </span>
                <span data-part="share">{share}%</span>
              </p>
            )
          })}
        </div>
      </div>
    </>
  )
}
