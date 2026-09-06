import type { ComponentProps, CSSProperties } from "react"

export type Chart020Metric = {
  label: string
  value: number
  max?: number
  hue?: number
}

export type Chart020Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  metrics?: Chart020Metric[]
  unit?: string
  /** Подпись под кольцами: {unit}. */
  unitLabel?: string
  /** Абсолютное значение в легенде: {value} и {max}. */
  rawLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: несколько показателей одним объектом — концентрические
// дуги. Каждая дуга живёт на своей окружности и заполняется через
// stroke-dasharray, поэтому радиусы можно менять, не трогая математику.
// Кольца сами по себе неразличимы, поэтому легенда с процентами обязательна.
//
// Тема берётся из color-scheme окружения через light-dark(): кольца темнеют
// вместе со страницей и не носят собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-020"]){
--vibeui-chart-020-bg:transparent;
--vibeui-chart-020-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-020-muted:color-mix(in oklab,var(--vibeui-chart-020-fg) 68%,transparent);
--vibeui-chart-020-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-020-track:light-dark(oklch(0.95 0 265),oklch(0.29 0 265));
--vibeui-chart-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-020"]{color-scheme:dark}
[data-vibeui-block="chart-020"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-020-bg);
border:1px solid var(--vibeui-chart-020-border);border-radius:0.875rem;
color:var(--vibeui-chart-020-fg);font-family:var(--vibeui-chart-020-font);
}
[data-vibeui-block="chart-020"] [data-part="title"]{flex:1 0 100%;margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-020"] svg{display:block;width:8.75rem;height:8.75rem;flex:0 0 auto}
[data-vibeui-block="chart-020"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-020-track);stroke-width:9;
}
[data-vibeui-block="chart-020"] [data-part="ring"]{
fill:none;stroke-width:9;stroke-linecap:round;
}
[data-vibeui-block="chart-020"] [data-part="legend"]{
flex:1 1 9rem;display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="chart-020"] [data-part="row"]{
display:grid;grid-template-columns:0.5rem 1fr auto;align-items:center;gap:0.5rem;
font-size:0.8125rem;
}
[data-vibeui-block="chart-020"] [data-part="chip"]{
width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-chart-020-ring);
}
[data-vibeui-block="chart-020"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-020"] [data-part="share"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-020"] [data-part="raw"]{
grid-column:2 / -1;font-size:0.6875rem;color:var(--vibeui-chart-020-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-020"] [data-part="unit"]{flex:1 0 100%;margin:0;font-size:0.75rem;color:var(--vibeui-chart-020-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-020"] *{animation:none!important;transition:none!important}}
`

const CENTER = 60
const RADII = [50, 38, 26, 14]
const HUES = [265, 200, 150, 40]

const DEFAULT_METRICS: Chart020Metric[] = [
  { label: "Покрытие тестами", value: 82, max: 100 },
  { label: "Готовность спринта", value: 64, max: 100 },
  { label: "Доля автосборок", value: 45, max: 100 },
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
 * Радиальный прогресс нескольких метрик концентрическими дугами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart020({
  title = "Готовность релиза",
  metrics = DEFAULT_METRICS,
  unit = "процентов от цели",
  unitLabel = "Единица измерения: {unit}",
  rawLabel = "{value} из {max}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart020Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const rings = metrics.slice(0, RADII.length).map((metric, index) => {
    const ceiling = metric.max ?? 100
    const share = Math.max(0, Math.min(1, metric.value / (ceiling || 1)))
    const radius = RADII[index]
    const circumference = 2 * Math.PI * radius

    return {
      metric,
      ceiling,
      share,
      radius,
      circumference,
      color:
        accent && index === 0
          ? accent
          : `oklch(0.6 0.15 ${metric.hue ?? HUES[index % HUES.length]})`,
    }
  })

  return (
    <>
      <style href="vibeui-chart-020" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-020"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          {rings.map((ring) => (
            <g key={ring.metric.label}>
              <circle
                data-part="track"
                cx={CENTER}
                cy={CENTER}
                r={ring.radius}
              />
              <circle
                data-part="ring"
                cx={CENTER}
                cy={CENTER}
                r={ring.radius}
                stroke={ring.color}
                strokeDasharray={`${ring.circumference * ring.share} ${ring.circumference}`}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              />
            </g>
          ))}
        </svg>
        <ul data-part="legend">
          {rings.map((ring) => (
            <li key={ring.metric.label} data-part="row">
              <span
                data-part="chip"
                aria-hidden="true"
                style={
                  { "--vibeui-chart-020-ring": ring.color } as CSSProperties
                }
              />
              <span data-part="name">{ring.metric.label}</span>
              <span data-part="share">{Math.round(ring.share * 100)}%</span>
              <span data-part="raw">
                {fillTemplate(rawLabel, {
                  value: ring.metric.value,
                  max: ring.ceiling,
                })}
              </span>
            </li>
          ))}
        </ul>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
      </figure>
    </>
  )
}
