import type { ComponentProps, CSSProperties } from "react"

export type CalendarAnim003Day = {
  day: number
  muted?: boolean
  /** Сегодняшний день: пульсирующее кольцо вокруг числа. */
  today?: boolean
  /** До трёх меток событий — цвет берётся из палитры категорий 1–4. */
  events?: Array<1 | 2 | 3 | 4>
}

export type CalendarAnim003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  days?: CalendarAnim003Day[]
  /** Семь сокращений дней недели, начиная с понедельника. */
  weekdays?: string[]
  accent?: string
  /** Точки событий проявляются волной по диагонали. false — видимы сразу. */
  wave?: boolean
  /** Пульсирующее кольцо вокруг сегодняшнего дня. */
  pulse?: boolean
}

const DEFAULT_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

// Идея: полная сетка месяца, где у части дней под числом — маленькие точки
// событий. Проявляются они не все разом и не по порядку чтения, а волной по
// диагонали: задержка каждой точки растёт с суммой номера строки и колонки,
// поэтому фронт волны идёт из левого верхнего угла к правому нижнему. Один
// день отмечен как «сегодня» — вокруг его числа бесконечно пульсирует
// кольцо, это единственная непрерывная анимация в компоненте.
const STYLES = `
:where([data-vibeui-block="calendar-anim-003"]){
--vibeui-calendar-anim-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-calendar-anim-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-calendar-anim-003-muted:color-mix(in oklab,var(--vibeui-calendar-anim-003-fg) 55%,transparent);
--vibeui-calendar-anim-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-calendar-anim-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-calendar-anim-003-cat-1:light-dark(oklch(0.6 0.19 265),oklch(0.72 0.16 265));
--vibeui-calendar-anim-003-cat-2:light-dark(oklch(0.62 0.17 165),oklch(0.72 0.15 165));
--vibeui-calendar-anim-003-cat-3:light-dark(oklch(0.68 0.18 70),oklch(0.78 0.15 70));
--vibeui-calendar-anim-003-cat-4:light-dark(oklch(0.6 0.2 20),oklch(0.72 0.17 20));
--vibeui-calendar-anim-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-anim-003"]{color-scheme:dark}
[data-vibeui-block="calendar-anim-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-calendar-anim-003-fg);font-family:var(--vibeui-calendar-anim-003-font);
}
[data-vibeui-block="calendar-anim-003"] *{box-sizing:border-box}
[data-vibeui-block="calendar-anim-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-calendar-anim-003-border);
background:var(--vibeui-calendar-anim-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="calendar-anim-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-calendar-anim-003-border);
}
[data-vibeui-block="calendar-anim-003"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-anim-003"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-anim-003-accent);
background:color-mix(in oklab,var(--vibeui-calendar-anim-003-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-calendar-anim-003-accent) 22%,transparent);
}
[data-vibeui-block="calendar-anim-003"] [data-part="body"]{padding:0.75rem 0.625rem 0.875rem}
[data-vibeui-block="calendar-anim-003"] [data-part="weekdays"],
[data-vibeui-block="calendar-anim-003"] [data-part="days"]{
display:grid;grid-template-columns:repeat(7,1fr);
}
[data-vibeui-block="calendar-anim-003"] [data-part="weekdays"]{margin-bottom:0.125rem}
[data-vibeui-block="calendar-anim-003"] [data-part="wd"]{
display:flex;align-items:center;justify-content:center;
height:1.25rem;font-size:0.5rem;font-weight:650;
color:var(--vibeui-calendar-anim-003-muted);
}
[data-vibeui-block="calendar-anim-003"] [data-part="day"]{
position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:0.1875rem;min-height:2.125rem;
}
[data-vibeui-block="calendar-anim-003"] [data-part="num"]{
position:relative;z-index:1;display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-anim-003"] [data-day-muted="true"] [data-part="num"]{
color:var(--vibeui-calendar-anim-003-muted);opacity:0.5;
}
[data-vibeui-block="calendar-anim-003"][data-pulse="true"] [data-part="day"][data-today="true"] [data-part="num"]::before{
content:"";position:absolute;inset:-0.1875rem;border-radius:9999px;
border:1.5px solid var(--vibeui-calendar-anim-003-accent);
animation:vibeui-calendar-anim-003-ping 2.4s ease-out infinite;
}
[data-vibeui-block="calendar-anim-003"] [data-part="day"][data-today="true"] [data-part="num"]{
font-weight:700;color:var(--vibeui-calendar-anim-003-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-calendar-anim-003-accent);
}
[data-vibeui-block="calendar-anim-003"] [data-part="dots"]{
display:flex;align-items:center;justify-content:center;gap:0.1875rem;height:0.3125rem;
}
[data-vibeui-block="calendar-anim-003"] [data-part="dot"]{
width:0.25rem;height:0.25rem;border-radius:9999px;background:var(--vibeui-calendar-anim-003-dot,var(--vibeui-calendar-anim-003-accent));
opacity:0;transform:scale(0.2);
animation:vibeui-calendar-anim-003-pop 0.4s ease-out both;
animation-delay:calc(var(--vibeui-calendar-anim-003-i,0) * 60ms + 200ms);
}
[data-vibeui-block="calendar-anim-003"][data-wave="false"] [data-part="dot"]{
animation:none;opacity:1;transform:none;
}
@keyframes vibeui-calendar-anim-003-pop{
0%{opacity:0;transform:scale(0.2)}
70%{opacity:1;transform:scale(1.25)}
100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-calendar-anim-003-ping{
0%{transform:scale(0.85);opacity:0.7}
80%,100%{transform:scale(1.35);opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="calendar-anim-003"] [data-part="dot"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="calendar-anim-003"] [data-part="day"][data-today="true"] [data-part="num"]::before{animation:none;opacity:0}
}
`

const CATEGORY_VARS: Record<number, string> = {
  1: "var(--vibeui-calendar-anim-003-cat-1)",
  2: "var(--vibeui-calendar-anim-003-cat-2)",
  3: "var(--vibeui-calendar-anim-003-cat-3)",
  4: "var(--vibeui-calendar-anim-003-cat-4)",
}

const DEFAULT_DAYS: CalendarAnim003Day[] = [
  { day: 31, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4, events: [1] },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9, events: [2] },
  { day: 10 },
  { day: 11, events: [1, 3] },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16, today: true, events: [2] },
  { day: 17 },
  { day: 18, events: [4, 1] },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22, events: [3] },
  { day: 23 },
  { day: 24 },
  { day: 25, events: [2, 4] },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29, events: [1] },
  { day: 30 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
]

/**
 * Полная сетка месяца с точками событий, которые проявляются волной по
 * диагонали. Один файл, ноль зависимостей, собственная палитра.
 */
export function CalendarAnim003({
  title = "Сентябрь 2026",
  badge = "8 событий",
  days = DEFAULT_DAYS,
  weekdays = DEFAULT_WEEKDAYS,
  accent,
  wave = true,
  pulse = true,
  className,
  style,
  ...props
}: CalendarAnim003Props) {
  const palette = {
    ...(accent ? { "--vibeui-calendar-anim-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-anim-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-anim-003"
        data-slot="calendar-month-view"
        data-wave={wave ? "true" : "false"}
        data-pulse={pulse ? "true" : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <div data-part="body">
            <div data-part="weekdays">
              {weekdays.map((label, index) => (
                <span data-part="wd" key={`${label}-${index}`}>
                  {label}
                </span>
              ))}
            </div>
            <div data-part="days">
              {days.map((cell, index) => {
                const row = Math.floor(index / 7)
                const col = index % 7
                const wavePosition = row + col

                return (
                  <div
                    data-part="day"
                    data-day-muted={cell.muted ? "true" : undefined}
                    data-today={cell.today ? "true" : undefined}
                    key={`${cell.day}-${index}`}
                  >
                    <span data-part="num">{cell.day}</span>
                    <span data-part="dots">
                      {(cell.events ?? []).slice(0, 3).map((category, dot) => (
                        <span
                          data-part="dot"
                          key={dot}
                          style={
                            {
                              "--vibeui-calendar-anim-003-dot":
                                CATEGORY_VARS[category],
                              "--vibeui-calendar-anim-003-i":
                                wavePosition + dot * 0.4,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
