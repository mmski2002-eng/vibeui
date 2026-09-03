import type { ComponentProps, CSSProperties } from "react"

export type Eventcalendar001Event = {
  /** День месяца, 1–31. */
  day: number
  title: string
  time?: string
  tone?: "work" | "personal" | "hold"
}

export type Eventcalendar001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  month?: string
  events?: Eventcalendar001Event[]
  visible?: number
  heading?: string
  /** Счётчик в шапке. {count} — число событий месяца. */
  countText?: string
  /** Подпись сворачивания. {count} — число спрятанных событий. */
  moreText?: string
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-eventcalendar-001-bg:transparent;
--vibeui-eventcalendar-001-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-eventcalendar-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-eventcalendar-001-muted:color-mix(in oklab,var(--vibeui-eventcalendar-001-fg) 68%,transparent);
--vibeui-eventcalendar-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-eventcalendar-001-line:light-dark(oklch(0.95 0.004 265),oklch(0.31 0.01 265));
--vibeui-eventcalendar-001-accent:light-dark(oklch(0.55 0.16 262),oklch(0.74 0.15 262));
--vibeui-eventcalendar-001-personal:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.13 152));
--vibeui-eventcalendar-001-hold:light-dark(oklch(0.6 0.02 265),oklch(0.72 0.02 265));
--vibeui-eventcalendar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="eventcalendar-001"]{color-scheme:dark}
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
background:var(--vibeui-eventcalendar-001-panel);
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
 * Месяц с событиями в клетках: лишние сворачиваются в «ещё N» и
 * раскрываются нативным <details>. Один файл, ноль зависимостей.
 */
export function Eventcalendar001({
  month = "2026-03-01",
  events = DEFAULT_EVENTS,
  visible = 2,
  heading,
  countText = "{count} событий в месяце",
  moreText = "ещё {count}",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Eventcalendar001Props) {
  const anchor = safeDay(month, "2026-03-01")
  const tag = safeLocale(locale, "ru-RU")
  const year = anchor.getUTCFullYear()
  const monthIndex = anchor.getUTCMonth()
  const first = Date.UTC(year, monthIndex, 1)
  const shift = (new Date(first).getUTCDay() + 6) % 7
  const start = first - shift * DAY

  const monthName = new Intl.DateTimeFormat(tag, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(anchor)

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(tag, {
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
    ...(background
      ? {
          "--vibeui-eventcalendar-001-bg": background,
          "--vibeui-eventcalendar-001-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="event-calendar"
        data-vibeui-block="eventcalendar-001"
        aria-label={heading ?? monthName}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading ?? monthName}</h3>
          <p data-part="count">
            {countText.replace("{count}", String(events.length))}
          </p>
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
                    <summary>
                      {moreText.replace("{count}", String(hidden.length))}
                    </summary>
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
