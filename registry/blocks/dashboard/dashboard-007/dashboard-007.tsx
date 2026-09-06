import type { CSSProperties } from "react"

export type Dashboard007Stat = {
  label: string
  value: string
  delta?: string
  trend?: "up" | "down" | "flat"
  points?: number[]
  hint?: string
}

export type Dashboard007Props = {
  title?: string
  period?: string
  stats?: Dashboard007Stat[]
  /** Пусто — подложки нет, ряд ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: ряд показателей с кривой внутри плитки. Кривая — polyline в SVG
// с preserveAspectRatio="none": она тянется под ширину плитки и не требует
// пересчёта в JS. Направление показано стрелкой и словом «за неделю», потому
// что «+18 %» без периода не значит ничего, а цвет один не читается на печати.
// Кривая скрыта от скринридера: она повторяет уже названное число, и её
// озвучивание только удлиняет чтение.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у ряда нет, плитки внутри держат свою поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-007"]){
--vibeui-dashboard-007-bg:transparent;
--vibeui-dashboard-007-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dashboard-007-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-dashboard-007-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-007-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-dashboard-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-007-up:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-007-down:light-dark(oklch(0.57 0.19 25),oklch(0.74 0.16 25));
--vibeui-dashboard-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-007"]{color-scheme:dark}
[data-vibeui-block="dashboard-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-dashboard-007-bg);
font-family:var(--vibeui-dashboard-007-sans);color:var(--vibeui-dashboard-007-fg);
}
[data-vibeui-block="dashboard-007"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-007"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin-bottom:0.75rem;
}
[data-vibeui-block="dashboard-007"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-007"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-007-muted)}
[data-vibeui-block="dashboard-007"] ul{
list-style:none;margin:0;padding:0;
display:grid;grid-template-columns:1fr;gap:0.625rem;
}
@container (min-width: 26rem){[data-vibeui-block="dashboard-007"] ul{grid-template-columns:repeat(2,1fr)}}
@container (min-width: 48rem){[data-vibeui-block="dashboard-007"] ul{grid-template-columns:repeat(4,1fr)}}
[data-vibeui-block="dashboard-007"] [data-part="tile"]{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.75rem 0.875rem 0.5rem;
background:var(--vibeui-dashboard-007-card);
border:1px solid var(--vibeui-dashboard-007-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-007"] [data-part="label"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-007-muted)}
[data-vibeui-block="dashboard-007"] [data-part="value"]{
margin:0;font-size:1.375rem;font-weight:700;line-height:1.15;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
/* Направление: стрелка и период словом — «+18 %» без периода не значит ничего. */
[data-vibeui-block="dashboard-007"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.25rem;margin:0;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-007-muted);
}
[data-vibeui-block="dashboard-007"] [data-trend="up"] [data-part="delta"]{color:var(--vibeui-dashboard-007-up)}
[data-vibeui-block="dashboard-007"] [data-trend="down"] [data-part="delta"]{color:var(--vibeui-dashboard-007-down)}
[data-vibeui-block="dashboard-007"] [data-part="hint"]{margin:0.125rem 0 0;font-size:0.625rem;color:var(--vibeui-dashboard-007-muted)}
/* Кривая тянется по ширине плитки: пересчёт в пиксели не нужен. */
[data-vibeui-block="dashboard-007"] svg{display:block;width:100%;height:2.25rem;margin-top:0.375rem;overflow:visible}
[data-vibeui-block="dashboard-007"] polyline{
fill:none;stroke:var(--vibeui-dashboard-007-accent);stroke-width:2;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
}
[data-vibeui-block="dashboard-007"] [data-trend="down"] polyline{stroke:var(--vibeui-dashboard-007-down)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Dashboard007Stat[] = [
  {
    label: "Установки",
    value: "1 284",
    delta: "+18 %",
    trend: "up",
    points: [22, 28, 26, 35, 33, 44, 52],
    hint: "за неделю",
  },
  {
    label: "Проекты",
    value: "312",
    delta: "+6 %",
    trend: "up",
    points: [40, 42, 41, 45, 44, 48, 50],
    hint: "за неделю",
  },
  {
    label: "Отказы установки",
    value: "7",
    delta: "−41 %",
    trend: "down",
    points: [30, 26, 24, 18, 16, 12, 9],
    hint: "за неделю",
  },
  {
    label: "Среднее время",
    value: "2,4 с",
    delta: "без изменений",
    trend: "flat",
    points: [24, 25, 24, 24, 25, 24, 24],
    hint: "за неделю",
  },
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

function line(points: number[]) {
  const max = Math.max(...points, 1)
  const step = 100 / Math.max(points.length - 1, 1)
  return points
    .map(
      (point, index) =>
        `${(index * step).toFixed(2)},${(100 - (point / max) * 88).toFixed(2)}`,
    )
    .join(" ")
}

/**
 * Ряд показателей: значение, направление словом и кривая внутри плитки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard007({
  title = "Ключевые показатели",
  period = "8–14 марта",
  stats = DEFAULT_STATS,
  background = "",
  accent,
  className,
  style,
}: Dashboard007Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-007"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="period">{period}</p>
        </header>
        <ul>
          {stats.map((stat) => (
            <li
              key={stat.label}
              data-part="tile"
              data-trend={stat.trend ?? "flat"}
            >
              <p data-part="label">{stat.label}</p>
              <p data-part="value">{stat.value}</p>
              {stat.delta ? (
                <p data-part="delta">
                  {stat.trend === "down"
                    ? "↓"
                    : stat.trend === "up"
                      ? "↑"
                      : "→"}{" "}
                  {stat.delta}
                  {stat.hint ? (
                    <span data-part="hint"> {stat.hint}</span>
                  ) : null}
                </p>
              ) : null}
              {stat.points?.length ? (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polyline points={line(stat.points)} />
                </svg>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
