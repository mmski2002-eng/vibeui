import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table013Event = {
  title: string
  place?: string
  tone?: "blue" | "green" | "amber" | "violet"
}

export type Table013Slot = {
  time: string
  cells: (Table013Event | null)[]
}

export type Table013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  days?: string[]
  slots?: Table013Slot[]
  /** День, чья колонка подсвечена как сегодняшняя. */
  today?: string
  caption?: string
  accent?: string
}

// Идея компонента: сетка расписания, где ось времени — заголовки строк, а
// дни — заголовки колонок, поэтому занятие всегда озвучивается парой
// «понедельник, 10:00». Ширину не сжимаем: колонки держат min-width, а
// таблица уезжает в горизонтальную прокрутку с доступом с клавиатуры.
const STYLES = `
:where([data-vibeui-block="table-013"]){
--vibeui-table-013-bg:oklch(1 0 0);
--vibeui-table-013-fg:oklch(0.24 0.014 265);
--vibeui-table-013-muted:oklch(0.56 0.014 265);
--vibeui-table-013-border:oklch(0.92 0.006 265);
--vibeui-table-013-head:oklch(0.975 0.003 265);
--vibeui-table-013-accent:oklch(0.55 0.2 262);
--vibeui-table-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="table-013"] [data-part="scroll"]{overflow-x:auto}
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
background:color-mix(in oklab,var(--vibeui-table-013-tone) 12%,oklch(1 0 0));
border-left:3px solid var(--vibeui-table-013-tone);
--vibeui-table-013-tone:oklch(0.55 0.2 262);
}
[data-vibeui-block="table-013"] [data-tone="green"]{--vibeui-table-013-tone:oklch(0.55 0.14 155)}
[data-vibeui-block="table-013"] [data-tone="amber"]{--vibeui-table-013-tone:oklch(0.65 0.14 70)}
[data-vibeui-block="table-013"] [data-tone="violet"]{--vibeui-table-013-tone:oklch(0.55 0.17 300)}
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
 * Недельное расписание: время — заголовки строк, дни — заголовки колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table013({
  days = DEFAULT_DAYS,
  slots = DEFAULT_SLOTS,
  today = "Ср",
  caption = "Расписание встреч на неделю",
  accent,
  className,
  style,
  ...props
}: Table013Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
                    <span data-part="sr">Время</span>
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      data-today={day === today ? "true" : undefined}
                    >
                      {day}
                      {day === today ? (
                        <span data-part="sr"> — сегодня</span>
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
