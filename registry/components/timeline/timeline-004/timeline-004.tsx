import type { ComponentProps, CSSProperties } from "react"

export type Timeline004Point = {
  date: string
  /** Машиночитаемая дата для <time datetime>: «14 января» роботу не дата. */
  dateTime: string
  title: string
  text?: string
  /** Веха рисуется ромбом и не теряется среди рядовых записей. */
  milestone?: boolean
}

export type Timeline004Props = Omit<ComponentProps<"section">, "children"> & {
  points?: Timeline004Point[]
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: хронология проекта, где вехи не равны рядовым записям.
// Веха — ромб и жирная дата, обычная запись — точка: важное видно, даже если
// список не читать. Раскладка считается от собственной ширины блока: узкий
// блок даёт один столбец, широкий — дату отдельной колонкой слева, поэтому
// даты выстраиваются по вертикали и список читается как календарь.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-004"]){
--vibeui-timeline-004-bg:transparent;
--vibeui-timeline-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-004-muted:color-mix(in oklab,var(--vibeui-timeline-004-fg) 68%,transparent);
--vibeui-timeline-004-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-004-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.76 0.16 39.8));
--vibeui-timeline-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-004"]{color-scheme:dark}
[data-vibeui-block="timeline-004"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-timeline-004-font);color:var(--vibeui-timeline-004-fg);
}
[data-vibeui-block="timeline-004"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.75rem;
box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-004-bg);
border:1px solid var(--vibeui-timeline-004-border);border-radius:0.875rem;
}
[data-vibeui-block="timeline-004"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-004"] ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-004"] li{
position:relative;display:grid;grid-template-columns:0.875rem 1fr;
gap:0.25rem 0.75rem;padding:0 0 1rem 0;
}
[data-vibeui-block="timeline-004"] li::before{
content:"";position:absolute;left:0.375rem;top:1.125rem;bottom:0;
width:1px;background:var(--vibeui-timeline-004-border);
}
[data-vibeui-block="timeline-004"] li:last-child{padding-bottom:0}
[data-vibeui-block="timeline-004"] li:last-child::before{display:none}
[data-vibeui-block="timeline-004"] [data-part="mark"]{
grid-row:1 / span 2;align-self:start;justify-self:center;margin-top:0.375rem;
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-timeline-004-border);
}
/* Ромб вместо точки: веха отличается формой, а не только цветом. */
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="mark"]{
width:0.625rem;height:0.625rem;margin-top:0.25rem;border-radius:0.0625rem;
transform:rotate(45deg);background:var(--vibeui-timeline-004-accent);
}
[data-vibeui-block="timeline-004"] [data-part="date"]{
font-size:0.6875rem;letter-spacing:0.02em;color:var(--vibeui-timeline-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="date"]{
color:var(--vibeui-timeline-004-accent);font-weight:700;
}
[data-vibeui-block="timeline-004"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="timeline-004"] [data-part="name"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="name"]{font-weight:700}
[data-vibeui-block="timeline-004"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-004-muted)}
/* Широкий блок: дата уезжает в свой столбец и даты встают по вертикали. */
@container (min-width: 30rem){
[data-vibeui-block="timeline-004"] li{grid-template-columns:6.5rem 0.875rem 1fr;align-items:start}
[data-vibeui-block="timeline-004"] li::before{left:7.375rem}
[data-vibeui-block="timeline-004"] [data-part="date"]{grid-column:1;grid-row:1;text-align:right;padding-top:0.1875rem}
[data-vibeui-block="timeline-004"] [data-part="mark"]{grid-column:2;grid-row:1;margin-top:0.4375rem}
[data-vibeui-block="timeline-004"] li[data-kind="milestone"] [data-part="mark"]{margin-top:0.3125rem}
[data-vibeui-block="timeline-004"] [data-part="body"]{grid-column:3;grid-row:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Timeline004Point[] = [
  {
    date: "14 января",
    dateTime: "2026-01-14",
    title: "Старт проекта",
    text: "Собрана команда, согласован объём первой версии",
    milestone: true,
  },
  {
    date: "02 февраля",
    dateTime: "2026-02-02",
    title: "Прототип интерфейса",
  },
  {
    date: "27 февраля",
    dateTime: "2026-02-27",
    title: "Внутренний релиз",
    text: "Сборка для команды: только каталог и поиск",
    milestone: true,
  },
  {
    date: "11 марта",
    dateTime: "2026-03-11",
    title: "Правки после теста на пользователях",
  },
  {
    date: "05 апреля",
    dateTime: "2026-04-05",
    title: "Публичный запуск",
    text: "Открытая регистрация и первый платный тариф",
    milestone: true,
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
 * Хронология проекта: вехи ромбом, даты отдельным столбцом на широкой раскладке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline004({
  points = DEFAULT_POINTS,
  title = "Хронология проекта",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline004Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h3 data-part="title">{title}</h3>
          <ol>
            {points.map((point) => (
              <li
                key={point.title}
                data-kind={point.milestone ? "milestone" : "event"}
              >
                <span data-part="mark" aria-hidden="true" />
                <time data-part="date" dateTime={point.dateTime}>
                  {point.date}
                </time>
                <div data-part="body">
                  <span data-part="name">{point.title}</span>
                  {point.text ? <p data-part="text">{point.text}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
