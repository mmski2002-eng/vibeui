import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar006Event = {
  from: string
  to: string
  title: string
  place?: string
  tone?: "default" | "accent" | "muted"
}

export type Calendar006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  date?: string
  events?: Calendar006Event[]
  freeLabel?: string
}

// Идея компонента: расписание дня списком, а не сеткой с часами. Сетка
// тратит высоту на пустые часы; список показывает только занятое время и
// подписывает промежутки словами «свободно 40 минут» — именно это и ищут,
// когда открывают день.
const STYLES = `
:where([data-vibeui-block="calendar-006"]){
--vibeui-calendar-006-bg:oklch(1 0 0);
--vibeui-calendar-006-fg:oklch(0.24 0.014 265);
--vibeui-calendar-006-muted:oklch(0.58 0.014 265);
--vibeui-calendar-006-border:oklch(0.91 0.006 265);
--vibeui-calendar-006-accent:oklch(0.55 0.17 265);
--vibeui-calendar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-006-bg);
border:1px solid var(--vibeui-calendar-006-border);border-radius:0.875rem;
color:var(--vibeui-calendar-006-fg);font-family:var(--vibeui-calendar-006-font);
}
[data-vibeui-block="calendar-006"] [data-part="date"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="calendar-006"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
/* Строка события: время слева колонкой, чтобы взгляд шёл по одной линии. */
[data-vibeui-block="calendar-006"] [data-part="event"]{
display:grid;grid-template-columns:3.25rem 1fr;gap:0.125rem 0.625rem;
padding:0.5rem 0;border-top:1px solid var(--vibeui-calendar-006-border);
}
[data-vibeui-block="calendar-006"] li:first-child [data-part="event"]{border-top:0}
[data-vibeui-block="calendar-006"] [data-part="time"]{
grid-row:span 2;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-006-muted);
}
[data-vibeui-block="calendar-006"] [data-part="title"]{font-size:0.875rem;line-height:1.3}
[data-vibeui-block="calendar-006"] [data-part="place"]{font-size:0.75rem;color:var(--vibeui-calendar-006-muted)}
/* Полоса слева задаёт тон события, не заливая всю строку цветом. */
[data-vibeui-block="calendar-006"] [data-part="event"][data-tone="accent"] [data-part="title"]{
padding-left:0.5rem;box-shadow:inset 2px 0 0 var(--vibeui-calendar-006-accent);
}
[data-vibeui-block="calendar-006"] [data-part="event"][data-tone="muted"]{opacity:.65}
/* Промежуток подписан словами: пустое место в списке ничего не сообщает. */
[data-vibeui-block="calendar-006"] [data-part="gap"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.25rem 0 0.25rem 3.875rem;
font-size:0.75rem;color:var(--vibeui-calendar-006-muted);
}
[data-vibeui-block="calendar-006"] [data-part="gap"]::before{
content:"";flex:none;width:0.75rem;height:1px;background:var(--vibeui-calendar-006-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Calendar006Event[] = [
  { from: "09:30", to: "10:00", title: "Планёрка команды", place: "Zoom" },
  {
    from: "11:00",
    to: "12:00",
    title: "Разбор каталога с дизайнером",
    place: "Переговорная «Полёт»",
    tone: "accent",
  },
  {
    from: "14:00",
    to: "14:30",
    title: "Созвон с подрядчиком",
    place: "Телефон",
  },
  { from: "17:00", to: "18:00", title: "Ревью релиза", tone: "muted" },
]

function minutes(time: string) {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

function gapText(from: string, to: string) {
  const total = minutes(to) - minutes(from)
  if (total <= 0) return null
  const hours = Math.floor(total / 60)
  const rest = total % 60
  if (hours && rest) return `свободно ${hours} ч ${rest} мин`
  if (hours) return `свободно ${hours} ч`
  return `свободно ${rest} мин`
}

/**
 * Расписание дня списком: события и подписанные промежутки между ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar006({
  date = "Вторник, 17 марта",
  events = DEFAULT_EVENTS,
  freeLabel = "Свободно",
  className,
  style,
  ...props
}: Calendar006Props) {
  return (
    <>
      <style href="vibeui-calendar-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-006"
        className={className}
        style={style as CSSProperties}
      >
        <p data-part="date">{date}</p>
        <ol>
          {events.map((event, index) => {
            const previous = events[index - 1]
            const gap = previous ? gapText(previous.to, event.from) : null

            return (
              <li key={`${event.from}-${event.title}`}>
                {gap ? (
                  <p data-part="gap">
                    {freeLabel === "Свободно" ? gap : `${freeLabel}: ${gap}`}
                  </p>
                ) : null}
                <div data-part="event" data-tone={event.tone ?? "default"}>
                  <span data-part="time">
                    {event.from}
                    <br />
                    {event.to}
                  </span>
                  <span data-part="title">{event.title}</span>
                  {event.place ? (
                    <span data-part="place">{event.place}</span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}
