import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline009Stop = {
  time: string
  dateTime: string
  title: string
  address?: string
  state?: "done" | "current" | "todo"
}

export type Timeline009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  stops?: Timeline009Stop[]
  orderLabel?: string
  positionNote?: string
  /** Состояния для скринридера: компонент несёт русские, проект — свои. */
  stateText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

const STATE_LABEL: Record<"done" | "current" | "todo", string> = {
  done: "Выполнено.",
  current: "Сейчас.",
  todo: "Предстоит.",
}

// Идея компонента: маршрут доставки, где видно не только список этапов, но
// и где сейчас находится посылка между ними. Стопы рисуются как обычная
// лента, а поверх неё едет отдельный маркер положения: его top задаётся
// одной процентной переменной, посчитанной из доли пройденных стопов, —
// маркер не привязан к конкретному пункту и может стоять между двумя.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-009"]){
--vibeui-timeline-009-bg:transparent;
--vibeui-timeline-009-surface:light-dark(oklch(0.99 0.002 265),oklch(0.19 0.012 265));
--vibeui-timeline-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-timeline-009-muted:light-dark(oklch(0.57 0.014 265),oklch(0.69 0.012 265));
--vibeui-timeline-009-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-timeline-009-track:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-timeline-009-done:light-dark(oklch(0.58 0.14 152),oklch(0.72 0.14 152));
--vibeui-timeline-009-accent:light-dark(oklch(0.55 0.18 262),oklch(0.74 0.16 262));
--vibeui-timeline-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-009"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-009-bg);
border:1px solid var(--vibeui-timeline-009-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-009-font);color:var(--vibeui-timeline-009-fg);
}
[data-vibeui-block="timeline-009"] [data-part="head"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-009"] [data-part="position"]{
margin:0;padding:0.5rem 0.625rem;border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-timeline-009-accent) 8%,transparent);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-timeline-009-fg);
}
/* Обёртка задаёт систему координат для маркера положения: он позиционируется
   в процентах от её высоты, а не от высоты конкретного пункта списка. */
[data-vibeui-block="timeline-009"] [data-part="route"]{position:relative}
[data-vibeui-block="timeline-009"] [data-part="stops"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-009"] [data-part="stops"] li{
position:relative;display:flex;flex-direction:column;gap:0.125rem;
padding:0 0 1.125rem 1.5rem;
border-left:2px solid var(--vibeui-timeline-009-track);
}
[data-vibeui-block="timeline-009"] [data-part="stops"] li:last-child{border-left-color:transparent;padding-bottom:0}
[data-vibeui-block="timeline-009"] [data-part="dot"]{
position:absolute;left:-0.4375rem;top:0.1875rem;
width:0.75rem;height:0.75rem;box-sizing:border-box;
border-radius:9999px;border:2px solid var(--vibeui-timeline-009-track);
background:var(--vibeui-timeline-009-surface);
}
[data-vibeui-block="timeline-009"] li[data-state="done"] [data-part="dot"]{
border-color:transparent;background:var(--vibeui-timeline-009-done);
}
[data-vibeui-block="timeline-009"] li[data-state="current"] [data-part="dot"]{
border-color:var(--vibeui-timeline-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-timeline-009-accent) 18%,transparent);
}
[data-vibeui-block="timeline-009"] [data-part="time"]{font-size:0.6875rem;color:var(--vibeui-timeline-009-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="timeline-009"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="timeline-009"] li[data-state="todo"] [data-part="title"]{color:var(--vibeui-timeline-009-muted);font-weight:600}
[data-vibeui-block="timeline-009"] [data-part="address"]{font-size:0.75rem;color:var(--vibeui-timeline-009-muted)}
[data-vibeui-block="timeline-009"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
/* Маркер положения: круг с пульсирующим кольцом, top задан процентом высоты
   маршрута. Он существует независимо от точек стопов. */
[data-vibeui-block="timeline-009"] [data-part="pin"]{
position:absolute;left:-0.5625rem;top:var(--vibeui-timeline-009-progress,0%);
transform:translateY(-50%);
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-timeline-009-accent);
box-shadow:0 0 0 3px var(--vibeui-timeline-009-surface),0 0 0 5px color-mix(in oklab,var(--vibeui-timeline-009-accent) 35%,transparent);
animation:vibeui-timeline-009-pulse 2.2s ease-in-out infinite;
}
@keyframes vibeui-timeline-009-pulse{
0%,100%{box-shadow:0 0 0 3px var(--vibeui-timeline-009-surface),0 0 0 5px color-mix(in oklab,var(--vibeui-timeline-009-accent) 35%,transparent)}
50%{box-shadow:0 0 0 3px var(--vibeui-timeline-009-surface),0 0 0 8px color-mix(in oklab,var(--vibeui-timeline-009-accent) 15%,transparent)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STOPS: Timeline009Stop[] = [
  {
    time: "12 марта, 10:02",
    dateTime: "2026-03-12T10:02",
    title: "Оплачен",
    state: "done",
  },
  {
    time: "12 марта, 18:40",
    dateTime: "2026-03-12T18:40",
    title: "Собран на складе",
    state: "done",
  },
  {
    time: "13 марта, 09:15",
    dateTime: "2026-03-13T09:15",
    title: "В пути",
    address: "Сортировочный центр, Тверь",
    state: "current",
  },
  {
    time: "13 марта, вечером",
    dateTime: "2026-03-13T20:00",
    title: "В пункте выдачи",
    state: "todo",
  },
  {
    time: "14 марта",
    dateTime: "2026-03-14",
    title: "Получен",
    state: "todo",
  },
]

/** Доля пройденного пути: done считается целиком, текущий стоп — наполовину. */
function routeProgress(stops: Timeline009Stop[]) {
  const total = stops.length || 1
  const done = stops.filter((stop) => stop.state === "done").length
  const hasCurrent = stops.some((stop) => stop.state === "current")
  return ((done + (hasCurrent ? 0.5 : 0)) / total) * 100
}

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
 * Маршрут доставки: список стопов плюс отдельный маркер текущего положения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline009({
  stops = DEFAULT_STOPS,
  orderLabel = "Заказ № 4471",
  positionNote = "Посылка в пути, ожидаемое прибытие в пункт выдачи — сегодня вечером.",
  stateText = STATE_LABEL,
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline009Props) {
  // Заливка точек и разрыв вокруг маркера идут за подложкой: на прозрачной
  // они берут цвет страницы через собственный токен.
  const palette = {
    ...(accent ? { "--vibeui-timeline-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-009-bg": background,
          "--vibeui-timeline-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const progress = routeProgress(stops)

  return (
    <>
      <style href="vibeui-timeline-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-009"
        className={className}
        style={palette}
        aria-label={orderLabel}
      >
        <h3 data-part="head">{orderLabel}</h3>
        <p data-part="position">{positionNote}</p>
        <div data-part="route">
          <ol data-part="stops">
            {stops.map((stop) => {
              const state = stop.state ?? "todo"
              return (
                <li key={stop.title} data-state={state}>
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="sr">
                    {stateText[state] ?? STATE_LABEL[state]}
                  </span>
                  <time data-part="time" dateTime={stop.dateTime}>
                    {stop.time}
                  </time>
                  <span data-part="title">{stop.title}</span>
                  {stop.address ? (
                    <span data-part="address">{stop.address}</span>
                  ) : null}
                </li>
              )
            })}
          </ol>
          <span
            data-part="pin"
            aria-hidden="true"
            style={
              {
                "--vibeui-timeline-009-progress": `${progress}%`,
              } as CSSProperties
            }
          />
        </div>
      </section>
    </>
  )
}
