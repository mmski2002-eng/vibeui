import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Timeline011Point = {
  date: string
  dateTime: string
  title: string
  text?: string
}

export type Timeline011Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  points?: Timeline011Point[]
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: вехи разложены по горизонтали вокруг общего ствола, а не
// нанизаны в один ряд. Чётные карточки стоят над стволом, нечётные — под ним:
// так на одной строке умещается вдвое больше вех, чем в обычном горизонтальном
// ряду, и путь всё равно читается слева направо. Узел всегда стоит ровно на
// стволе: карточка растёт в свою сторону через grid-строку 1fr, а не через
// подгонку отступов на глаз. На узкой ширине лента не ломается в столбец —
// она прокручивается по горизонтали.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-011"]){
--vibeui-timeline-011-bg:transparent;
--vibeui-timeline-011-surface:light-dark(oklch(0.99 0.002 265),oklch(0.19 0.012 265));
--vibeui-timeline-011-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-timeline-011-muted:light-dark(oklch(0.57 0.014 265),oklch(0.69 0.012 265));
--vibeui-timeline-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-timeline-011-accent:light-dark(oklch(0.55 0.18 262),oklch(0.74 0.16 262));
--vibeui-timeline-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="timeline-011"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:44rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-011-bg);
border:1px solid var(--vibeui-timeline-011-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-011-font);color:var(--vibeui-timeline-011-fg);
}
[data-vibeui-block="timeline-011"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-011"] [data-part="scroll"]{overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin}
[data-vibeui-block="timeline-011"] ol{
position:relative;display:flex;
margin:0;padding:0 1rem;list-style:none;
width:max-content;min-width:100%;height:11rem;
}
/* Ствол — один сплошной элемент под всеми вехами, а не бордюр каждой из них. */
[data-vibeui-block="timeline-011"] ol::before{
content:"";position:absolute;left:1rem;right:1rem;top:50%;height:2px;
background:var(--vibeui-timeline-011-border);
}
/* Узел стоит в средней grid-строке, а карточка растёт в соседнюю 1fr-строку:
   так узел остаётся ровно на стволе независимо от длины текста карточки. */
[data-vibeui-block="timeline-011"] li{
position:relative;flex:0 0 11rem;padding:0 0.625rem;height:100%;
display:grid;grid-template-rows:1fr auto 1fr;justify-items:center;
}
[data-vibeui-block="timeline-011"] [data-part="node"]{
grid-row:2;position:relative;z-index:1;
width:0.75rem;height:0.75rem;border-radius:9999px;
background:var(--vibeui-timeline-011-accent);
box-shadow:0 0 0 3px var(--vibeui-timeline-011-surface);
}
[data-vibeui-block="timeline-011"] [data-part="card"]{
position:relative;display:flex;flex-direction:column;gap:0.125rem;
max-width:10rem;text-align:center;
}
[data-vibeui-block="timeline-011"] [data-part="card"]::after{
content:"";position:absolute;left:50%;width:1px;height:0.5rem;
background:var(--vibeui-timeline-011-border);transform:translateX(-50%);
}
[data-vibeui-block="timeline-011"] li:nth-child(odd) [data-part="card"]{grid-row:1;align-self:end;margin-bottom:0.5rem}
[data-vibeui-block="timeline-011"] li:nth-child(odd) [data-part="card"]::after{bottom:-0.5rem}
[data-vibeui-block="timeline-011"] li:nth-child(even) [data-part="card"]{grid-row:3;align-self:start;margin-top:0.5rem}
[data-vibeui-block="timeline-011"] li:nth-child(even) [data-part="card"]::after{top:-0.5rem}
[data-vibeui-block="timeline-011"] [data-part="date"]{font-size:0.6875rem;color:var(--vibeui-timeline-011-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="timeline-011"] [data-part="name"]{font-size:0.8125rem;font-weight:700;line-height:1.3}
[data-vibeui-block="timeline-011"] [data-part="text"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-timeline-011-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Timeline011Point[] = [
  {
    date: "14 января",
    dateTime: "2026-01-14",
    title: "Старт проекта",
    text: "Команда собрана, объём согласован",
  },
  {
    date: "02 февраля",
    dateTime: "2026-02-02",
    title: "Прототип",
    text: "Первая кликабельная версия",
  },
  {
    date: "27 февраля",
    dateTime: "2026-02-27",
    title: "Внутренний релиз",
    text: "Каталог и поиск для команды",
  },
  {
    date: "20 марта",
    dateTime: "2026-03-20",
    title: "Тест на пользователях",
    text: "Пять интервью, список правок",
  },
  {
    date: "05 апреля",
    dateTime: "2026-04-05",
    title: "Публичный запуск",
    text: "Открытая регистрация",
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
 * Горизонтальная лента вех вокруг общего ствола: чётные карточки сверху,
 * нечётные снизу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline011({
  points = DEFAULT_POINTS,
  title = "Вехи проекта",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline011Props) {
  // Разрыв ствола вокруг узла рисуется цветом подложки: на прозрачной он
  // берёт цвет страницы через собственный токен.
  const palette = {
    ...(accent ? { "--vibeui-timeline-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-011-bg": background,
          "--vibeui-timeline-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-011"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <div data-part="scroll">
          <ol>
            {points.map((point) => (
              <li key={point.dateTime}>
                <div data-part="card">
                  <time data-part="date" dateTime={point.dateTime}>
                    {point.date}
                  </time>
                  <span data-part="name">{point.title}</span>
                  {point.text ? <p data-part="text">{point.text}</p> : null}
                </div>
                <span data-part="node" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
