import type { CSSProperties } from "react"

export type Chart002Bar = {
  label: string
  value: number
  /** Выделить столбец: текущий период, план, аномалия. */
  highlight?: boolean
}

export type Chart002Props = {
  bars?: Chart002Bar[]
  title?: string
  unit?: string
  /** Показывать значение над столбцом. */
  showValues?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: столбцы — это раскладка, а не рисунок. Высота задаётся
// процентом в CSS-переменной каждого столбца, поэтому график остаётся
// текстом и разметкой: он масштабируется, копируется и печатается, а SVG
// и библиотека графиков не нужны.
//
// Тема берётся из color-scheme окружения через light-dark(): диаграмма
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-002"]){
--vibeui-chart-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-chart-002-muted:color-mix(in oklab,var(--vibeui-chart-002-fg) 68%,transparent);
--vibeui-chart-002-bg:transparent;
--vibeui-chart-002-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-002-grid:light-dark(oklch(0.94 0 265),oklch(0.3 0 265));
--vibeui-chart-002-bar:light-dark(oklch(0.88 0 262),oklch(0.4 0 0));
--vibeui-chart-002-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-chart-002-radius:0.875rem;
--vibeui-chart-002-height:9rem;
--vibeui-chart-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-002"]{color-scheme:dark}
[data-vibeui-block="chart-002"]{
display:flex;flex-direction:column;gap:1rem;
width:100%;box-sizing:border-box;padding:1.125rem 1.25rem 1rem;
border:1px solid var(--vibeui-chart-002-border);
border-radius:var(--vibeui-chart-002-radius);
background:var(--vibeui-chart-002-bg);color:var(--vibeui-chart-002-fg);
font-family:var(--vibeui-chart-002-font);
}
[data-vibeui-block="chart-002"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:600}
/* Сетка — фон области, а не элементы: три линии повторяющимся градиентом. */
[data-vibeui-block="chart-002"] [data-part="plot"]{
position:relative;
display:flex;align-items:flex-end;gap:0.5rem;
height:var(--vibeui-chart-002-height);
background:repeating-linear-gradient(to top,transparent 0 calc(50% - 1px),var(--vibeui-chart-002-grid) calc(50% - 1px) 50%);
}
[data-vibeui-block="chart-002"] [data-part="column"]{
display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:0.375rem;
flex:1 1 0;min-width:0;height:100%;
}
[data-vibeui-block="chart-002"] [data-part="value"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-002-muted);
}
[data-vibeui-block="chart-002"] [data-part="bar"]{
width:100%;border-radius:0.3125rem 0.3125rem 0 0;
height:calc(var(--vibeui-chart-002-bar-height,0) * 1%);
min-height:0.25rem;
background:var(--vibeui-chart-002-bar);
transition:background-color .16s ease;
}
[data-vibeui-block="chart-002"] [data-part="column"]:hover [data-part="bar"]{background:color-mix(in oklab,var(--vibeui-chart-002-accent) 45%,var(--vibeui-chart-002-bar))}
[data-vibeui-block="chart-002"] [data-part="column"][data-highlight="true"] [data-part="bar"]{background:var(--vibeui-chart-002-accent);color:oklch(from var(--vibeui-chart-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-002"] [data-part="column"][data-highlight="true"] [data-part="value"]{color:var(--vibeui-chart-002-accent);font-weight:650}
[data-vibeui-block="chart-002"] [data-part="axis"]{
display:flex;gap:0.5rem;font-size:0.6875rem;color:var(--vibeui-chart-002-muted);
}
[data-vibeui-block="chart-002"] [data-part="axis"] span{flex:1 1 0;min-width:0;text-align:center;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="chart-002"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BARS: Chart002Bar[] = [
  { label: "Окт", value: 42 },
  { label: "Ноя", value: 58 },
  { label: "Дек", value: 91 },
  { label: "Янв", value: 74 },
  { label: "Фев", value: 86 },
  { label: "Мар", value: 118, highlight: true },
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

/**
 * Столбчатая диаграмма на разметке: высота задаётся переменной, SVG не нужен.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart002({
  bars = DEFAULT_BARS,
  title = "Установок компонентов по месяцам",
  unit = "",
  showValues = true,
  accent,
  background = "",
  className,
  style,
}: Chart002Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const max = Math.max(...bars.map((bar) => bar.value)) || 1

  return (
    <>
      <style href="vibeui-chart-002" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-slot="chart"
        data-vibeui-block="chart-002"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <div data-part="plot">
          {bars.map((bar) => (
            <div
              key={bar.label}
              data-part="column"
              data-highlight={bar.highlight || undefined}
            >
              {showValues ? (
                <span data-part="value">
                  {bar.value}
                  {unit}
                </span>
              ) : null}
              <span
                data-part="bar"
                style={
                  {
                    "--vibeui-chart-002-bar-height": (bar.value / max) * 100,
                  } as CSSProperties
                }
              />
              <span data-part="sr">
                {bar.label}: {bar.value}
                {unit}
              </span>
            </div>
          ))}
        </div>
        <div data-part="axis" aria-hidden="true">
          {bars.map((bar) => (
            <span key={bar.label}>{bar.label}</span>
          ))}
        </div>
      </figure>
    </>
  )
}
