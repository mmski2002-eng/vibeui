import type { ComponentProps, CSSProperties } from "react"

export type Calendar016Member = {
  name: string
  /** Занятость по дням недели в часах, слева направо. */
  hours: number[]
}

export type Calendar016Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  weekStart?: string
  members?: Calendar016Member[]
  capacity?: number
  heading?: string
  /** Подпись столбца с именами для скринридера. */
  memberColumnLabel?: string
  /** Подсказка клетки. {name}, {date}, {hours} и {capacity} подставляются. */
  cellTitleText?: string
  /** Часы под полосой. {hours} подставляется. */
  hoursText?: string
  /** Легенда по состояниям free, busy и full. {capacity} подставляется. */
  legendText?: Record<string, string>
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: занятость команды — это таблица «люди × дни», а не
// пять отдельных календарей. Клетка несёт и полосу, и число часов: полоса
// даёт увидеть свободное окно всей команды одним взглядом, число отвечает
// на вопрос «а насколько занят», на который цвет не отвечает.
const STYLES = `
:where([data-vibeui-block="calendar-016"]){
--vibeui-calendar-016-bg:transparent;
--vibeui-calendar-016-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-calendar-016-muted:color-mix(in oklab,var(--vibeui-calendar-016-fg) 68%,transparent);
--vibeui-calendar-016-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-016-track:light-dark(oklch(0.95 0 265),oklch(0.3 0 265));
--vibeui-calendar-016-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.72 0.13 39.8));
--vibeui-calendar-016-full:light-dark(oklch(0.56 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-calendar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-016"]{color-scheme:dark}
[data-vibeui-block="calendar-016"]{
width:100%;max-width:44rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-016-bg);
border:1px solid var(--vibeui-calendar-016-border);border-radius:1rem;
color:var(--vibeui-calendar-016-fg);font-family:var(--vibeui-calendar-016-font);
}
[data-vibeui-block="calendar-016"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0 0 0.75rem;
}
[data-vibeui-block="calendar-016"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-016"] [data-part="range"]{
font-size:0.875rem;color:var(--vibeui-calendar-016-muted);
}
[data-vibeui-block="calendar-016"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="calendar-016"] table{width:100%;min-width:30rem;border-collapse:collapse}
[data-vibeui-block="calendar-016"] thead th{
padding:0 0.25rem 0.4375rem;text-align:center;vertical-align:bottom;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-calendar-016-muted);
border-bottom:1px solid var(--vibeui-calendar-016-border);
}
[data-vibeui-block="calendar-016"] thead th[scope="col"] span{
display:block;text-transform:capitalize;color:var(--vibeui-calendar-016-fg);font-weight:650;
}
[data-vibeui-block="calendar-016"] thead th[data-weekend="true"] span{color:var(--vibeui-calendar-016-muted)}
[data-vibeui-block="calendar-016"] tbody th{
padding:0.375rem 0.625rem 0.375rem 0;text-align:left;white-space:nowrap;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="calendar-016"] tbody tr+tr th,
[data-vibeui-block="calendar-016"] tbody tr+tr td{border-top:1px solid var(--vibeui-calendar-016-border)}
[data-vibeui-block="calendar-016"] td{padding:0.375rem 0.1875rem;vertical-align:middle}
[data-vibeui-block="calendar-016"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;gap:0.1875rem;
}
[data-vibeui-block="calendar-016"] [data-part="bar"]{
width:100%;height:0.4375rem;border-radius:0.25rem;overflow:hidden;
background:var(--vibeui-calendar-016-track);
}
[data-vibeui-block="calendar-016"] [data-part="bar"] i{
display:block;height:100%;border-radius:inherit;
width:calc(var(--vibeui-calendar-016-fill,0) * 1%);
background:var(--vibeui-calendar-016-accent);
}
/* Перегруз красится отдельным тоном: «занят на 100%» и «занят сверх нормы»
   — разные новости для того, кто раздаёт задачи. */
[data-vibeui-block="calendar-016"] [data-part="cell"][data-state="full"] [data-part="bar"] i{background:var(--vibeui-calendar-016-full)}
[data-vibeui-block="calendar-016"] [data-part="hours"]{
font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-calendar-016-muted);
}
[data-vibeui-block="calendar-016"] [data-part="cell"][data-state="free"] [data-part="hours"]{opacity:.5}
[data-vibeui-block="calendar-016"] [data-part="cell"][data-state="full"] [data-part="hours"]{
color:var(--vibeui-calendar-016-full);font-weight:650;
}
[data-vibeui-block="calendar-016"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.875rem;margin:0.75rem 0 0;
font-size:0.75rem;color:var(--vibeui-calendar-016-muted);
}
[data-vibeui-block="calendar-016"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="calendar-016"] [data-part="legend"] i{
width:0.75rem;height:0.4375rem;border-radius:0.25rem;background:var(--vibeui-calendar-016-track);
}
[data-vibeui-block="calendar-016"] [data-part="legend"] i[data-tone="busy"]{background:var(--vibeui-calendar-016-accent)}
[data-vibeui-block="calendar-016"] [data-part="legend"] i[data-tone="full"]{background:var(--vibeui-calendar-016-full)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-016"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_MEMBERS: Calendar016Member[] = [
  { name: "Аня Ким", hours: [6, 8, 4, 2, 0] },
  { name: "Борис Лещ", hours: [3, 3, 8, 8, 5] },
  { name: "Вера Ной", hours: [0, 2, 2, 6, 8] },
  { name: "Глеб Ро", hours: [8, 8, 8, 4, 1] },
  { name: "Дина Соль", hours: [2, 0, 5, 3, 7] },
]

const DEFAULT_LEGEND: Record<string, string> = {
  free: "свободно",
  busy: "занято частично",
  full: "день забит ({capacity} ч)",
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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? fallback
    : value
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Недельная сетка занятости команды: люди по строкам, дни по столбцам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar016({
  weekStart: weekStartProp = "2026-03-16",
  members = DEFAULT_MEMBERS,
  capacity = 8,
  heading = "Загрузка команды",
  memberColumnLabel = "Участник",
  cellTitleText = "{name}, {date}: {hours} из {capacity} ч",
  hoursText = "{hours} ч",
  legendText = DEFAULT_LEGEND,
  locale: localeProp = "ru-RU",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar016Props) {
  const weekStart = safeDate(weekStartProp, "2026-03-16")
  const locale = safeLocale(localeProp, "ru-RU")
  const [year, month, day] = weekStart.split("-").map(Number)
  const first = new Date(year, month - 1, day)
  const columns = Math.max(1, ...members.map((member) => member.hours.length))
  const days = Array.from(
    { length: columns },
    (_, index) => new Date(first.getTime() + index * DAY),
  )

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const short = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  })

  const legend = { ...DEFAULT_LEGEND, ...legendText }

  const palette = {
    ...(accent ? { "--vibeui-calendar-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-016"
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="range">
            {short.format(days[0])} — {short.format(days[days.length - 1])}
          </p>
        </header>
        <div data-part="scroll">
          <table aria-label={heading}>
            <thead>
              <tr>
                <th scope="col" aria-label={memberColumnLabel} />
                {days.map((date) => {
                  const weekend = date.getDay() === 0 || date.getDay() === 6

                  return (
                    <th
                      key={date.toISOString()}
                      scope="col"
                      data-weekend={weekend}
                    >
                      <span>{weekday.format(date)}</span>
                      {date.getDate()}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.name}>
                  <th scope="row">{member.name}</th>
                  {days.map((date, index) => {
                    const hours = member.hours[index] ?? 0
                    const fill = Math.min(
                      100,
                      Math.round((hours / capacity) * 100),
                    )
                    const state =
                      hours === 0 ? "free" : fill >= 100 ? "full" : "busy"

                    return (
                      <td key={date.toISOString()}>
                        <span
                          data-part="cell"
                          data-state={state}
                          title={fillText(cellTitleText, {
                            name: member.name,
                            date: short.format(date),
                            hours,
                            capacity,
                          })}
                        >
                          <span data-part="bar" aria-hidden="true">
                            <i
                              style={
                                {
                                  "--vibeui-calendar-016-fill": fill,
                                } as CSSProperties
                              }
                            />
                          </span>
                          <span data-part="hours">
                            {fillText(hoursText, { hours })}
                          </span>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="legend">
          <span>
            <i aria-hidden="true" />
            {fillText(legend.free, { capacity })}
          </span>
          <span>
            <i data-tone="busy" aria-hidden="true" />
            {fillText(legend.busy, { capacity })}
          </span>
          <span>
            <i data-tone="full" aria-hidden="true" />
            {fillText(legend.full, { capacity })}
          </span>
        </p>
      </section>
    </>
  )
}
