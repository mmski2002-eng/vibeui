import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart016Row = {
  label: string
  fact: number
  plan: number
}

export type Chart016Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart016Row[]
  unit?: string
  scaleMax?: number
  accent?: string
}

// Идея компонента: bullet-график «план против факта». Тонкая полоса факта
// лежит на светлой шкале, риска плана стоит поперёк, а процент выполнения
// написан числом. Одна строка отвечает сразу на три вопроса, при этом занимает
// меньше места, чем пара столбиков.
const STYLES = `
:where([data-vibeui-block="chart-016"]){
--vibeui-chart-016-bg:oklch(1 0 0);
--vibeui-chart-016-fg:oklch(0.22 0.014 265);
--vibeui-chart-016-muted:oklch(0.55 0.014 265);
--vibeui-chart-016-border:oklch(0.91 0.006 265);
--vibeui-chart-016-band:oklch(0.96 0.004 265);
--vibeui-chart-016-band-2:oklch(0.93 0.005 265);
--vibeui-chart-016-band-3:oklch(0.89 0.006 265);
--vibeui-chart-016-accent:oklch(0.45 0.15 265);
--vibeui-chart-016-over:oklch(0.55 0.15 155);
--vibeui-chart-016-plan:oklch(0.3 0.02 265);
--vibeui-chart-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-016"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-016-bg);
border:1px solid var(--vibeui-chart-016-border);border-radius:0.875rem;
color:var(--vibeui-chart-016-fg);font-family:var(--vibeui-chart-016-font);
}
[data-vibeui-block="chart-016"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-016"] ul{display:flex;flex-direction:column;gap:0.625rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-016"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;font-size:0.8125rem;
}
[data-vibeui-block="chart-016"] [data-part="label"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-016"] [data-part="numbers"]{
font-variant-numeric:tabular-nums;color:var(--vibeui-chart-016-muted);
}
[data-vibeui-block="chart-016"] [data-part="numbers"] b{color:var(--vibeui-chart-016-fg)}
/* Три ступени фона — качественные диапазоны: «мало», «приемлемо», «хорошо».
   Они дают факту контекст, которого не даёт голая полоса. */
[data-vibeui-block="chart-016"] [data-part="track"]{
grid-column:1 / -1;position:relative;height:1.125rem;border-radius:0.25rem;overflow:hidden;
background:linear-gradient(to right,
var(--vibeui-chart-016-band-3) 0 60%,
var(--vibeui-chart-016-band-2) 60% 85%,
var(--vibeui-chart-016-band) 85% 100%);
}
[data-vibeui-block="chart-016"] [data-part="fact"]{
position:absolute;top:50%;left:0;height:0.4375rem;transform:translateY(-50%);
border-radius:0 0.125rem 0.125rem 0;background:var(--vibeui-chart-016-accent);
}
[data-vibeui-block="chart-016"] [data-part="fact"][data-over="true"]{background:var(--vibeui-chart-016-over)}
[data-vibeui-block="chart-016"] [data-part="plan"]{
position:absolute;top:0.125rem;bottom:0.125rem;width:2px;border-radius:1px;
background:var(--vibeui-chart-016-plan);
}
[data-vibeui-block="chart-016"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-016-muted)}
[data-vibeui-block="chart-016"] [data-part="key"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-chart-016-muted);
}
[data-vibeui-block="chart-016"] [data-part="key"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-016"] [data-part="swatch"]{
width:0.75rem;height:0.375rem;border-radius:1px;background:var(--vibeui-chart-016-accent);
}
[data-vibeui-block="chart-016"] [data-part="swatch"][data-kind="plan"]{
width:2px;height:0.75rem;background:var(--vibeui-chart-016-plan);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Chart016Row[] = [
  { label: "Выручка", fact: 8_400, plan: 9_000 },
  { label: "Новые клиенты", fact: 320, plan: 280 },
  { label: "Продления", fact: 145, plan: 180 },
  { label: "Средний чек", fact: 26, plan: 25 },
]

/**
 * Bullet-график «план против факта» строками с риской плана.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart016({
  title = "Выполнение плана квартала",
  rows = DEFAULT_ROWS,
  unit = "факт против плана",
  scaleMax = 1.25,
  accent,
  className,
  style,
  ...props
}: Chart016Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-016" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-016"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ul>
          {rows.map((row) => {
            // Шкала строки — план, растянутый до scaleMax: так риска плана
            // стоит в одном и том же месте у всех строк, и глаз сравнивает
            // перевыполнение, а не абсолютные величины разной природы.
            const ceiling = row.plan * scaleMax || 1
            const done = Math.round((row.fact / (row.plan || 1)) * 100)

            return (
              <li key={row.label} data-part="row">
                <span data-part="label">{row.label}</span>
                <span data-part="numbers">
                  <b>{row.fact}</b> из {row.plan} · {done}%
                </span>
                <span data-part="track" aria-hidden="true">
                  <span
                    data-part="fact"
                    data-over={row.fact >= row.plan ? "true" : undefined}
                    style={{
                      width: `${Math.min((row.fact / ceiling) * 100, 100)}%`,
                    }}
                  />
                  <span
                    data-part="plan"
                    style={{ left: `${(row.plan / ceiling) * 100}%` }}
                  />
                </span>
              </li>
            )
          })}
        </ul>
        <ul data-part="key">
          <li>
            <span data-part="swatch" aria-hidden="true" />
            Факт
          </li>
          <li>
            <span data-part="swatch" data-kind="plan" aria-hidden="true" />
            План
          </li>
        </ul>
        <p data-part="unit">Единица измерения: {unit}</p>
      </figure>
    </>
  )
}
