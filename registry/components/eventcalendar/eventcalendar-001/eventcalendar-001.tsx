import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Eventcalendar001Event = {
  /** День месяца, 1–31. */
  day: number
  title: string
  time?: string
  tone?: "work" | "personal" | "hold"
}

export type Eventcalendar001Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  month?: string
  events?: Eventcalendar001Event[]
  visible?: number
  heading?: string
  locale?: string
  accent?: string
}

// Идея компонента: месяц показывает не даты, а события в датах. Клетка
// держит фиксированную высоту, поэтому загруженный день не растягивает
// строку и сетка остаётся сеткой; всё, что не влезло, сворачивается в
// «ещё N» и раскрывается нативным <details> — без единой строки клиентского
// кода. Переполнение считается заранее, а не обрезается overflow: скрытое
// событие обязано быть достижимо, иначе календарь врёт.
const STYLES = `
:where([data-vibeui-block="eventcalendar-001"]){
--vibeui-eventcalendar-001-bg:oklch(1 0 0);
--vibeui-eventcalendar-001-fg:oklch(0.24 0.014 265);
--vibeui-eventcalendar-001-muted:oklch(0.6 0.014 265);
--vibeui-eventcalendar-001-border:oklch(0.91 0.006 265);
--vibeui-eventcalendar-001-line:oklch(0.95 0.004 265);
--vibeui-eventcalendar-001-accent:oklch(0.55 0.16 262);
--vibeui-eventcalendar-001-personal:oklch(0.58 0.14 152);
--vibeui-eventcalendar-001-hold:oklch(0.6 0.02 265);
--vibeui-eventcalendar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="eventcalendar-001"]{
width:100%;max-width:46rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-eventcalendar-001-bg);
border:1px solid var(--vibeui-eventcalendar-001-border);border-radius:1rem;
color:var(--vibeui-eventcalendar-001-fg);
font-family:var(--vibeui-eventcalendar-001-font);
}
[data-vibeui-block="eventcalendar-001"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-001"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="eventcalendar-001"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «март 2026 г.». */
[data-vibeui-block="eventcalendar-001"] [data-part="heading"]::first-letter{text-transform:uppercase}
[data-vibeui-block="eventcalendar-001"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-eventcalendar-001-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="eventcalendar-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,minmax(0,1fr));
border:1px solid var(--vibeui-eventcalendar-001-line);border-radius:0.625rem;
}
[data-vibeui-block="eventcalendar-001"] [data-part="weekday"]{
padding:0.375rem 0.5rem;text-align:center;
font-size:0.6875rem;font-weight:600;text-transform:capitalize;
color:var(--vibeui-eventcalendar-001-muted);
border-bottom:1px solid var(--vibeui-eventcalendar-001-line);
}
/* Клетка держит высоту сама: иначе один загруженный день растянет всю
   строку месяца и сетка перестанет читаться как сетка. */
[data-vibeui-block="eventcalendar-001"] [data-part="cell"]{
position:relative;display:flex;flex-direction:column;gap:0.1875rem;
min-height:5.25rem;padding:0.3125rem;
border-top:1px solid var(--vibeui-eventcalendar-001-line);
border-left:1px solid var(--vibeui-eventcalendar-001-line);
}
[data-vibeui-block="eventcalendar-001"] [data-part="cell"]:nth-child(7n+1){border-left:0}
[data-vibeui-block="eventcalendar-001"] [data-part="cell"][data-outside="true"]{
background:var(--vibeui-eventcalendar-001-line);
}
[data-vibeui-block="eventcalendar-001"] [data-part="daynum"]{
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-001-muted);
}
[data-vibeui-block="eventcalendar-001"] [data-part="cell"][data-outside="false"] [data-part="daynum"]{
color:var(--vibeui-eventcalendar-001-fg);
}
[data-vibeui-block="eventcalendar-001"] [data-part="chip"]{
display:flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.3125rem;border-radius:0.3125rem;
border-left:3px solid var(--vibeui-eventcalendar-001-accent);
background:color-mix(in oklab,var(--vibeui-eventcalendar-001-accent) 12%,transparent);
font-size:0.625rem;line-height:1.3;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="eventcalendar-001"] [data-part="chip"] b{
font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-001-muted);
}
[data-vibeui-block="eventcalendar-001"] [data-tone="personal"]{
border-left-color:var(--vibeui-eventcalendar-001-personal);
background:color-mix(in oklab,var(--vibeui-eventcalendar-001-personal) 14%,transparent);
}
[data-vibeui-block="eventcalendar-001"] [data-tone="hold"]{
border-left-color:var(--vibeui-eventcalendar-001-hold);border-left-style:dashed;
background:color-mix(in oklab,var(--vibeui-eventcalendar-001-hold) 10%,transparent);
}
/* «Ещё N» — обычный <details>: раскрытие списка не требует состояния,
   а скрытое событие обязано оставаться достижимым с клавиатуры. */
[data-vibeui-block="eventcalendar-001"] [data-part="more"]{margin-top:auto}
[data-vibeui-block="eventcalendar-001"] summary{
list-style:none;cursor:pointer;border-radius:0.3125rem;padding:0.0625rem 0.25rem;
font-size:0.625rem;font-weight:600;
color:var(--vibeui-eventcalendar-001-accent);
}
[data-vibeui-block="eventcalendar-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="eventcalendar-001"] summary:focus-visible{
outline:2px solid var(--vibeui-eventcalendar-001-accent);outline-offset:1px;
}
[data-vibeui-block="eventcalendar-001"] [data-part="overflow"]{
position:absolute;left:0.25rem;right:0.25rem;top:100%;z-index:2;
display:flex;flex-direction:column;gap:0.1875rem;
margin:0.1875rem 0 0;padding:0.375rem;list-style:none;
background:var(--vibeui-eventcalendar-001-bg);
border:1px solid var(--vibeui-eventcalendar-001-border);border-radius:0.5rem;
box-shadow:0 10px 24px oklch(0.24 0.014 265 / 14%);
}
[data-vibeui-block="eventcalendar-001"] [data-part="cell"]:nth-child(n+29) [data-part="overflow"]{
top:auto;bottom:100%;margin:0 0 0.1875rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-001"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_EVENTS: Eventcalendar001Event[] = [
  { day: 3, title: "Планёрка", time: "10:00" },
  { day: 5, title: "Ревью дизайна", time: "14:00" },
  { day: 5, title: "Созвон с Кимом", time: "16:30", tone: "personal" },
  { day: 11, title: "Релиз 4.2", time: "12:00" },
  { day: 12, title: "Бассейн", time: "07:30", tone: "personal" },
  { day: 12, title: "Спринт-обзор", time: "11:00" },
  { day: 12, title: "Интервью", time: "15:00" },
  { day: 12, title: "Ретро", time: "17:00", tone: "hold" },
  { day: 18, title: "Отчёт за квартал", time: "09:00" },
  { day: 19, title: "Обед с Верой", time: "13:00", tone: "personal" },
  { day: 19, title: "Правки бюджета", tone: "hold" },
  { day: 24, title: "Демо клиенту", time: "11:30" },
  { day: 24, title: "Тренировка", time: "19:00", tone: "personal" },
  { day: 24, title: "Черновик плана", tone: "hold" },
  { day: 27, title: "Выезд команды", time: "10:00" },
]

/**
 * Месяц с событиями в клетках: лишние сворачиваются в «ещё N» и
 * раскрываются нативным <details>. Один файл, ноль зависимостей.
 */
export function Eventcalendar001({
  month = "2026-03-01",
  events = DEFAULT_EVENTS,
  visible = 2,
  heading,
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Eventcalendar001Props) {
  const anchor = new Date(`${month}T00:00:00Z`)
  const year = anchor.getUTCFullYear()
  const monthIndex = anchor.getUTCMonth()
  const first = Date.UTC(year, monthIndex, 1)
  const shift = (new Date(first).getUTCDay() + 6) % 7
  const start = first - shift * DAY

  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(anchor)

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(start + index * DAY)),
  )

  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start + index * DAY)
    const outside = date.getUTCMonth() !== monthIndex
    const day = date.getUTCDate()

    return {
      key: date.toISOString().slice(0, 10),
      day,
      outside,
      events: outside ? [] : events.filter((event) => event.day === day),
    }
  })

  const palette = {
    ...(accent ? { "--vibeui-eventcalendar-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="eventcalendar-001"
        aria-label={heading ?? monthName}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading ?? monthName}</h3>
          <p data-part="count">{events.length} событий в месяце</p>
        </header>

        <div data-part="grid">
          {weekdays.map((weekday) => (
            <span key={weekday} data-part="weekday">
              {weekday}
            </span>
          ))}

          {cells.map((cell) => {
            const shown = cell.events.slice(0, visible)
            const hidden = cell.events.slice(visible)

            return (
              <div
                key={cell.key}
                data-part="cell"
                data-outside={String(cell.outside)}
              >
                <span data-part="daynum">{cell.day}</span>

                {shown.map((event) => (
                  <span
                    key={event.title}
                    data-part="chip"
                    data-tone={event.tone ?? "work"}
                  >
                    {event.time ? <b>{event.time}</b> : null}
                    {event.title}
                  </span>
                ))}

                {hidden.length > 0 ? (
                  <details data-part="more">
                    <summary>ещё {hidden.length}</summary>
                    <ul data-part="overflow">
                      {hidden.map((event) => (
                        <li
                          key={event.title}
                          data-part="chip"
                          data-tone={event.tone ?? "work"}
                        >
                          {event.time ? <b>{event.time}</b> : null}
                          {event.title}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
