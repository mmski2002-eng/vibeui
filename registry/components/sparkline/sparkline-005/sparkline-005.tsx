import type { ComponentProps, CSSProperties } from "react"

export type Sparkline005Props = Omit<ComponentProps<"span">, "children"> & {
  values?: number[]
  label?: string
  value?: string
  /** Нижняя граница нормы. */
  low?: number
  /** Верхняя граница нормы. */
  high?: number
  /** Подпись нормы: {low} и {high} подставляются. */
  bandTemplate?: string
  /** Подпись выходов за норму: {count}. Пустая строка убирает её. */
  breachTemplate?: string
  /** Подпись для диктора: {label}, {value}, {count}, {low} и {high}. */
  ariaTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: спарклайн с зоной нормы. Сам по себе ряд отвечает только
// «росло или падало», а вопрос обычно другой — «было ли плохо». Полоса нормы
// на фоне отвечает на него без единой подписи, а точки выхода за неё отмечены
// отдельно: их и ищут глазами в первую очередь.
//
// Границы нормы приходят в тех же единицах, что и данные, поэтому масштаб
// строится по объединению ряда и полосы — иначе полоса уехала бы за кадр.
const STYLES = `
:where([data-vibeui-block="sparkline-005"]){
--vibeui-sparkline-005-bg:transparent;
--vibeui-sparkline-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-sparkline-005-muted:color-mix(in oklab,var(--vibeui-sparkline-005-fg) 62%,transparent);
--vibeui-sparkline-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-sparkline-005-band:color-mix(in oklab,var(--vibeui-sparkline-005-accent) 14%,transparent);
--vibeui-sparkline-005-breach:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-sparkline-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sparkline-005"]{color-scheme:dark}
[data-vibeui-block="sparkline-005"]{
display:inline-flex;flex-direction:column;gap:0.375rem;
min-width:min(100%,10rem);box-sizing:border-box;
background:var(--vibeui-sparkline-005-bg);
color:var(--vibeui-sparkline-005-fg);
font-family:var(--vibeui-sparkline-005-font);
}
[data-vibeui-block="sparkline-005"] *{box-sizing:border-box}
[data-vibeui-block="sparkline-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="sparkline-005"] [data-part="label"]{
font-size:0.75rem;color:var(--vibeui-sparkline-005-muted);
}
[data-vibeui-block="sparkline-005"] [data-part="value"]{
font-size:1.0625rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2;
}
[data-vibeui-block="sparkline-005"] svg{display:block;inline-size:100%;block-size:2.5rem}
[data-vibeui-block="sparkline-005"] [data-part="band"]{fill:var(--vibeui-sparkline-005-band)}
[data-vibeui-block="sparkline-005"] [data-part="edge"]{
stroke:color-mix(in oklab,var(--vibeui-sparkline-005-accent) 40%,transparent);
stroke-width:1;stroke-dasharray:3 3;
}
[data-vibeui-block="sparkline-005"] [data-part="line"]{
fill:none;stroke:var(--vibeui-sparkline-005-accent);stroke-width:1.75;
stroke-linejoin:round;stroke-linecap:round;
}
/* Точки выхода за норму: их ищут в первую очередь, поэтому они крупнее
   последней точки ряда и своего цвета. */
[data-vibeui-block="sparkline-005"] [data-part="breach"]{
fill:var(--vibeui-sparkline-005-breach);
}
[data-vibeui-block="sparkline-005"] [data-part="last"]{fill:var(--vibeui-sparkline-005-accent)}
[data-vibeui-block="sparkline-005"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-sparkline-005-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sparkline-005"] [data-part="breaches"]{
color:var(--vibeui-sparkline-005-breach);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-005"] *{animation:none!important;transition:none!important}}
`

const WIDTH = 120
const HEIGHT = 40

const DEFAULT_VALUES = [
  120, 132, 128, 145, 138, 210, 156, 141, 133, 129, 188, 147, 139, 131,
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Спарклайн с зоной нормы: полоса на фоне и отмеченные выходы за неё.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline005({
  values = DEFAULT_VALUES,
  label = "Время ответа, мс",
  value = "131",
  low = 100,
  high = 160,
  bandTemplate = "норма {low}–{high}",
  breachTemplate = "выходов за норму: {count}",
  ariaTemplate = "{label}: {value}. Норма от {low} до {high}, выходов за неё — {count}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sparkline005Props) {
  // Масштаб строится по объединению ряда и полосы: иначе полоса нормы уехала
  // бы за кадр, как только все значения окажутся выше или ниже неё.
  const max = Math.max(...values, high)
  const min = Math.min(...values, low)
  const span = max - min || 1

  const toY = (point: number) => HEIGHT - ((point - min) / span) * HEIGHT
  const points = values.map((point, index) => ({
    x: (index / Math.max(1, values.length - 1)) * WIDTH,
    y: toY(point),
    breach: point > high || point < low,
  }))

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ")
  const last = points[points.length - 1]
  const breaches = points.filter((point) => point.breach)

  const bandTop = toY(high)
  const bandBottom = toY(low)

  const palette = {
    ...(accent ? { "--vibeui-sparkline-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sparkline-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const numbers = { label, value, low, high, count: breaches.length }

  return (
    <>
      <style href="vibeui-sparkline-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="sparkline"
        data-vibeui-block="sparkline-005"
        className={className}
        style={palette}
      >
        <span data-part="head">
          <span data-part="label">{label}</span>
          <span data-part="value">{value}</span>
        </span>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={fillTemplate(ariaTemplate, numbers)}
        >
          <rect
            data-part="band"
            x={0}
            y={bandTop}
            width={WIDTH}
            height={Math.max(bandBottom - bandTop, 1)}
          />
          <line
            data-part="edge"
            x1={0}
            y1={bandTop}
            x2={WIDTH}
            y2={bandTop}
          />
          <line
            data-part="edge"
            x1={0}
            y1={bandBottom}
            x2={WIDTH}
            y2={bandBottom}
          />
          <path data-part="line" d={line} />
          {breaches.map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              data-part="breach"
              cx={point.x}
              cy={point.y}
              r={2.5}
            />
          ))}
          <circle data-part="last" cx={last.x} cy={last.y} r={2} />
        </svg>
        <span data-part="foot">
          <span>{fillTemplate(bandTemplate, numbers)}</span>
          {breachTemplate && breaches.length > 0 ? (
            <span data-part="breaches">
              {fillTemplate(breachTemplate, numbers)}
            </span>
          ) : null}
        </span>
      </span>
    </>
  )
}
