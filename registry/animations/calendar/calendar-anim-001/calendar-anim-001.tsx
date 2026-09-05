import type { ComponentProps, CSSProperties } from "react"

export type CalendarAnim001Day = {
  day: number
  /** День соседнего месяца: приглушённый и вне выбора. */
  muted?: boolean
  state?: "selected" | "range-start" | "range" | "range-end"
}

export type CalendarAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  days?: CalendarAnim001Day[]
  /** Семь сокращений дней недели, начиная с понедельника. */
  weekdays?: string[]
  accent?: string
  /** Пульсирующее кольцо вокруг выбранного дня. */
  pulse?: boolean
  /** Мягкая заливка диапазона между двумя датами. */
  highlightRange?: boolean
}

const DEFAULT_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

// Идея: сетка месяца, где выбор дня и диапазон читаются формой заливки, а
// не только цветом. Выбранный день выезжает пружинным scale-in и держит
// вокруг себя пульсирующее кольцо — единственная бесконечная анимация,
// остальное играет один раз при появлении. Диапазон — сплошная мягкая
// плашка на смежных днях: она не двигается пикселями, а «дорастает» слева
// направо через clip-path с растущей задержкой на каждой следующей дате,
// поэтому выглядит как непрерывное растягивание, а не отдельные вспышки.
const STYLES = `
:where([data-vibeui-block="calendar-anim-001"]){
--vibeui-calendar-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-calendar-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-calendar-anim-001-muted:color-mix(in oklab,var(--vibeui-calendar-anim-001-fg) 55%,transparent);
--vibeui-calendar-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-calendar-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-calendar-anim-001-accent-fg:oklch(from var(--vibeui-calendar-anim-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-calendar-anim-001-range:color-mix(in oklab,var(--vibeui-calendar-anim-001-accent) 16%,transparent);
--vibeui-calendar-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-anim-001"]{color-scheme:dark}
[data-vibeui-block="calendar-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-calendar-anim-001-fg);font-family:var(--vibeui-calendar-anim-001-font);
}
[data-vibeui-block="calendar-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="calendar-anim-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-calendar-anim-001-border);
background:var(--vibeui-calendar-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="calendar-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-calendar-anim-001-border);
}
[data-vibeui-block="calendar-anim-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-anim-001-accent);
background:color-mix(in oklab,var(--vibeui-calendar-anim-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-calendar-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="calendar-anim-001"] [data-part="body"]{padding:0.75rem 0.625rem 0.875rem}
[data-vibeui-block="calendar-anim-001"] [data-part="weekdays"],
[data-vibeui-block="calendar-anim-001"] [data-part="days"]{
display:grid;grid-template-columns:repeat(7,1fr);
}
[data-vibeui-block="calendar-anim-001"] [data-part="weekdays"]{margin-bottom:0.25rem}
[data-vibeui-block="calendar-anim-001"] [data-part="wd"]{
display:flex;align-items:center;justify-content:center;
height:1.375rem;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-calendar-anim-001-muted);
}
[data-vibeui-block="calendar-anim-001"] [data-part="days"]{row-gap:0.1875rem}
[data-vibeui-block="calendar-anim-001"] [data-part="day"]{
position:relative;display:flex;align-items:center;justify-content:center;
min-height:2rem;
}
[data-vibeui-block="calendar-anim-001"] [data-part="num"]{
position:relative;z-index:2;font-size:0.6875rem;font-weight:550;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-anim-001"] [data-day-muted="true"] [data-part="num"]{
color:var(--vibeui-calendar-anim-001-muted);opacity:0.55;
}
/* Диапазон: сплошная плашка встык между соседними датами, растёт слева
   направо через clip-path со ступенчатой задержкой по дню. */
[data-vibeui-block="calendar-anim-001"] [data-state="range-start"]::before,
[data-vibeui-block="calendar-anim-001"] [data-state="range"]::before,
[data-vibeui-block="calendar-anim-001"] [data-state="range-end"]::before{
content:"";position:absolute;z-index:1;top:0.1875rem;bottom:0.1875rem;left:0;right:0;
background:var(--vibeui-calendar-anim-001-range);
clip-path:inset(0 100% 0 0);
animation:vibeui-calendar-anim-001-stretch 0.5s ease-out both;
animation-delay:calc(var(--vibeui-calendar-anim-001-i,0) * 90ms + 200ms);
}
[data-vibeui-block="calendar-anim-001"][data-range="false"] [data-state="range-start"]::before,
[data-vibeui-block="calendar-anim-001"][data-range="false"] [data-state="range"]::before,
[data-vibeui-block="calendar-anim-001"][data-range="false"] [data-state="range-end"]::before{
display:none;
}
[data-vibeui-block="calendar-anim-001"] [data-state="range-start"]::before{left:0.1875rem;border-start-start-radius:9999px;border-end-start-radius:9999px}
[data-vibeui-block="calendar-anim-001"] [data-state="range-end"]::before{right:0.1875rem;border-start-end-radius:9999px;border-end-end-radius:9999px}
/* Выбранный день: пружинный scale-in плюс бесконечное пульсирующее кольцо. */
[data-vibeui-block="calendar-anim-001"] [data-state="selected"]::before{
content:"";position:absolute;z-index:1;inset:0.1875rem;border-radius:9999px;
background:var(--vibeui-calendar-anim-001-accent);
animation:vibeui-calendar-anim-001-pop 0.55s cubic-bezier(.34,1.56,.64,1) both;
}
[data-vibeui-block="calendar-anim-001"][data-pulse="true"] [data-state="selected"]::after{
content:"";position:absolute;z-index:1;inset:0.1875rem;border-radius:9999px;
background:var(--vibeui-calendar-anim-001-accent);
animation:vibeui-calendar-anim-001-ping 2.2s ease-out infinite;
}
[data-vibeui-block="calendar-anim-001"] [data-state="selected"] [data-part="num"]{
color:var(--vibeui-calendar-anim-001-accent-fg);
}
@keyframes vibeui-calendar-anim-001-pop{
0%{transform:scale(0);opacity:0}
60%{transform:scale(1.18);opacity:1}
100%{transform:scale(1);opacity:1}
}
@keyframes vibeui-calendar-anim-001-ping{
0%{transform:scale(1);opacity:0.35}
80%,100%{transform:scale(1.7);opacity:0}
}
@keyframes vibeui-calendar-anim-001-stretch{
from{clip-path:inset(0 100% 0 0)}
to{clip-path:inset(0 0 0 0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="calendar-anim-001"] [data-state="selected"]::before{animation:none}
[data-vibeui-block="calendar-anim-001"] [data-state="selected"]::after{animation:none;opacity:0}
[data-vibeui-block="calendar-anim-001"] [data-state="range-start"]::before,
[data-vibeui-block="calendar-anim-001"] [data-state="range"]::before,
[data-vibeui-block="calendar-anim-001"] [data-state="range-end"]::before{animation:none;clip-path:inset(0 0 0 0)}
}
`

const DEFAULT_DAYS: CalendarAnim001Day[] = [
  { day: 31, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9, state: "range-start" },
  { day: 10, state: "range" },
  { day: 11, state: "range" },
  { day: 12, state: "range-end" },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16, state: "selected" },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
]

/** Порядковый номер дня внутри диапазона — задаёт задержку растягивания. */
function rangeStepIndexes(days: CalendarAnim001Day[]): number[] {
  let counter = 0

  return days.map((cell) => {
    const isRangeMember =
      cell.state === "range-start" ||
      cell.state === "range" ||
      cell.state === "range-end"

    return isRangeMember ? counter++ : -1
  })
}

/**
 * Календарь-пикер даты с диапазоном. Один файл, ноль зависимостей,
 * собственная палитра. Состояние дня — пропами, анимации на чистом CSS.
 */
export function CalendarAnim001({
  title = "Сентябрь 2026",
  badge = "Пн–Вс",
  days = DEFAULT_DAYS,
  weekdays = DEFAULT_WEEKDAYS,
  accent,
  pulse = true,
  highlightRange = true,
  className,
  style,
  ...props
}: CalendarAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-calendar-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const stepIndexes = rangeStepIndexes(days)

  return (
    <>
      <style href="vibeui-calendar-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-anim-001"
        data-slot="calendar-date-picker"
        data-pulse={pulse ? "true" : "false"}
        data-range={highlightRange ? "true" : "false"}
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
                const stepIndex = stepIndexes[index]

                return (
                  <div
                    data-part="day"
                    data-state={cell.state}
                    data-day-muted={cell.muted ? "true" : undefined}
                    key={`${cell.day}-${index}`}
                    style={
                      stepIndex >= 0
                        ? ({
                            "--vibeui-calendar-anim-001-i": stepIndex,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    <span data-part="num">{cell.day}</span>
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
