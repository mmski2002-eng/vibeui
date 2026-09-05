import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim003Stage = {
  label: string
  value: string
  /** Ширина слэба в процентах от полной ширины воронки. */
  percent: number
}

export type ChartAnim003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: период среза. */
  period?: string
  stages?: ChartAnim003Stage[]
  accent?: string
  /** Слэбы темнеют по глубине градиентом. false — один плоский цвет. */
  gradient?: boolean
  /** Нижние слэбы растворяются к низу карточки. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: воронка конверсии из сужающихся трапеций-слэбов. Ширина слэба —
// процент от целой ширины, срез углов задаёт clip-path. Слэбы «вливаются»
// сверху вниз по очереди: opacity и scaleY идут от 0 к 1 с задержкой,
// пропорциональной положению в списке (обычный animation-delay, без CSS
// custom properties — ширина и задержка выражаются штатными свойствами).
const STYLES = `
:where([data-vibeui-block="chart-anim-003"]){
--vibeui-chart-anim-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-003-muted:color-mix(in oklab,var(--vibeui-chart-anim-003-fg) 62%,transparent);
--vibeui-chart-anim-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-003-accent-fg:oklch(from var(--vibeui-chart-anim-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-chart-anim-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-003"]{color-scheme:dark}
[data-vibeui-block="chart-anim-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-chart-anim-003-fg);font-family:var(--vibeui-chart-anim-003-font);
}
[data-vibeui-block="chart-anim-003"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-003"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-003-border);
background:var(--vibeui-chart-anim-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="chart-anim-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="chart-anim-003"] [data-part="title"]{margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-anim-003"] [data-part="period"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;padding:0 0.375rem;border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-chart-anim-003-muted);background:var(--vibeui-chart-anim-003-frame);
}
[data-vibeui-block="chart-anim-003"] [data-part="funnel"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="chart-anim-003"][data-fade="true"] [data-part="funnel"]{
-webkit-mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
}
[data-vibeui-block="chart-anim-003"] [data-part="row"]{
display:flex;flex-direction:column;gap:0.25rem;
animation:vibeui-chart-anim-003-pour .55s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="chart-anim-003"] [data-part="row-info"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.6875rem;
}
[data-vibeui-block="chart-anim-003"] [data-part="row-label"]{
font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-anim-003"] [data-part="row-meta"]{
flex:none;display:flex;align-items:baseline;gap:0.375rem;
color:var(--vibeui-chart-anim-003-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-anim-003"] [data-part="row-percent"]{font-weight:650;color:var(--vibeui-chart-anim-003-fg)}
[data-vibeui-block="chart-anim-003"] [data-part="slab"]{
height:1.375rem;margin:0 auto;background:var(--vibeui-chart-anim-003-accent);
clip-path:polygon(6% 0%,94% 0%,100% 100%,0% 100%);
transform-origin:top;
}
[data-vibeui-block="chart-anim-003"][data-gradient="true"] [data-part="slab"]{
background:linear-gradient(to bottom,var(--vibeui-chart-anim-003-accent),color-mix(in oklab,var(--vibeui-chart-anim-003-accent) 55%,transparent));
}
[data-vibeui-block="chart-anim-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-003-pour{from{opacity:0;transform:scaleY(0.4) translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-003"] [data-part="row"]{animation:none}
}
`

const DEFAULT_STAGES: ChartAnim003Stage[] = [
  { label: "Визиты", value: "24 800", percent: 100 },
  { label: "Регистрации", value: "8 950", percent: 68 },
  { label: "Добавили в корзину", value: "3 120", percent: 41 },
  { label: "Оплатили", value: "1 590", percent: 22 },
]

/**
 * Анимированная воронка конверсии: сужающиеся слэбы вливаются по очереди
 * сверху вниз. Один файл, ноль зависимостей, собственная палитра, клиентского
 * JS нет.
 */
export function ChartAnim003({
  title = "Воронка регистрации",
  period = "30д",
  stages = DEFAULT_STAGES,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim003Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-chart-anim-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-003"
        data-slot="chart-funnel"
        data-fade={fadeOut ? "true" : undefined}
        data-gradient={gradient ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <div data-part="head">
                <p data-part="title">{title}</p>
                {period ? <span data-part="period">{period}</span> : null}
              </div>
              <p data-part="sr">
                {title}:{" "}
                {stages.map((stage) => `${stage.label} ${stage.value} (${stage.percent}%)`).join(", ")}
              </p>
              <div data-part="funnel" aria-hidden="true">
                {stages.map((stageItem, index) => (
                  <div
                    data-part="row"
                    key={stageItem.label}
                    style={{ animationDelay: `${index * 110}ms` }}
                  >
                    <div data-part="row-info">
                      <span data-part="row-label">{stageItem.label}</span>
                      <span data-part="row-meta">
                        <span>{stageItem.value}</span>
                        <span data-part="row-percent">{stageItem.percent}%</span>
                      </span>
                    </div>
                    <div
                      data-part="slab"
                      style={{ width: `${stageItem.percent}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
