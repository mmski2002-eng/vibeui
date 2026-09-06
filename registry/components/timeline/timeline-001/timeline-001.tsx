import type { ComponentProps, CSSProperties } from "react"

export type Timeline001Event = {
  time: string
  /** Машиночитаемая дата для <time datetime>: «Сегодня» роботу ничего не говорит. */
  dateTime: string
  title: string
  text?: string
  state?: "done" | "current" | "todo"
}

export type Timeline001Props = Omit<ComponentProps<"ol">, "children"> & {
  events?: Timeline001Event[]
  accent?: string
  /** Цвет пройденного шага: заливка точки у state="done". */
  done?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: лента событий с линией слева. Линия нарисована бордюром
// самого элемента списка, а не отдельным столбиком: тогда она тянется ровно
// от точки к точке и не торчит за последним событием. Текущий шаг отличается
// кольцом, а прошедшие — заливкой: состояние читается формой.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-001"]){
--vibeui-timeline-001-bg:transparent;
--vibeui-timeline-001-dot:light-dark(oklch(0.99 0 0),oklch(0.21 0 265));
--vibeui-timeline-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-001-muted:color-mix(in oklab,var(--vibeui-timeline-001-fg) 68%,transparent);
--vibeui-timeline-001-line:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-timeline-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-timeline-001-done:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.14 152));
--vibeui-timeline-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-001"]{color-scheme:dark}
[data-vibeui-block="timeline-001"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.9375rem;
list-style:none;
background:var(--vibeui-timeline-001-bg);
border:1px solid var(--vibeui-timeline-001-line);border-radius:0.875rem;
font-family:var(--vibeui-timeline-001-font);color:var(--vibeui-timeline-001-fg);
}
/* Линия — бордюр самого события: тянется от точки к точке и не торчит. */
[data-vibeui-block="timeline-001"] li{
position:relative;display:flex;flex-direction:column;gap:0.125rem;
padding:0 0 1rem 1.375rem;
border-left:2px solid var(--vibeui-timeline-001-line);
}
[data-vibeui-block="timeline-001"] li:last-child{border-left-color:transparent;padding-bottom:0}
[data-vibeui-block="timeline-001"] [data-part="dot"]{
position:absolute;left:-0.4375rem;top:0.1875rem;
width:0.75rem;height:0.75rem;box-sizing:border-box;
border-radius:9999px;border:2px solid var(--vibeui-timeline-001-line);
background:var(--vibeui-timeline-001-dot);
}
[data-vibeui-block="timeline-001"] li[data-state="done"] [data-part="dot"]{
border-color:transparent;background:var(--vibeui-timeline-001-done);
}
[data-vibeui-block="timeline-001"] li[data-state="current"] [data-part="dot"]{
border-color:var(--vibeui-timeline-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-timeline-001-accent) 18%,transparent);
}
[data-vibeui-block="timeline-001"] [data-part="time"]{font-size:0.6875rem;color:var(--vibeui-timeline-001-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="timeline-001"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="timeline-001"] li[data-state="todo"] [data-part="title"]{color:var(--vibeui-timeline-001-muted);font-weight:600}
[data-vibeui-block="timeline-001"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-timeline-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EVENTS: Timeline001Event[] = [
  {
    time: "12 марта, 10:20",
    dateTime: "2026-03-12T10:20",
    title: "Заказ собран",
    text: "Курьер забрал посылку со склада",
    state: "done",
  },
  {
    time: "13 марта, 08:40",
    dateTime: "2026-03-13T08:40",
    title: "В пути",
    text: "Отправление прибыло в сортировочный центр",
    state: "done",
  },
  {
    time: "Сегодня",
    dateTime: "2026-03-14",
    title: "В доставке",
    text: "Курьер привезёт с 10:00 до 14:00",
    state: "current",
  },
  {
    time: "Завтра",
    dateTime: "2026-03-15",
    title: "Вручение",
    state: "todo",
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
 * Лента событий: линия из бордюров, состояние читается формой точки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline001({
  events = DEFAULT_EVENTS,
  accent,
  done,
  background = "",
  className,
  style,
  ...props
}: Timeline001Props) {
  // Точка перекрывает линию, поэтому её заливка идёт следом за подложкой:
  // на прозрачном фоне ей достаётся цвет страницы через собственный токен.
  const palette = {
    ...(accent ? { "--vibeui-timeline-001-accent": accent } : null),
    ...(done ? { "--vibeui-timeline-001-done": done } : null),
    ...(background
      ? {
          "--vibeui-timeline-001-bg": background,
          "--vibeui-timeline-001-dot": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-001" precedence="medium">
        {STYLES}
      </style>
      <ol
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-001"
        className={className}
        style={palette}
      >
        {events.map((event) => (
          <li key={event.title} data-state={event.state ?? "todo"}>
            <span data-part="dot" aria-hidden="true" />
            <time data-part="time" dateTime={event.dateTime}>
              {event.time}
            </time>
            <span data-part="title">{event.title}</span>
            {event.text ? <p data-part="text">{event.text}</p> : null}
          </li>
        ))}
      </ol>
    </>
  )
}
