import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar014Props = Omit<
  ComponentPropsWithoutRef<"aside">,
  "children" | "title"
> & {
  year?: number
  month?: number
  /** Число событий по дням месяца: ключ — день, значение — сколько событий. */
  events?: Record<number, number>
  today?: number
  caption?: string
  locale?: string
  accent?: string
}

// Идея компонента: мини-календарь для боковой колонки. Ширина — пятнадцать
// рем, поэтому событий в клетке нет: под числом стоят точки, максимум три,
// а четвёртое и дальше сворачиваются в плюс. Точки под числом, а не поверх:
// подложка под цифрой съела бы саму цифру.
const STYLES = `
:where([data-vibeui-block="calendar-014"]){
--vibeui-calendar-014-bg:oklch(1 0 0);
--vibeui-calendar-014-fg:oklch(0.24 0.014 265);
--vibeui-calendar-014-muted:oklch(0.63 0.014 265);
--vibeui-calendar-014-border:oklch(0.91 0.006 265);
--vibeui-calendar-014-accent:oklch(0.56 0.16 25);
--vibeui-calendar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-014"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-calendar-014-bg);
border:1px solid var(--vibeui-calendar-014-border);border-radius:0.75rem;
color:var(--vibeui-calendar-014-fg);font-family:var(--vibeui-calendar-014-font);
}
[data-vibeui-block="calendar-014"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-014"] [data-part="month"]{
margin:0;font-size:0.8125rem;font-weight:650;text-transform:capitalize;
}
[data-vibeui-block="calendar-014"] [data-part="year"]{
font-size:0.6875rem;color:var(--vibeui-calendar-014-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-014"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.0625rem;
}
[data-vibeui-block="calendar-014"] [data-part="wd"]{
padding-bottom:0.1875rem;text-align:center;
font-size:0.625rem;font-weight:600;text-transform:lowercase;
color:var(--vibeui-calendar-014-muted);
}
[data-vibeui-block="calendar-014"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.125rem;
height:1.875rem;border-radius:0.375rem;
font-size:0.6875rem;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-weekend="true"]{color:var(--vibeui-calendar-014-muted)}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"]{
background:var(--vibeui-calendar-014-accent);color:oklch(0.99 0.01 25);font-weight:700;
}
[data-vibeui-block="calendar-014"] [data-part="dots"]{
display:flex;align-items:center;gap:0.09375rem;height:0.25rem;
}
[data-vibeui-block="calendar-014"] [data-part="dots"] i{
width:0.1875rem;height:0.1875rem;border-radius:50%;
background:var(--vibeui-calendar-014-accent);
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"] [data-part="dots"] i{background:oklch(0.99 0.01 25)}
[data-vibeui-block="calendar-014"] [data-part="more"]{
font-size:0.5rem;line-height:0.25rem;font-weight:700;
color:var(--vibeui-calendar-014-accent);
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"] [data-part="more"]{color:oklch(0.99 0.01 25)}
[data-vibeui-block="calendar-014"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.375rem;border-top:1px solid var(--vibeui-calendar-014-border);
font-size:0.6875rem;color:var(--vibeui-calendar-014-muted);
}
[data-vibeui-block="calendar-014"] [data-part="foot"] a{
color:var(--vibeui-calendar-014-accent);font-weight:600;text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="calendar-014"] [data-part="foot"] a:hover{text-decoration:underline}
[data-vibeui-block="calendar-014"] [data-part="foot"] a:focus-visible{outline:2px solid var(--vibeui-calendar-014-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Record<number, number> = {
  3: 1,
  5: 2,
  9: 4,
  12: 1,
  14: 3,
  17: 2,
  20: 1,
  23: 5,
  27: 2,
  30: 1,
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) {
    return forms[2]
  }

  if (ones === 1) {
    return forms[0]
  }

  if (ones > 1 && ones < 5) {
    return forms[1]
  }

  return forms[2]
}

/**
 * Мини-календарь боковой колонки: точки событий под числами и итог месяца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar014({
  year = 2026,
  month = 3,
  events = DEFAULT_EVENTS,
  today = 14,
  caption = "Все события",
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar014Props) {
  const first = new Date(year, month - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, month, 0).getDate()

  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )
  const monthName = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    first,
  )

  const total = Object.values(events).reduce((sum, count) => sum + count, 0)

  const palette = {
    ...(accent ? { "--vibeui-calendar-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-014" precedence="medium">
        {STYLES}
      </style>
      <aside
        {...props}
        data-vibeui-block="calendar-014"
        className={className}
        style={palette}
        aria-label={`Календарь: ${monthName} ${year}`}
      >
        <header data-part="head">
          <h3 data-part="month">{monthName}</h3>
          <span data-part="year">{year}</span>
        </header>
        <div data-part="grid">
          {weekdays.map((label, index) => (
            <span key={index} data-part="wd" aria-hidden="true">
              {label}
            </span>
          ))}
          {Array.from({ length: lead }, (_, index) => (
            <span key={`lead-${index}`} data-part="cell" />
          ))}
          {Array.from({ length }, (_, index) => {
            const day = index + 1
            const date = new Date(year, month - 1, day)
            const weekend = date.getDay() === 0 || date.getDay() === 6
            const count = events[day] ?? 0

            return (
              <span
                key={day}
                data-part="cell"
                data-weekend={weekend}
                data-today={day === today}
                aria-label={
                  count > 0
                    ? `${day} ${monthName}: ${count} ${pluralize(count, ["событие", "события", "событий"])}`
                    : undefined
                }
              >
                <span>{day}</span>
                <span data-part="dots" aria-hidden="true">
                  {Array.from({ length: Math.min(count, 3) }, (_, dot) => (
                    <i key={dot} />
                  ))}
                  {count > 3 ? <b data-part="more">+</b> : null}
                </span>
              </span>
            )
          })}
        </div>
        <footer data-part="foot">
          <span>
            {total} {pluralize(total, ["событие", "события", "событий"])}
          </span>
          <a href="#events">{caption}</a>
        </footer>
      </aside>
    </>
  )
}
