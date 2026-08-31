import type { CSSProperties } from "react"

export type Commerce005Category = {
  title: string
  count: string
  hint?: string
  hue?: number
  wide?: boolean
}

export type Commerce005Props = {
  title?: string
  lead?: string
  categories?: Commerce005Category[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: витрина категорий мозаикой. Крупная плитка получает два столбца
// не через ручную раскладку, а флагом wide — так порядок можно менять данными,
// не трогая CSS. Число товаров стоит в самой плитке: без него категория —
// просто картинка, и по ней нечего решать. Вся плитка кликабельна растянутой
// ссылкой, а фокус ловит саму плитку, а не заголовок внутри неё.
const STYLES = `
:where([data-vibeui-block="commerce-005"]){
--vibeui-commerce-005-bg:oklch(1 0 0);
--vibeui-commerce-005-fg:oklch(0.22 0.014 265);
--vibeui-commerce-005-muted:oklch(0.55 0.014 265);
--vibeui-commerce-005-border:oklch(0.91 0.006 265);
--vibeui-commerce-005-accent:oklch(0.55 0.2 262);
--vibeui-commerce-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-005"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-005-bg);
font-family:var(--vibeui-commerce-005-sans);color:var(--vibeui-commerce-005-fg);
}
[data-vibeui-block="commerce-005"] *{box-sizing:border-box}
[data-vibeui-block="commerce-005"] h2{margin:0 0 0.25rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="commerce-005"] [data-part="lead"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-commerce-005-muted)}
[data-vibeui-block="commerce-005"] ul{
list-style:none;margin:0;padding:0;
display:grid;grid-template-columns:1fr;gap:0.625rem;
}
@container (min-width: 28rem){[data-vibeui-block="commerce-005"] ul{grid-template-columns:repeat(2,1fr)}}
@container (min-width: 46rem){[data-vibeui-block="commerce-005"] ul{grid-template-columns:repeat(4,1fr)}}
/* Крупная плитка — флаг в данных, а не отдельная раскладка в CSS. */
@container (min-width: 28rem){
[data-vibeui-block="commerce-005"] [data-wide="true"]{grid-column:span 2}
}
[data-vibeui-block="commerce-005"] [data-part="tile"]{
position:relative;display:flex;flex-direction:column;justify-content:flex-end;
min-height:8.5rem;padding:0.75rem;overflow:hidden;
border-radius:0.875rem;border:1px solid var(--vibeui-commerce-005-border);
background:
radial-gradient(120% 100% at 20% 0%, oklch(0.93 0.08 var(--vibeui-commerce-005-hue,262)), transparent 70%),
oklch(0.97 0.02 var(--vibeui-commerce-005-hue,262));
}
[data-vibeui-block="commerce-005"] h3{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.25}
/* Растянутая ссылка: цель — вся плитка, а фокус ловит именно плитка. */
[data-vibeui-block="commerce-005"] h3 a{color:inherit;text-decoration:none}
[data-vibeui-block="commerce-005"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-005"] [data-part="tile"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-005-accent);outline-offset:2px}
[data-vibeui-block="commerce-005"] [data-part="count"]{
margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-005-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-005"] [data-part="hint"]{
margin:0.25rem 0 0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-commerce-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATEGORIES: Commerce005Category[] = [
  {
    title: "Свет",
    count: "128 товаров",
    hint: "Лампы, торшеры, гирлянды",
    hue: 75,
    wide: true,
  },
  { title: "Мебель", count: "94 товара", hue: 152 },
  { title: "Текстиль", count: "212 товаров", hue: 262 },
  { title: "Посуда", count: "76 товаров", hue: 25 },
  { title: "Хранение", count: "58 товаров", hue: 200 },
  { title: "Растения", count: "41 товар", hue: 130 },
]

/**
 * Витрина категорий: мозаика с крупной плиткой по флагу в данных.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce005({
  title = "Категории",
  lead = "Каждая плитка ведёт в подборку — число товаров видно до перехода.",
  categories = DEFAULT_CATEGORIES,
  accent,
  className,
  style,
}: Commerce005Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{lead}</p>
        <ul>
          {categories.map((category) => (
            <li
              key={category.title}
              data-wide={category.wide ? "true" : undefined}
            >
              <article
                data-part="tile"
                style={
                  {
                    "--vibeui-commerce-005-hue": category.hue ?? 262,
                  } as CSSProperties
                }
              >
                <h3>
                  <a href="#">{category.title}</a>
                </h3>
                <p data-part="count">{category.count}</p>
                {category.hint ? <p data-part="hint">{category.hint}</p> : null}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
