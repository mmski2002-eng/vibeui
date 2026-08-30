import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline001Event = {
  time: string
  title: string
  text?: string
  state?: "done" | "current" | "todo"
}

export type Timeline001Props = Omit<
  ComponentPropsWithoutRef<"ol">,
  "children"
> & {
  events?: Timeline001Event[]
  accent?: string
}

// Идея компонента: лента событий с линией слева. Линия нарисована бордюром
// самого элемента списка, а не отдельным столбиком: тогда она тянется ровно
// от точки к точке и не торчит за последним событием. Текущий шаг отличается
// кольцом, а прошедшие — заливкой: состояние читается формой.
const STYLES = `
:where([data-vibeui-block="timeline-001"]){
--vibeui-timeline-001-bg:oklch(1 0 0);
--vibeui-timeline-001-fg:oklch(0.22 0.014 265);
--vibeui-timeline-001-muted:oklch(0.56 0.014 265);
--vibeui-timeline-001-line:oklch(0.9 0.006 265);
--vibeui-timeline-001-accent:oklch(0.55 0.17 265);
--vibeui-timeline-001-done:oklch(0.58 0.15 152);
--vibeui-timeline-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-001"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
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
background:var(--vibeui-timeline-001-bg);
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
    title: "Заказ собран",
    text: "Курьер забрал посылку со склада",
    state: "done",
  },
  {
    time: "13 марта, 08:40",
    title: "В пути",
    text: "Отправление прибыло в сортировочный центр",
    state: "done",
  },
  {
    time: "Сегодня",
    title: "В доставке",
    text: "Курьер привезёт с 10:00 до 14:00",
    state: "current",
  },
  { time: "Завтра", title: "Вручение", state: "todo" },
]

/**
 * Лента событий: линия из бордюров, состояние читается формой точки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline001({
  events = DEFAULT_EVENTS,
  accent,
  className,
  style,
  ...props
}: Timeline001Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-001" precedence="medium">
        {STYLES}
      </style>
      <ol
        {...props}
        data-vibeui-block="timeline-001"
        className={className}
        style={palette}
      >
        {events.map((event) => (
          <li key={event.title} data-state={event.state ?? "todo"}>
            <span data-part="dot" aria-hidden="true" />
            <span data-part="time">{event.time}</span>
            <span data-part="title">{event.title}</span>
            {event.text ? <p data-part="text">{event.text}</p> : null}
          </li>
        ))}
      </ol>
    </>
  )
}
