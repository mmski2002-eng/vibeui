import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar025Shift = "day" | "night" | "off" | "leave"

export type Calendar025Person = {
  name: string
  role?: string
  /** Семь смен подряд, начиная с weekStart. */
  shifts: Calendar025Shift[]
}

export type Calendar025Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  heading?: string
  weekStart?: string
  people?: Calendar025Person[]
  density?: "compact" | "comfortable"
  locale?: string
  accent?: string
}

// Идея компонента: график смен читают не по одному человеку, а по столбцу —
// «кто в ночь во вторник». Поэтому это таблица «сотрудники × дни» с кодом
// смены в клетке, цветом по типу и итогом смен справа: дыру в покрытии
// видно как пустую колонку, а перегруз — как большое число в итоге.
const STYLES = `
:where([data-vibeui-block="calendar-025"]){
--vibeui-calendar-025-bg:oklch(1 0 0);
--vibeui-calendar-025-fg:oklch(0.23 0.014 250);
--vibeui-calendar-025-muted:oklch(0.57 0.014 250);
--vibeui-calendar-025-border:oklch(0.91 0.006 250);
--vibeui-calendar-025-soft:oklch(0.97 0.006 250);
--vibeui-calendar-025-day:oklch(0.93 0.06 95);
--vibeui-calendar-025-dayfg:oklch(0.4 0.09 75);
--vibeui-calendar-025-night:oklch(0.9 0.05 270);
--vibeui-calendar-025-nightfg:oklch(0.38 0.11 275);
--vibeui-calendar-025-leave:oklch(0.93 0.05 160);
--vibeui-calendar-025-leavefg:oklch(0.4 0.08 160);
--vibeui-calendar-025-cell:2.1rem;
--vibeui-calendar-025-radius:0.75rem;
--vibeui-calendar-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-025"]{
display:flex;flex-direction:column;gap:0.7rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-025-bg);
border:1px solid var(--vibeui-calendar-025-border);
border-radius:calc(var(--vibeui-calendar-025-radius) + 0.25rem);
color:var(--vibeui-calendar-025-fg);
font-family:var(--vibeui-calendar-025-font);
}
[data-vibeui-block="calendar-025"][data-density="comfortable"]{--vibeui-calendar-025-cell:2.6rem}
[data-vibeui-block="calendar-025"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-025"] [data-part="range"]{
margin:0.15rem 0 0;font-size:0.75rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="calendar-025"] table{
width:100%;min-width:24rem;border-collapse:separate;border-spacing:0.15rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-025"] th,
[data-vibeui-block="calendar-025"] td{padding:0;text-align:center;font-weight:600}
[data-vibeui-block="calendar-025"] thead th{
font-size:0.68rem;text-transform:uppercase;letter-spacing:0.04em;
color:var(--vibeui-calendar-025-muted);padding-bottom:0.15rem;
}
[data-vibeui-block="calendar-025"] thead th[data-weekend="true"]{color:var(--vibeui-calendar-025-fg)}
[data-vibeui-block="calendar-025"] [data-part="who"]{
width:8rem;text-align:left;font-size:0.8125rem;line-height:1.15;
padding-right:0.35rem;
}
[data-vibeui-block="calendar-025"] [data-part="who"] small{
display:block;font-size:0.68rem;font-weight:500;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="cell"]{
position:relative;display:flex;align-items:center;justify-content:center;
height:var(--vibeui-calendar-025-cell);border-radius:0.45rem;
background:var(--vibeui-calendar-025-soft);
color:var(--vibeui-calendar-025-muted);font-size:0.75rem;
}
[data-vibeui-block="calendar-025"] [data-part="cell"][data-shift="day"]{
background:var(--vibeui-calendar-025-day);color:var(--vibeui-calendar-025-dayfg);
}
[data-vibeui-block="calendar-025"] [data-part="cell"][data-shift="night"]{
background:var(--vibeui-calendar-025-night);color:var(--vibeui-calendar-025-nightfg);
}
[data-vibeui-block="calendar-025"] [data-part="cell"][data-shift="leave"]{
background:var(--vibeui-calendar-025-leave);color:var(--vibeui-calendar-025-leavefg);
}
[data-vibeui-block="calendar-025"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="calendar-025"] [data-part="total"]{
width:2.4rem;font-size:0.8125rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin:0;padding-top:0.6rem;
border-top:1px solid var(--vibeui-calendar-025-border);
font-size:0.75rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="key"]{display:inline-flex;align-items:center;gap:0.3rem}
[data-vibeui-block="calendar-025"] [data-part="chip"]{
width:0.85rem;height:0.85rem;border-radius:0.25rem;background:var(--vibeui-calendar-025-soft);
}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="day"]{background:var(--vibeui-calendar-025-day)}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="night"]{background:var(--vibeui-calendar-025-night)}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="leave"]{background:var(--vibeui-calendar-025-leave)}
`

const MARKS: Record<Calendar025Shift, { short: string; title: string }> = {
  day: { short: "Д", title: "дневная смена" },
  night: { short: "Н", title: "ночная смена" },
  off: { short: "·", title: "выходной" },
  leave: { short: "О", title: "отпуск" },
}

const CREW: Calendar025Person[] = [
  {
    name: "Ирина Соколова",
    role: "старшая смены",
    shifts: ["day", "day", "night", "off", "off", "day", "day"],
  },
  {
    name: "Пётр Ковалёв",
    role: "оператор",
    shifts: ["night", "off", "off", "day", "day", "night", "off"],
  },
  {
    name: "Алия Хасанова",
    role: "оператор",
    shifts: ["off", "night", "day", "day", "off", "off", "night"],
  },
  {
    name: "Марк Дубов",
    role: "стажёр",
    shifts: ["leave", "leave", "leave", "off", "day", "day", "off"],
  },
]

/**
 * График смен: сотрудники по строкам, дни недели по столбцам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar025({
  heading = "График смен",
  weekStart = "2026-04-13",
  people = CREW,
  density = "compact",
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar025Props) {
  const first = new Date(`${weekStart}T00:00:00`)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(first)
    date.setDate(first.getDate() + index)

    return date
  })

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const span = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  })

  const palette = {
    ...(accent ? { "--vibeui-calendar-025-night": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-025" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-025"
        data-density={density}
        className={className}
        style={palette}
      >
        <header>
          <h3 data-part="title">{heading}</h3>
          <p data-part="range">
            {span.format(days[0])} — {span.format(days[6])}
          </p>
        </header>
        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th data-part="who" scope="col">
                  Сотрудник
                </th>
                {days.map((date, index) => (
                  <th
                    key={date.getTime()}
                    scope="col"
                    data-weekend={index > 4}
                    abbr={weekday.format(date)}
                  >
                    {weekday.format(date).slice(0, 2)}
                    <br />
                    {date.getDate()}
                  </th>
                ))}
                <th data-part="total" scope="col" abbr="Смен">
                  Σ
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.name}>
                  <th data-part="who" scope="row">
                    {person.name}
                    {person.role ? <small>{person.role}</small> : null}
                  </th>
                  {person.shifts.slice(0, 7).map((shift, index) => (
                    <td key={days[index].getTime()}>
                      <span
                        data-part="cell"
                        data-shift={shift}
                        title={`${person.name}: ${MARKS[shift].title}`}
                      >
                        <span aria-hidden="true">{MARKS[shift].short}</span>
                        <span data-part="sr">{MARKS[shift].title}</span>
                      </span>
                    </td>
                  ))}
                  <td data-part="total">
                    {
                      person.shifts.filter(
                        (shift) => shift === "day" || shift === "night",
                      ).length
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="legend">
          {(["day", "night", "off", "leave"] as Calendar025Shift[]).map(
            (shift) => (
              <span key={shift} data-part="key">
                <span data-part="chip" data-shift={shift} aria-hidden="true" />
                {MARKS[shift].title}
              </span>
            ),
          )}
        </p>
      </section>
    </>
  )
}
