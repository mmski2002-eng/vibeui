import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  year?: number
  month?: number
  /** Загрузка по дням месяца: 0 — свободно, 1 — занято целиком. */
  load?: number[]
  locale?: string
  accent?: string
}

// Идея компонента: месяц как карта загрузки. Насыщенность клетки показывает
// занятость, но число внутри остаётся: по одному цвету процент не назвать, а
// сравнить два дня «на глаз» ошибаются все. Ступеней пять, а не непрерывная
// шкала — глаз всё равно различает не больше.
const STYLES = `
:where([data-vibeui-block="calendar-007"]){
--vibeui-calendar-007-bg:oklch(1 0 0);
--vibeui-calendar-007-fg:oklch(0.24 0.014 265);
--vibeui-calendar-007-muted:oklch(0.6 0.014 265);
--vibeui-calendar-007-border:oklch(0.91 0.006 265);
--vibeui-calendar-007-accent:oklch(0.55 0.17 265);
--vibeui-calendar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-007-bg);
border:1px solid var(--vibeui-calendar-007-border);border-radius:0.875rem;
color:var(--vibeui-calendar-007-fg);font-family:var(--vibeui-calendar-007-font);
}
[data-vibeui-block="calendar-007"] [data-part="title"]{font-size:0.875rem;font-weight:650;text-transform:capitalize}
[data-vibeui-block="calendar-007"] table{width:100%;border-collapse:separate;border-spacing:0.1875rem;table-layout:fixed}
[data-vibeui-block="calendar-007"] th{padding:0;font-size:0.6875rem;font-weight:600;color:var(--vibeui-calendar-007-muted);text-transform:capitalize}
[data-vibeui-block="calendar-007"] td{
height:2rem;padding:0;border-radius:0.375rem;text-align:center;
font-size:0.75rem;font-variant-numeric:tabular-nums;
/* Пять ступеней вместо непрерывной шкалы: больше глаз не различает. */
background:color-mix(in oklab,var(--vibeui-calendar-007-accent) calc(var(--vibeui-calendar-007-step,0) * 22%),oklch(0.97 0.003 265));
}
[data-vibeui-block="calendar-007"] td[data-step="3"],
[data-vibeui-block="calendar-007"] td[data-step="4"]{color:oklch(0.99 0.01 265)}
[data-vibeui-block="calendar-007"] td[data-empty="true"]{background:transparent}
[data-vibeui-block="calendar-007"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-calendar-007-muted);
}
[data-vibeui-block="calendar-007"] [data-part="scale"]{display:flex;gap:0.125rem}
[data-vibeui-block="calendar-007"] [data-part="scale"] i{
width:0.875rem;height:0.6875rem;border-radius:0.1875rem;
background:color-mix(in oklab,var(--vibeui-calendar-007-accent) calc(var(--vibeui-calendar-007-step,0) * 22%),oklch(0.97 0.003 265));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-007"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

const DEFAULT_LOAD = [
  0.1, 0.2, 0.9, 0.4, 0.6, 0, 0, 0.3, 0.5, 1, 0.8, 0.2, 0, 0, 0.7, 0.9, 0.95,
  0.5, 0.3, 0, 0, 0.4, 0.6, 0.2, 0.1, 0.8, 0, 0, 0.5, 0.7, 0.3,
]

/**
 * Месяц как карта загрузки: ступени насыщенности и числа внутри клеток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar007({
  year = 2026,
  month = 3,
  load = DEFAULT_LOAD,
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Calendar007Props) {
  const first = new Date(year, month - 1, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  const cells = Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )

  const week = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  const palette = {
    ...(accent ? { "--vibeui-calendar-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-007"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <table>
          <thead>
            <tr>
              {cells.slice(0, 7).map((date) => (
                <th key={date.toISOString()} scope="col">
                  {week.format(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {cells.slice(row * 7, row * 7 + 7).map((date) => {
                  const outside = date.getMonth() !== month - 1
                  const value = outside ? 0 : (load[date.getDate() - 1] ?? 0)
                  const step = Math.round(value * 4)

                  return (
                    <td
                      key={date.toISOString()}
                      data-empty={outside}
                      data-step={step}
                      style={
                        { "--vibeui-calendar-007-step": step } as CSSProperties
                      }
                      aria-label={
                        outside
                          ? undefined
                          : `${date.getDate()} число, загрузка ${Math.round(value * 100)}%`
                      }
                    >
                      {outside ? "" : date.getDate()}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p data-part="legend">
          Свободно
          <span data-part="scale" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((step) => (
              <i
                key={step}
                style={{ "--vibeui-calendar-007-step": step } as CSSProperties}
              />
            ))}
          </span>
          Занято
        </p>
      </div>
    </>
  )
}
