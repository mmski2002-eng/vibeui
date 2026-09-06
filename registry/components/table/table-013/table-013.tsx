import type { ComponentProps, CSSProperties } from "react"

export type Table013Event = {
  title: string
  place?: string
  tone?: "blue" | "green" | "amber" | "violet"
}

export type Table013Slot = {
  time: string
  cells: (Table013Event | null)[]
}

export type Table013Props = Omit<ComponentProps<"div">, "children"> & {
  days?: string[]
  slots?: Table013Slot[]
  /** День, чья колонка подсвечена как сегодняшняя. */
  today?: string
  caption?: string
  /** Скрытая подпись первой колонки: её слышит только озвучка. */
  timeLabel?: string
  /** Скрытая приписка к сегодняшнему дню. */
  todayLabel?: string
  /** Пусто — подложки нет, расписание лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сетка расписания, где ось времени — заголовки строк, а
// дни — заголовки колонок, поэтому занятие всегда озвучивается парой
// «понедельник, 10:00». Ширину не сжимаем: колонки держат min-width, а
// таблица уезжает в горизонтальную прокрутку с доступом с клавиатуры.
//
// Тема берётся из color-scheme окружения через light-dark(): расписание
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-013"]){
--vibeui-table-013-bg:transparent;
--vibeui-table-013-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-013-muted:color-mix(in oklab,var(--vibeui-table-013-fg) 68%,transparent);
--vibeui-table-013-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-013-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-013"]{color-scheme:dark}
[data-vibeui-block="table-013"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-013-font);color:var(--vibeui-table-013-fg);
}
[data-vibeui-block="table-013"] [data-part="shell"]{
background:var(--vibeui-table-013-bg);
border:1px solid var(--vibeui-table-013-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-013"] [data-part="head"]{
padding:0.875rem 1rem;font-size:0.9375rem;font-weight:650;
border-bottom:1px solid var(--vibeui-table-013-border);
}
/* position:relative — контейнер для скрытых от глаз, но не от скринридера,
   подписей внутри (position:absolute): без своего контейнера их статическая
   позиция считается от viewport и вылезает за пределы прокрутки на странице. */
[data-vibeui-block="table-013"] [data-part="scroll"]{position:relative;overflow-x:auto}
[data-vibeui-block="table-013"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-013-accent);outline-offset:-2px;
}
[data-vibeui-block="table-013"] table{border-collapse:collapse;width:100%;font-size:0.75rem}
[data-vibeui-block="table-013"] caption{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="table-013"] th,
[data-vibeui-block="table-013"] td{
border-bottom:1px solid var(--vibeui-table-013-border);
border-right:1px solid var(--vibeui-table-013-border);
padding:0.25rem;vertical-align:top;text-align:left;
}
[data-vibeui-block="table-013"] tr > :last-child{border-right:0}
[data-vibeui-block="table-013"] tbody tr:last-child th,
[data-vibeui-block="table-013"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="table-013"] thead th{
background:var(--vibeui-table-013-head);
padding:0.5rem 0.5rem;font-weight:650;text-align:center;white-space:nowrap;
min-width:7.5rem;
}
[data-vibeui-block="table-013"] tbody th{
background:var(--vibeui-table-013-head);
padding:0.5rem;font-weight:500;color:var(--vibeui-table-013-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;width:1%;
}
[data-vibeui-block="table-013"] th[data-today="true"]{
color:var(--vibeui-table-013-accent);
box-shadow:inset 0 -2px 0 var(--vibeui-table-013-accent);
}
[data-vibeui-block="table-013"] td[data-today="true"]{
background:color-mix(in oklab,var(--vibeui-table-013-accent) 5%,transparent);
}
[data-vibeui-block="table-013"] [data-part="event"]{
display:block;border-radius:0.5rem;padding:0.375rem 0.5rem;
background:color-mix(in oklab,var(--vibeui-table-013-tone) 14%,transparent);
border-left:3px solid var(--vibeui-table-013-tone);
--vibeui-table-013-tone:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
}
[data-vibeui-block="table-013"] [data-tone="green"]{--vibeui-table-013-tone:light-dark(oklch(0.55 0.14 155),oklch(0.74 0.13 155))}
[data-vibeui-block="table-013"] [data-tone="amber"]{--vibeui-table-013-tone:light-dark(oklch(0.65 0.14 70),oklch(0.8 0.13 70))}
[data-vibeui-block="table-013"] [data-tone="violet"]{--vibeui-table-013-tone:light-dark(oklch(0.55 0.17 300),oklch(0.75 0.15 300))}
[data-vibeui-block="table-013"] [data-part="title"]{display:block;font-weight:600;line-height:1.25}
[data-vibeui-block="table-013"] [data-part="place"]{
display:block;margin-top:0.125rem;color:var(--vibeui-table-013-muted);font-size:0.6875rem;
}
[data-vibeui-block="table-013"] [data-part="free"]{color:var(--vibeui-table-013-border)}
[data-vibeui-block="table-013"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт"]

const DEFAULT_SLOTS: Table013Slot[] = [
  {
    time: "09:00",
    cells: [
      { title: "Планёрка", place: "Зал 2" },
      null,
      { title: "Планёрка", place: "Зал 2" },
      null,
      { title: "Планёрка", place: "Зал 2" },
    ],
  },
  {
    time: "11:00",
    cells: [
      { title: "Дизайн-ревью", place: "Онлайн", tone: "violet" },
      { title: "Интервью", place: "Переговорка", tone: "amber" },
      null,
      { title: "Дизайн-ревью", place: "Онлайн", tone: "violet" },
      null,
    ],
  },
  {
    time: "14:00",
    cells: [
      null,
      { title: "Груминг задач", place: "Зал 1", tone: "green" },
      { title: "Демо", place: "Большой зал", tone: "green" },
      null,
      { title: "Ретро", place: "Зал 1", tone: "green" },
    ],
  },
  {
    time: "17:00",
    cells: [
      { title: "Час поддержки", place: "Дежурный" },
      null,
      null,
      { title: "Час поддержки", place: "Дежурный" },
      null,
    ],
  },
]

/**
 * Ветка темы для заданного фона: light-dark() смотрит на color-scheme, а не
 * на цвет подложки, поэтому светлую плашку приходится объявлять светлой.
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
 * Недельное расписание: время — заголовки строк, дни — заголовки колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table013({
  days = DEFAULT_DAYS,
  slots = DEFAULT_SLOTS,
  today = "Ср",
  caption = "Расписание встреч на неделю",
  timeLabel = "Время",
  todayLabel = "— сегодня",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table013Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="head">{caption}</p>
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span data-part="sr">{timeLabel}</span>
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      data-today={day === today ? "true" : undefined}
                    >
                      {day}
                      {day === today ? (
                        <span data-part="sr"> {todayLabel}</span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.time}>
                    <th scope="row">{slot.time}</th>
                    {days.map((day, index) => {
                      const event = slot.cells[index] ?? null

                      return (
                        <td
                          key={day}
                          data-today={day === today ? "true" : undefined}
                        >
                          {event ? (
                            <span
                              data-part="event"
                              data-tone={event.tone ?? "blue"}
                            >
                              <span data-part="title">{event.title}</span>
                              {event.place ? (
                                <span data-part="place">{event.place}</span>
                              ) : null}
                            </span>
                          ) : (
                            <span data-part="free" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
