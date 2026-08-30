import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart004Row = {
  label: string
  value: number
}

export type Chart004Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart004Row[]
  unit?: string
  accent?: string
}

// Идея компонента: рейтинг горизонтальными полосами. Длину глаз сравнивает
// точнее, чем высоту и угол, поэтому топ-5 всегда ложится в горизонтальные
// полосы. Числа стоят справа от каждой полосы: без них диаграмма отвечает
// «кто больше», но не «насколько».
const STYLES = `
:where([data-vibeui-block="chart-004"]){
--vibeui-chart-004-bg:oklch(1 0 0);
--vibeui-chart-004-fg:oklch(0.22 0.014 265);
--vibeui-chart-004-muted:oklch(0.56 0.014 265);
--vibeui-chart-004-border:oklch(0.91 0.006 265);
--vibeui-chart-004-track:oklch(0.95 0.004 265);
--vibeui-chart-004-accent:oklch(0.55 0.17 265);
--vibeui-chart-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-chart-004-accent);
}
/* Первая строка ярче: лидер должен читаться сразу. */
[data-vibeui-block="chart-004"] li:first-child [data-part="fill"]{background:var(--vibeui-chart-004-accent)}
[data-vibeui-block="chart-004"] li:not(:first-child) [data-part="fill"]{
background:color-mix(in oklab,var(--vibeui-chart-004-accent) 55%,oklch(0.9 0.01 265));
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
 * Рейтинг горизонтальными полосами: длину глаз сравнивает точнее угла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart004({
  title = "Просмотры за неделю",
  rows = DEFAULT_ROWS,
  unit = "визитов",
  accent,
  className,
  style,
  ...props
}: Chart004Props) {
  const max = Math.max(...rows.map((row) => row.value), 1)

  const palette = {
    ...(accent ? { "--vibeui-chart-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-004" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
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
                aria-label={`${row.label}: ${row.value} ${unit}`}
              >
                <span
                  data-part="fill"
                  style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
                />
              </span>
            </li>
          ))}
        </ol>
        <figcaption data-part="unit">Единица измерения: {unit}</figcaption>
      </figure>
    </>
  )
}
