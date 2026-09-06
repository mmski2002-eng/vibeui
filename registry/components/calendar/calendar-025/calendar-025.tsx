import type { ComponentProps, CSSProperties } from "react"

export type Calendar025Shift = "day" | "night" | "off" | "leave"

export type Calendar025Person = {
  name: string
  role?: string
  /** Семь смен подряд, начиная с weekStart. */
  shifts: Calendar025Shift[]
}

export type Calendar025Props = Omit<ComponentProps<"section">, "children"> & {
  heading?: string
  weekStart?: string
  people?: Calendar025Person[]
  density?: "compact" | "comfortable"
  locale?: string
  /** Полные названия смен: компонент несёт русские, проект подставляет свои. */
  shiftText?: Record<Calendar025Shift, string>
  /** Короткие коды смен в клетке. */
  shiftCode?: Record<Calendar025Shift, string>
  /** Заголовок первой колонки. */
  staffLabel?: string
  /** Подпись колонки итога для скринридера. */
  totalLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: график смен читают не по одному человеку, а по столбцу —
// «кто в ночь во вторник». Поэтому это таблица «сотрудники × дни» с кодом
// смены в клетке, цветом по типу и итогом смен справа: дыру в покрытии
// видно как пустую колонку, а перегруз — как большое число в итоге.
const STYLES = `
:where([data-vibeui-block="calendar-025"]){
--vibeui-calendar-025-bg:transparent;
--vibeui-calendar-025-fg:light-dark(oklch(0.23 0 250),oklch(0.94 0 250));
--vibeui-calendar-025-muted:color-mix(in oklab,var(--vibeui-calendar-025-fg) 68%,transparent);
--vibeui-calendar-025-border:light-dark(oklch(0.91 0 250),oklch(0.34 0 250));
--vibeui-calendar-025-soft:light-dark(oklch(0.97 0 250),oklch(0.27 0 250));
--vibeui-calendar-025-day:light-dark(oklch(0.93 0.06 95),oklch(0.43 0.07 95));
--vibeui-calendar-025-dayfg:light-dark(oklch(0.4 0.09 75),oklch(0.92 0.06 90));
--vibeui-calendar-025-night:light-dark(oklch(0.9 0.05 270),oklch(0.41 0.08 275));
--vibeui-calendar-025-nightfg:light-dark(oklch(0.38 0.11 275),oklch(0.9 0.06 275));
--vibeui-calendar-025-leave:light-dark(oklch(0.93 0.05 160),oklch(0.41 0.06 160));
--vibeui-calendar-025-leavefg:light-dark(oklch(0.4 0.08 160),oklch(0.9 0.05 160));
--vibeui-calendar-025-cell:2.125rem;
--vibeui-calendar-025-radius:0.75rem;
--vibeui-calendar-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-025"]{color-scheme:dark}
[data-vibeui-block="calendar-025"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-025-bg);
border:1px solid var(--vibeui-calendar-025-border);
border-radius:calc(var(--vibeui-calendar-025-radius) + 0.25rem);
color:var(--vibeui-calendar-025-fg);
font-family:var(--vibeui-calendar-025-font);
}
[data-vibeui-block="calendar-025"][data-density="comfortable"]{--vibeui-calendar-025-cell:2.625rem}
[data-vibeui-block="calendar-025"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-025"] [data-part="range"]{
margin:0.125rem 0 0;font-size:0.875rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="calendar-025"] table{
width:100%;min-width:24rem;border-collapse:separate;border-spacing:0.125rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-025"] th,
[data-vibeui-block="calendar-025"] td{padding:0;text-align:center;font-weight:600}
[data-vibeui-block="calendar-025"] thead th{
font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.04em;
color:var(--vibeui-calendar-025-muted);padding-bottom:0.125rem;
}
[data-vibeui-block="calendar-025"] thead th[data-weekend="true"]{color:var(--vibeui-calendar-025-fg)}
[data-vibeui-block="calendar-025"] [data-part="who"]{
width:8rem;text-align:left;font-size:0.8125rem;line-height:1.15;
padding-right:0.375rem;
}
[data-vibeui-block="calendar-025"] [data-part="who"] small{
display:block;font-size:0.6875rem;font-weight:500;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="cell"]{
position:relative;display:flex;align-items:center;justify-content:center;
height:var(--vibeui-calendar-025-cell);border-radius:0.4375rem;
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
width:2.5rem;font-size:0.875rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin:0;padding-top:0.625rem;
border-top:1px solid var(--vibeui-calendar-025-border);
font-size:0.75rem;color:var(--vibeui-calendar-025-muted);
}
[data-vibeui-block="calendar-025"] [data-part="key"]{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="calendar-025"] [data-part="chip"]{
width:0.875rem;height:0.875rem;border-radius:0.25rem;background:var(--vibeui-calendar-025-soft);
}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="day"]{background:var(--vibeui-calendar-025-day)}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="night"]{background:var(--vibeui-calendar-025-night)}
[data-vibeui-block="calendar-025"] [data-part="chip"][data-shift="leave"]{background:var(--vibeui-calendar-025-leave)}
`

const SHIFT_CODE: Record<Calendar025Shift, string> = {
  day: "Д",
  night: "Н",
  off: "·",
  leave: "О",
}

const SHIFT_TEXT: Record<Calendar025Shift, string> = {
  day: "дневная смена",
  night: "ночная смена",
  off: "выходной",
  leave: "отпуск",
}

const SHIFT_ORDER: Calendar025Shift[] = ["day", "night", "off", "leave"]

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
 * График смен: сотрудники по строкам, дни недели по столбцам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar025({
  heading = "График смен",
  weekStart: weekStartProp = "2026-04-13",
  people = CREW,
  density = "compact",
  locale: localeProp = "ru-RU",
  shiftText = SHIFT_TEXT,
  shiftCode = SHIFT_CODE,
  staffLabel = "Сотрудник",
  totalLabel = "Смен",
  background = "",
  accent,
  className,
  style,
  ...props
}: Calendar025Props) {
  const weekStart = safeDate(weekStartProp, "2026-04-13")
  const locale = safeLocale(localeProp, "ru-RU")
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
    ...(background
      ? {
          "--vibeui-calendar-025-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-025" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="calendar"
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
                  {staffLabel}
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
                <th data-part="total" scope="col" abbr={totalLabel}>
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
                        title={`${person.name}: ${shiftText[shift] ?? SHIFT_TEXT[shift]}`}
                      >
                        <span aria-hidden="true">
                          {shiftCode[shift] ?? SHIFT_CODE[shift]}
                        </span>
                        <span data-part="sr">
                          {shiftText[shift] ?? SHIFT_TEXT[shift]}
                        </span>
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
          {SHIFT_ORDER.map((shift) => (
            <span key={shift} data-part="key">
              <span data-part="chip" data-shift={shift} aria-hidden="true" />
              {shiftText[shift] ?? SHIFT_TEXT[shift]}
            </span>
          ))}
        </p>
      </section>
    </>
  )
}
