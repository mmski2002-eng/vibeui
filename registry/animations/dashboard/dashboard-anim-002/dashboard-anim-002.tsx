import type { ComponentProps, CSSProperties } from "react"

export type DashboardAnim002Widget = {
  label: string
  value: string
  trend?: string
  trendTone?: "up" | "down"
  /** Высоты столбиков мини-графика, любые положительные числа — нормализуются сами. */
  bars?: number[]
}

export type DashboardAnim002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  widgets?: DashboardAnim002Widget[]
  /** Число колонок сетки: 2 (2×3) или 3 (2×2 при 4 виджетах, 2×3 по умолчанию). */
  columns?: 2 | 3
  accent?: string
  /** Изометрический наклон всей сетки. */
  isometric?: boolean
}

// Идея: сетка карточек-виджетов дашборда. Карточки появляются по очереди
// увеличением с прозрачности (scale+fade) — анимацией управляет один
// именованный view-timeline на сетке, а стаггер получается срезами одного и
// того же таймлайна (animation-range сдвинут по номеру карточки), как и у
// activity-001/table-anim-001, без единой строки JS. Внутри каждой карточки —
// заголовок метрики, число, пилюля тренда и мини-график столбиками, где
// последний столбик подсвечен акцентом как «текущее» значение.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="dashboard-anim-002"]){
--vibeui-dashboard-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-dashboard-anim-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-dashboard-anim-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-dashboard-anim-002-muted:color-mix(in oklab,var(--vibeui-dashboard-anim-002-fg) 60%,transparent);
--vibeui-dashboard-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-dashboard-anim-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-dashboard-anim-002-up:light-dark(oklch(0.6 0.15 148),oklch(0.72 0.14 148));
--vibeui-dashboard-anim-002-down:light-dark(oklch(0.62 0.21 25),oklch(0.72 0.18 25));
--vibeui-dashboard-anim-002-tone:var(--vibeui-dashboard-anim-002-up);
--vibeui-dashboard-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-anim-002"]{color-scheme:dark}
[data-vibeui-block="dashboard-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;margin:0;
color:var(--vibeui-dashboard-anim-002-fg);font-family:var(--vibeui-dashboard-anim-002-font);
perspective:1400px;
}
[data-vibeui-block="dashboard-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-anim-002"] [data-part="heading"]{
margin:0 0 0.5rem;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;color:var(--vibeui-dashboard-anim-002-muted);
}
[data-vibeui-block="dashboard-anim-002"] [data-part="grid"]{
display:grid;gap:0.625rem;grid-template-columns:repeat(3,minmax(0,1fr));
transform-origin:center;transition:transform .3s ease;
view-timeline:--vibeui-dashboard-anim-002 block;
}
[data-vibeui-block="dashboard-anim-002"][data-columns="2"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]{
border-radius:0.875rem;border:1px solid var(--vibeui-dashboard-anim-002-border);
background:var(--vibeui-dashboard-anim-002-card);box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.625rem 0.6875rem 0.5625rem;min-width:0;
animation:vibeui-dashboard-anim-002-pop linear both;
animation-timeline:--vibeui-dashboard-anim-002;
animation-range:entry 0% entry 38%;
}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]:nth-child(2){animation-range:entry 6% entry 44%}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]:nth-child(3){animation-range:entry 12% entry 50%}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]:nth-child(4){animation-range:entry 18% entry 56%}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]:nth-child(5){animation-range:entry 24% entry 62%}
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]:nth-child(6){animation-range:entry 30% entry 68%}
[data-vibeui-block="dashboard-anim-002"] [data-part="whead"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.375rem;margin-bottom:0.375rem;
}
[data-vibeui-block="dashboard-anim-002"] [data-part="wlabel"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;font-weight:650;letter-spacing:0.01em;text-transform:uppercase;
color:var(--vibeui-dashboard-anim-002-muted);
}
[data-vibeui-block="dashboard-anim-002"] [data-part="wtrend"]{
flex:none;font-size:0.5625rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-dashboard-anim-002-tone);
}
[data-vibeui-block="dashboard-anim-002"] [data-part="wvalue"]{
margin:0 0 0.4375rem;font-size:1.0625rem;font-weight:750;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-anim-002"] [data-part="bars"]{
display:flex;align-items:flex-end;gap:0.1875rem;height:1.375rem;
}
[data-vibeui-block="dashboard-anim-002"] [data-part="bar"]{
flex:1;min-width:0.125rem;border-radius:0.125rem 0.125rem 0 0;
height:var(--vibeui-dashboard-anim-002-bar-h,20%);
background:color-mix(in oklab,var(--vibeui-dashboard-anim-002-fg) 16%,transparent);
}
[data-vibeui-block="dashboard-anim-002"] [data-part="bar"][data-current="true"]{
background:var(--vibeui-dashboard-anim-002-accent);
}
@keyframes vibeui-dashboard-anim-002-pop{from{opacity:0;transform:scale(0.86)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dashboard-anim-002"] [data-part="widget"]{animation:none}
}
`

const DEFAULT_WIDGETS: DashboardAnim002Widget[] = [
  {
    label: "Доход",
    value: "$12 480",
    trend: "+12,4%",
    trendTone: "up",
    bars: [30, 42, 38, 55, 70],
  },
  {
    label: "Пользователи",
    value: "3 214",
    trend: "+4,1%",
    trendTone: "up",
    bars: [50, 46, 58, 54, 64],
  },
  {
    label: "Заказы",
    value: "812",
    trend: "+9,8%",
    trendTone: "up",
    bars: [24, 36, 30, 48, 58],
  },
  {
    label: "Конверсия",
    value: "3,4%",
    trend: "-0,6%",
    trendTone: "down",
    bars: [60, 55, 58, 50, 46],
  },
  {
    label: "Отток",
    value: "1,2%",
    trend: "-0,3%",
    trendTone: "up",
    bars: [40, 44, 38, 34, 30],
  },
  {
    label: "Аптайм",
    value: "99,98%",
    trend: "+0,02%",
    trendTone: "up",
    bars: [62, 64, 63, 65, 66],
  },
]

function barHeight(bars: number[], index: number) {
  const max = Math.max(...bars, 1)
  const pct = Math.round((bars[index] / max) * 100)

  return `${Math.max(pct, 8)}%`
}

/**
 * Сетка карточек-виджетов дашборда: появляются по очереди увеличением с
 * прозрачности (scale+fade) по scroll-driven view-timeline. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function DashboardAnim002({
  title = "Обзор",
  widgets = DEFAULT_WIDGETS,
  columns = 3,
  accent,
  isometric = false,
  className,
  style,
  ...props
}: DashboardAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-anim-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const gridStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-dashboard-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="dashboard-anim-002"
        data-slot="widget-grid"
        data-columns={columns === 2 ? "2" : undefined}
        className={className}
        style={palette}
      >
        {title ? <p data-part="heading">{title}</p> : null}
        <div data-part="grid" style={gridStyle}>
          {widgets.map((widget) => {
            const bars = widget.bars ?? [40, 50, 45, 60, 65]
            const tone = widget.trendTone ?? "up"

            return (
              <article
                data-part="widget"
                key={widget.label}
                style={
                  {
                    "--vibeui-dashboard-anim-002-tone": `var(--vibeui-dashboard-anim-002-${tone})`,
                  } as CSSProperties
                }
              >
                <div data-part="whead">
                  <p data-part="wlabel">{widget.label}</p>
                  {widget.trend ? (
                    <span data-part="wtrend">{widget.trend}</span>
                  ) : null}
                </div>
                <p data-part="wvalue">{widget.value}</p>
                <div data-part="bars" aria-hidden="true">
                  {bars.map((_, index) => (
                    <span
                      data-part="bar"
                      data-current={
                        index === bars.length - 1 ? "true" : undefined
                      }
                      key={index}
                      style={
                        {
                          "--vibeui-dashboard-anim-002-bar-h": barHeight(
                            bars,
                            index,
                          ),
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
