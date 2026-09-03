import type { ComponentProps, CSSProperties } from "react"

export type Eventcalendar002Event = {
  /** Индекс дня недели в показанном диапазоне, 0 — первый столбец. */
  day: number
  /** «ЧЧ:ММ». Для событий на весь день время не указывается. */
  from?: string
  to?: string
  title: string
  tone?: "work" | "focus" | "away"
}

export type Eventcalendar002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  weekStart?: string
  events?: Eventcalendar002Event[]
  dayFrom?: number
  dayTo?: number
  heading?: string
  /** Подсказка под заголовком. {from} и {to} — границы рабочего дня. */
  hintText?: string
  /** Подпись столбца событий на весь день. */
  allDayText?: string
  /** Имя области прокрутки для читалки. {heading} — заголовок. */
  scrollLabel?: string
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: неделя как семь колонок времени. Высота колонки — это
// рабочий день целиком, поэтому положение и длительность события считаются
// в процентах от неё, а не подгоняются под ряды сетки: событие с 9:40 до
// 10:20 встаёт ровно туда, где оно есть. События на весь день живут в
// отдельной строке сверху — у них нет положения на шкале, и растягивать их
// на всю колонку было бы враньём.
const STYLES = `
:where([data-vibeui-block="eventcalendar-002"]){
--vibeui-eventcalendar-002-bg:transparent;
--vibeui-eventcalendar-002-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-eventcalendar-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-eventcalendar-002-muted:color-mix(in oklab,var(--vibeui-eventcalendar-002-fg) 68%,transparent);
--vibeui-eventcalendar-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-eventcalendar-002-line:light-dark(oklch(0.95 0.004 265),oklch(0.31 0.01 265));
--vibeui-eventcalendar-002-accent:light-dark(oklch(0.55 0.16 262),oklch(0.74 0.15 262));
--vibeui-eventcalendar-002-focus:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.13 152));
--vibeui-eventcalendar-002-away:light-dark(oklch(0.62 0.02 265),oklch(0.72 0.02 265));
--vibeui-eventcalendar-002-now:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.18 25));
--vibeui-eventcalendar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="eventcalendar-002"]{color-scheme:dark}
[data-vibeui-block="eventcalendar-002"]{
width:100%;max-width:52rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-eventcalendar-002-bg);
border:1px solid var(--vibeui-eventcalendar-002-border);border-radius:1rem;
color:var(--vibeui-eventcalendar-002-fg);
font-family:var(--vibeui-eventcalendar-002-font);
}
[data-vibeui-block="eventcalendar-002"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-002"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="eventcalendar-002"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="eventcalendar-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-eventcalendar-002-muted);
}
[data-vibeui-block="eventcalendar-002"] [data-part="scroll"]{
overflow-x:auto;border-radius:0.625rem;
border:1px solid var(--vibeui-eventcalendar-002-line);
}
[data-vibeui-block="eventcalendar-002"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-eventcalendar-002-accent);outline-offset:2px;
}
[data-vibeui-block="eventcalendar-002"] [data-part="shell"]{min-width:38rem}
[data-vibeui-block="eventcalendar-002"] [data-part="row"]{
display:grid;grid-template-columns:2.75rem repeat(var(--vibeui-eventcalendar-002-days,7),minmax(0,1fr));
}
[data-vibeui-block="eventcalendar-002"] [data-part="daylabel"]{
display:flex;flex-direction:column;align-items:center;gap:0.0625rem;
padding:0.375rem 0.25rem;
border-left:1px solid var(--vibeui-eventcalendar-002-line);
font-size:0.6875rem;color:var(--vibeui-eventcalendar-002-muted);
text-transform:capitalize;
}
[data-vibeui-block="eventcalendar-002"] [data-part="daylabel"] b{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-002-fg);
}
[data-vibeui-block="eventcalendar-002"] [data-part="daylabel"][data-weekend="true"] b{
color:var(--vibeui-eventcalendar-002-muted);
}
[data-vibeui-block="eventcalendar-002"] [data-part="corner"]{
padding:0.375rem 0.25rem;font-size:0.5625rem;text-align:right;
color:var(--vibeui-eventcalendar-002-muted);
}
/* Строка «весь день» отделена от шкалы: у такого события нет положения
   во времени, и растягивать его по колонке значило бы соврать. */
[data-vibeui-block="eventcalendar-002"] [data-part="row"][data-allday="true"]{
border-top:1px solid var(--vibeui-eventcalendar-002-line);
border-bottom:1px solid var(--vibeui-eventcalendar-002-border);
background:color-mix(in oklab,var(--vibeui-eventcalendar-002-line) 60%,transparent);
}
[data-vibeui-block="eventcalendar-002"] [data-part="allslot"]{
display:flex;flex-direction:column;gap:0.125rem;
min-height:1.5rem;padding:0.1875rem;
border-left:1px solid var(--vibeui-eventcalendar-002-line);
}
[data-vibeui-block="eventcalendar-002"] [data-part="hours"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="eventcalendar-002"] [data-part="hour"]{
height:var(--vibeui-eventcalendar-002-hour,2.75rem);
padding-right:0.3125rem;text-align:right;
font-size:0.5625rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-002-muted);
}
/* Колонка дня — своя система координат: событие ставится в проценты от
   рабочего дня, поэтому 9:40 не округляется до ближайшей строки сетки. */
[data-vibeui-block="eventcalendar-002"] [data-part="col"]{
position:relative;
height:calc(var(--vibeui-eventcalendar-002-hours,10) * var(--vibeui-eventcalendar-002-hour,2.75rem));
border-left:1px solid var(--vibeui-eventcalendar-002-line);
background:repeating-linear-gradient(
to bottom,
var(--vibeui-eventcalendar-002-line) 0 1px,
transparent 1px var(--vibeui-eventcalendar-002-hour,2.75rem));
}
[data-vibeui-block="eventcalendar-002"] [data-part="event"]{
position:absolute;left:0.1875rem;right:0.1875rem;
display:flex;flex-direction:column;gap:0.0625rem;overflow:hidden;
padding:0.1875rem 0.3125rem;border-radius:0.375rem;
border-left:3px solid var(--vibeui-eventcalendar-002-accent);
background:color-mix(in oklab,var(--vibeui-eventcalendar-002-accent) 14%,var(--vibeui-eventcalendar-002-panel));
font-size:0.625rem;line-height:1.25;
}
[data-vibeui-block="eventcalendar-002"] [data-part="event"] b{font-weight:650}
[data-vibeui-block="eventcalendar-002"] [data-part="event"] time{
font-variant-numeric:tabular-nums;color:var(--vibeui-eventcalendar-002-muted);
}
[data-vibeui-block="eventcalendar-002"] [data-tone="focus"]{
border-left-color:var(--vibeui-eventcalendar-002-focus);
background:color-mix(in oklab,var(--vibeui-eventcalendar-002-focus) 14%,var(--vibeui-eventcalendar-002-panel));
}
[data-vibeui-block="eventcalendar-002"] [data-tone="away"]{
border-left-color:var(--vibeui-eventcalendar-002-away);border-left-style:dashed;
background:repeating-linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-eventcalendar-002-away) 16%,var(--vibeui-eventcalendar-002-panel)) 0 4px,
var(--vibeui-eventcalendar-002-panel) 4px 8px);
}
[data-vibeui-block="eventcalendar-002"] [data-part="chip"]{
padding:0.0625rem 0.25rem;border-radius:0.25rem;
border:1px solid var(--vibeui-eventcalendar-002-away);
font-size:0.5625rem;line-height:1.3;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="eventcalendar-002"] [data-part="now"]{
position:absolute;left:0;right:0;height:0;
border-top:2px solid var(--vibeui-eventcalendar-002-now);
}
[data-vibeui-block="eventcalendar-002"] [data-part="now"]::before{
content:"";position:absolute;left:-0.1875rem;top:-0.25rem;
width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-eventcalendar-002-now);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-002"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_EVENTS: Eventcalendar002Event[] = [
  { day: 0, title: "Отпуск Веры" },
  { day: 0, from: "09:00", to: "09:30", title: "Планёрка" },
  { day: 0, from: "11:00", to: "12:30", title: "Дизайн-ревью" },
  { day: 1, from: "10:15", to: "11:45", title: "Интервью", tone: "focus" },
  { day: 1, from: "15:00", to: "16:00", title: "Клиент" },
  { day: 2, from: "09:30", to: "12:00", title: "Фокус-блок", tone: "focus" },
  { day: 2, from: "14:00", to: "14:45", title: "1:1 с Кимом" },
  { day: 3, title: "Учебный день" },
  { day: 3, from: "13:00", to: "17:00", title: "Воркшоп", tone: "away" },
  { day: 4, from: "09:00", to: "10:00", title: "Спринт-обзор" },
  { day: 4, from: "16:30", to: "18:00", title: "Ретро" },
  { day: 5, from: "11:00", to: "12:00", title: "Уборка бэклога", tone: "away" },
]

function minutes(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
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
 * Неверный проп не должен ронять страницу-хост: на Invalid Date форматтеры
 * Intl и toISOString бросают RangeError, поэтому дату откатываем на дефолтную.
 */
function safeDay(value: string, fallback: string) {
  const date = new Date(`${value}T00:00:00Z`)

  return Number.isNaN(date.getTime()) ? new Date(`${fallback}T00:00:00Z`) : date
}

/** По той же причине неразбираемая локаль откатывается на дефолтную. */
function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Неделя колонками дней: события стоят по времени в процентах от рабочего
 * дня, события на весь день — отдельной строкой. Один файл, ноль зависимостей.
 */
export function Eventcalendar002({
  weekStart = "2026-03-16",
  events = DEFAULT_EVENTS,
  dayFrom = 8,
  dayTo = 19,
  heading = "Неделя",
  hintText = "рабочий день {from}:00 — {to}:00, красная черта — сейчас",
  allDayText = "весь день",
  scrollLabel = "{heading}: расписание по дням",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Eventcalendar002Props) {
  const start = safeDay(weekStart, "2026-03-16").getTime()
  const tag = safeLocale(locale, "ru-RU")
  const span = (dayTo - dayFrom) * 60
  const days = 7

  const columns = Array.from({ length: days }, (_, index) => {
    const date = new Date(start + index * DAY)

    return {
      key: date.toISOString().slice(0, 10),
      weekday: new Intl.DateTimeFormat(tag, {
        weekday: "short",
        timeZone: "UTC",
      }).format(date),
      number: date.getUTCDate(),
      weekend: date.getUTCDay() % 6 === 0,
      allDay: events.filter((event) => event.day === index && !event.from),
      timed: events.filter((event) => event.day === index && event.from),
    }
  })

  const hours = Array.from(
    { length: dayTo - dayFrom },
    (_, index) => dayFrom + index,
  )

  const palette = {
    "--vibeui-eventcalendar-002-days": days,
    "--vibeui-eventcalendar-002-hours": hours.length,
    ...(accent ? { "--vibeui-eventcalendar-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-eventcalendar-002-bg": background,
          "--vibeui-eventcalendar-002-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="event-calendar"
        data-vibeui-block="eventcalendar-002"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">
            {hintText
              .replace("{from}", String(dayFrom))
              .replace("{to}", String(dayTo))}
          </p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={scrollLabel.replace("{heading}", heading)}
        >
          <div data-part="shell">
            <div data-part="row">
              <span data-part="corner" />
              {columns.map((column) => (
                <span
                  key={column.key}
                  data-part="daylabel"
                  data-weekend={String(column.weekend)}
                >
                  {column.weekday}
                  <b>{column.number}</b>
                </span>
              ))}
            </div>

            <div data-part="row" data-allday="true">
              <span data-part="corner">{allDayText}</span>
              {columns.map((column) => (
                <div key={column.key} data-part="allslot">
                  {column.allDay.map((event) => (
                    <span key={event.title} data-part="chip">
                      {event.title}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div data-part="row">
              <div data-part="hours">
                {hours.map((hour) => (
                  <span key={hour} data-part="hour">
                    {hour}:00
                  </span>
                ))}
              </div>

              {columns.map((column, index) => (
                <div key={column.key} data-part="col">
                  {index === 2 ? (
                    <span
                      data-part="now"
                      aria-hidden="true"
                      style={{ top: "38%" }}
                    />
                  ) : null}

                  {column.timed.map((event) => {
                    const from = minutes(event.from ?? "00:00")
                    const to = minutes(event.to ?? event.from ?? "00:00")
                    const top = ((from - dayFrom * 60) / span) * 100
                    const height = ((to - from) / span) * 100

                    return (
                      <article
                        key={event.title}
                        data-part="event"
                        data-tone={event.tone ?? "work"}
                        style={{
                          top: `${Math.max(0, top)}%`,
                          height: `${Math.max(3, height)}%`,
                        }}
                      >
                        <b>{event.title}</b>
                        <time>
                          {event.from}–{event.to}
                        </time>
                      </article>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
