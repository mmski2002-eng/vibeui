import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline012Entry = {
  time: string
  dateTime: string
  author: string
  action: string
}

export type Timeline012Day = {
  label: string
  dateTime: string
  entries: Timeline012Entry[]
}

export type Timeline012Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  days?: Timeline012Day[]
  title?: string
  accent?: string
}

// Идея компонента: активность, сгруппированная по дням, но без прокрутки и
// без sticky-заголовков — вся лента растёт вместе со страницей. Заголовок
// дня несёт счётчик записей: «Сегодня · 3», поэтому объём дня виден без
// подсчёта строк. Аватар — просто первая буква имени на нейтральном фоне,
// а не оттенок из хеша: акцент здесь на дне и счётчике, а не на личности.
const STYLES = `
:where([data-vibeui-block="timeline-012"]){
--vibeui-timeline-012-bg:oklch(1 0 0);
--vibeui-timeline-012-fg:oklch(0.22 0.014 265);
--vibeui-timeline-012-muted:oklch(0.57 0.014 265);
--vibeui-timeline-012-border:oklch(0.91 0.006 265);
--vibeui-timeline-012-accent:oklch(0.55 0.18 262);
--vibeui-timeline-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-012"]{
display:flex;flex-direction:column;gap:1rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-012-bg);
border:1px solid var(--vibeui-timeline-012-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-012-font);color:var(--vibeui-timeline-012-fg);
}
[data-vibeui-block="timeline-012"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-012"] [data-part="groups"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:1rem}
[data-vibeui-block="timeline-012"] [data-part="day"]{margin:0;padding:0;list-style:none}
/* Заголовок дня — обычный поток, не sticky: лента растёт вместе со страницей. */
[data-vibeui-block="timeline-012"] [data-part="heading"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0 0 0.5rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-timeline-012-muted);
}
[data-vibeui-block="timeline-012"] [data-part="count"]{
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-timeline-012-accent);
}
[data-vibeui-block="timeline-012"] [data-part="entries"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-012"] [data-part="row"]{
position:relative;display:grid;grid-template-columns:1.75rem 1fr auto;
align-items:start;gap:0.625rem;padding-bottom:0.75rem;
}
[data-vibeui-block="timeline-012"] [data-part="row"]::before{
content:"";position:absolute;left:0.8125rem;top:1.875rem;bottom:0;
width:1px;background:var(--vibeui-timeline-012-border);
}
[data-vibeui-block="timeline-012"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="timeline-012"] [data-part="row"]:last-child::before{display:none}
[data-vibeui-block="timeline-012"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-timeline-012-border);color:var(--vibeui-timeline-012-fg);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="timeline-012"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;padding-top:0.1875rem}
[data-vibeui-block="timeline-012"] [data-part="author"]{color:var(--vibeui-timeline-012-fg);font-weight:650}
[data-vibeui-block="timeline-012"] [data-part="time"]{
font-size:0.6875rem;color:var(--vibeui-timeline-012-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;padding-top:0.1875rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Timeline012Day[] = [
  {
    label: "Сегодня",
    dateTime: "2026-03-14",
    entries: [
      { time: "14:20", dateTime: "2026-03-14T14:20", author: "Марк Иванов", action: "закрыл задачу «Экспорт в CSV»" },
      { time: "11:05", dateTime: "2026-03-14T11:05", author: "Аня Петрова", action: "оставила комментарий на главной странице" },
      { time: "09:40", dateTime: "2026-03-14T09:40", author: "Лиза Ким", action: "загрузила 6 файлов" },
    ],
  },
  {
    label: "Вчера",
    dateTime: "2026-03-13",
    entries: [
      { time: "18:12", dateTime: "2026-03-13T18:12", author: "Марк Иванов", action: "пригласил в проект Олега С." },
      { time: "10:30", dateTime: "2026-03-13T10:30", author: "Аня Петрова", action: "создала задачу «Обновить прайс»" },
    ],
  },
  {
    label: "12 марта",
    dateTime: "2026-03-12",
    entries: [
      { time: "16:45", dateTime: "2026-03-12T16:45", author: "Лиза Ким", action: "изменила права доступа" },
    ],
  },
]

function initial(name: string) {
  return name.charAt(0).toUpperCase()
}

/**
 * Активность, сгруппированная по дням, без прокрутки и sticky: заголовок дня
 * несёт счётчик записей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline012({
  days = DEFAULT_DAYS,
  title = "Активность по дням",
  accent,
  className,
  style,
  ...props
}: Timeline012Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-012"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol data-part="groups">
          {days.map((day) => (
            <li data-part="day" key={day.dateTime}>
              <h4 data-part="heading">
                <time dateTime={day.dateTime}>{day.label}</time>
                <span data-part="count">{day.entries.length}</span>
              </h4>
              <ol data-part="entries">
                {day.entries.map((entry, index) => (
                  <li data-part="row" key={`${entry.dateTime}-${index}`}>
                    <span data-part="avatar" aria-hidden="true">
                      {initial(entry.author)}
                    </span>
                    <p data-part="text">
                      <span data-part="author">{entry.author}</span>{" "}
                      {entry.action}
                    </p>
                    <time data-part="time" dateTime={entry.dateTime}>
                      {entry.time}
                    </time>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
