import type { ComponentProps, CSSProperties } from "react"

export type Chart004Row = {
  label: string
  value: number
}

export type Chart004Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart004Row[]
  unit?: string
  /** Подпись под рейтингом: {unit}. */
  unitLabel?: string
  /** Подпись полосы для скринридера: {label}, {value}, {unit}. */
  rowLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: рейтинг горизонтальными полосами. Длину глаз сравнивает
// точнее, чем высоту и угол, поэтому топ-5 всегда ложится в горизонтальные
// полосы. Числа стоят справа от каждой полосы: без них диаграмма отвечает
// «кто больше», но не «насколько».
//
// Тема берётся из color-scheme окружения через light-dark(): рейтинг темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-004"]){
--vibeui-chart-004-bg:transparent;
--vibeui-chart-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-004-muted:color-mix(in oklab,var(--vibeui-chart-004-fg) 68%,transparent);
--vibeui-chart-004-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-004-track:light-dark(oklch(0.95 0 265),oklch(0.3 0 265));
--vibeui-chart-004-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-chart-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-004"]{color-scheme:dark}
[data-vibeui-block="chart-004"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-004-bg);
border:1px solid var(--vibeui-chart-004-border);border-radius:0.875rem;
color:var(--vibeui-chart-004-fg);font-family:var(--vibeui-chart-004-font);
}
[data-vibeui-block="chart-004"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-004"] ol{display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none}
/* Подпись, полоса и число в одной сетке: колонки не разъезжаются между
   строками, и числа стоят ровным столбцом. */
[data-vibeui-block="chart-004"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;
font-size:0.8125rem;
}
[data-vibeui-block="chart-004"] [data-part="label"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-004"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-004"] [data-part="track"]{
grid-column:1 / -1;height:0.5rem;border-radius:9999px;
background:var(--vibeui-chart-004-track);overflow:hidden;
}
[data-vibeui-block="chart-004"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-chart-004-accent);color:oklch(from var(--vibeui-chart-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Первая строка ярче: лидер должен читаться сразу. */
[data-vibeui-block="chart-004"] li:first-child [data-part="fill"]{background:var(--vibeui-chart-004-accent);color:oklch(from var(--vibeui-chart-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-004"] li:not(:first-child) [data-part="fill"]{
background:color-mix(in oklab,var(--vibeui-chart-004-accent) 55%,var(--vibeui-chart-004-track));
}
[data-vibeui-block="chart-004"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Chart004Row[] = [
  { label: "Каталог", value: 4820 },
  { label: "Главная", value: 3140 },
  { label: "Страница компонента", value: 2260 },
  { label: "Блоки", value: 1180 },
  { label: "Документация", value: 640 },
]

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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Рейтинг горизонтальными полосами: длину глаз сравнивает точнее угла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart004({
  title = "Просмотры за неделю",
  rows = DEFAULT_ROWS,
  unit = "визитов",
  unitLabel = "Единица измерения: {unit}",
  rowLabel = "{label}: {value} {unit}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart004Props) {
  const max = Math.max(...rows.map((row) => row.value), 1)

  const palette = {
    ...(accent ? { "--vibeui-chart-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-004" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-004"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {rows.map((row) => (
            <li key={row.label} data-part="row">
              <span data-part="label">{row.label}</span>
              <span data-part="value">{row.value}</span>
              <span
                data-part="track"
                role="img"
                aria-label={fillTemplate(rowLabel, {
                  label: row.label,
                  value: row.value,
                  unit,
                })}
              >
                <span
                  data-part="fill"
                  style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
                />
              </span>
            </li>
          ))}
        </ol>
        <figcaption data-part="unit">
          {fillTemplate(unitLabel, { unit })}
        </figcaption>
      </figure>
    </>
  )
}
