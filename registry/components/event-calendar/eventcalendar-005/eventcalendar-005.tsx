import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Eventcalendar005Source = {
  label: string
  /** Цвет метки. Одного цвета мало: у каждого источника своя форма. */
  color: string
  shape: "dot" | "square" | "diamond" | "triangle"
}

export type Eventcalendar005Event = {
  /** «ГГГГ-ММ-ДД». */
  date: string
  title: string
  time?: string
  /** Индекс источника в массиве sources. */
  source: number
}

export type Eventcalendar005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  rangeStart?: string
  weeks?: number
  sources?: Eventcalendar005Source[]
  events?: Eventcalendar005Event[]
  heading?: string
  locale?: string
}

// Идея компонента: календарь из нескольких источников — это в первую очередь
// легенда. Источник различается и цветом, и формой метки: на монохромной
// печати и при дальтонизме четыре цветных кружка превращаются в один.
// Показ источников переключается чекбоксами и правилом :has() — фильтрация
// целиком на CSS, поэтому компонент остаётся серверным и без состояния.
const STYLES = `
:where([data-vibeui-block="eventcalendar-005"]){
--vibeui-eventcalendar-005-bg:oklch(1 0 0);
--vibeui-eventcalendar-005-fg:oklch(0.23 0.014 265);
--vibeui-eventcalendar-005-muted:oklch(0.6 0.014 265);
--vibeui-eventcalendar-005-border:oklch(0.91 0.006 265);
--vibeui-eventcalendar-005-line:oklch(0.95 0.004 265);
--vibeui-eventcalendar-005-accent:oklch(0.55 0.16 262);
--vibeui-eventcalendar-005-mark:oklch(0.55 0.16 262);
--vibeui-eventcalendar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="eventcalendar-005"]{
width:100%;max-width:38rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-eventcalendar-005-bg);
border:1px solid var(--vibeui-eventcalendar-005-border);border-radius:1rem;
color:var(--vibeui-eventcalendar-005-fg);
font-family:var(--vibeui-eventcalendar-005-font);
}
[data-vibeui-block="eventcalendar-005"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-005"] ol,
[data-vibeui-block="eventcalendar-005"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="eventcalendar-005"] [data-part="heading"]{
margin:0 0 0.625rem;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="eventcalendar-005"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
margin:0 0 0.75rem;padding:0;border:0;min-width:0;
}
[data-vibeui-block="eventcalendar-005"] [data-part="legend"] legend{
padding:0;margin:0 0 0.375rem;float:left;width:100%;clear:both;
font-size:0.6875rem;color:var(--vibeui-eventcalendar-005-muted);
}
[data-vibeui-block="eventcalendar-005"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:9999px;
border:1px solid var(--vibeui-eventcalendar-005-border);
font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="eventcalendar-005"] [data-part="chip"] input{
width:0.75rem;height:0.75rem;margin:0;
accent-color:var(--vibeui-eventcalendar-005-mark);
}
[data-vibeui-block="eventcalendar-005"] [data-part="chip"]:has(input:focus-visible){
outline:2px solid var(--vibeui-eventcalendar-005-accent);outline-offset:2px;
}
/* Снятая галочка гасит чип: иначе неясно, какой источник спрятан. */
[data-vibeui-block="eventcalendar-005"] [data-part="chip"]:has(input:not(:checked)){
opacity:.5;text-decoration:line-through;
}
[data-vibeui-block="eventcalendar-005"] [data-part="chip"] b{
font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-005-muted);
}
/* Метка источника: форма несёт ту же информацию, что и цвет. */
[data-vibeui-block="eventcalendar-005"] [data-part="mark"]{
display:inline-block;flex:none;width:0.5rem;height:0.5rem;
background:var(--vibeui-eventcalendar-005-mark);
}
[data-vibeui-block="eventcalendar-005"] [data-shape="dot"]{border-radius:9999px}
[data-vibeui-block="eventcalendar-005"] [data-shape="square"]{border-radius:0.0625rem}
[data-vibeui-block="eventcalendar-005"] [data-shape="diamond"]{transform:rotate(45deg)}
[data-vibeui-block="eventcalendar-005"] [data-shape="triangle"]{
clip-path:polygon(50% 0,100% 100%,0 100%);
}
[data-vibeui-block="eventcalendar-005"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,minmax(0,1fr));
border:1px solid var(--vibeui-eventcalendar-005-line);border-radius:0.625rem;
}
[data-vibeui-block="eventcalendar-005"] [data-part="weekday"]{
padding:0.3125rem;text-align:center;text-transform:capitalize;
font-size:0.625rem;font-weight:600;color:var(--vibeui-eventcalendar-005-muted);
border-bottom:1px solid var(--vibeui-eventcalendar-005-line);
}
[data-vibeui-block="eventcalendar-005"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
min-height:3.25rem;padding:0.3125rem 0.1875rem;
border-top:1px solid var(--vibeui-eventcalendar-005-line);
border-left:1px solid var(--vibeui-eventcalendar-005-line);
}
[data-vibeui-block="eventcalendar-005"] [data-part="cell"]:nth-child(7n+1){border-left:0}
[data-vibeui-block="eventcalendar-005"] [data-part="daynum"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="eventcalendar-005"] [data-part="marks"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.1875rem;
}
[data-vibeui-block="eventcalendar-005"] [data-part="list"]{
margin:0.75rem 0 0;max-height:11rem;overflow-y:auto;
}
[data-vibeui-block="eventcalendar-005"] [data-part="list"]:focus-visible{
outline:2px solid var(--vibeui-eventcalendar-005-accent);outline-offset:2px;
border-radius:0.5rem;
}
[data-vibeui-block="eventcalendar-005"] [data-part="item"]{
display:grid;grid-template-columns:0.75rem 5rem minmax(0,1fr);
align-items:center;gap:0.5rem;padding:0.375rem 0;
border-bottom:1px solid var(--vibeui-eventcalendar-005-line);
font-size:0.75rem;
}
[data-vibeui-block="eventcalendar-005"] [data-part="item"] time{
font-size:0.6875rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-eventcalendar-005-muted);
}
[data-vibeui-block="eventcalendar-005"] [data-part="item"] small{
display:block;font-size:0.625rem;color:var(--vibeui-eventcalendar-005-muted);
}
/* Фильтрация без единой строки JS: снятая галочка прячет всё, что помечено
   тем же источником — и метки в сетке, и строки списка. */
[data-vibeui-block="eventcalendar-005"]:has([data-index="0"]:not(:checked)) [data-source="0"]{display:none}
[data-vibeui-block="eventcalendar-005"]:has([data-index="1"]:not(:checked)) [data-source="1"]{display:none}
[data-vibeui-block="eventcalendar-005"]:has([data-index="2"]:not(:checked)) [data-source="2"]{display:none}
[data-vibeui-block="eventcalendar-005"]:has([data-index="3"]:not(:checked)) [data-source="3"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-005"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_SOURCES: Eventcalendar005Source[] = [
  { label: "Работа", color: "oklch(0.55 0.16 262)", shape: "square" },
  { label: "Личное", color: "oklch(0.6 0.13 165)", shape: "dot" },
  { label: "Семья", color: "oklch(0.65 0.15 45)", shape: "diamond" },
  { label: "Праздники", color: "oklch(0.58 0.17 15)", shape: "triangle" },
]

const DEFAULT_EVENTS: Eventcalendar005Event[] = [
  { date: "2026-03-16", time: "09:30", title: "Планёрка", source: 0 },
  { date: "2026-03-17", time: "07:00", title: "Пробежка", source: 1 },
  { date: "2026-03-17", time: "14:00", title: "Дизайн-ревью", source: 0 },
  { date: "2026-03-18", time: "18:30", title: "Родительское", source: 2 },
  { date: "2026-03-19", time: "11:00", title: "Спринт-обзор", source: 0 },
  { date: "2026-03-20", title: "День рождения мамы", source: 2 },
  { date: "2026-03-21", time: "10:00", title: "Велопрогулка", source: 1 },
  { date: "2026-03-23", title: "Выходной", source: 3 },
  { date: "2026-03-24", time: "12:00", title: "Демо клиенту", source: 0 },
  { date: "2026-03-25", time: "19:00", title: "Театр", source: 2 },
  { date: "2026-03-26", time: "08:00", title: "Стоматолог", source: 1 },
  { date: "2026-03-27", time: "16:00", title: "Ретро", source: 0 },
]

/**
 * Календарь нескольких источников: источник различается цветом и формой
 * метки, показ переключается чекбоксами через :has(). Ноль зависимостей.
 */
export function Eventcalendar005({
  rangeStart = "2026-03-16",
  weeks = 3,
  sources = DEFAULT_SOURCES,
  events = DEFAULT_EVENTS,
  heading = "Все календари",
  locale = "ru-RU",
  className,
  style,
  ...props
}: Eventcalendar005Props) {
  const start = new Date(`${rangeStart}T00:00:00Z`).getTime()

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(start + index * DAY)),
  )

  const cells = Array.from({ length: weeks * 7 }, (_, index) => {
    const date = new Date(start + index * DAY)
    const key = date.toISOString().slice(0, 10)

    return {
      key,
      day: date.getUTCDate(),
      marks: events.filter((event) => event.date === key),
    }
  })

  const sorted = [...events].sort((left, right) =>
    `${left.date}${left.time ?? ""}`.localeCompare(
      `${right.date}${right.time ?? ""}`,
    ),
  )

  return (
    <>
      <style href="vibeui-eventcalendar-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="eventcalendar-005"
        aria-label={heading}
        className={className}
        style={style}
      >
        <h3 data-part="heading">{heading}</h3>

        <fieldset data-part="legend">
          <legend>Источники: цвет плюс форма метки</legend>
          {sources.map((source, index) => (
            <label
              key={source.label}
              data-part="chip"
              style={
                {
                  "--vibeui-eventcalendar-005-mark": source.color,
                } as CSSProperties
              }
            >
              <input type="checkbox" defaultChecked data-index={index} />
              <i
                data-part="mark"
                data-shape={source.shape}
                aria-hidden="true"
              />
              {source.label}
              <b>{events.filter((event) => event.source === index).length}</b>
            </label>
          ))}
        </fieldset>

        <div data-part="grid">
          {weekdays.map((weekday) => (
            <span key={weekday} data-part="weekday">
              {weekday}
            </span>
          ))}

          {cells.map((cell) => (
            <div key={cell.key} data-part="cell">
              <span data-part="daynum">{cell.day}</span>
              <span data-part="marks">
                {cell.marks.map((event) => (
                  <i
                    key={event.title}
                    data-part="mark"
                    data-shape={sources[event.source]?.shape ?? "dot"}
                    data-source={event.source}
                    title={`${sources[event.source]?.label}: ${event.title}`}
                    style={
                      {
                        "--vibeui-eventcalendar-005-mark":
                          sources[event.source]?.color,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
            </div>
          ))}
        </div>

        <ol
          data-part="list"
          tabIndex={0}
          role="group"
          aria-label={`${heading}: события списком`}
        >
          {sorted.map((event) => (
            <li
              key={event.date + event.title}
              data-part="item"
              data-source={event.source}
            >
              <i
                data-part="mark"
                data-shape={sources[event.source]?.shape ?? "dot"}
                aria-hidden="true"
                style={
                  {
                    "--vibeui-eventcalendar-005-mark":
                      sources[event.source]?.color,
                  } as CSSProperties
                }
              />
              <time dateTime={event.date}>
                {event.date.slice(8)}.{event.date.slice(5, 7)}
                {event.time ? ` ${event.time}` : ""}
              </time>
              <span>
                {event.title}
                <small>{sources[event.source]?.label}</small>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
