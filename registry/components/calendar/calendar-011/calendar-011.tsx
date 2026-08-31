import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  year?: number
  /** Отмеченные даты в ISO: 2026-03-14. Строки, а не Date — их проще отдать с сервера. */
  marks?: string[]
  locale?: string
  accent?: string
}

// Идея компонента: год целиком — двенадцать миниатюр месяцев на одной
// плоскости. Числа мелкие и читаются плохо, поэтому работу делают отметки:
// год нужен, чтобы увидеть, где густо и где пусто, а не чтобы прочитать дату.
const STYLES = `
:where([data-vibeui-block="calendar-011"]){
--vibeui-calendar-011-bg:oklch(1 0 0);
--vibeui-calendar-011-fg:oklch(0.24 0.014 265);
--vibeui-calendar-011-muted:oklch(0.62 0.014 265);
--vibeui-calendar-011-border:oklch(0.91 0.006 265);
--vibeui-calendar-011-accent:oklch(0.55 0.17 265);
--vibeui-calendar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-011"]{
width:100%;max-width:46rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-011-bg);
border:1px solid var(--vibeui-calendar-011-border);border-radius:1rem;
color:var(--vibeui-calendar-011-fg);font-family:var(--vibeui-calendar-011-font);
}
[data-vibeui-block="calendar-011"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0 0 0.875rem;
}
[data-vibeui-block="calendar-011"] [data-part="year"]{
margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-011"] [data-part="total"]{
font-size:0.75rem;color:var(--vibeui-calendar-011-muted);
}
[data-vibeui-block="calendar-011"] [data-part="shell"]{
display:grid;gap:0.75rem;
grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr));
}
[data-vibeui-block="calendar-011"] [data-part="month"]{
min-width:0;
}
[data-vibeui-block="calendar-011"] [data-part="name"]{
margin:0 0 0.3125rem;font-size:0.75rem;font-weight:650;text-transform:capitalize;
}
[data-vibeui-block="calendar-011"] [data-part="name"] b{
font-weight:650;color:var(--vibeui-calendar-011-accent);
}
[data-vibeui-block="calendar-011"] [data-part="mini"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.0625rem;
}
[data-vibeui-block="calendar-011"] [data-part="wd"]{
font-size:0.5625rem;line-height:1.2;text-align:center;
color:var(--vibeui-calendar-011-muted);text-transform:lowercase;
}
[data-vibeui-block="calendar-011"] [data-part="day"]{
aspect-ratio:1;display:flex;align-items:center;justify-content:center;
border-radius:0.25rem;font-size:0.625rem;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-011"] [data-part="day"][data-weekend="true"]{
color:var(--vibeui-calendar-011-muted);
}
/* Отметка — заливка целой клетки, а не точка: на миниатюре точка в шесть
   пикселей теряется, а плотность месяца перестаёт читаться. */
[data-vibeui-block="calendar-011"] [data-part="day"][data-mark="true"]{
background:var(--vibeui-calendar-011-accent);color:oklch(0.99 0.01 265);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MARKS = [
  "2026-01-07",
  "2026-01-19",
  "2026-02-14",
  "2026-02-23",
  "2026-03-08",
  "2026-03-14",
  "2026-03-27",
  "2026-04-12",
  "2026-05-01",
  "2026-05-09",
  "2026-06-12",
  "2026-06-13",
  "2026-07-04",
  "2026-08-22",
  "2026-09-01",
  "2026-09-30",
  "2026-10-05",
  "2026-11-04",
  "2026-12-25",
  "2026-12-31",
]

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
 * Год двенадцатью миниатюрами месяцев с заливкой отмеченных дней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar011({
  year = 2026,
  marks = DEFAULT_MARKS,
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar011Props) {
  const monthName = new Intl.DateTimeFormat(locale, { month: "long" })
  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  const marked = new Set(marks)

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    // 5 января 2026 — понедельник: опора нужна, чтобы неделя начиналась
    // с понедельника независимо от локали.
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const total = marks.filter((value) => value.startsWith(`${year}-`)).length

  return (
    <>
      <style href="vibeui-calendar-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-011"
        className={className}
        style={palette}
      >
        <header data-part="head">
          <p data-part="year">{year}</p>
          <p data-part="total">
            {total} {pluralize(total, ["дата", "даты", "дат"])} отмечено
          </p>
        </header>
        <div data-part="shell">
          {Array.from({ length: 12 }, (_, month) => {
            const first = new Date(year, month, 1)
            const lead = (first.getDay() + 6) % 7
            const length = new Date(year, month + 1, 0).getDate()
            const inMonth = Array.from({ length }, (_, index) => index + 1)
            const hits = inMonth.filter((day) =>
              marked.has(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
              ),
            ).length

            return (
              <section key={month} data-part="month">
                <h3 data-part="name">
                  {monthName.format(first)}
                  {hits > 0 ? <b> · {hits}</b> : null}
                </h3>
                <div data-part="mini">
                  {weekdays.map((label, index) => (
                    <span key={index} data-part="wd" aria-hidden="true">
                      {label}
                    </span>
                  ))}
                  {Array.from({ length: lead }, (_, index) => (
                    <span key={`lead-${index}`} data-part="day" />
                  ))}
                  {inMonth.map((day) => {
                    const date = new Date(year, month, day)
                    const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const weekend = date.getDay() === 0 || date.getDay() === 6
                    const hit = marked.has(value)

                    return (
                      <span
                        key={day}
                        data-part="day"
                        data-weekend={weekend}
                        data-mark={hit}
                        title={hit ? fullDate.format(date) : undefined}
                      >
                        {day}
                      </span>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
