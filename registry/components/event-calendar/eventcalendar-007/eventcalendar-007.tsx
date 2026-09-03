import type { ComponentProps, CSSProperties } from "react"

export type Eventcalendar007Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  month?: string
  /** Подписи дней недели, начиная с понедельника. */
  weekdays?: string[]
  /** Сколько дней в месяце. */
  days?: number
  /** Пустых клеток перед первым числом: день недели, с которого месяц начался. */
  offset?: number
  /** Числа с событиями и их количество: {"3": 2, "17": 4}. */
  load?: Record<string, number>
  /** Сегодняшнее число. */
  today?: number
  /** Выбранное число. */
  selected?: number
  /** Строка под сеткой: {days} и {events} подставляются. */
  summaryTemplate?: string
  /** Подпись занятости для диктора: {count}. */
  loadLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: месяц размером с боковую панель. Событий в клетку не
// вписать, поэтому занятость показана точками — одна, две, три и «много»:
// вопрос к такому календарю не «что за встреча», а «в какие дни густо».
//
// Числа остаются кнопками нормального размера: календарь, ужатый до
// нечитаемых цифр, экономит место за счёт того, ради чего он и нужен.
const STYLES = `
:where([data-vibeui-block="eventcalendar-007"]){
--vibeui-eventcalendar-007-bg:transparent;
--vibeui-eventcalendar-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-eventcalendar-007-muted:color-mix(in oklab,var(--vibeui-eventcalendar-007-fg) 58%,transparent);
--vibeui-eventcalendar-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-eventcalendar-007-hover:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.011 265));
--vibeui-eventcalendar-007-accent:light-dark(oklch(0.52 0.19 262),oklch(0.74 0.15 262));
--vibeui-eventcalendar-007-on-accent:oklch(from var(--vibeui-eventcalendar-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-eventcalendar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="eventcalendar-007"]{color-scheme:dark}
[data-vibeui-block="eventcalendar-007"]{
width:100%;max-width:17rem;box-sizing:border-box;
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem;
border:1px solid var(--vibeui-eventcalendar-007-border);border-radius:0.875rem;
background:var(--vibeui-eventcalendar-007-bg);
color:var(--vibeui-eventcalendar-007-fg);
font-family:var(--vibeui-eventcalendar-007-font);
}
[data-vibeui-block="eventcalendar-007"] *{box-sizing:border-box}
[data-vibeui-block="eventcalendar-007"] [data-part="month"]{
margin:0;font-size:0.875rem;font-weight:680;letter-spacing:-0.01em;
}
[data-vibeui-block="eventcalendar-007"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:0.125rem;
}
[data-vibeui-block="eventcalendar-007"] [data-part="weekday"]{
padding-block:0.125rem;text-align:center;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-eventcalendar-007-muted);
}
/* Клетка держит и число, и точки: собственная высота задаётся содержимым,
   поэтому ряды не разъезжаются, когда в дне нет событий. */
[data-vibeui-block="eventcalendar-007"] [data-part="day"]{
appearance:none;border:1px solid transparent;cursor:pointer;
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
min-block-size:2.125rem;padding:0.25rem 0.125rem 0.1875rem;
border-radius:0.5rem;background:transparent;
color:inherit;font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="eventcalendar-007"] [data-part="day"]:hover{background:var(--vibeui-eventcalendar-007-hover)}
[data-vibeui-block="eventcalendar-007"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-eventcalendar-007-accent);outline-offset:1px;
}
[data-vibeui-block="eventcalendar-007"] [data-part="day"][data-today="true"]{
border-color:var(--vibeui-eventcalendar-007-accent);font-weight:700;
}
[data-vibeui-block="eventcalendar-007"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-eventcalendar-007-accent);
color:var(--vibeui-eventcalendar-007-on-accent);
border-color:var(--vibeui-eventcalendar-007-accent);
}
[data-vibeui-block="eventcalendar-007"] [data-part="dots"]{
display:flex;gap:2px;min-block-size:4px;
}
[data-vibeui-block="eventcalendar-007"] [data-part="dot"]{
inline-size:4px;block-size:4px;border-radius:999px;
background:var(--vibeui-eventcalendar-007-accent);
}
/* На выбранном дне точки перекрашиваются: на заливке акцента точки того же
   цвета исчезли бы. */
[data-vibeui-block="eventcalendar-007"] [data-part="day"][aria-pressed="true"] [data-part="dot"]{
background:var(--vibeui-eventcalendar-007-on-accent);
}
[data-vibeui-block="eventcalendar-007"] [data-part="blank"]{min-block-size:2.125rem}
[data-vibeui-block="eventcalendar-007"] [data-part="foot"]{
margin:0;font-size:0.75rem;color:var(--vibeui-eventcalendar-007-muted);
}
[data-vibeui-block="eventcalendar-007"] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="eventcalendar-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

const DEFAULT_LOAD: Record<string, number> = {
  "3": 1,
  "4": 2,
  "8": 3,
  "9": 1,
  "12": 4,
  "15": 2,
  "17": 3,
  "18": 1,
  "22": 2,
  "23": 5,
  "26": 1,
  "29": 2,
}

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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Месяц размером с боковую панель: занятость дня показана точками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Eventcalendar007({
  month = "Июль 2026",
  weekdays = DEFAULT_WEEKDAYS,
  days = 31,
  offset = 2,
  load = DEFAULT_LOAD,
  today = 17,
  selected = 23,
  summaryTemplate = "{events} событий в {days} днях",
  loadLabel = "событий: {count}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Eventcalendar007Props) {
  const busyDays = Object.keys(load).length
  const events = Object.values(load).reduce((sum, count) => sum + count, 0)

  const palette = {
    ...(accent ? { "--vibeui-eventcalendar-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-eventcalendar-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-eventcalendar-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="event-calendar"
        data-vibeui-block="eventcalendar-007"
        className={className}
        style={palette}
        aria-label={month}
      >
        <h3 data-part="month">{month}</h3>
        <div data-part="grid">
          {weekdays.map((weekday) => (
            <span key={weekday} data-part="weekday" aria-hidden="true">
              {weekday}
            </span>
          ))}
          {Array.from({ length: offset }, (_, index) => (
            <span key={`blank-${index}`} data-part="blank" aria-hidden="true" />
          ))}
          {Array.from({ length: days }, (_, index) => {
            const day = index + 1
            const count = load[String(day)] ?? 0
            // Точек не больше трёх: четвёртая уже не считается взглядом, а
            // точное число уходит в подпись для диктора.
            const dots = Math.min(count, 3)

            return (
              <button
                key={day}
                data-part="day"
                type="button"
                data-today={day === today ? "true" : undefined}
                aria-pressed={day === selected}
              >
                {day}
                <span data-part="dots" aria-hidden="true">
                  {Array.from({ length: dots }, (_, dot) => (
                    <span key={dot} data-part="dot" />
                  ))}
                </span>
                {count > 0 ? (
                  <span data-part="reader">
                    {fillTemplate(loadLabel, { count })}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
        <p data-part="foot">
          {fillTemplate(summaryTemplate, { events, days: busyDays })}
        </p>
      </section>
    </>
  )
}
