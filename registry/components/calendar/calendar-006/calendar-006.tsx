import type { ComponentProps, CSSProperties } from "react"

export type Calendar006Event = {
  from: string
  to: string
  title: string
  place?: string
  tone?: "default" | "accent" | "muted"
}

export type Calendar006Props = Omit<ComponentProps<"div">, "children"> & {
  date?: string
  events?: Calendar006Event[]
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  freeLabel?: string
  hourUnit?: string
  minuteUnit?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: расписание дня списком, а не сеткой с часами. Сетка
// тратит высоту на пустые часы; список показывает только занятое время и
// подписывает промежутки словами «свободно 40 минут» — именно это и ищут,
// когда открывают день.
const STYLES = `
:where([data-vibeui-block="calendar-006"]){
--vibeui-calendar-006-bg:transparent;
--vibeui-calendar-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-calendar-006-muted:color-mix(in oklab,var(--vibeui-calendar-006-fg) 68%,transparent);
--vibeui-calendar-006-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-006"]{color-scheme:dark}
[data-vibeui-block="calendar-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-006-bg);
border:1px solid var(--vibeui-calendar-006-border);border-radius:0.875rem;
color:var(--vibeui-calendar-006-fg);font-family:var(--vibeui-calendar-006-font);
}
[data-vibeui-block="calendar-006"] [data-part="date"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="calendar-006"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
/* Строка события: время слева колонкой, чтобы взгляд шёл по одной линии. */
[data-vibeui-block="calendar-006"] [data-part="event"]{
display:grid;grid-template-columns:3.25rem 1fr;gap:0.125rem 0.625rem;
padding:0.5rem 0;border-top:1px solid var(--vibeui-calendar-006-border);
}
[data-vibeui-block="calendar-006"] li:first-child [data-part="event"]{border-top:0}
[data-vibeui-block="calendar-006"] [data-part="time"]{
grid-row:span 2;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
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

function gapText(
  from: string,
  to: string,
  words: { freeLabel: string; hourUnit: string; minuteUnit: string },
) {
  const total = minutes(to) - minutes(from)
  if (total <= 0) return null
  const hours = Math.floor(total / 60)
  const rest = total % 60
  if (hours && rest)
    return `${words.freeLabel} ${hours} ${words.hourUnit} ${rest} ${words.minuteUnit}`
  if (hours) return `${words.freeLabel} ${hours} ${words.hourUnit}`
  return `${words.freeLabel} ${rest} ${words.minuteUnit}`
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
 * Расписание дня списком: события и подписанные промежутки между ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar006({
  date = "Вторник, 17 марта",
  events = DEFAULT_EVENTS,
  freeLabel = "свободно",
  hourUnit = "ч",
  minuteUnit = "мин",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar006Props) {
  const palette = {
    ...(accent ? { "--vibeui-calendar-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-006"
        className={className}
        style={palette}
      >
        <p data-part="date">{date}</p>
        <ol>
          {events.map((event, index) => {
            const previous = events[index - 1]
            const gap = previous
              ? gapText(previous.to, event.from, {
                  freeLabel,
                  hourUnit,
                  minuteUnit,
                })
              : null

            return (
              <li key={`${event.from}-${event.title}`}>
                {gap ? <p data-part="gap">{gap}</p> : null}
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
