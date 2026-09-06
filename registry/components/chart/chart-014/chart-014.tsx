import type { ComponentProps, CSSProperties } from "react"

export type Chart014Zone = {
  upTo: number
  label: string
  tone: "bad" | "warn" | "good"
}

export type Chart014Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  value?: number
  max?: number
  unit?: string
  zones?: Chart014Zone[]
  /** Имя картинки для скринридера: {title}, {value}, {max} и {zone}. */
  chartLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: датчик с зонами вместо одной дуги. Стрелка отвечает
// «сколько», а окрашенные участки — «это норма или уже плохо». Границы зон
// продублированы текстом под шкалой: цвет один смысл не несёт ни на печати,
// ни при дальтонизме.
//
// Тема берётся из color-scheme окружения через light-dark(): датчик темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-014"]){
--vibeui-chart-014-bg:transparent;
--vibeui-chart-014-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-014-muted:color-mix(in oklab,var(--vibeui-chart-014-fg) 68%,transparent);
--vibeui-chart-014-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-014-bad:light-dark(oklch(0.63 0.18 28),oklch(0.71 0.16 28));
--vibeui-chart-014-warn:light-dark(oklch(0.76 0.15 85),oklch(0.83 0.14 85));
--vibeui-chart-014-good:light-dark(oklch(0.64 0.15 155),oklch(0.76 0.14 155));
--vibeui-chart-014-needle:light-dark(oklch(0.25 0 265),oklch(0.9 0 265));
--vibeui-chart-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-014"]{color-scheme:dark}
[data-vibeui-block="chart-014"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:18rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-014-bg);
border:1px solid var(--vibeui-chart-014-border);border-radius:0.875rem;
color:var(--vibeui-chart-014-fg);font-family:var(--vibeui-chart-014-font);
}
[data-vibeui-block="chart-014"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-014"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-014"] [data-part="zone"]{fill:none;stroke-width:12;stroke-linecap:butt}
[data-vibeui-block="chart-014"] [data-part="zone"][data-tone="bad"]{stroke:var(--vibeui-chart-014-bad)}
[data-vibeui-block="chart-014"] [data-part="zone"][data-tone="warn"]{stroke:var(--vibeui-chart-014-warn)}
[data-vibeui-block="chart-014"] [data-part="zone"][data-tone="good"]{stroke:var(--vibeui-chart-014-good)}
[data-vibeui-block="chart-014"] [data-part="needle"]{
stroke:var(--vibeui-chart-014-needle);stroke-width:3;stroke-linecap:round;
}
[data-vibeui-block="chart-014"] [data-part="hub"]{fill:var(--vibeui-chart-014-needle)}
[data-vibeui-block="chart-014"] [data-part="edge"]{
fill:var(--vibeui-chart-014-muted);font-size:9px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-014"] [data-part="reading"]{
display:flex;align-items:baseline;justify-content:center;gap:0.375rem;margin:-1.75rem 0 0;
}
[data-vibeui-block="chart-014"] [data-part="number"]{
font-size:1.75rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-014"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-014-muted)}
[data-vibeui-block="chart-014"] [data-part="scale"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0.25rem 0 0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-chart-014-muted);
}
[data-vibeui-block="chart-014"] [data-part="scale"] li{
display:flex;align-items:center;gap:0.3125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-014"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="chart-014"] [data-part="dot"][data-tone="bad"]{background:var(--vibeui-chart-014-bad)}
[data-vibeui-block="chart-014"] [data-part="dot"][data-tone="warn"]{background:var(--vibeui-chart-014-warn)}
[data-vibeui-block="chart-014"] [data-part="dot"][data-tone="good"]{background:var(--vibeui-chart-014-good)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-014"] *{animation:none!important;transition:none!important}}
`

const CENTER_X = 90
const CENTER_Y = 92
const RADIUS = 68

function pointAt(share: number, radius: number) {
  const angle = Math.PI * (1 - share)

  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y - Math.sin(angle) * radius,
  }
}

function arc(from: number, to: number) {
  const start = pointAt(from, RADIUS)
  const end = pointAt(to, RADIUS)

  return `M${start.x} ${start.y} A${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`
}

const DEFAULT_ZONES: Chart014Zone[] = [
  { upTo: 40, label: "низко", tone: "bad" },
  { upTo: 70, label: "норма", tone: "warn" },
  { upTo: 100, label: "отлично", tone: "good" },
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
 * Полукруговой датчик с зонами и стрелкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart014({
  title = "Индекс удовлетворённости",
  value = 78,
  max = 100,
  unit = "баллов из 100",
  zones = DEFAULT_ZONES,
  chartLabel = "{title}: {value} из {max}, зона «{zone}»",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart014Props) {
  const safeMax = max || 1
  const share = Math.max(0, Math.min(1, value / safeMax))
  const needle = pointAt(share, RADIUS - 16)
  const current =
    zones.find((zone) => value <= zone.upTo) ?? zones[zones.length - 1]

  const palette = {
    ...(accent ? { "--vibeui-chart-014-good": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Начало зоны — граница предыдущей: счётчик не нужен, соседняя зона уже
  // хранит всё, что требуется.
  const bands = zones.map((zone, index) => ({
    zone,
    from:
      index === 0
        ? 0
        : Math.max(0, Math.min(1, zones[index - 1].upTo / safeMax)),
    to: Math.max(0, Math.min(1, zone.upTo / safeMax)),
  }))

  return (
    <>
      <style href="vibeui-chart-014" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-014"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg
          viewBox="0 0 180 106"
          role="img"
          aria-label={fillTemplate(chartLabel, {
            title,
            value,
            max,
            zone: current?.label ?? "",
          })}
        >
          {bands.map((band) => (
            <path
              key={band.zone.label}
              data-part="zone"
              data-tone={band.zone.tone}
              d={arc(band.from, Math.max(band.to, band.from + 0.001))}
            />
          ))}
          <line
            data-part="needle"
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={needle.x}
            y2={needle.y}
          />
          <circle data-part="hub" cx={CENTER_X} cy={CENTER_Y} r={4} />
          <text data-part="edge" x={4} y={104}>
            0
          </text>
          <text data-part="edge" x={158} y={104}>
            {max}
          </text>
        </svg>
        <p data-part="reading">
          <span data-part="number">{value}</span>
          <span data-part="unit">{unit}</span>
        </p>
        <ul data-part="scale">
          {bands.map((band, index) => (
            <li key={band.zone.label}>
              <span
                data-part="dot"
                data-tone={band.zone.tone}
                aria-hidden="true"
              />
              {band.zone.label}: {index === 0 ? 0 : zones[index - 1].upTo}–
              {band.zone.upTo}
            </li>
          ))}
        </ul>
      </figure>
    </>
  )
}
