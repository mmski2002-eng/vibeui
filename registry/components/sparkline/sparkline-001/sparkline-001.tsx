import type { CSSProperties } from "react"

export type Sparkline001Props = {
  values?: number[]
  label?: string
  /** Текущее значение крупно слева от кривой. */
  value?: string
  /** Изменение за период: положительное растёт, отрицательное падает. */
  delta?: number
  unit?: string
  /** Подпись для скринридера: {label}, {value}, {delta} и {unit} подставляются. */
  ariaTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: график размером со строку, который стоит рядом с числом,
// а не вместо него. Число отвечает «сколько», кривая — «куда идёт», и вместе
// они занимают место одной ячейки таблицы. Цвет считается из знака изменения,
// поэтому падение нельзя случайно покрасить в зелёный.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// показателя нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="sparkline-001"]){
--vibeui-sparkline-001-surface:transparent;
--vibeui-sparkline-001-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-sparkline-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-sparkline-001-muted:color-mix(in oklab,var(--vibeui-sparkline-001-fg) 68%,transparent);
--vibeui-sparkline-001-up:light-dark(oklch(0.58 0.15 152),oklch(0.76 0.14 152));
--vibeui-sparkline-001-down:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.17 25));
--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-up);
--vibeui-sparkline-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sparkline-001"]{color-scheme:dark}
/* Рамка держит показатель отдельной строкой, а подложка по умолчанию
   прозрачна: цвет приходит со страницы. */
[data-vibeui-block="sparkline-001"]{
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-sparkline-001-surface);
border:1px solid var(--vibeui-sparkline-001-surface-border);border-radius:0.75rem;
display:inline-flex;align-items:center;gap:0.75rem;
font-family:var(--vibeui-sparkline-001-font);color:var(--vibeui-sparkline-001-fg);
}
[data-vibeui-block="sparkline-001"][data-trend="down"]{--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-down)}
[data-vibeui-block="sparkline-001"][data-trend="flat"]{--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-muted)}
[data-vibeui-block="sparkline-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="sparkline-001"] [data-part="label"]{font-size:0.6875rem;color:var(--vibeui-sparkline-001-muted)}
[data-vibeui-block="sparkline-001"] [data-part="value"]{
font-size:1.125rem;font-weight:650;line-height:1.1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sparkline-001"] [data-part="chart"]{display:flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="sparkline-001"] svg{display:block;width:6.5rem;height:2rem;overflow:visible}
/* Заливка под кривой: она показывает объём, а не только направление, и
   держит взгляд на графике, когда кривая почти горизонтальна. Цвет —
   разбавленный акцент, поэтому падение остаётся красным и в заливке. */
[data-vibeui-block="sparkline-001"] [data-part="area"]{
stroke:none;fill:color-mix(in oklab,var(--vibeui-sparkline-001-accent) 18%,transparent);
animation:vibeui-sparkline-001-rise 0.7s ease-out both;
}
/* Мягкое свечение — та же кривая толстой полупрозрачной линией под основной:
   без него тонкая линия на светлой подложке выглядит вычерченной, а не живой. */
[data-vibeui-block="sparkline-001"] [data-part="glow"]{
fill:none;stroke:var(--vibeui-sparkline-001-accent);stroke-width:5;opacity:0.16;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="sparkline-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-sparkline-001-accent);stroke-width:2;
stroke-linecap:round;stroke-linejoin:round;
/* pathLength="1" на самом пути: длина кривой заранее неизвестна, а так
   штрих нормирован и линия «рисуется» одной строкой CSS. */
stroke-dasharray:1;animation:vibeui-sparkline-001-draw 0.9s ease-out both;
}
[data-vibeui-block="sparkline-001"] [data-part="halo"]{
fill:var(--vibeui-sparkline-001-accent);opacity:0.2;
animation:vibeui-sparkline-001-pulse 2.4s ease-out infinite;
}
[data-vibeui-block="sparkline-001"] [data-part="dot"]{
fill:var(--vibeui-sparkline-001-accent);
stroke:light-dark(oklch(1 0 0),oklch(0.16 0 265));stroke-width:1.5;
}
@keyframes vibeui-sparkline-001-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-sparkline-001-rise{from{opacity:0}to{opacity:1}}
@keyframes vibeui-sparkline-001-pulse{0%{r:3;opacity:0.28}70%{r:6;opacity:0}100%{r:6;opacity:0}}
[data-vibeui-block="sparkline-001"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.1875rem;
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-sparkline-001-accent);
}
[data-vibeui-block="sparkline-001"] [data-part="arrow"]{
width:0.3125rem;height:0.3125rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
transform:rotate(-45deg);
}
[data-vibeui-block="sparkline-001"][data-trend="down"] [data-part="arrow"]{transform:rotate(135deg)}
[data-vibeui-block="sparkline-001"][data-trend="flat"] [data-part="arrow"]{transform:rotate(45deg) scale(0.8)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VALUES = [12, 15, 13, 19, 17, 24, 22, 28, 31, 29, 36, 41]
const WIDTH = 104
const HEIGHT = 32
const ARIA_TEMPLATE = "{label}: {value}, изменение {delta}{unit}"

/**
 * Гладкая кривая через все точки: Catmull-Rom, переписанный кубическими
 * Безье. Ломаная из прямых отрезков читается как «данные скачут», хотя
 * скачет только частота замеров; кривая показывает ту же правду мягче и
 * при этом проходит ровно через значения, ничего не сглаживая по существу.
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
 * Мини-график размером со строку: число, кривая и изменение за период.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline001({
  values = DEFAULT_VALUES,
  label = "Установок за месяц",
  value = "1 284",
  delta = 12.4,
  unit = "%",
  ariaTemplate = ARIA_TEMPLATE,
  accent,
  background = "",
  className,
  style,
}: Sparkline001Props) {
  const palette = {
    // Красит рост, а не линию целиком: иначе падение переставало быть
    // красным, и график врал о направлении.
    ...(accent ? { "--vibeui-sparkline-001-up": accent } : null),
    ...(background
      ? {
          "--vibeui-sparkline-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  // Полтора пикселя сверху и снизу — место для толстой линии и кружка:
  // без них крайние точки срезались бы краем кадра.
  const inset = 3
  const points = values.map((point, index) => ({
    x: (index / Math.max(1, values.length - 1)) * WIDTH,
    y: HEIGHT - inset - ((point - min) / span) * (HEIGHT - inset * 2),
  }))

  const line = curve(points)
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
  const tail = points[points.length - 1]
  const trend = delta > 0.5 ? "up" : delta < -0.5 ? "down" : "flat"
  const description = ariaTemplate
    .replace("{label}", label)
    .replace("{value}", value)
    .replace("{delta}", String(delta))
    .replace("{unit}", unit)

  return (
    <>
      <style href="vibeui-sparkline-001" precedence="medium">
        {STYLES}
      </style>
      <span
        data-slot="sparkline"
        data-vibeui-block="sparkline-001"
        data-trend={trend}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="value">{value}</span>
        </span>
        <span data-part="chart">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={description}
          >
            <path data-part="area" d={area} />
            <path data-part="glow" d={line} pathLength={1} />
            <path data-part="line" d={line} pathLength={1} />
            <circle data-part="halo" cx={tail.x} cy={tail.y} r={3} />
            <circle data-part="dot" cx={tail.x} cy={tail.y} r={2.5} />
          </svg>
          <span data-part="delta">
            <span data-part="arrow" aria-hidden="true" />
            {Math.abs(delta)}
            {unit}
          </span>
        </span>
      </span>
    </>
  )
}
