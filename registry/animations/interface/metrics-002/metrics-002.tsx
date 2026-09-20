import type { ComponentProps, CSSProperties } from "react"

export type Metrics002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Слово «тренд» в строке для скринридера. */
  trendWord?: string
  title?: string
  value?: number
  valuePrefix?: string
  valueSuffix?: string
  /** Знаковое значение тренда в процентах, например 12.4 или -3.2. */
  trendValue?: number
  periodLabel?: string
  accent?: string
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: одна крупная цифра, подпись и пилюля тренда. Цифра считается вверх
// от нуля до значения через анимируемое @property (CSS Houdini) — тот же
// приём, что и в metrics-001: браузер плавно интерполирует custom property
// между кадрами, а counter() показывает целую часть текстом без единого
// килобайта JS. Пилюля тренда просто всплывает fade+scale следом.
const STYLES = `
:where([data-vibeui-block="metrics-002"]){
--vibeui-metrics-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-metrics-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-metrics-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-metrics-002-muted:color-mix(in oklab,var(--vibeui-metrics-002-fg) 60%,transparent);
--vibeui-metrics-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-metrics-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-metrics-002-pos:light-dark(oklch(0.6 0.17 145),oklch(0.78 0.15 145));
--vibeui-metrics-002-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.17 25));
--vibeui-metrics-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="metrics-002"]{color-scheme:dark}
@property --vibeui-metrics-002-n{
syntax:'<integer>';inherits:false;initial-value:0;
}
[data-vibeui-block="metrics-002"]{
display:block;box-sizing:border-box;width:100%;max-width:14rem;margin:0;
color:var(--vibeui-metrics-002-fg);font-family:var(--vibeui-metrics-002-font);
}
[data-vibeui-block="metrics-002"] *{box-sizing:border-box}
[data-vibeui-block="metrics-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="metrics-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.375rem;border:1px solid var(--vibeui-metrics-002-border);
background:color-mix(in oklab,var(--vibeui-metrics-002-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="metrics-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-metrics-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="metrics-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="metrics-002"] [data-part="card"]{
position:relative;z-index:1;
border-radius:0.9375rem;border:1px solid var(--vibeui-metrics-002-border);
background:var(--vibeui-metrics-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:1rem;
}
[data-vibeui-block="metrics-002"] [data-part="label"]{
margin:0 0 0.375rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-metrics-002-muted);
}
[data-vibeui-block="metrics-002"] [data-part="value"]{
display:block;font-size:1.875rem;font-weight:750;letter-spacing:-0.03em;
line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="metrics-002"] [data-part="count"]{
--vibeui-metrics-002-n:0;counter-reset:vibeui-metrics-002-c var(--vibeui-metrics-002-n);
animation:vibeui-metrics-002-count 1.2s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="metrics-002"] [data-part="count"]::after{content:counter(vibeui-metrics-002-c)}
[data-vibeui-block="metrics-002"] [data-part="foot"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.625rem;
}
[data-vibeui-block="metrics-002"] [data-part="pill"]{
display:inline-flex;align-items:center;gap:0.1875rem;white-space:nowrap;
height:1.25rem;padding:0 0.4375rem;border-radius:9999px;
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
opacity:0;transform:scale(0.6);
animation:vibeui-metrics-002-pop .5s cubic-bezier(.34,1.56,.64,1) both;
animation-delay:.85s;
}
[data-vibeui-block="metrics-002"] [data-part="pill"] svg{width:0.625rem;height:0.625rem}
[data-vibeui-block="metrics-002"][data-trend="up"] [data-part="pill"]{
color:var(--vibeui-metrics-002-pos);
background:color-mix(in oklab,var(--vibeui-metrics-002-pos) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-metrics-002-pos) 24%,transparent);
}
[data-vibeui-block="metrics-002"][data-trend="down"] [data-part="pill"]{
color:var(--vibeui-metrics-002-neg);
background:color-mix(in oklab,var(--vibeui-metrics-002-neg) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-metrics-002-neg) 24%,transparent);
}
[data-vibeui-block="metrics-002"] [data-part="period"]{
font-size:0.625rem;color:var(--vibeui-metrics-002-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="metrics-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-metrics-002-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-metrics-002-count{from{--vibeui-metrics-002-n:0}to{--vibeui-metrics-002-n:var(--vibeui-metrics-002-target)}}
@keyframes vibeui-metrics-002-pop{
0%{opacity:0;transform:scale(0.6)}
70%{opacity:1;transform:scale(1.08)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="metrics-002"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="metrics-002"] [data-part="count"]{animation:none;--vibeui-metrics-002-n:var(--vibeui-metrics-002-target)}
[data-vibeui-block="metrics-002"] [data-part="pill"]{animation:none;opacity:1;transform:none}
}
`

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
 * Карточка показателя: крупное число считается вверх, следом всплывает
 * пилюля тренда со стрелкой и процентом. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function Metrics002({
  trendWord = "тренд",
  title = "Активные пользователи",
  value = 8412,
  valuePrefix = "",
  valueSuffix = "",
  trendValue = 12.4,
  periodLabel = "vs прошлый месяц",
  accent,
  gradient = true,
  isometric = false,
  className,
  style,
  ...props
}: Metrics002Props) {
  const palette = {
    ...(accent ? { "--vibeui-metrics-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const trend = trendValue >= 0 ? "up" : "down"
  const trendText = `${trendValue >= 0 ? "+" : ""}${trendValue}%`

  return (
    <>
      <style href="vibeui-metrics-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="metrics-002"
        data-slot="metrics-stat-card"
        data-trend={trend}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <p data-part="label">{title}</p>
              <span data-part="value">
                {valuePrefix}
                <span
                  data-part="count"
                  style={
                    { "--vibeui-metrics-002-target": value } as CSSProperties
                  }
                />
                {valueSuffix}
              </span>
              <div data-part="foot">
                <span data-part="pill" aria-hidden="true">
                  {trend === "up" ? ARROW_UP : ARROW_DOWN}
                  {trendText}
                </span>
                {periodLabel ? (
                  <span data-part="period">{periodLabel}</span>
                ) : null}
              </div>
              <p data-part="sr">
                {title}: {valuePrefix}
                {value}
                {valueSuffix}, {trendWord} {trendText} {periodLabel}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
