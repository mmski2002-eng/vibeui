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
--vibeui-sparkline-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-sparkline-005-band:color-mix(in oklab,var(--vibeui-sparkline-005-accent) 14%,transparent);
--vibeui-sparkline-005-breach:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
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
[data-vibeui-block="sparkline-005"] svg{display:block;inline-size:100%;block-size:3rem}
[data-vibeui-block="sparkline-005"] [data-part="band"]{
fill:var(--vibeui-sparkline-005-band);rx:3;
}
[data-vibeui-block="sparkline-005"] [data-part="edge"]{
stroke:color-mix(in oklab,var(--vibeui-sparkline-005-accent) 40%,transparent);
stroke-width:1;stroke-dasharray:3 3;
}
/* Заливка под кривой: полоса нормы отвечает «в пределах ли», заливка —
   «сколько», и вместе они читаются как одна картинка, а не два слоя. */
[data-vibeui-block="sparkline-005"] [data-part="area"]{
stroke:none;fill:color-mix(in oklab,var(--vibeui-sparkline-005-accent) 14%,transparent);
animation:vibeui-sparkline-005-rise 0.6s ease-out both;
}
/* Мягкое свечение под кривой: тонкая линия поверх полосы иначе теряется. */
[data-vibeui-block="sparkline-005"] [data-part="glow"]{
fill:none;stroke:var(--vibeui-sparkline-005-accent);stroke-width:5;opacity:0.14;
stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="sparkline-005"] [data-part="line"]{
fill:none;stroke:var(--vibeui-sparkline-005-accent);stroke-width:2.25;
stroke-linejoin:round;stroke-linecap:round;
stroke-dasharray:1;animation:vibeui-sparkline-005-draw 0.9s ease-out both;
}
@keyframes vibeui-sparkline-005-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-sparkline-005-rise{from{opacity:0}to{opacity:1}}
@keyframes vibeui-sparkline-005-flash{0%{opacity:0.35;r:3}70%{opacity:0;r:7}100%{opacity:0;r:7}}
/* Точки выхода за норму: их ищут в первую очередь, поэтому они крупнее
   последней точки ряда и своего цвета. */
[data-vibeui-block="sparkline-005"] [data-part="breach"]{
fill:var(--vibeui-sparkline-005-breach);
stroke:light-dark(oklch(1 0 0),oklch(0.16 0 265));stroke-width:1.25;
}
/* Пульс вокруг выхода за норму: именно эти точки ищут глазами первыми. */
[data-vibeui-block="sparkline-005"] [data-part="flash"]{
fill:var(--vibeui-sparkline-005-breach);
animation:vibeui-sparkline-005-flash 2.6s ease-out infinite;
}
[data-vibeui-block="sparkline-005"] [data-part="last"]{
fill:var(--vibeui-sparkline-005-accent);
stroke:light-dark(oklch(1 0 0),oklch(0.16 0 265));stroke-width:1.25;
}
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
 * Гладкая кривая через все точки: Catmull-Rom, переписанный кубическими
 * Безье. Ломаная углами спорит с мягкой полосой нормы; кривая проходит
 * ровно через значения и оставляет углы данным, а не отрисовке.
 */
function curve(points: { x: number; y: number }[]) {
  if (points.length < 2) {
    return points.length === 1 ? `M${points[0].x} ${points[0].y}` : ""
  }

  const round = (value: number) => Math.round(value * 100) / 100
  const parts = [`M${round(points[0].x)} ${round(points[0].y)}`]

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const start = points[index]
    const end = points[index + 1]
    const next = points[index + 2] ?? end

    parts.push(
      `C${round(start.x + (end.x - previous.x) / 6)} ${round(start.y + (end.y - previous.y) / 6)} ` +
        `${round(end.x - (next.x - start.x) / 6)} ${round(end.y - (next.y - start.y) / 6)} ` +
        `${round(end.x)} ${round(end.y)}`,
    )
  }

  return parts.join(" ")
}

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

  // Три пикселя сверху и снизу — место под толстую линию и кружки: без
  // отступа крайние точки срезались бы краем кадра.
  const inset = 3
  const toY = (point: number) =>
    HEIGHT - inset - ((point - min) / span) * (HEIGHT - inset * 2)
  const points = values.map((point, index) => ({
    x: (index / Math.max(1, values.length - 1)) * WIDTH,
    y: toY(point),
    breach: point > high || point < low,
  }))

  const line = curve(points)
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
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
          <line data-part="edge" x1={0} y1={bandTop} x2={WIDTH} y2={bandTop} />
          <line
            data-part="edge"
            x1={0}
            y1={bandBottom}
            x2={WIDTH}
            y2={bandBottom}
          />
          <path data-part="area" d={area} />
          <path data-part="glow" d={line} />
          <path data-part="line" d={line} pathLength={1} />
          {breaches.map((point) => (
            <g key={`${point.x}-${point.y}`}>
              <circle data-part="flash" cx={point.x} cy={point.y} r={3} />
              <circle data-part="breach" cx={point.x} cy={point.y} r={3} />
            </g>
          ))}
          <circle data-part="last" cx={last.x} cy={last.y} r={2.5} />
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
