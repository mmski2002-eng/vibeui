import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline008Entry = {
  time: string
  title: string
  text?: string
}

export type Timeline008Day = {
  date: string
  entries: Timeline008Entry[]
}

export type Timeline008Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  days?: Timeline008Day[]
  title?: string
  accent?: string
}

// Идея компонента: длинная лента, разрезанная по дням, где дата не уезжает
// вместе с прокруткой. Заголовок дня липкий (position:sticky в своей группе),
// поэтому в любой момент видно, какой день читаешь. Липкая дата обязана быть
// непрозрачной: без собственного фона строки ленты просвечивают сквозь неё.
const STYLES = `
:where([data-vibeui-block="timeline-008"]){
--vibeui-timeline-008-bg:oklch(1 0 0);
--vibeui-timeline-008-fg:oklch(0.22 0.014 265);
--vibeui-timeline-008-muted:oklch(0.57 0.014 265);
--vibeui-timeline-008-border:oklch(0.91 0.006 265);
--vibeui-timeline-008-accent:oklch(0.55 0.18 262);
--vibeui-timeline-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-008-bg);
border:1px solid var(--vibeui-timeline-008-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-008-font);color:var(--vibeui-timeline-008-fg);
}
[data-vibeui-block="timeline-008"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-008"] [data-part="scroll"]{
max-height:15rem;overflow-y:auto;overscroll-behavior:contain;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="timeline-008"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-timeline-008-accent);outline-offset:2px;border-radius:0.5rem;
}
/* Дата липнет к верху своей группы, а не всей ленты: следующий день выталкивает
   предыдущий, и подпись всегда относится к тому, что под ней. */
[data-vibeui-block="timeline-008"] [data-part="date"]{
position:sticky;top:0;z-index:1;
display:flex;align-items:center;gap:0.5rem;
margin:0;padding:0.3125rem 0;
background:var(--vibeui-timeline-008-bg);
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-timeline-008-muted);
}
[data-vibeui-block="timeline-008"] [data-part="date"]::after{
content:"";flex:1;height:1px;background:var(--vibeui-timeline-008-border);
}
[data-vibeui-block="timeline-008"] [data-part="day"] ul{margin:0 0 0.25rem;padding:0;list-style:none}
[data-vibeui-block="timeline-008"] [data-part="row"]{
position:relative;display:grid;grid-template-columns:2.75rem 1fr;
gap:0.5rem;padding:0.375rem 0 0.375rem 0;
}
[data-vibeui-block="timeline-008"] [data-part="row"]::before{
content:"";position:absolute;left:3.0625rem;top:0;bottom:0;
width:1px;background:var(--vibeui-timeline-008-border);
}
[data-vibeui-block="timeline-008"] [data-part="row"] [data-part="body"]{padding-left:0.75rem;min-width:0}
[data-vibeui-block="timeline-008"] [data-part="dot"]{
position:absolute;left:2.875rem;top:0.6875rem;
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-timeline-008-accent);
}
[data-vibeui-block="timeline-008"] [data-part="time"]{
font-size:0.6875rem;color:var(--vibeui-timeline-008-muted);
font-variant-numeric:tabular-nums;padding-top:0.125rem;
}
[data-vibeui-block="timeline-008"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:600;line-height:1.35}
[data-vibeui-block="timeline-008"] [data-part="text"]{margin:0.0625rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-timeline-008-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Timeline008Day[] = [
  {
    date: "Сегодня",
    entries: [
      {
        time: "14:20",
        title: "Счёт оплачен",
        text: "Платёж прошёл, чек отправлен на почту",
      },
      { time: "11:05", title: "Заявка принята в работу" },
    ],
  },
  {
    date: "Вчера",
    entries: [
      { time: "19:42", title: "Добавлен комментарий инженера" },
      {
        time: "16:10",
        title: "Назначен исполнитель",
        text: "Бригада №3, выезд утром",
      },
      { time: "09:30", title: "Создана заявка" },
    ],
  },
  {
    date: "12 марта",
    entries: [
      { time: "18:00", title: "Звонок клиенту" },
      { time: "10:15", title: "Первичный осмотр" },
    ],
  },
]

/**
 * Лента, разрезанная по дням: заголовок дня липнет к верху своей группы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline008({
  days = DEFAULT_DAYS,
  title = "Лента заявки",
  accent,
  className,
  style,
  ...props
}: Timeline008Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-008"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={`${title}: события по дням`}
        >
          {days.map((day) => (
            <li data-part="day" key={day.date}>
              <h4 data-part="date">{day.date}</h4>
              <ul>
                {day.entries.map((entry) => (
                  <li
                    data-part="row"
                    key={`${day.date}-${entry.time}-${entry.title}`}
                  >
                    <span data-part="time">{entry.time}</span>
                    <span data-part="dot" aria-hidden="true" />
                    <div data-part="body">
                      <span data-part="name">{entry.title}</span>
                      {entry.text ? <p data-part="text">{entry.text}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
