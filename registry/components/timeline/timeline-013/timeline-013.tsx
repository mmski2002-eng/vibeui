import type { ComponentProps, CSSProperties } from "react"

export type Timeline013Point = {
  date: string
  /** Машиночитаемый момент для <time datetime>: «март 2019» роботу не дата. */
  dateTime: string
  title: string
  text?: string
}

export type Timeline013Props = Omit<ComponentProps<"section">, "children"> & {
  points?: Timeline013Point[]
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: история компании читается сверху вниз, а не пролистыванием
// в сторону, поэтому ствол вертикальный, а не горизонтальный, как у ленты вех
// (timeline-011). Вехи стоят по обе стороны от ствола — нечётные слева, чётные
// справа: колонка вдвое короче и заметнее глазу, чем один сплошной столбец.
// На узкой ширине обе стороны сливаются в один столбец у левого края —
// контейнерный запрос переключает раскладку, горизонтальная прокрутка
// странице не нужна.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-013"]){
--vibeui-timeline-013-bg:transparent;
--vibeui-timeline-013-surface:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-timeline-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-013-muted:color-mix(in oklab,var(--vibeui-timeline-013-fg) 68%,transparent);
--vibeui-timeline-013-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-013-line:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-timeline-013-accent:light-dark(oklch(0.55 0.18 262),oklch(0.74 0.16 262));
--vibeui-timeline-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-013"]{color-scheme:dark}
[data-vibeui-block="timeline-013"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,18rem);max-width:36rem;box-sizing:border-box;
font-family:var(--vibeui-timeline-013-font);color:var(--vibeui-timeline-013-fg);
}
[data-vibeui-block="timeline-013"] [data-part="shell"]{
display:flex;flex-direction:column;gap:1rem;
box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-013-bg);
border:1px solid var(--vibeui-timeline-013-border);border-radius:0.875rem;
}
[data-vibeui-block="timeline-013"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-013"] ol{
position:relative;margin:0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:1.375rem;
}
/* Ствол — один сплошной элемент под всеми вехами, а не бордюр каждой из них. */
[data-vibeui-block="timeline-013"] ol::before{
content:"";position:absolute;left:1rem;top:0.1875rem;bottom:0.1875rem;width:2px;
background:var(--vibeui-timeline-013-line);
}
[data-vibeui-block="timeline-013"] li{
position:relative;display:grid;
grid-template-columns:2rem 1fr;gap:0 0.875rem;align-items:start;
}
[data-vibeui-block="timeline-013"] [data-part="node"]{
grid-column:1;justify-self:center;margin-top:0.1875rem;
width:0.6875rem;height:0.6875rem;border-radius:9999px;
background:var(--vibeui-timeline-013-accent);
box-shadow:0 0 0 3px var(--vibeui-timeline-013-surface);
position:relative;z-index:1;
}
[data-vibeui-block="timeline-013"] [data-part="card"]{
grid-column:2;display:flex;flex-direction:column;gap:0.1875rem;min-width:0;
}
[data-vibeui-block="timeline-013"] [data-part="date"]{
font-size:0.6875rem;letter-spacing:0.02em;color:var(--vibeui-timeline-013-accent);
font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="timeline-013"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="timeline-013"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-013-muted)}
/* Широкий контейнер: ствол уходит в центр, вехи расходятся по обе стороны —
   нечётные тянутся к левому краю, чётные к правому. */
@container (min-width: 30rem){
[data-vibeui-block="timeline-013"] ol::before{left:50%}
[data-vibeui-block="timeline-013"] li{grid-template-columns:1fr 1.75rem 1fr}
[data-vibeui-block="timeline-013"] [data-part="node"]{grid-column:2}
[data-vibeui-block="timeline-013"] li:nth-child(odd) [data-part="card"]{
grid-column:1;align-items:flex-end;text-align:right;
}
[data-vibeui-block="timeline-013"] li:nth-child(even) [data-part="card"]{
grid-column:3;align-items:flex-start;text-align:left;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Timeline013Point[] = [
  {
    date: "Март 2019",
    dateTime: "2019-03",
    title: "Основание компании",
    text: "Три человека и первый клиент",
  },
  {
    date: "Октябрь 2020",
    dateTime: "2020-10",
    title: "Первый офис",
    text: "Переезд из коворкинга в своё помещение",
  },
  {
    date: "Май 2022",
    dateTime: "2022-05",
    title: "Выход на новый рынок",
    text: "Открыто представительство в Алматы",
  },
  {
    date: "Январь 2024",
    dateTime: "2024-01",
    title: "Сотый сотрудник",
    text: "Отдел разработки вырос втрое",
  },
  {
    date: "Февраль 2026",
    dateTime: "2026-02",
    title: "Международный запуск",
    text: "Продукт доступен в шести странах",
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
 * Вертикальная лента вех по обе стороны от общего ствола: нечётные слева,
 * чётные справа. Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline013({
  points = DEFAULT_POINTS,
  title = "История компании",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline013Props) {
  // Разрыв ствола вокруг узла рисуется цветом подложки: на прозрачной он
  // берёт цвет страницы через собственный токен.
  const palette = {
    ...(accent ? { "--vibeui-timeline-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-013-bg": background,
          "--vibeui-timeline-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h3 data-part="title">{title}</h3>
          <ol>
            {points.map((point) => (
              <li key={point.dateTime}>
                <span data-part="node" aria-hidden="true" />
                <div data-part="card">
                  <time data-part="date" dateTime={point.dateTime}>
                    {point.date}
                  </time>
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
