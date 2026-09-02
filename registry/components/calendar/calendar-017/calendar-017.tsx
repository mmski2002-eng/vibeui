import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  year?: number
  month?: number
  /** Праздники месяца: ключ — число, значение — название. */
  holidays?: Record<number, string>
  workdays?: number[]
  /** Легенда по видам дней: weekend, holiday, workday. */
  legendText?: Record<string, string>
  /** Подпись праздничной клетки. {day} и {name} подставляются. */
  holidayLabelText?: string
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: выходной и праздник различаются формой, а не только
// цветом. Выходной — заливка клетки, праздник — ромб вокруг числа,
// перенесённый рабочий день — пунктирная рамка. Дальтоник и чёрно-белая
// печать читают такой месяц так же, как и все остальные.
const STYLES = `
:where([data-vibeui-block="calendar-017"]){
--vibeui-calendar-017-bg:transparent;
--vibeui-calendar-017-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-calendar-017-muted:light-dark(oklch(0.62 0.014 265),oklch(0.67 0.013 265));
--vibeui-calendar-017-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-calendar-017-weekend:light-dark(oklch(0.95 0.012 265),oklch(0.3 0.015 265));
--vibeui-calendar-017-accent:light-dark(oklch(0.55 0.16 25),oklch(0.75 0.14 25));
--vibeui-calendar-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-017"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-017-bg);
border:1px solid var(--vibeui-calendar-017-border);border-radius:1rem;
color:var(--vibeui-calendar-017-fg);font-family:var(--vibeui-calendar-017-font);
}
[data-vibeui-block="calendar-017"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-017"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-017"] table{width:100%;border-collapse:separate;border-spacing:0.125rem;table-layout:fixed}
[data-vibeui-block="calendar-017"] th{
padding:0 0 0.125rem;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-017-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-017"] th[data-weekend="true"]{color:var(--vibeui-calendar-017-accent)}
[data-vibeui-block="calendar-017"] td{padding:0}
[data-vibeui-block="calendar-017"] [data-part="cell"]{
position:relative;display:flex;align-items:center;justify-content:center;
height:2.125rem;border-radius:0.4375rem;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-017"] [data-part="cell"][data-kind="weekend"]{
background:var(--vibeui-calendar-017-weekend);
}
/* Ромб рисуется псевдоэлементом и повёрнут, а само число остаётся прямым:
   повернуть клетку целиком — значит положить цифру набок. */
[data-vibeui-block="calendar-017"] [data-part="cell"][data-kind="holiday"]::before{
content:"";position:absolute;inset:0.1875rem;border-radius:0.1875rem;
border:1.5px solid var(--vibeui-calendar-017-accent);
transform:rotate(45deg);
}
[data-vibeui-block="calendar-017"] [data-part="cell"][data-kind="holiday"]{
color:var(--vibeui-calendar-017-accent);font-weight:700;
}
[data-vibeui-block="calendar-017"] [data-part="cell"][data-kind="workday"]{
border:1.5px dashed var(--vibeui-calendar-017-border);
}
[data-vibeui-block="calendar-017"] [data-part="cell"][data-outside="true"]{color:var(--vibeui-calendar-017-muted);opacity:.4}
[data-vibeui-block="calendar-017"] [data-part="cell"] span{position:relative}
[data-vibeui-block="calendar-017"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-calendar-017-muted);
}
[data-vibeui-block="calendar-017"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="calendar-017"] [data-part="chip"]{
width:0.75rem;height:0.75rem;border-radius:0.1875rem;flex:none;
background:var(--vibeui-calendar-017-weekend);
}
[data-vibeui-block="calendar-017"] [data-part="chip"][data-kind="holiday"]{
background:transparent;border:1.5px solid var(--vibeui-calendar-017-accent);transform:rotate(45deg) scale(.8);
}
[data-vibeui-block="calendar-017"] [data-part="chip"][data-kind="workday"]{
background:transparent;border:1.5px dashed var(--vibeui-calendar-017-border);
}
[data-vibeui-block="calendar-017"] [data-part="list"]{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.25rem;
padding-top:0.625rem;border-top:1px solid var(--vibeui-calendar-017-border);
font-size:0.75rem;
}
[data-vibeui-block="calendar-017"] [data-part="list"] li{display:flex;gap:0.5rem}
[data-vibeui-block="calendar-017"] [data-part="list"] b{
flex:none;width:1.75rem;color:var(--vibeui-calendar-017-accent);
font-variant-numeric:tabular-nums;font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-017"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_HOLIDAYS: Record<number, string> = {
  1: "Новый год",
  2: "Новогодние каникулы",
  5: "Новогодние каникулы",
  7: "Рождество",
}

const DEFAULT_LEGEND: Record<string, string> = {
  weekend: "выходной",
  holiday: "праздник",
  workday: "рабочий перенос",
}

function fillText(template: string, values: Record<string, string | number>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => `${values[key] ?? match}`,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Месяц, где выходной, праздник и перенесённый рабочий день различаются формой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar017({
  year = 2026,
  month = 1,
  holidays = DEFAULT_HOLIDAYS,
  workdays = [17],
  legendText = DEFAULT_LEGEND,
  holidayLabelText = "{day} — {name}",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar017Props) {
  const first = new Date(year, month - 1, 1)
  const start = new Date(first.getTime() - ((first.getDay() + 6) % 7) * DAY)
  const cells = Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  const legend = { ...DEFAULT_LEGEND, ...legendText }

  const palette = {
    ...(accent ? { "--vibeui-calendar-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const kindOf = (date: Date, outside: boolean) => {
    const day = date.getDate()
    const weekend = date.getDay() === 0 || date.getDay() === 6

    if (outside) {
      return "plain"
    }

    if (holidays[day]) {
      return "holiday"
    }

    if (workdays.includes(day)) {
      return "workday"
    }

    return weekend ? "weekend" : "plain"
  }

  return (
    <>
      <style href="vibeui-calendar-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-017"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <table>
          <thead>
            <tr>
              {cells.slice(0, 7).map((date) => (
                <th
                  key={date.toISOString()}
                  scope="col"
                  data-weekend={date.getDay() === 0 || date.getDay() === 6}
                >
                  {weekday.format(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {cells.slice(row * 7, row * 7 + 7).map((date) => {
                  const outside = date.getMonth() !== month - 1
                  const kind = kindOf(date, outside)
                  const label = holidays[date.getDate()]

                  return (
                    <td key={date.toISOString()}>
                      <span
                        data-part="cell"
                        data-kind={kind}
                        data-outside={outside}
                        title={outside ? undefined : label}
                        aria-label={
                          outside || !label
                            ? undefined
                            : fillText(holidayLabelText, {
                                day: date.getDate(),
                                name: label,
                              })
                        }
                      >
                        <span>{date.getDate()}</span>
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p data-part="legend">
          <span>
            <i data-part="chip" aria-hidden="true" />
            {legend.weekend}
          </span>
          <span>
            <i data-part="chip" data-kind="holiday" aria-hidden="true" />
            {legend.holiday}
          </span>
          <span>
            <i data-part="chip" data-kind="workday" aria-hidden="true" />
            {legend.workday}
          </span>
        </p>
        <ul data-part="list">
          {Object.entries(holidays).map(([day, name]) => (
            <li key={day}>
              <b>{day}</b>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
