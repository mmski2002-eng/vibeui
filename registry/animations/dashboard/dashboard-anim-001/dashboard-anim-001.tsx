import type { ComponentProps, CSSProperties } from "react"

export type DashboardAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Заголовок метрики над числом. */
  title?: string
  /** Число целиком как строка: цифры крутятся барабаном, остальные символы (пробел, $, %) просто проявляются. */
  value?: string
  /** Пилюля тренда, например "+12,4%". */
  trend?: string
  trendTone?: "up" | "down"
  /** Точки для мини-спарклайна, любое количество. */
  spark?: number[]
  accent?: string
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: компактная панель метрики. Число — не просто текст, а барабан:
// каждая цифра лежит в своей колонке со стопкой 0–9 и едет вверх, пока не
// встанет на нужном значении, — визуально это и есть «число считается
// вверх». Остальные символы строки (пробел, $, %, запятая) просто
// проявляются в том же ритме. Справа от числа — мини-спарклайн: линия
// дорисовывается слева направо через stroke-dashoffset, заливка под ней и
// точка на конце проявляются следом. Цикл бесконечный: досчитав и
// дорисовав, панель на мгновение гаснет и считает заново — как живое демо.
// Настоящее значение остаётся в DOM отдельной скрытой строкой для
// скринридера, барабан и график декоративны (aria-hidden).
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="dashboard-anim-001"]){
--vibeui-dashboard-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-dashboard-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-dashboard-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-dashboard-anim-001-muted:color-mix(in oklab,var(--vibeui-dashboard-anim-001-fg) 60%,transparent);
--vibeui-dashboard-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-dashboard-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-dashboard-anim-001-up:light-dark(oklch(0.6 0.15 148),oklch(0.72 0.14 148));
--vibeui-dashboard-anim-001-down:light-dark(oklch(0.62 0.21 25),oklch(0.72 0.18 25));
--vibeui-dashboard-anim-001-tone:var(--vibeui-dashboard-anim-001-up);
--vibeui-dashboard-anim-001-digit-h:1.625rem;
--vibeui-dashboard-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-anim-001"]{color-scheme:dark}
[data-vibeui-block="dashboard-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:14.5rem;margin:0;
color:var(--vibeui-dashboard-anim-001-fg);font-family:var(--vibeui-dashboard-anim-001-font);
}
[data-vibeui-block="dashboard-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-anim-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="dashboard-anim-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.3125rem;
border-radius:1.25rem;border:1px solid var(--vibeui-dashboard-anim-001-border);
background:color-mix(in oklab,var(--vibeui-dashboard-anim-001-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="glow"]{
position:absolute;left:0.25rem;right:0.25rem;bottom:0;height:3.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(6px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-dashboard-anim-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="dashboard-anim-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="dashboard-anim-001"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:1rem;border:1px solid var(--vibeui-dashboard-anim-001-border);
background:var(--vibeui-dashboard-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.75rem 0.8125rem 0.6875rem;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="label"]{
margin:0;font-size:0.6875rem;font-weight:650;letter-spacing:0.01em;color:var(--vibeui-dashboard-anim-001-muted);
text-transform:uppercase;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="trend"]{
flex:none;display:inline-flex;align-items:center;
padding:0.1875rem 0.4375rem;border-radius:9999px;
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-dashboard-anim-001-tone);
background:color-mix(in oklab,var(--vibeui-dashboard-anim-001-tone) 16%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-dashboard-anim-001-tone) 26%,transparent);
}
[data-vibeui-block="dashboard-anim-001"] [data-part="body"]{
display:flex;align-items:flex-end;gap:0.625rem;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="value"]{
display:flex;align-items:baseline;flex:none;
font-size:1.375rem;font-weight:750;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;line-height:var(--vibeui-dashboard-anim-001-digit-h);
}
[data-vibeui-block="dashboard-anim-001"] [data-part="digit"]{
display:inline-block;overflow:hidden;width:0.6em;height:var(--vibeui-dashboard-anim-001-digit-h);
}
[data-vibeui-block="dashboard-anim-001"] [data-part="reel"]{
display:flex;flex-direction:column;
animation:vibeui-dashboard-anim-001-reel 4.5s cubic-bezier(.22,.85,.34,1) infinite;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="reel"] span{
display:block;height:var(--vibeui-dashboard-anim-001-digit-h);text-align:center;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="glyph"]{
display:inline-block;height:var(--vibeui-dashboard-anim-001-digit-h);
animation:vibeui-dashboard-anim-001-fade 4.5s ease-in-out infinite;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="chart"]{
flex:1;min-width:0;height:2.375rem;overflow:visible;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="area"]{
fill:color-mix(in oklab,var(--vibeui-dashboard-anim-001-accent) 20%,transparent);
stroke:none;animation:vibeui-dashboard-anim-001-area 4.5s ease-in-out infinite;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-dashboard-anim-001-accent);
stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
animation:vibeui-dashboard-anim-001-draw 4.5s ease-in-out infinite;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="dot"]{
fill:var(--vibeui-dashboard-anim-001-accent);
animation:vibeui-dashboard-anim-001-dot 4.5s ease-in-out infinite;
}
[data-vibeui-block="dashboard-anim-001"] [data-part="sr-only"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@keyframes vibeui-dashboard-anim-001-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-dashboard-anim-001-reel{
0%{opacity:0;transform:translateY(0)}
8%{opacity:1;transform:translateY(0)}
55%,88%{opacity:1;transform:translateY(calc(var(--vibeui-dashboard-anim-001-target,0) * -1 * var(--vibeui-dashboard-anim-001-digit-h)))}
96%{opacity:0;transform:translateY(calc(var(--vibeui-dashboard-anim-001-target,0) * -1 * var(--vibeui-dashboard-anim-001-digit-h)))}
100%{opacity:0;transform:translateY(0)}
}
@keyframes vibeui-dashboard-anim-001-fade{0%,100%{opacity:0}8%,88%{opacity:1}96%{opacity:0}}
@keyframes vibeui-dashboard-anim-001-draw{
0%,100%{stroke-dashoffset:100;opacity:0}
8%{opacity:1}
55%,88%{stroke-dashoffset:0;opacity:1}
96%{stroke-dashoffset:0;opacity:0}
}
@keyframes vibeui-dashboard-anim-001-area{0%,55%,100%{opacity:0}72%,88%{opacity:1}96%{opacity:0}}
@keyframes vibeui-dashboard-anim-001-dot{0%,52%,100%{opacity:0}62%,88%{opacity:1}96%{opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dashboard-anim-001"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="dashboard-anim-001"] [data-part="reel"]{animation:none;opacity:1;transform:translateY(calc(var(--vibeui-dashboard-anim-001-target,0) * -1 * var(--vibeui-dashboard-anim-001-digit-h)))}
[data-vibeui-block="dashboard-anim-001"] [data-part="glyph"]{animation:none;opacity:1}
[data-vibeui-block="dashboard-anim-001"] [data-part="line"]{animation:none;stroke-dashoffset:0;opacity:1}
[data-vibeui-block="dashboard-anim-001"] [data-part="area"]{animation:none;opacity:1}
[data-vibeui-block="dashboard-anim-001"] [data-part="dot"]{animation:none;opacity:1}
}
`

const DIGIT_COLUMN = "0123456789".split("")

const DEFAULT_SPARK = [22, 30, 26, 38, 34, 48, 40, 58, 52, 66]

/**
 * Разбирает строку значения на колонки-барабаны для цифр и проявляющиеся
 * глифы для остальных символов (пробел, $, %, запятая).
 */
function renderValue(value: string) {
  return value.split("").map((char, index) => {
    if (/[0-9]/.test(char)) {
      return (
        <span data-part="digit" key={index}>
          <span
            data-part="reel"
            style={
              { "--vibeui-dashboard-anim-001-target": char } as CSSProperties
            }
          >
            {DIGIT_COLUMN.map((digit) => (
              <span key={digit}>{digit}</span>
            ))}
          </span>
        </span>
      )
    }

    return (
      <span data-part="glyph" key={index}>
        {char}
      </span>
    )
  })
}

/** Строит ломаную-спарклайн и площадь под ней в viewBox 0 0 120 36. */
function buildSpark(points: number[]) {
  const width = 120
  const height = 36
  const padTop = 4
  const padBottom = 4
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points.map((value, index) => {
    const x = points.length > 1 ? (index / (points.length - 1)) * width : 0
    const y =
      height -
      padBottom -
      ((value - min) / range) * (height - padTop - padBottom)
    return [x, y] as const
  })

  const line = coords
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`,
    )
    .join(" ")

  const [firstX] = coords[0]
  const [lastX] = coords[coords.length - 1]
  const area = `${line} L${lastX.toFixed(1)},${height} L${firstX.toFixed(1)},${height} Z`

  return { line, area, last: coords[coords.length - 1] }
}

/**
 * Компактная панель метрики: число крутится барабаном по цифрам, справа
 * мини-спарклайн дорисовывается слева направо. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function DashboardAnim001({
  title = "Доход",
  value = "$12 480",
  trend = "+12,4%",
  trendTone = "up",
  spark = DEFAULT_SPARK,
  accent,
  gradient = true,
  isometric = false,
  className,
  style,
  ...props
}: DashboardAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-anim-001-accent": accent } : null),
    "--vibeui-dashboard-anim-001-tone": `var(--vibeui-dashboard-anim-001-${trendTone})`,
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const { line, area, last } = buildSpark(spark)

  return (
    <>
      <style href="vibeui-dashboard-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="dashboard-anim-001"
        data-slot="mini-panel"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="label">{title}</p>
                {trend ? <span data-part="trend">{trend}</span> : null}
              </div>
              <div data-part="body">
                <span data-part="value" aria-hidden="true">
                  {renderValue(value)}
                </span>
                <span data-part="sr-only">
                  {title}: {value} ({trend})
                </span>
                <svg
                  data-part="chart"
                  viewBox="0 0 120 36"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path data-part="area" d={area} />
                  <path data-part="line" d={line} pathLength={100} />
                  <circle data-part="dot" cx={last[0]} cy={last[1]} r={2.4} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
