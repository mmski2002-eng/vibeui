import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  from?: string
  to?: string
  locale?: string
  accent?: string
}

// Идея компонента: два месяца рядом для брони. Диапазон почти всегда
// пересекает границу месяца, и в одном окне человек теряет счёт ночам,
// переключаясь туда-сюда. На узкой ширине второй месяц уходит под первый, а
// не сжимается: календарь в 140 пикселей нечитаем.
const STYLES = `
:where([data-vibeui-block="calendar-009"]){
--vibeui-calendar-009-bg:oklch(1 0 0);
--vibeui-calendar-009-fg:oklch(0.24 0.014 265);
--vibeui-calendar-009-muted:oklch(0.6 0.014 265);
--vibeui-calendar-009-border:oklch(0.91 0.006 265);
--vibeui-calendar-009-accent:oklch(0.55 0.17 265);
--vibeui-calendar-009-range:color-mix(in oklab,var(--vibeui-calendar-009-accent) 12%,oklch(1 0 0));
--vibeui-calendar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="calendar-009"]{
display:block;width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-calendar-009-font);color:var(--vibeui-calendar-009-fg);
}
[data-vibeui-block="calendar-009"] [data-part="card"]{
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-009-bg);
border:1px solid var(--vibeui-calendar-009-border);border-radius:0.875rem;
}
[data-vibeui-block="calendar-009"] [data-part="months"]{display:flex;gap:1.25rem}
[data-vibeui-block="calendar-009"] [data-part="month"]{flex:1;min-width:0}
[data-vibeui-block="calendar-009"] [data-part="title"]{
margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650;text-transform:capitalize;
}
[data-vibeui-block="calendar-009"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-009"] th{padding:0.1875rem 0;font-size:0.625rem;font-weight:600;color:var(--vibeui-calendar-009-muted);text-transform:capitalize}
[data-vibeui-block="calendar-009"] td{
height:1.875rem;padding:0;text-align:center;
font-size:0.75rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-009"] td[data-in="true"]{background:var(--vibeui-calendar-009-range)}
[data-vibeui-block="calendar-009"] td[data-edge="from"]{border-radius:0.4375rem 0 0 0.4375rem}
[data-vibeui-block="calendar-009"] td[data-edge="to"]{border-radius:0 0.4375rem 0.4375rem 0}
[data-vibeui-block="calendar-009"] td[data-edge] span{
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
background:var(--vibeui-calendar-009-accent);color:oklch(0.99 0.01 265);font-weight:650;
}
[data-vibeui-block="calendar-009"] td[data-outside="true"]{color:var(--vibeui-calendar-009-muted);opacity:.45}
[data-vibeui-block="calendar-009"] [data-part="summary"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
margin:0.75rem 0 0;font-size:0.8125rem;color:var(--vibeui-calendar-009-muted);
}
[data-vibeui-block="calendar-009"] [data-part="nights"]{color:var(--vibeui-calendar-009-fg);font-weight:650}
/* В узкой колонке второй месяц уходит вниз: календарь в 140 пикселей
   не читается, а перенос сохраняет обе сетки целыми. */
@container (max-width: 30rem){
[data-vibeui-block="calendar-009"] [data-part="months"]{flex-direction:column;gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-009"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  return Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )
}

/**
 * Два месяца рядом с подсвеченным диапазоном и счётом ночей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar009({
  from = "2026-03-28",
  to = "2026-04-05",
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar009Props) {
  const [year, month] = from.split("-").map(Number)
  const months = [{ year, month: month - 1 }, new Date(year, month, 1)].map(
    (value, index) =>
      index === 0
        ? (value as { year: number; month: number })
        : {
            year: (value as Date).getFullYear(),
            month: (value as Date).getMonth(),
          },
  )

  const week = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  })
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" })

  const nights = Math.round(
    (new Date(`${to}T00:00:00`).getTime() -
      new Date(`${from}T00:00:00`).getTime()) /
      DAY,
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-009"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="months">
            {months.map((value) => {
              const days = buildGrid(value.year, value.month)

              return (
                <section key={`${value.year}-${value.month}`} data-part="month">
                  <h3 data-part="title">
                    {title.format(new Date(value.year, value.month, 1))}
                  </h3>
                  <table>
                    <thead>
                      <tr>
                        {days.slice(0, 7).map((date) => (
                          <th key={date.toISOString()} scope="col">
                            {week.format(date)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 6 }, (_, row) => (
                        <tr key={row}>
                          {days.slice(row * 7, row * 7 + 7).map((date) => {
                            const key = iso(date)
                            const outside = date.getMonth() !== value.month
                            const inRange = !outside && key >= from && key <= to
                            const edge =
                              key === from
                                ? "from"
                                : key === to
                                  ? "to"
                                  : undefined

                            return (
                              <td
                                key={key}
                                data-outside={outside}
                                data-in={inRange}
                                data-edge={outside ? undefined : edge}
                              >
                                {edge && !outside ? (
                                  <span>{date.getDate()}</span>
                                ) : (
                                  date.getDate()
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )
            })}
          </div>
          <p data-part="summary">
            <span>
              {day.format(new Date(`${from}T00:00:00`))} —{" "}
              {day.format(new Date(`${to}T00:00:00`))}
            </span>
            <span data-part="nights">{nights} ночей</span>
          </p>
        </div>
      </div>
    </>
  )
}
