import type { ComponentProps, CSSProperties } from "react"

export type Timeline008Entry = {
  time: string
  /** Машиночитаемый момент для <time datetime>. */
  dateTime: string
  title: string
  text?: string
}

export type Timeline008Day = {
  date: string
  /** Машиночитаемая дата дня для <time datetime>: «Сегодня» роботу не дата. */
  dateTime: string
  entries: Timeline008Entry[]
}

export type Timeline008Props = Omit<ComponentProps<"section">, "children"> & {
  days?: Timeline008Day[]
  title?: string
  /** Подпись области прокрутки; {title} подставляется заголовком. */
  feedLabelText?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: длинная лента, разрезанная по дням, где дата не уезжает
// вместе с прокруткой. Заголовок дня липкий (position:sticky в своей группе),
// поэтому в любой момент видно, какой день читаешь. Липкая дата обязана быть
// непрозрачной: без собственного фона строки ленты просвечивают сквозь неё,
// поэтому у неё свой токен, а не общая (прозрачная) подложка блока.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-008"]){
--vibeui-timeline-008-bg:transparent;
--vibeui-timeline-008-sticky:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-timeline-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-008-muted:color-mix(in oklab,var(--vibeui-timeline-008-fg) 68%,transparent);
--vibeui-timeline-008-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-008-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-timeline-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-008"]{color-scheme:dark}
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
background:var(--vibeui-timeline-008-sticky);
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
background:var(--vibeui-timeline-008-accent);color:oklch(from var(--vibeui-timeline-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
    dateTime: "2026-03-14",
    entries: [
      {
        time: "14:20",
        dateTime: "2026-03-14T14:20",
        title: "Счёт оплачен",
        text: "Платёж прошёл, чек отправлен на почту",
      },
      {
        time: "11:05",
        dateTime: "2026-03-14T11:05",
        title: "Заявка принята в работу",
      },
    ],
  },
  {
    date: "Вчера",
    dateTime: "2026-03-13",
    entries: [
      {
        time: "19:42",
        dateTime: "2026-03-13T19:42",
        title: "Добавлен комментарий инженера",
      },
      {
        time: "16:10",
        dateTime: "2026-03-13T16:10",
        title: "Назначен исполнитель",
        text: "Бригада №3, выезд утром",
      },
      { time: "09:30", dateTime: "2026-03-13T09:30", title: "Создана заявка" },
    ],
  },
  {
    date: "12 марта",
    dateTime: "2026-03-12",
    entries: [
      { time: "18:00", dateTime: "2026-03-12T18:00", title: "Звонок клиенту" },
      {
        time: "10:15",
        dateTime: "2026-03-12T10:15",
        title: "Первичный осмотр",
      },
    ],
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Лента, разрезанная по дням: заголовок дня липнет к верху своей группы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline008({
  days = DEFAULT_DAYS,
  title = "Лента заявки",
  feedLabelText = "{title}: события по дням",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline008Props) {
  // Подложка задаёт и фон липкой даты: сквозь прозрачную просвечивают строки.
  const palette = {
    ...(accent ? { "--vibeui-timeline-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-008-bg": background,
          "--vibeui-timeline-008-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-008"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={feedLabelText.replace("{title}", title)}
        >
          {days.map((day) => (
            <li data-part="day" key={day.dateTime}>
              <h4 data-part="date">
                <time dateTime={day.dateTime}>{day.date}</time>
              </h4>
              <ul>
                {day.entries.map((entry) => (
                  <li data-part="row" key={entry.dateTime}>
                    <time data-part="time" dateTime={entry.dateTime}>
                      {entry.time}
                    </time>
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
