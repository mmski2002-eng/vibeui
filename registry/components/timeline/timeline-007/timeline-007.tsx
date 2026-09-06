import type { ComponentProps, CSSProperties } from "react"

export type Timeline007Stage = {
  title: string
  date?: string
  /** Машиночитаемая дата для <time datetime>: «сегодня» роботу не дата. */
  dateTime?: string
  state?: "done" | "current" | "todo"
}

export type Timeline007Props = Omit<ComponentProps<"section">, "children"> & {
  stages?: Timeline007Stage[]
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: этапы разложены по горизонтали, потому что так читается
// путь, а не список. Соединитель — псевдоэлемент каждого этапа, дотянутый до
// следующего кружка: он красится в цвет пройденного отрезка и обрывается на
// последнем узле. На узкой ширине лента не ломается в столбец, а прокручивается
// со scroll-snap: горизонтальный путь, свёрнутый в вертикальный, врёт про порядок.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-007"]){
--vibeui-timeline-007-bg:transparent;
--vibeui-timeline-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-007-muted:color-mix(in oklab,var(--vibeui-timeline-007-fg) 68%,transparent);
--vibeui-timeline-007-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-007-done:light-dark(oklch(0.58 0.14 152),oklch(0.72 0.14 152));
--vibeui-timeline-007-on-done:light-dark(oklch(1 0 0),oklch(0.19 0.04 152));
--vibeui-timeline-007-accent:light-dark(oklch(0.55 0.18 39.8),oklch(0.74 0.16 39.8));
--vibeui-timeline-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-007"]{color-scheme:dark}
[data-vibeui-block="timeline-007"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-007-bg);
border:1px solid var(--vibeui-timeline-007-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-007-font);color:var(--vibeui-timeline-007-fg);
}
[data-vibeui-block="timeline-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
/* На узкой ширине лента прокручивается, а не переворачивается в столбец. */
[data-vibeui-block="timeline-007"] ol{
display:flex;margin:0;padding:0 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x proximity;scrollbar-width:thin;
}
[data-vibeui-block="timeline-007"] li{
position:relative;flex:1 0 7rem;scroll-snap-align:start;
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
padding:0 0.25rem;text-align:center;
}
/* Соединитель тянется до следующего узла и красится состоянием этого этапа. */
[data-vibeui-block="timeline-007"] li::before{
content:"";position:absolute;top:0.6875rem;left:calc(50% + 1rem);right:calc(-50% + 1rem);
height:2px;border-radius:2px;background:var(--vibeui-timeline-007-border);
}
[data-vibeui-block="timeline-007"] li[data-state="done"]::before{background:var(--vibeui-timeline-007-done)}
[data-vibeui-block="timeline-007"] li:last-child::before{display:none}
[data-vibeui-block="timeline-007"] [data-part="node"]{
position:relative;z-index:1;box-sizing:border-box;
display:flex;align-items:center;justify-content:center;
width:1.375rem;height:1.375rem;border-radius:9999px;
border:2px solid var(--vibeui-timeline-007-border);
background:var(--vibeui-timeline-007-bg);
font-size:0.625rem;font-weight:700;color:var(--vibeui-timeline-007-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="timeline-007"] li[data-state="done"] [data-part="node"]{
border-color:var(--vibeui-timeline-007-done);background:var(--vibeui-timeline-007-done);
color:var(--vibeui-timeline-007-on-done);
}
[data-vibeui-block="timeline-007"] li[data-state="current"] [data-part="node"]{
border-color:var(--vibeui-timeline-007-accent);color:var(--vibeui-timeline-007-accent);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-timeline-007-accent) 15%,transparent);
}
[data-vibeui-block="timeline-007"] [data-part="stage"]{font-size:0.8125rem;font-weight:600;line-height:1.25}
[data-vibeui-block="timeline-007"] li[data-state="todo"] [data-part="stage"]{color:var(--vibeui-timeline-007-muted);font-weight:500}
[data-vibeui-block="timeline-007"] [data-part="date"]{font-size:0.6875rem;color:var(--vibeui-timeline-007-muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Timeline007Stage[] = [
  { title: "Заявка", date: "3 марта", dateTime: "2026-03-03", state: "done" },
  { title: "Оценка", date: "6 марта", dateTime: "2026-03-06", state: "done" },
  {
    title: "Договор",
    date: "сегодня",
    dateTime: "2026-03-14",
    state: "current",
  },
  {
    title: "Работы",
    date: "с 20 марта",
    dateTime: "2026-03-20",
    state: "todo",
  },
  { title: "Сдача", date: "апрель", dateTime: "2026-04", state: "todo" },
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
 * Горизонтальная лента этапов: соединитель красится пройденным, узкий блок прокручивается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline007({
  stages = DEFAULT_STAGES,
  title = "Этапы сделки",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline007Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-007"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol>
          {stages.map((stage, index) => {
            const state = stage.state ?? "todo"
            return (
              <li key={stage.title} data-state={state}>
                <span
                  data-part="node"
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {index + 1}
                </span>
                <span data-part="stage">{stage.title}</span>
                {stage.date ? (
                  <time data-part="date" dateTime={stage.dateTime}>
                    {stage.date}
                  </time>
                ) : null}
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
