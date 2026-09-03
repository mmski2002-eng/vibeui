import type { ComponentProps, CSSProperties } from "react"

export type Calendar014Props = Omit<
  ComponentProps<"aside">,
  "children" | "title"
> & {
  year?: number
  month?: number
  /** Число событий по дням месяца: ключ — день, значение — сколько событий. */
  events?: Record<number, number>
  today?: number
  caption?: string
  /** Формы счётчика событий по категориям Intl.PluralRules. {count} подставляется. */
  eventsText?: Record<string, string>
  /** Подпись клетки с событиями. {day}, {month} и {events} подставляются. */
  dayLabelText?: string
  /** Подпись всего календаря. {month} и {year} подставляются. */
  calendarLabelText?: string
  /** Слово к сегодняшней дате: заливка видна глазом, но не слышна скринридеру. */
  todayLabel?: string
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: мини-календарь для боковой колонки. Ширина — пятнадцать
// рем, поэтому событий в клетке нет: под числом стоят точки, максимум три,
// а четвёртое и дальше сворачиваются в плюс. Точки под числом, а не поверх:
// подложка под цифрой съела бы саму цифру.
const STYLES = `
:where([data-vibeui-block="calendar-014"]){
--vibeui-calendar-014-bg:transparent;
--vibeui-calendar-014-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-calendar-014-muted:color-mix(in oklab,var(--vibeui-calendar-014-fg) 68%,transparent);
--vibeui-calendar-014-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-014-accent:light-dark(oklch(0.56 0.16 25),oklch(0.74 0.14 25));
--vibeui-calendar-014-on-accent:light-dark(oklch(0.99 0.01 25),oklch(0.2 0.04 25));
--vibeui-calendar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-014"]{color-scheme:dark}
[data-vibeui-block="calendar-014"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-014-bg);
border:1px solid var(--vibeui-calendar-014-border);border-radius:0.75rem;
color:var(--vibeui-calendar-014-fg);font-family:var(--vibeui-calendar-014-font);
}
[data-vibeui-block="calendar-014"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-014"] [data-part="month"]{
margin:0;font-size:0.9375rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-014"] [data-part="month"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-014"] [data-part="year"]{
font-size:0.75rem;color:var(--vibeui-calendar-014-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-014"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.0625rem;
}
[data-vibeui-block="calendar-014"] [data-part="wd"]{
padding-bottom:0.1875rem;text-align:center;
font-size:0.6875rem;font-weight:600;text-transform:lowercase;
color:var(--vibeui-calendar-014-muted);
}
[data-vibeui-block="calendar-014"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.125rem;
height:1.875rem;border-radius:0.375rem;
font-size:0.8125rem;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-weekend="true"]{color:var(--vibeui-calendar-014-muted)}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"]{
background:var(--vibeui-calendar-014-accent);color:var(--vibeui-calendar-014-on-accent);font-weight:700;
}
/* Заливка «сегодня» — только цвет; слово рядом произносит скринридер. */
[data-vibeui-block="calendar-014"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="calendar-014"] [data-part="dots"]{
display:flex;align-items:center;gap:0.125rem;height:0.25rem;
}
[data-vibeui-block="calendar-014"] [data-part="dots"] i{
width:0.1875rem;height:0.1875rem;border-radius:50%;
background:var(--vibeui-calendar-014-accent);
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"] [data-part="dots"] i{background:var(--vibeui-calendar-014-on-accent)}
[data-vibeui-block="calendar-014"] [data-part="more"]{
font-size:0.5rem;line-height:0.25rem;font-weight:700;
color:var(--vibeui-calendar-014-accent);
}
[data-vibeui-block="calendar-014"] [data-part="cell"][data-today="true"] [data-part="more"]{color:var(--vibeui-calendar-014-on-accent)}
[data-vibeui-block="calendar-014"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.375rem;border-top:1px solid var(--vibeui-calendar-014-border);
font-size:0.875rem;color:var(--vibeui-calendar-014-muted);
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

const DEFAULT_EVENTS_TEXT: Record<string, string> = {
  one: "{count} событие",
  few: "{count} события",
  many: "{count} событий",
  other: "{count} событий",
}

function fill(template: string, values: Record<string, string | number>) {
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
 * Месяц и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за неверного значения: NaN даёт Invalid Date, а Intl бросает
 * RangeError и на нём, и на нераспознанной локали — белый экран вместо сайта.
 */
function safeMonth(year: number, month: number, fallback: number[]) {
  return Number.isNaN(new Date(year, month - 1, 1).getTime())
    ? fallback
    : [year, month]
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
 * Мини-календарь боковой колонки: точки событий под числами и итог месяца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar014({
  year: yearProp = 2026,
  month: monthProp = 3,
  events = DEFAULT_EVENTS,
  today = 14,
  caption = "Все события",
  eventsText = DEFAULT_EVENTS_TEXT,
  dayLabelText = "{day} {month}: {events}",
  calendarLabelText = "Календарь: {month} {year}",
  todayLabel = "Сегодня",
  locale: localeProp = "ru-RU",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar014Props) {
  const [year, month] = safeMonth(yearProp, monthProp, [2026, 3])
  const locale = safeLocale(localeProp, "ru-RU")
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

  // Формы счётчика выбираются по правилам самого языка, а не по русским:
  // словарь приходит пропсом, а категорию называет Intl.
  const plural = new Intl.PluralRules(locale)
  const countText = (count: number) =>
    fill(
      eventsText[plural.select(count)] ??
        eventsText.other ??
        DEFAULT_EVENTS_TEXT.other,
      { count },
    )

  const palette = {
    ...(accent ? { "--vibeui-calendar-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-014" precedence="medium">
        {STYLES}
      </style>
      <aside
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-014"
        className={className}
        style={palette}
        aria-label={fill(calendarLabelText, { month: monthName, year })}
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
                    ? fill(dayLabelText, {
                        day,
                        month: monthName,
                        events: countText(count),
                      })
                    : undefined
                }
              >
                <span>{day}</span>
                {day === today ? (
                  <span data-part="sr">{todayLabel}</span>
                ) : null}
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
          <span>{countText(total)}</span>
          <a href="#events">{caption}</a>
        </footer>
      </aside>
    </>
  )
}
