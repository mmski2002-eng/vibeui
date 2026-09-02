import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Eventcalendar003Event = {
  from: string
  to: string
  title: string
  place?: string
  tone?: "work" | "focus" | "hold"
}

export type Eventcalendar003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  date?: string
  events?: Eventcalendar003Event[]
  dayFrom?: number
  dayTo?: number
  /** Подсказка в шапке. {count} — событий, {overlaps} — групп пересечений. */
  hintText?: string
  /** Подписи легенды: компонент несёт русские, проект подставляет свои. */
  legendText?: Record<string, string>
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: день — единственный вид, где пересечения нельзя спрятать.
// События сначала разбиваются на связные группы по времени, внутри группы
// раскладываются по дорожкам жадным алгоритмом, и ширина считается от числа
// дорожек ИМЕННО этой группы: одно наложение в 11 утра не должно сужать
// спокойный вечер. Всё считается при рендере, состояния нет — компонент
// остаётся серверным.
const STYLES = `
:where([data-vibeui-block="eventcalendar-003"]){
--vibeui-eventcalendar-003-bg:transparent;
--vibeui-eventcalendar-003-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-eventcalendar-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-eventcalendar-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-eventcalendar-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-eventcalendar-003-line:light-dark(oklch(0.95 0.004 265),oklch(0.31 0.01 265));
--vibeui-eventcalendar-003-accent:light-dark(oklch(0.55 0.16 275),oklch(0.74 0.15 275));
--vibeui-eventcalendar-003-focus:light-dark(oklch(0.6 0.13 165),oklch(0.76 0.12 165));
--vibeui-eventcalendar-003-hold:light-dark(oklch(0.65 0.13 70),oklch(0.79 0.13 70));
--vibeui-eventcalendar-003-hour:3.25rem;
--vibeui-eventcalendar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="eventcalendar-003"]{
width:100%;max-width:34rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-eventcalendar-003-bg);
border:1px solid var(--vibeui-eventcalendar-003-border);border-radius:1rem;
color:var(--vibeui-eventcalendar-003-fg);
font-family:var(--vibeui-eventcalendar-003-font);
}
[data-vibeui-block="eventcalendar-003"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-003"] ol,
[data-vibeui-block="eventcalendar-003"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="eventcalendar-003"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.875rem;
}
[data-vibeui-block="eventcalendar-003"] [data-part="heading"]{
margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «март 2026 г.». */
[data-vibeui-block="eventcalendar-003"] [data-part="heading"]::first-letter{text-transform:uppercase}
[data-vibeui-block="eventcalendar-003"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-eventcalendar-003-muted);
}
[data-vibeui-block="eventcalendar-003"] [data-part="board"]{
display:grid;grid-template-columns:2.875rem minmax(0,1fr);
}
[data-vibeui-block="eventcalendar-003"] [data-part="axis"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="eventcalendar-003"] [data-part="hour"]{
height:var(--vibeui-eventcalendar-003-hour);
padding-right:0.4375rem;text-align:right;
font-size:0.625rem;font-variant-numeric:tabular-nums;line-height:1;
color:var(--vibeui-eventcalendar-003-muted);
transform:translateY(-0.3em);
}
/* Полотно дня: одна система координат в процентах от рабочего интервала. */
[data-vibeui-block="eventcalendar-003"] [data-part="canvas"]{
position:relative;
height:calc(var(--vibeui-eventcalendar-003-span,10) * var(--vibeui-eventcalendar-003-hour));
border-left:1px solid var(--vibeui-eventcalendar-003-border);
background:repeating-linear-gradient(
to bottom,
var(--vibeui-eventcalendar-003-line) 0 1px,
transparent 1px var(--vibeui-eventcalendar-003-hour));
}
[data-vibeui-block="eventcalendar-003"] [data-part="event"]{
position:absolute;
display:flex;flex-direction:column;gap:0.0625rem;overflow:hidden;
padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-eventcalendar-003-accent);
border-left-width:0.1875rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-accent) 12%,var(--vibeui-eventcalendar-003-panel));
font-size:0.6875rem;line-height:1.25;
}
[data-vibeui-block="eventcalendar-003"] [data-part="event"] b{font-weight:650}
[data-vibeui-block="eventcalendar-003"] [data-part="event"] time,
[data-vibeui-block="eventcalendar-003"] [data-part="event"] small{
font-size:0.5625rem;color:var(--vibeui-eventcalendar-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="eventcalendar-003"] [data-tone="focus"]{
border-color:var(--vibeui-eventcalendar-003-focus);
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-focus) 12%,var(--vibeui-eventcalendar-003-panel));
}
[data-vibeui-block="eventcalendar-003"] [data-tone="hold"]{
border-color:var(--vibeui-eventcalendar-003-hold);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-hold) 12%,var(--vibeui-eventcalendar-003-panel));
}
/* Соседняя дорожка сдвинута и слегка приподнята тенью: без разделения
   два прижатых прямоугольника читаются как один. */
[data-vibeui-block="eventcalendar-003"] [data-part="event"][data-lane="1"],
[data-vibeui-block="eventcalendar-003"] [data-part="event"][data-lane="2"]{
box-shadow:-2px 0 0 var(--vibeui-eventcalendar-003-panel);
}
[data-vibeui-block="eventcalendar-003"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.875rem;margin:0.75rem 0 0;padding:0;
list-style:none;font-size:0.6875rem;color:var(--vibeui-eventcalendar-003-muted);
}
[data-vibeui-block="eventcalendar-003"] [data-part="legend"] li{
display:inline-flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="eventcalendar-003"] [data-part="legend"] i{
width:0.75rem;height:0.75rem;border-radius:0.25rem;
border:1px solid var(--vibeui-eventcalendar-003-accent);
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-accent) 20%,transparent);
}
[data-vibeui-block="eventcalendar-003"] [data-part="legend"] i[data-tone="focus"]{
border-color:var(--vibeui-eventcalendar-003-focus);
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-focus) 20%,transparent);
}
[data-vibeui-block="eventcalendar-003"] [data-part="legend"] i[data-tone="hold"]{
border-color:var(--vibeui-eventcalendar-003-hold);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-eventcalendar-003-hold) 20%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Eventcalendar003Event[] = [
  { from: "09:00", to: "09:30", title: "Планёрка", place: "Зал 2" },
  { from: "10:00", to: "12:00", title: "Фокус-блок", tone: "focus" },
  { from: "10:30", to: "11:15", title: "Звонок клиенту", place: "Meet" },
  { from: "11:00", to: "11:45", title: "Интервью", place: "Зал 1" },
  { from: "13:00", to: "14:00", title: "Обед" },
  { from: "14:30", to: "16:00", title: "Правки макетов", tone: "focus" },
  { from: "15:30", to: "16:30", title: "Разбор инцидента", tone: "hold" },
  { from: "17:00", to: "18:00", title: "Ретро", place: "Зал 2" },
]

function minutes(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

/**
 * Раскладка событий дня по дорожкам. Группа — связная цепочка пересечений;
 * внутри группы каждое событие занимает первую дорожку, где оно помещается.
 */
function layout(events: Eventcalendar003Event[]) {
  const sorted = [...events].sort(
    (left, right) => minutes(left.from) - minutes(right.from),
  )

  const placed: {
    event: Eventcalendar003Event
    from: number
    to: number
    lane: number
    group: number
  }[] = []

  const groupWidth: number[] = []
  let lanes: number[] = []
  let group = -1

  for (const event of sorted) {
    const from = minutes(event.from)
    const to = minutes(event.to)

    if (lanes.every((end) => end <= from)) {
      lanes = []
      group += 1
      groupWidth[group] = 0
    }

    let lane = lanes.findIndex((end) => end <= from)

    if (lane === -1) {
      lane = lanes.length
    }

    lanes[lane] = to
    groupWidth[group] = Math.max(groupWidth[group], lanes.length)
    placed.push({ event, from, to, lane, group })
  }

  return { placed, groupWidth }
}

const LEGEND_LABEL: Record<string, string> = {
  work: "встреча",
  focus: "работа без встреч",
  hold: "под вопросом",
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
 * День с временной шкалой: пересекающиеся события расходятся по дорожкам
 * внутри своей группы. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Eventcalendar003({
  date = "2026-03-17",
  events = DEFAULT_EVENTS,
  dayFrom = 8,
  dayTo = 19,
  hintText = "{count} событий, пересечений: {overlaps}",
  legendText = LEGEND_LABEL,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Eventcalendar003Props) {
  const span = (dayTo - dayFrom) * 60
  const hours = Array.from({ length: dayTo - dayFrom }, (_, i) => dayFrom + i)
  const { placed, groupWidth } = layout(events)
  const overlaps = groupWidth.filter((width) => width > 1).length

  const label = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))

  const palette = {
    "--vibeui-eventcalendar-003-span": hours.length,
    ...(accent ? { "--vibeui-eventcalendar-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-eventcalendar-003-bg": background,
          "--vibeui-eventcalendar-003-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="eventcalendar-003"
        aria-label={label}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{label}</h3>
          <p data-part="hint">
            {hintText
              .replace("{count}", String(events.length))
              .replace("{overlaps}", String(overlaps))}
          </p>
        </header>

        <div data-part="board">
          <div data-part="axis" aria-hidden="true">
            {hours.map((hour) => (
              <span key={hour} data-part="hour">
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>

          <ol data-part="canvas">
            {placed.map((item) => {
              const width = groupWidth[item.group]
              const slice = 100 / width

              return (
                <li
                  key={item.event.title}
                  data-part="event"
                  data-tone={item.event.tone ?? "work"}
                  data-lane={item.lane}
                  style={{
                    top: `${((item.from - dayFrom * 60) / span) * 100}%`,
                    height: `${((item.to - item.from) / span) * 100}%`,
                    left: `calc(${item.lane * slice}% + 0.25rem)`,
                    width: `calc(${slice}% - 0.5rem)`,
                  }}
                >
                  <b>{item.event.title}</b>
                  <time>
                    {item.event.from}–{item.event.to}
                  </time>
                  {item.event.place ? <small>{item.event.place}</small> : null}
                </li>
              )
            })}
          </ol>
        </div>

        <ul data-part="legend">
          <li>
            <i /> {legendText.work ?? LEGEND_LABEL.work}
          </li>
          <li>
            <i data-tone="focus" /> {legendText.focus ?? LEGEND_LABEL.focus}
          </li>
          <li>
            <i data-tone="hold" /> {legendText.hold ?? LEGEND_LABEL.hold}
          </li>
        </ul>
      </section>
    </>
  )
}
