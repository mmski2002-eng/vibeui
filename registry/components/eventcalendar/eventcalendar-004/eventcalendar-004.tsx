import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Eventcalendar004Event = {
  /** Начало в виде «ГГГГ-ММ-ДДTЧЧ:ММ». */
  at: string
  /** Длительность в минутах. */
  minutes?: number
  title: string
  place?: string
  tone?: "work" | "personal" | "deadline"
}

export type Eventcalendar004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  today?: string
  events?: Eventcalendar004Event[]
  days?: number
  heading?: string
  locale?: string
  accent?: string
}

// Идея компонента: ближайшие события удобнее читать лентой, а не сеткой —
// в сетке половина клеток пустая. День становится липким заголовком, под ним
// идут события по возрастанию времени, и сколько бы их ни было, строка не
// ломается: время стоит отдельной колонкой с моноширинными цифрами.
// «Сегодня» и «Завтра» подписаны словами — дату в эти два дня никто не читает.
const STYLES = `
:where([data-vibeui-block="eventcalendar-004"]){
--vibeui-eventcalendar-004-bg:oklch(1 0 0);
--vibeui-eventcalendar-004-fg:oklch(0.23 0.014 265);
--vibeui-eventcalendar-004-muted:oklch(0.6 0.014 265);
--vibeui-eventcalendar-004-border:oklch(0.91 0.006 265);
--vibeui-eventcalendar-004-line:oklch(0.96 0.004 265);
--vibeui-eventcalendar-004-accent:oklch(0.55 0.16 262);
--vibeui-eventcalendar-004-personal:oklch(0.6 0.13 165);
--vibeui-eventcalendar-004-deadline:oklch(0.58 0.19 25);
--vibeui-eventcalendar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="eventcalendar-004"]{
width:100%;max-width:30rem;box-sizing:border-box;
padding:1rem 1rem 0.5rem;
background:var(--vibeui-eventcalendar-004-bg);
border:1px solid var(--vibeui-eventcalendar-004-border);border-radius:1rem;
color:var(--vibeui-eventcalendar-004-fg);
font-family:var(--vibeui-eventcalendar-004-font);
}
[data-vibeui-block="eventcalendar-004"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-004"] ol,
[data-vibeui-block="eventcalendar-004"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="eventcalendar-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.5rem;
}
[data-vibeui-block="eventcalendar-004"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="eventcalendar-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-eventcalendar-004-muted);
}
/* Лента прокручивается сама: карточка в сайдбаре не должна расти вместе
   с числом встреч. */
[data-vibeui-block="eventcalendar-004"] [data-part="feed"]{
max-height:22rem;overflow-y:auto;
}
[data-vibeui-block="eventcalendar-004"] [data-part="feed"]:focus-visible{
outline:2px solid var(--vibeui-eventcalendar-004-accent);outline-offset:2px;
border-radius:0.5rem;
}
/* Заголовок дня липкий: при прокрутке видно, к какому дню относится строка. */
[data-vibeui-block="eventcalendar-004"] [data-part="dayhead"]{
position:sticky;top:0;z-index:1;
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0;padding:0.375rem 0;
background:var(--vibeui-eventcalendar-004-bg);
border-bottom:1px solid var(--vibeui-eventcalendar-004-border);
font-size:0.75rem;font-weight:700;text-transform:capitalize;
}
[data-vibeui-block="eventcalendar-004"] [data-part="dayhead"] span{
font-weight:500;text-transform:none;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-004-muted);
}
[data-vibeui-block="eventcalendar-004"] [data-part="dayhead"][data-today="true"]{
color:var(--vibeui-eventcalendar-004-accent);
}
[data-vibeui-block="eventcalendar-004"] [data-part="row"]{
display:grid;grid-template-columns:3.25rem minmax(0,1fr);
gap:0.625rem;padding:0.5rem 0;
border-bottom:1px solid var(--vibeui-eventcalendar-004-line);
}
[data-vibeui-block="eventcalendar-004"] [data-part="when"]{
display:flex;flex-direction:column;gap:0.0625rem;
padding-left:0.5rem;
border-left:3px solid var(--vibeui-eventcalendar-004-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="eventcalendar-004"] [data-part="when"] time{
font-size:0.8125rem;font-weight:650;line-height:1.1;
}
[data-vibeui-block="eventcalendar-004"] [data-part="when"] small{
font-size:0.5625rem;color:var(--vibeui-eventcalendar-004-muted);
}
[data-vibeui-block="eventcalendar-004"] [data-tone="personal"] [data-part="when"]{
border-left-color:var(--vibeui-eventcalendar-004-personal);
}
[data-vibeui-block="eventcalendar-004"] [data-tone="deadline"] [data-part="when"]{
border-left-color:var(--vibeui-eventcalendar-004-deadline);border-left-style:double;
border-left-width:4px;
}
[data-vibeui-block="eventcalendar-004"] [data-part="what"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;
}
[data-vibeui-block="eventcalendar-004"] [data-part="what"] b{
font-size:0.8125rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="eventcalendar-004"] [data-part="what"] span{
font-size:0.6875rem;color:var(--vibeui-eventcalendar-004-muted);
}
[data-vibeui-block="eventcalendar-004"] [data-part="badge"]{
align-self:flex-start;margin-top:0.125rem;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-eventcalendar-004-deadline);
color:var(--vibeui-eventcalendar-004-deadline);
font-size:0.5625rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="eventcalendar-004"] [data-part="empty"]{
padding:0.75rem 0;font-size:0.75rem;color:var(--vibeui-eventcalendar-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-004"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_EVENTS: Eventcalendar004Event[] = [
  {
    at: "2026-03-17T09:30",
    minutes: 30,
    title: "Планёрка команды",
    place: "Зал 2",
  },
  {
    at: "2026-03-17T12:00",
    minutes: 60,
    title: "Обед с подрядчиком",
    place: "Кафе внизу",
    tone: "personal",
  },
  {
    at: "2026-03-17T16:00",
    minutes: 45,
    title: "Разбор метрик",
    place: "Meet",
  },
  {
    at: "2026-03-18T11:00",
    minutes: 90,
    title: "Дизайн-ревью каталога",
    place: "Зал 1",
  },
  {
    at: "2026-03-18T18:00",
    title: "Сдать смету",
    tone: "deadline",
  },
  {
    at: "2026-03-20T08:00",
    minutes: 60,
    title: "Бассейн",
    tone: "personal",
  },
  {
    at: "2026-03-20T14:00",
    minutes: 120,
    title: "Выезд к клиенту",
    place: "Пр. Мира, 12",
  },
  {
    at: "2026-03-23T10:00",
    minutes: 30,
    title: "Ретро спринта",
    place: "Зал 2",
  },
]

function duration(value: number) {
  const hours = Math.floor(value / 60)
  const rest = value % 60

  if (hours === 0) {
    return `${rest} мин`
  }

  return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`
}

/**
 * Лента ближайших событий, сгруппированная по дням: заголовок дня липкий,
 * «сегодня» и «завтра» названы словами. Один файл, ноль зависимостей.
 */
export function Eventcalendar004({
  today = "2026-03-17",
  events = DEFAULT_EVENTS,
  days = 7,
  heading = "Ближайшее",
  locale = "ru-RU",
  accent,
  className,
  style,
  ...props
}: Eventcalendar004Props) {
  const from = new Date(`${today}T00:00:00Z`).getTime()
  const to = from + days * DAY

  const upcoming = events
    .filter((event) => {
      const stamp = new Date(`${event.at}:00Z`).getTime()
      return stamp >= from && stamp < to
    })
    .sort((left, right) => left.at.localeCompare(right.at))

  const groups: { key: string; offset: number; items: typeof upcoming }[] = []

  for (const event of upcoming) {
    const key = event.at.slice(0, 10)
    const last = groups.at(-1)

    if (last?.key === key) {
      last.items.push(event)
      continue
    }

    groups.push({
      key,
      offset: Math.round((new Date(`${key}T00:00:00Z`).getTime() - from) / DAY),
      items: [event],
    })
  }

  const dayName = (key: string, offset: number) => {
    if (offset === 0) {
      return "Сегодня"
    }

    if (offset === 1) {
      return "Завтра"
    }

    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(`${key}T00:00:00Z`))
  }

  const dayDate = (key: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(new Date(`${key}T00:00:00Z`))

  const palette = {
    ...(accent ? { "--vibeui-eventcalendar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="eventcalendar-004"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">{days} дней вперёд</p>
        </header>

        <div
          data-part="feed"
          tabIndex={0}
          role="group"
          aria-label={`${heading}: список событий`}
        >
          {groups.length === 0 ? (
            <p data-part="empty">На ближайшие дни ничего не запланировано.</p>
          ) : null}

          {groups.map((group) => (
            <section key={group.key} aria-label={dayDate(group.key)}>
              <h4 data-part="dayhead" data-today={String(group.offset === 0)}>
                {dayName(group.key, group.offset)}
                <span>
                  {dayDate(group.key)} · {group.items.length}
                </span>
              </h4>

              <ol>
                {group.items.map((event) => (
                  <li
                    key={event.at + event.title}
                    data-part="row"
                    data-tone={event.tone ?? "work"}
                  >
                    <span data-part="when">
                      <time dateTime={event.at}>{event.at.slice(11, 16)}</time>
                      {event.minutes ? (
                        <small>{duration(event.minutes)}</small>
                      ) : (
                        <small>срок</small>
                      )}
                    </span>

                    <span data-part="what">
                      <b>{event.title}</b>
                      {event.place ? <span>{event.place}</span> : null}
                      {event.tone === "deadline" ? (
                        <span data-part="badge">дедлайн</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
