import type { ComponentProps, CSSProperties } from "react"

export type Chart016Row = {
  label: string
  fact: number
  plan: number
}

export type Chart016Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart016Row[]
  unit?: string
  scaleMax?: number
  /** Подпись рядом с фактом: {plan} и {done}. */
  compareLabel?: string
  /** Подпись под списком: {unit}. */
  unitLabel?: string
  /** Легенда: ключи fact и plan. */
  keyText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: bullet-график «план против факта». Тонкая полоса факта
// лежит на светлой шкале, риска плана стоит поперёк, а процент выполнения
// написан числом. Одна строка отвечает сразу на три вопроса, при этом занимает
// меньше места, чем пара столбиков.
//
// Тема берётся из color-scheme окружения через light-dark(): строки темнеют
// вместе со страницей и не носят собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-016"]){
--vibeui-chart-016-bg:transparent;
--vibeui-chart-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-016-muted:color-mix(in oklab,var(--vibeui-chart-016-fg) 68%,transparent);
--vibeui-chart-016-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-016-band:light-dark(oklch(0.96 0 265),oklch(0.25 0 265));
--vibeui-chart-016-band-2:light-dark(oklch(0.93 0 265),oklch(0.29 0 265));
--vibeui-chart-016-band-3:light-dark(oklch(0.89 0 265),oklch(0.33 0 265));
--vibeui-chart-016-accent:light-dark(oklch(0.45 0.15 39.8),oklch(0.74 0.14 39.8));
--vibeui-chart-016-over:light-dark(oklch(0.55 0.15 39.8),oklch(0.76 0.14 39.8));
--vibeui-chart-016-plan:light-dark(oklch(0.3 0 265),oklch(0.9 0 265));
--vibeui-chart-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-016"]{color-scheme:dark}
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

const KEY_TEXT: Record<string, string> = {
  fact: "Факт",
  plan: "План",
}

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
 * Bullet-график «план против факта» строками с риской плана.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart016({
  title = "Выполнение плана квартала",
  rows = DEFAULT_ROWS,
  unit = "факт против плана",
  scaleMax = 1.25,
  compareLabel = "из {plan} · {done}%",
  unitLabel = "Единица измерения: {unit}",
  keyText = KEY_TEXT,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart016Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-016" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
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
                  <b>{row.fact}</b>{" "}
                  {fillTemplate(compareLabel, { plan: row.plan, done })}
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
            {keyText.fact ?? KEY_TEXT.fact}
          </li>
          <li>
            <span data-part="swatch" data-kind="plan" aria-hidden="true" />
            {keyText.plan ?? KEY_TEXT.plan}
          </li>
        </ul>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
      </figure>
    </>
  )
}
