import type { ComponentProps, CSSProperties } from "react"

export type Metrics001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Слова направления для скринридера. */
  trendText?: { up: string; down: string }
  title?: string
  /** Пилюля справа от заголовка: период сравнения. */
  period?: string
  beforeLabel?: string
  afterLabel?: string
  beforeValue?: number
  afterValue?: number
  /** Суффикс обоих чисел и дельты: "%", "К", "" и т. п. */
  unit?: string
  accent?: string
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: две панели «до» и «после», между ними — пилюля дельты со стрелкой.
// Оба числа считаются вверх от нуля до целевого значения через анимируемое
// @property (CSS Houdini): без него интерполяция custom property шла бы
// мгновенным скачком, а не плавной сменой кадров. Счётчик читает значение
// через counter(), поэтому JS не нужен вовсе. Дельта и её знак/цвет
// вычисляются на сервере из before/after, а пилюля появляется с задержкой —
// как будто дожидается, пока оба числа досчитают.
const STYLES = `
:where([data-vibeui-block="metrics-001"]){
--vibeui-metrics-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-metrics-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-metrics-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-metrics-001-muted:color-mix(in oklab,var(--vibeui-metrics-001-fg) 60%,transparent);
--vibeui-metrics-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-metrics-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-metrics-001-pos:light-dark(oklch(0.6 0.17 145),oklch(0.78 0.15 145));
--vibeui-metrics-001-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.17 25));
--vibeui-metrics-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="metrics-001"]{color-scheme:dark}
@property --vibeui-metrics-001-n{
syntax:'<integer>';inherits:false;initial-value:0;
}
[data-vibeui-block="metrics-001"]{
display:block;box-sizing:border-box;width:100%;max-width:19rem;margin:0;
color:var(--vibeui-metrics-001-fg);font-family:var(--vibeui-metrics-001-font);
}
[data-vibeui-block="metrics-001"] *{box-sizing:border-box}
[data-vibeui-block="metrics-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="metrics-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-metrics-001-border);
background:color-mix(in oklab,var(--vibeui-metrics-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="metrics-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-metrics-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="metrics-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="metrics-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-metrics-001-border);
background:var(--vibeui-metrics-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="metrics-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.875rem;
}
[data-vibeui-block="metrics-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="metrics-001"] [data-part="badge"]{
display:inline-flex;align-items:center;height:1.125rem;padding:0 0.5rem;
border-radius:9999px;font-size:0.625rem;font-weight:650;white-space:nowrap;
color:var(--vibeui-metrics-001-muted);
background:color-mix(in oklab,var(--vibeui-metrics-001-fg) 8%,transparent);
}
[data-vibeui-block="metrics-001"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.5rem;
}
[data-vibeui-block="metrics-001"] [data-part="panel"]{min-width:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="metrics-001"] [data-part="panel"][data-role="after"]{align-items:flex-end;text-align:right}
[data-vibeui-block="metrics-001"] [data-part="plabel"]{
font-size:0.625rem;font-weight:650;text-transform:uppercase;letter-spacing:0.04em;
color:var(--vibeui-metrics-001-muted);
}
[data-vibeui-block="metrics-001"] [data-part="pvalue"]{
font-size:1.5rem;font-weight:750;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;line-height:1;
}
[data-vibeui-block="metrics-001"] [data-part="panel"][data-role="after"] [data-part="pvalue"]{color:var(--vibeui-metrics-001-accent)}
[data-vibeui-block="metrics-001"] [data-part="count"]{
--vibeui-metrics-001-n:0;counter-reset:vibeui-metrics-001-c var(--vibeui-metrics-001-n);
animation:vibeui-metrics-001-count 1.1s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="metrics-001"] [data-part="count"]::after{content:counter(vibeui-metrics-001-c)}
[data-vibeui-block="metrics-001"] [data-part="count"][data-role="after"]{animation-delay:.32s}
[data-vibeui-block="metrics-001"] [data-part="arrow"]{
display:flex;flex-direction:column;align-items:center;gap:0.3125rem;
padding-top:1.125rem;
opacity:0;transform:scale(0.6);
animation:vibeui-metrics-001-pop .5s cubic-bezier(.34,1.56,.64,1) both;
animation-delay:1.05s;
}
[data-vibeui-block="metrics-001"] [data-part="chevron"]{width:0.875rem;height:0.875rem;color:var(--vibeui-metrics-001-muted)}
[data-vibeui-block="metrics-001"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.1875rem;white-space:nowrap;
height:1.25rem;padding:0 0.4375rem;border-radius:9999px;
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="metrics-001"] [data-part="delta"] svg{width:0.625rem;height:0.625rem}
[data-vibeui-block="metrics-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="metrics-001"][data-trend="up"] [data-part="delta"]{
color:var(--vibeui-metrics-001-pos);
background:color-mix(in oklab,var(--vibeui-metrics-001-pos) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-metrics-001-pos) 24%,transparent);
}
[data-vibeui-block="metrics-001"][data-trend="down"] [data-part="delta"]{
color:var(--vibeui-metrics-001-neg);
background:color-mix(in oklab,var(--vibeui-metrics-001-neg) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-metrics-001-neg) 24%,transparent);
}
@keyframes vibeui-metrics-001-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-metrics-001-count{from{--vibeui-metrics-001-n:0}to{--vibeui-metrics-001-n:var(--vibeui-metrics-001-target)}}
@keyframes vibeui-metrics-001-pop{
0%{opacity:0;transform:scale(0.6)}
70%{opacity:1;transform:scale(1.08)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="metrics-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="metrics-001"] [data-part="count"]{animation:none;--vibeui-metrics-001-n:var(--vibeui-metrics-001-target)}
[data-vibeui-block="metrics-001"] [data-part="arrow"]{animation:none;opacity:1;transform:none}
}
`

const CHEVRON_RIGHT = (
  <svg
    data-part="chevron"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
)

const ARROW_UP = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const ARROW_DOWN = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
)

/**
 * Сравнение метрики до и после: два числа считаются вверх, между ними
 * появляется пилюля дельты со стрелкой. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function Metrics001({
  trendText = { up: "рост", down: "падение" },
  title = "Конверсия оформления",
  period = "30 дней",
  beforeLabel = "До",
  afterLabel = "После",
  beforeValue = 64,
  afterValue = 89,
  unit = "%",
  accent,
  gradient = true,
  isometric = false,
  className,
  style,
  ...props
}: Metrics001Props) {
  const palette = {
    ...(accent ? { "--vibeui-metrics-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const delta = afterValue - beforeValue
  const trend = delta >= 0 ? "up" : "down"
  const deltaText = `${delta >= 0 ? "+" : ""}${delta}${unit}`

  return (
    <>
      <style href="vibeui-metrics-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="metrics-001"
        data-slot="metrics-comparison"
        data-trend={trend}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {period ? <span data-part="badge">{period}</span> : null}
              </div>
              <div data-part="row">
                <div data-part="panel" data-role="before">
                  <span data-part="plabel">{beforeLabel}</span>
                  <span data-part="pvalue">
                    <span
                      data-part="count"
                      data-role="before"
                      style={
                        {
                          "--vibeui-metrics-001-target": beforeValue,
                        } as CSSProperties
                      }
                    />
                    {unit}
                  </span>
                </div>
                <div data-part="arrow" aria-hidden="true">
                  {CHEVRON_RIGHT}
                  <span data-part="delta">
                    {trend === "up" ? ARROW_UP : ARROW_DOWN}
                    {deltaText}
                  </span>
                </div>
                <div data-part="panel" data-role="after">
                  <span data-part="plabel">{afterLabel}</span>
                  <span data-part="pvalue">
                    <span
                      data-part="count"
                      data-role="after"
                      style={
                        {
                          "--vibeui-metrics-001-target": afterValue,
                        } as CSSProperties
                      }
                    />
                    {unit}
                  </span>
                </div>
              </div>
              <p data-part="sr">
                {title}: {beforeLabel} {beforeValue}
                {unit}, {afterLabel} {afterValue}
                {unit}, {trend === "up" ? trendText.up : trendText.down}{" "}
                {deltaText}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
