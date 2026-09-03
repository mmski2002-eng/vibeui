import type { CSSProperties } from "react"

export type Dashboard006Event = {
  title: string
  day: number
  start: number
  end: number
  tone?: "work" | "call" | "focus"
}

export type Dashboard006Props = {
  title?: string
  week?: string
  days?: string[]
  fromHour?: number
  toHour?: number
  events?: Dashboard006Event[]
  /** Подпись часа в колонке: {hour} — целый час. */
  hourText?: string
  /** Время события: {start} и {end} — целые часы. */
  rangeText?: string
  /** Пусто — подложки нет, сетка ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: недельное расписание на CSS-гриде. Событие занимает ячейки
// grid-row от начала до конца, поэтому длительность видна геометрией, а не
// подписью, и пересчёт в пиксели не нужен. Часы стоят в первой колонке
// липкими: при прокрутке видно, к какому времени относится строка. Тон
// события дублируется полосой слева — на печати и при дальтонизме цвет один
// не различается.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у сетки нет, липкой колонке часов оставлена своя поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-006"]){
--vibeui-dashboard-006-bg:transparent;
--vibeui-dashboard-006-surface:light-dark(oklch(1 0 0),oklch(0.23 0.012 265));
--vibeui-dashboard-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-dashboard-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-006-border:light-dark(oklch(0.92 0.006 265),oklch(0.38 0.012 265));
--vibeui-dashboard-006-line:light-dark(oklch(0.95 0.004 265),oklch(0.32 0.008 265));
--vibeui-dashboard-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-006-work:var(--vibeui-dashboard-006-accent);
--vibeui-dashboard-006-work-fill:light-dark(oklch(0.55 0.2 262 / 10%),oklch(0.74 0.16 262 / 18%));
--vibeui-dashboard-006-call:light-dark(oklch(0.62 0.16 40),oklch(0.78 0.14 40));
--vibeui-dashboard-006-call-fill:light-dark(oklch(0.62 0.16 40 / 12%),oklch(0.78 0.14 40 / 20%));
--vibeui-dashboard-006-focus:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.13 152));
--vibeui-dashboard-006-focus-fill:light-dark(oklch(0.58 0.14 152 / 12%),oklch(0.76 0.13 152 / 20%));
--vibeui-dashboard-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-006"]{color-scheme:dark}
[data-vibeui-block="dashboard-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-006-bg);
border:1px solid var(--vibeui-dashboard-006-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-006-sans);color:var(--vibeui-dashboard-006-fg);
}
[data-vibeui-block="dashboard-006"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-006"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;padding:0.875rem 1rem;
border-bottom:1px solid var(--vibeui-dashboard-006-border);
}
[data-vibeui-block="dashboard-006"] h2{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="dashboard-006"] [data-part="week"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-006-muted)}
[data-vibeui-block="dashboard-006"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="dashboard-006"] [data-part="grid"]{
display:grid;grid-template-columns:3rem repeat(var(--vibeui-dashboard-006-days,5),minmax(6.5rem,1fr));
min-width:32rem;
}
[data-vibeui-block="dashboard-006"] [data-part="day"]{
padding:0.5rem;text-align:center;
font-size:0.75rem;font-weight:650;
border-bottom:1px solid var(--vibeui-dashboard-006-border);
}
/* Часы липкие: при прокрутке видно, к какому времени относится строка. */
[data-vibeui-block="dashboard-006"] [data-part="hour"]{
position:sticky;left:0;z-index:1;
padding:0 0.5rem;text-align:right;
background:var(--vibeui-dashboard-006-surface);
border-top:1px solid var(--vibeui-dashboard-006-line);
font-size:0.6875rem;color:var(--vibeui-dashboard-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-006"] [data-part="cell"]{
min-height:2.25rem;
border-top:1px solid var(--vibeui-dashboard-006-line);
border-left:1px solid var(--vibeui-dashboard-006-line);
}
/* Событие занимает строки грида: длительность видна геометрией, а не текстом. */
[data-vibeui-block="dashboard-006"] [data-part="event"]{
margin:0.125rem;padding:0.3125rem 0.375rem;
border-radius:0.5rem;border-left:3px solid var(--vibeui-dashboard-006-work);
background:var(--vibeui-dashboard-006-work-fill);
font-size:0.6875rem;line-height:1.3;overflow:hidden;
}
[data-vibeui-block="dashboard-006"] [data-tone="call"]{
border-left-color:var(--vibeui-dashboard-006-call);background:var(--vibeui-dashboard-006-call-fill);
}
[data-vibeui-block="dashboard-006"] [data-tone="focus"]{
border-left-color:var(--vibeui-dashboard-006-focus);background:var(--vibeui-dashboard-006-focus-fill);
}
[data-vibeui-block="dashboard-006"] [data-part="event"] b{display:block;font-weight:650}
[data-vibeui-block="dashboard-006"] [data-part="event"] span{color:var(--vibeui-dashboard-006-muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт"]

const DEFAULT_EVENTS: Dashboard006Event[] = [
  { title: "Разбор задач", day: 0, start: 10, end: 11, tone: "call" },
  { title: "Обзор каталога", day: 1, start: 11, end: 13, tone: "work" },
  { title: "Работа над блоками", day: 2, start: 10, end: 13, tone: "focus" },
  { title: "Созвон с командой", day: 3, start: 12, end: 13, tone: "call" },
  { title: "Ревью и выпуск", day: 4, start: 11, end: 12, tone: "work" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  )
}

/**
 * Недельное расписание на гриде: длительность события видна геометрией.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard006({
  title = "Расписание",
  week = "9–13 марта",
  days = DEFAULT_DAYS,
  fromHour = 9,
  toHour = 14,
  events = DEFAULT_EVENTS,
  hourText = "{hour}:00",
  rangeText = "{start}:00 — {end}:00",
  background = "",
  accent,
  className,
  style,
}: Dashboard006Props) {
  const hours = Array.from(
    { length: toHour - fromHour },
    (_, i) => fromHour + i,
  )

  const palette = {
    "--vibeui-dashboard-006-days": days.length,
    ...(accent ? { "--vibeui-dashboard-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-006-bg": background,
          "--vibeui-dashboard-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-006"
        className={className}
        style={palette}
        aria-label={`${title}: ${week}`}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="week">{week}</p>
        </header>

        <div data-part="scroll">
          <div data-part="grid">
            <span data-part="day" />
            {days.map((day) => (
              <span key={day} data-part="day">
                {day}
              </span>
            ))}

            {hours.map((hour) => (
              <span
                key={hour}
                data-part="hour"
                style={
                  {
                    gridRow: hour - fromHour + 2,
                    gridColumn: 1,
                  } as CSSProperties
                }
              >
                {fill(hourText, { hour: String(hour) })}
              </span>
            ))}

            {hours.map((hour) =>
              days.map((day, index) => (
                <span
                  key={`${hour}-${day}`}
                  data-part="cell"
                  style={
                    {
                      gridRow: hour - fromHour + 2,
                      gridColumn: index + 2,
                    } as CSSProperties
                  }
                />
              )),
            )}

            {events.map((event) => (
              <article
                key={`${event.day}-${event.start}-${event.title}`}
                data-part="event"
                data-tone={event.tone ?? "work"}
                style={
                  {
                    gridColumn: event.day + 2,
                    gridRow: `${event.start - fromHour + 2} / ${event.end - fromHour + 2}`,
                  } as CSSProperties
                }
              >
                <b>{event.title}</b>
                <span>
                  {fill(rangeText, {
                    start: String(event.start),
                    end: String(event.end),
                  })}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
