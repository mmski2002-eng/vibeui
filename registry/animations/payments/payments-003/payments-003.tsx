import type { ComponentProps, CSSProperties } from "react"

export type Payments003Meter = {
  label: string
  percent: number
}

export type Payments003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  usageLabel?: string
  used?: string
  quota?: string
  /** 0–100: доля использования квоты для главной полосы. */
  percent?: number
  meters?: Payments003Meter[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: сводка тарификации по использованию — главная полоса заполняется
// слева направо при появлении карточки и меняет цвет к красному по мере
// приближения к лимиту (обычный акцент до 70%, янтарный до 90%, красный
// дальше). Ниже — список отдельных метрик с такими же полосами поменьше,
// каждая въезжает с задержкой по своему индексу.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="payments-003"]){
--vibeui-payments-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-payments-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-payments-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-payments-003-muted:color-mix(in oklab,var(--vibeui-payments-003-fg) 60%,transparent);
--vibeui-payments-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-payments-003-track:light-dark(oklch(0.94 0 0),oklch(0.3 0 0));
--vibeui-payments-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-payments-003-warn:oklch(0.75 0.16 80);
--vibeui-payments-003-danger:oklch(0.62 0.21 25);
--vibeui-payments-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-payments-003-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="payments-003"]{color-scheme:dark}
[data-vibeui-block="payments-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-payments-003-fg);font-family:var(--vibeui-payments-003-font);
}
[data-vibeui-block="payments-003"] *{box-sizing:border-box}
[data-vibeui-block="payments-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="payments-003"] [data-part="frame"]{
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="payments-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-payments-003-border);
background:var(--vibeui-payments-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="payments-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="payments-003"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="payments-003"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1.125rem;padding:0 0.4375rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;
color:var(--vibeui-payments-003-muted);background:var(--vibeui-payments-003-frame);
}
[data-vibeui-block="payments-003"] [data-part="primary"]{margin-bottom:0.875rem}
[data-vibeui-block="payments-003"] [data-part="primary-top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.375rem;
}
[data-vibeui-block="payments-003"] [data-part="usage-label"]{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-payments-003-muted);
}
[data-vibeui-block="payments-003"] [data-part="usage-value"]{
font-family:var(--vibeui-payments-003-mono);font-size:0.75rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="payments-003"] [data-part="track"]{
position:relative;height:0.625rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-payments-003-track);
}
[data-vibeui-block="payments-003"] [data-part="fill"]{
position:absolute;inset:0;width:var(--vibeui-payments-003-v,0%);height:100%;border-radius:9999px;
background:var(--vibeui-payments-003-accent);transform-origin:left;transform:scaleX(0);
animation:vibeui-payments-003-grow 0.8s cubic-bezier(0.16,1,0.3,1) both;
animation-delay:0.1s;
}
[data-vibeui-block="payments-003"] [data-part="primary"][data-level="warn"] [data-part="fill"]{background:var(--vibeui-payments-003-warn)}
[data-vibeui-block="payments-003"] [data-part="primary"][data-level="danger"] [data-part="fill"]{background:var(--vibeui-payments-003-danger)}
[data-vibeui-block="payments-003"] [data-part="meters"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;padding-top:0.75rem;
border-top:1px solid var(--vibeui-payments-003-border);list-style:none;
}
[data-vibeui-block="payments-003"] [data-part="meter"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="payments-003"] [data-part="meter-top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="payments-003"] [data-part="meter-label"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-payments-003-muted);
}
[data-vibeui-block="payments-003"] [data-part="meter-value"]{
flex:none;font-family:var(--vibeui-payments-003-mono);font-size:0.6875rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="payments-003"] [data-part="meter-track"]{
position:relative;height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-payments-003-track);
}
[data-vibeui-block="payments-003"] [data-part="meter-fill"]{
position:absolute;inset:0;width:var(--vibeui-payments-003-v,0%);height:100%;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-payments-003-accent) 72%,transparent);
transform-origin:left;transform:scaleX(0);
animation:vibeui-payments-003-grow 0.7s cubic-bezier(0.16,1,0.3,1) both;
animation-delay:calc(0.2s + var(--vibeui-payments-003-i,0) * 110ms);
}
@keyframes vibeui-payments-003-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="payments-003"] [data-part="fill"]{animation:none;transform:scaleX(1)}
[data-vibeui-block="payments-003"] [data-part="meter-fill"]{animation:none;transform:scaleX(1)}
}
`

const DEFAULT_METERS: Payments003Meter[] = [
  { label: "Запросы API", percent: 46 },
  { label: "Хранилище", percent: 78 },
  { label: "Исходящий трафик", percent: 33 },
]

function levelFor(percent: number): "ok" | "warn" | "danger" {
  if (percent >= 90) return "danger"
  if (percent >= 70) return "warn"
  return "ok"
}

/**
 * Сводка тарификации по использованию: главная полоса заполняется слева
 * направо и краснеет к лимиту, ниже — отдельные метрики со своими полосами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Payments003({
  title = "Использование за период",
  badge = "Тариф Pro",
  usageLabel = "Запросы к API",
  used = "82 400",
  quota = "100 000",
  percent = 82,
  meters = DEFAULT_METERS,
  accent,
  isometric = false,
  className,
  style,
  ...props
}: Payments003Props) {
  const clamped = Math.min(100, Math.max(0, percent))
  const level = levelFor(clamped)
  const palette = {
    ...(accent ? { "--vibeui-payments-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-payments-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="payments-003"
        data-slot="usage-meter"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <div data-part="primary" data-level={level}>
                <div data-part="primary-top">
                  <span data-part="usage-label">{usageLabel}</span>
                  <span data-part="usage-value">
                    {used} / {quota}
                  </span>
                </div>
                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={clamped}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={usageLabel}
                >
                  <span
                    data-part="fill"
                    style={
                      { "--vibeui-payments-003-v": `${clamped}%` } as CSSProperties
                    }
                  />
                </div>
              </div>
              <ul data-part="meters">
                {meters.map((meter, index) => {
                  const value = Math.min(100, Math.max(0, meter.percent))

                  return (
                    <li data-part="meter" key={meter.label}>
                      <div data-part="meter-top">
                        <span data-part="meter-label">{meter.label}</span>
                        <span data-part="meter-value">{value}%</span>
                      </div>
                      <div
                        data-part="meter-track"
                        role="progressbar"
                        aria-valuenow={value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={meter.label}
                      >
                        <span
                          data-part="meter-fill"
                          style={
                            {
                              "--vibeui-payments-003-v": `${value}%`,
                              "--vibeui-payments-003-i": index,
                            } as CSSProperties
                          }
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
