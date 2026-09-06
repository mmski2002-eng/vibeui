import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim004Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Подписи состояний. */
  stateText?: Record<"pos" | "warn" | "neg", string>
  /** Строка для скринридера: {title}, {value}, {max}, {sublabel}. */
  readTemplate?: string
  title?: string
  /** Пилюля в верхнем левом углу: статус показателя. */
  status?: string
  statusTone?: "pos" | "warn" | "neg"
  value?: number
  min?: number
  max?: number
  /** Подпись под крупным числом. */
  sublabel?: string
  /** Цветные зоны нормы под дугой (красная/жёлтая/зелёная). */
  zones?: boolean
  accent?: string
  /** Заливка дуги градиентом. false — плоский цвет. */
  gradient?: boolean
  /** Дуга растворяется к концу шкалы. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: полукруглый индикатор, дуга которого разворачивается до значения.
// SVG-дуге задан pathLength=100 — единицы штриха не зависят от реальной
// геометрии, поэтому дозаполнение до нужной доли считается в JS один раз,
// а анимирует его CSS через custom property (--vibeui-chart-anim-004-off,
// keyframes читают её как цель дозаполнения). Опциональные цветные зоны —
// статичная подложка под дугой.
const STYLES = `
:where([data-vibeui-block="chart-anim-004"]){
--vibeui-chart-anim-004-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-004-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-004-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-004-muted:color-mix(in oklab,var(--vibeui-chart-anim-004-fg) 62%,transparent);
--vibeui-chart-anim-004-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-004-track:light-dark(oklch(0.93 0 0),oklch(0.3 0 0));
--vibeui-chart-anim-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-004-bad:light-dark(oklch(0.62 0.19 25),oklch(0.7 0.17 25));
--vibeui-chart-anim-004-mid:light-dark(oklch(0.75 0.15 85),oklch(0.8 0.14 85));
--vibeui-chart-anim-004-good:light-dark(oklch(0.65 0.15 150),oklch(0.75 0.14 150));
--vibeui-chart-anim-004-pos:var(--vibeui-chart-anim-004-good);
--vibeui-chart-anim-004-warn:var(--vibeui-chart-anim-004-mid);
--vibeui-chart-anim-004-neg:var(--vibeui-chart-anim-004-bad);
--vibeui-chart-anim-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-004"]{color-scheme:dark}
[data-vibeui-block="chart-anim-004"]{
display:block;box-sizing:border-box;width:100%;max-width:17rem;margin:0;
color:var(--vibeui-chart-anim-004-fg);font-family:var(--vibeui-chart-anim-004-font);
}
[data-vibeui-block="chart-anim-004"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-004"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-004"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-004"] [data-part="card"]{
position:relative;
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-004-border);
background:var(--vibeui-chart-anim-004-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:1.75rem 1.25rem 0.875rem;
}
[data-vibeui-block="chart-anim-004"] [data-part="status"]{
position:absolute;top:0.625rem;left:0.625rem;
display:inline-flex;align-items:center;gap:0.3125rem;
height:1.125rem;padding:0 0.5rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;
}
[data-vibeui-block="chart-anim-004"] [data-part="status"][data-tone="pos"]{color:var(--vibeui-chart-anim-004-pos);background:color-mix(in oklab,var(--vibeui-chart-anim-004-pos) 16%,transparent)}
[data-vibeui-block="chart-anim-004"] [data-part="status"][data-tone="warn"]{color:var(--vibeui-chart-anim-004-warn);background:color-mix(in oklab,var(--vibeui-chart-anim-004-warn) 20%,transparent)}
[data-vibeui-block="chart-anim-004"] [data-part="status"][data-tone="neg"]{color:var(--vibeui-chart-anim-004-neg);background:color-mix(in oklab,var(--vibeui-chart-anim-004-neg) 16%,transparent)}
[data-vibeui-block="chart-anim-004"] [data-part="status-dot"]{width:0.3125rem;height:0.3125rem;border-radius:9999px;background:currentColor}
[data-vibeui-block="chart-anim-004"] [data-part="title"]{margin:0 0 0.625rem;text-align:center;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-anim-004"] [data-part="dial"]{position:relative;width:100%;max-width:13rem;margin:0 auto}
[data-vibeui-block="chart-anim-004"] [data-part="dial"] svg{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="chart-anim-004"] [data-part="track"]{fill:none;stroke:var(--vibeui-chart-anim-004-track);stroke-width:9;stroke-linecap:round}
[data-vibeui-block="chart-anim-004"] [data-part="zone"]{fill:none;stroke-width:9}
[data-vibeui-block="chart-anim-004"] [data-part="fill"]{
fill:none;stroke:var(--vibeui-chart-anim-004-accent);stroke-width:9;stroke-linecap:round;
stroke-dasharray:100;
animation:vibeui-chart-anim-004-sweep 1s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="chart-anim-004"][data-gradient="true"] [data-part="fill"]{stroke:url(#vibeui-chart-anim-004-grad)}
[data-vibeui-block="chart-anim-004"][data-fade="true"] [data-part="fill"]{opacity:.85;-webkit-mask-image:linear-gradient(to right,#000 70%,transparent 100%);mask-image:linear-gradient(to right,#000 70%,transparent 100%)}
[data-vibeui-block="chart-anim-004"] [data-part="center"]{
position:absolute;left:50%;bottom:0.375rem;transform:translateX(-50%);
display:flex;flex-direction:column;align-items:center;text-align:center;
}
[data-vibeui-block="chart-anim-004"] [data-part="value"]{font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-anim-004"] [data-part="sublabel"]{font-size:0.625rem;color:var(--vibeui-chart-anim-004-muted);max-width:9rem}
[data-vibeui-block="chart-anim-004"] [data-part="range"]{
display:flex;justify-content:space-between;margin-top:-0.5rem;
font-size:0.625rem;color:var(--vibeui-chart-anim-004-muted);
}
[data-vibeui-block="chart-anim-004"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-004-sweep{from{stroke-dashoffset:100}to{stroke-dashoffset:var(--vibeui-chart-anim-004-off)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-004"] [data-part="fill"]{animation:none;stroke-dashoffset:var(--vibeui-chart-anim-004-off)}
}
`

const STATUS_LABEL: Record<"pos" | "warn" | "neg", string> = {
  pos: "Норма",
  warn: "Внимание",
  neg: "Критично",
}

/**
 * Анимированный полукруглый индикатор: дуга разворачивается до значения,
 * опционально видны цветные зоны нормы. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function ChartAnim004({
  stateText = STATUS_LABEL,
  readTemplate = "{title}: {value} из {max}. {sublabel}",
  title = "Индекс здоровья системы",
  status,
  statusTone = "pos",
  value = 92,
  min = 0,
  max = 100,
  sublabel = "Все системы в норме",
  zones = true,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim004Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const fraction = Math.min(1, Math.max(0, (value - min) / (max - min || 1)))
  const off = 100 - fraction * 100
  const statusText = status ?? stateText[statusTone]

  return (
    <>
      <style href="vibeui-chart-anim-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-004"
        data-slot="chart-gauge"
        data-fade={fadeOut ? "true" : undefined}
        data-gradient={gradient ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <span data-part="status" data-tone={statusTone}>
                <span data-part="status-dot" aria-hidden="true" />
                {statusText}
              </span>
              <p data-part="title">{title}</p>
              <div data-part="dial">
                <p data-part="sr">
                  {readTemplate
                    .replace("{title}", title)
                    .replace("{value}", String(value))
                    .replace("{max}", String(max))
                    .replace("{sublabel}", sublabel)}
                </p>
                <svg viewBox="0 0 120 66" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient
                      id="vibeui-chart-anim-004-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--vibeui-chart-anim-004-accent)"
                      />
                      <stop
                        offset="100%"
                        stopColor="color-mix(in oklab, var(--vibeui-chart-anim-004-accent) 55%, transparent)"
                      />
                    </linearGradient>
                  </defs>
                  {zones ? (
                    <>
                      <path
                        data-part="zone"
                        d="M10 60 A50 50 0 0 1 35 16.7"
                        stroke="var(--vibeui-chart-anim-004-bad)"
                      />
                      <path
                        data-part="zone"
                        d="M35 16.7 A50 50 0 0 1 85 16.7"
                        stroke="var(--vibeui-chart-anim-004-mid)"
                      />
                      <path
                        data-part="zone"
                        d="M85 16.7 A50 50 0 0 1 110 60"
                        stroke="var(--vibeui-chart-anim-004-good)"
                      />
                    </>
                  ) : (
                    <path data-part="track" d="M10 60 A50 50 0 0 1 110 60" />
                  )}
                  <path
                    data-part="fill"
                    d="M10 60 A50 50 0 0 1 110 60"
                    pathLength={100}
                    style={
                      { "--vibeui-chart-anim-004-off": off } as CSSProperties
                    }
                  />
                </svg>
                <div data-part="center" aria-hidden="true">
                  <span data-part="value">{value}</span>
                  {sublabel ? (
                    <span data-part="sublabel">{sublabel}</span>
                  ) : null}
                </div>
              </div>
              <div data-part="range" aria-hidden="true">
                <span>{min}</span>
                <span>{max}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
