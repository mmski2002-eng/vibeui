import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart022Row = {
  label: string
  value: number
  wasRank?: number
}

export type Chart022Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart022Row[]
  unit?: string
  showMoves?: boolean
  accent?: string
}

// Идея компонента: рейтинг, в котором место важнее величины. Номер позиции
// стоит отдельной колонкой, а рядом — движение относительно прошлого замера:
// «был четвёртым, стал вторым». Без движения таблица топа отвечает только
// «кто сейчас», а спрашивают обычно «что изменилось».
const STYLES = `
:where([data-vibeui-block="chart-022"]){
--vibeui-chart-022-bg:oklch(1 0 0);
--vibeui-chart-022-fg:oklch(0.22 0.014 265);
--vibeui-chart-022-muted:oklch(0.55 0.014 265);
--vibeui-chart-022-border:oklch(0.91 0.006 265);
--vibeui-chart-022-track:oklch(0.95 0.004 265);
--vibeui-chart-022-accent:oklch(0.55 0.17 265);
--vibeui-chart-022-up:oklch(0.55 0.14 155);
--vibeui-chart-022-down:oklch(0.58 0.16 25);
--vibeui-chart-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-022"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-022-bg);
border:1px solid var(--vibeui-chart-022-border);border-radius:0.875rem;
color:var(--vibeui-chart-022-fg);font-family:var(--vibeui-chart-022-font);
}
[data-vibeui-block="chart-022"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-022"] ol{display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none}
/* Номер, имя, движение и значение живут в одной сетке, полоса занимает всю
   строку снизу: числа не разъезжаются между строками. */
[data-vibeui-block="chart-022"] [data-part="row"]{
display:grid;grid-template-columns:1.25rem 1fr auto auto;align-items:center;
gap:0.125rem 0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="chart-022"] [data-part="rank"]{
font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-022-muted);
}
[data-vibeui-block="chart-022"] li:nth-child(-n+3) [data-part="rank"]{color:var(--vibeui-chart-022-accent)}
[data-vibeui-block="chart-022"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-022"] [data-part="move"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-022-muted);
}
[data-vibeui-block="chart-022"] [data-part="move"][data-dir="up"]{color:var(--vibeui-chart-022-up)}
[data-vibeui-block="chart-022"] [data-part="move"][data-dir="down"]{color:var(--vibeui-chart-022-down)}
[data-vibeui-block="chart-022"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-022"] [data-part="track"]{
grid-column:2 / -1;height:0.375rem;border-radius:9999px;
background:var(--vibeui-chart-022-track);overflow:hidden;
}
[data-vibeui-block="chart-022"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-chart-022-accent);
}
[data-vibeui-block="chart-022"] li:not(:nth-child(-n+3)) [data-part="fill"]{
background:color-mix(in oklab,var(--vibeui-chart-022-accent) 45%,oklch(0.9 0.01 265));
}
[data-vibeui-block="chart-022"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-022-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Chart022Row[] = [
  { label: "Тарифы", value: 5240, wasRank: 3 },
  { label: "Каталог", value: 4810, wasRank: 1 },
  { label: "Главная", value: 3960, wasRank: 2 },
  { label: "Документация", value: 2180, wasRank: 6 },
  { label: "Блог", value: 1640, wasRank: 4 },
  { label: "Вакансии", value: 720, wasRank: 5 },
]

/**
 * Рейтинг с номерами мест и движением относительно прошлого замера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart022({
  title = "Топ страниц за неделю",
  rows = DEFAULT_ROWS,
  unit = "визитов",
  showMoves = true,
  accent,
  className,
  style,
  ...props
}: Chart022Props) {
  const max = Math.max(...rows.map((row) => row.value), 1)

  const palette = {
    ...(accent ? { "--vibeui-chart-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-022" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-022"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {rows.map((row, index) => {
            const rank = index + 1
            // Движение вверх — это уменьшение номера места, поэтому знак
            // считается наоборот привычному «больше значит лучше».
            const shift = row.wasRank ? row.wasRank - rank : 0
            const direction = shift > 0 ? "up" : shift < 0 ? "down" : "flat"

            return (
              <li key={row.label} data-part="row">
                <span data-part="rank">{rank}</span>
                <span data-part="name">{row.label}</span>
                {showMoves ? (
                  <span data-part="move" data-dir={direction}>
                    {direction === "up"
                      ? `▲ ${shift}`
                      : direction === "down"
                        ? `▼ ${Math.abs(shift)}`
                        : "— без движения"}
                  </span>
                ) : (
                  <span data-part="move" />
                )}
                <span data-part="value">{row.value}</span>
                <span data-part="track" aria-hidden="true">
                  <span
                    data-part="fill"
                    style={{
                      width: `${Math.max((row.value / max) * 100, 2)}%`,
                    }}
                  />
                </span>
              </li>
            )
          })}
        </ol>
        <p data-part="unit">
          Единица измерения: {unit}. Стрелка — изменение места с прошлой недели.
        </p>
      </figure>
    </>
  )
}
