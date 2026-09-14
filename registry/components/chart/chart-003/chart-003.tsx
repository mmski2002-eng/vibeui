import type { ComponentProps, CSSProperties } from "react"

export type Chart003Slice = {
  label: string
  value: number
  hue?: number
}

export type Chart003Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  slices?: Chart003Slice[]
  unit?: string
  /** Подпись итога под легендой: {total} и {unit}. */
  totalLabel?: string
  /** Выдвигать секторы по очереди при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кольцевая диаграмма — окружности SVG со штрихом на долю
// (pathLength=100, поэтому длина штриха = процент), между секторами зазор.
// Легенда обязательна — по кольцу без подписей нельзя назвать ни одну долю,
// а угол глаз оценивает хуже длины. Сектор и строка легенды связаны
// через :has(): наведение на одно подсвечивает другое, без JS.
// При появлении секторы выезжают по очереди по часовой стрелке.
//
// Тема берётся из color-scheme окружения через light-dark(): подписи и рамка
// темнеют вместе со страницей, оттенки секторов читаются в обеих темах.
const STYLES = `
:where([data-vibeui-block="chart-003"]){
--vibeui-chart-003-bg:transparent;
--vibeui-chart-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-003-muted:color-mix(in oklab,var(--vibeui-chart-003-fg) 62%,transparent);
--vibeui-chart-003-border:light-dark(oklch(0.91 0 265),oklch(0.32 0 265));
--vibeui-chart-003-track:light-dark(oklch(0.95 0 265),oklch(0.28 0 265));
--vibeui-chart-003-accent:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-003-size:7.5rem;
--vibeui-chart-003-thickness:20;
--vibeui-chart-003-dur:0.9s;
--vibeui-chart-003-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-003"]{color-scheme:dark}
[data-vibeui-block="chart-003"]{
display:flex;align-items:center;gap:1.125rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem 1rem;
background:var(--vibeui-chart-003-bg);
border:1px solid var(--vibeui-chart-003-border);border-radius:0.875rem;
color:var(--vibeui-chart-003-fg);font-family:var(--vibeui-chart-003-font);
}
[data-vibeui-block="chart-003"] [data-part="ring"]{position:relative;flex:none;width:var(--vibeui-chart-003-size);height:var(--vibeui-chart-003-size)}
[data-vibeui-block="chart-003"] svg{display:block;width:100%;height:100%;overflow:visible;transform:rotate(-90deg)}
[data-vibeui-block="chart-003"] [data-part="track"]{fill:none;stroke:var(--vibeui-chart-003-track);stroke-width:var(--vibeui-chart-003-thickness)}
/* Сектор: штрих длиной в процент, смещение — сумма предыдущих; зазор 1.2 %. */
[data-vibeui-block="chart-003"] [data-part="slice"]{
fill:none;stroke:oklch(0.68 0.19 var(--vibeui-chart-003-hue,250));
stroke-width:var(--vibeui-chart-003-thickness);stroke-linecap:butt;
stroke-dasharray:max(0, calc(var(--len) - 1.2)) 100;stroke-dashoffset:calc(-1 * var(--start) - 0.6);
transition:stroke-width 0.25s var(--vibeui-chart-003-ease),opacity 0.25s;cursor:default;
}
[data-vibeui-block="chart-003"] [data-part="slice"]:hover{stroke-width:calc(var(--vibeui-chart-003-thickness) + 5)}
[data-vibeui-block="chart-003"] [data-part="center"]{
position:absolute;inset:0;display:flex;flex-direction:column;
align-items:center;justify-content:center;pointer-events:none;
}
[data-vibeui-block="chart-003"] [data-part="total"]{
font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;line-height:1.1;
color:var(--vibeui-chart-003-accent);
}
[data-vibeui-block="chart-003"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-003-muted)}
[data-vibeui-block="chart-003"] [data-part="body"]{display:flex;flex-direction:column;gap:0.5rem;min-width:0;flex:1}
[data-vibeui-block="chart-003"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-003"] [data-part="legend"]{display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none}
/* Легенда с числами: по углу сектора долю не назвать. */
[data-vibeui-block="chart-003"] [data-part="row"]{
display:grid;grid-template-columns:0.5rem 1fr auto;align-items:center;gap:0.5rem;
padding:0.2rem 0.375rem;margin:0 -0.375rem;border-radius:0.375rem;
font-size:0.8125rem;transition:background-color 0.2s,opacity 0.2s;
}
[data-vibeui-block="chart-003"] [data-part="row"]:hover{background:color-mix(in oklab,var(--vibeui-chart-003-fg) 6%,transparent)}
/* Цвет точки один на обе темы: он обязан совпадать с сектором. */
[data-vibeui-block="chart-003"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
background:oklch(0.68 0.19 var(--vibeui-chart-003-hue,250));
transition:box-shadow 0.2s,transform 0.2s;
}
[data-vibeui-block="chart-003"] [data-part="row"]:hover [data-part="dot"]{transform:scale(1.25);box-shadow:0 0 0 3px oklch(0.68 0.19 var(--vibeui-chart-003-hue,250) / 0.3)}
[data-vibeui-block="chart-003"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--vibeui-chart-003-muted)}
[data-vibeui-block="chart-003"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
/* Связь сектора и строки: наведение на одно гасит остальное. Пары по
   порядку — сектор k и строка k; на восемь долей хватает любому кольцу. */
[data-vibeui-block="chart-003"]:has([data-part="slice"]:hover) [data-part="slice"]:not(:hover){opacity:0.35}
[data-vibeui-block="chart-003"]:has([data-part="row"]:hover) [data-part="slice"]{opacity:0.35}
[data-vibeui-block="chart-003"]:has([data-part="slice"]:hover) [data-part="row"]{opacity:0.45}
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(1):hover) [data-part="slice"]:nth-child(2),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(2):hover) [data-part="slice"]:nth-child(3),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(3):hover) [data-part="slice"]:nth-child(4),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(4):hover) [data-part="slice"]:nth-child(5),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(5):hover) [data-part="slice"]:nth-child(6),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(6):hover) [data-part="slice"]:nth-child(7),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(7):hover) [data-part="slice"]:nth-child(8),
[data-vibeui-block="chart-003"]:has([data-part="row"]:nth-child(8):hover) [data-part="slice"]:nth-child(9){opacity:1;stroke-width:calc(var(--vibeui-chart-003-thickness) + 5)}
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(2):hover) [data-part="row"]:nth-child(1),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(3):hover) [data-part="row"]:nth-child(2),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(4):hover) [data-part="row"]:nth-child(3),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(5):hover) [data-part="row"]:nth-child(4),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(6):hover) [data-part="row"]:nth-child(5),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(7):hover) [data-part="row"]:nth-child(6),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(8):hover) [data-part="row"]:nth-child(7),
[data-vibeui-block="chart-003"]:has([data-part="slice"]:nth-child(9):hover) [data-part="row"]:nth-child(8){opacity:1;background:color-mix(in oklab,var(--vibeui-chart-003-fg) 6%,transparent)}
/* Появление: секторы выезжают по очереди, итог и строки всплывают. */
[data-vibeui-block="chart-003"][data-animate] [data-part="slice"]{
animation:vibeui-chart-003-sweep var(--vibeui-chart-003-dur) var(--vibeui-chart-003-ease) calc(var(--start) * 6ms) both;
}
[data-vibeui-block="chart-003"][data-animate] [data-part="center"],[data-vibeui-block="chart-003"][data-animate] [data-part="row"]{
opacity:0;animation:vibeui-chart-003-rise 0.5s var(--vibeui-chart-003-ease) calc(0.4s + var(--i,0) * 70ms) forwards;
}
@keyframes vibeui-chart-003-sweep{from{stroke-dasharray:0 100}}
@keyframes vibeui-chart-003-rise{from{opacity:0;translate:0 0.3rem}to{opacity:1;translate:0 0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-003"][data-animate] [data-part="center"],[data-vibeui-block="chart-003"][data-animate] [data-part="row"]{opacity:1}
}
`

const DEFAULT_SLICES: Chart003Slice[] = [
  { label: "Прямые заходы", value: 42, hue: 250 },
  { label: "Поиск", value: 28, hue: 150 },
  { label: "Соцсети", value: 18, hue: 30 },
  { label: "Письма", value: 12, hue: 300 },
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
 * Кольцевая диаграмма на conic-gradient с обязательной легендой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart003({
  title = "Источники трафика",
  slices = DEFAULT_SLICES,
  unit = "тысяч визитов",
  totalLabel = "Всего: {total} {unit}",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart003Props) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1
  // Начало сектора — сумма предыдущих долей в процентах: штрих окружности
  // с pathLength=100 смещается ровно на неё.
  const arcs = slices.map((slice, index) => ({
    slice,
    start: slices.slice(0, index).reduce((sum, before) => sum + (before.value / total) * 100, 0),
    length: (slice.value / total) * 100,
  }))

  const palette = {
    ...(accent ? { "--vibeui-chart-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-003" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-003"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="ring" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle data-part="track" cx="50" cy="50" r="40" />
            {arcs.map(({ slice, start, length }) => (
              <circle
                key={slice.label}
                data-part="slice"
                cx="50"
                cy="50"
                r="40"
                pathLength={100}
                style={{ "--start": start, "--len": length, "--vibeui-chart-003-hue": slice.hue ?? 250 } as CSSProperties}
              />
            ))}
          </svg>
          <div data-part="center">
            <span data-part="total">{total}</span>
          </div>
        </div>
        <div data-part="body">
          <figcaption data-part="title">{title}</figcaption>
          <ul data-part="legend">
            {slices.map((slice, index) => (
              <li key={slice.label} data-part="row" style={{ "--i": index } as CSSProperties}>
                <span
                  data-part="dot"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-chart-003-hue": slice.hue ?? 250,
                    } as CSSProperties
                  }
                />
                <span data-part="name">{slice.label}</span>
                <span data-part="value">
                  {Math.round((slice.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
          <span data-part="unit">
            {fillTemplate(totalLabel, { total, unit })}
          </span>
        </div>
      </figure>
    </>
  )
}
