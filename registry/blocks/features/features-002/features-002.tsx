import type { CSSProperties } from "react"

export type Features002Item = {
  icon: "bolt" | "shield" | "layers" | "chat" | "chart" | "plug"
  title: string
  description: string
}

export type Features002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: Features002Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: честная сетка шесть на две колонки — базовый способ показать
// возможности, когда ни одна из них не главнее прочих. Иконки нарисованы
// inline-путями и берут цвет из currentColor: ни библиотеки иконок, ни
// шрифта. Ячейки разделены не рамками, а фоном подложки: сетка читается
// линиями зазора, поэтому на узкой ширине она сворачивается в столбец без
// «висящих» рамок.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: ячейка там светлее фона, а линии зазора светлее ячейки.
const STYLES = `
:where([data-vibeui-block="features-002"]){
--vibeui-features-002-bg:transparent;
--vibeui-features-002-cell:light-dark(oklch(1 0 0),oklch(0.25 0 255));
--vibeui-features-002-fg:light-dark(oklch(0.2 0 255),oklch(0.95 0 255));
--vibeui-features-002-muted:light-dark(oklch(0.51 0 255),oklch(0.72 0 255));
--vibeui-features-002-line:light-dark(oklch(0.88 0 255),oklch(0.36 0 255));
--vibeui-features-002-accent:light-dark(oklch(0.53 0.16 258),oklch(0.76 0.14 258));
--vibeui-features-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-002"]{color-scheme:dark}
[data-vibeui-block="features-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-002-bg);color:var(--vibeui-features-002-fg);
font-family:var(--vibeui-features-002-sans);
}
[data-vibeui-block="features-002"] *{box-sizing:border-box}
[data-vibeui-block="features-002"] [data-part="shell"]{max-width:72rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-002"] [data-part="head"]{max-width:38rem;margin:0 auto 2.25rem;text-align:center}
[data-vibeui-block="features-002"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-002-accent);
}
[data-vibeui-block="features-002"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.5rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-002"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-002-muted);text-wrap:pretty;
}
[data-vibeui-block="features-002"] [data-part="grid"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:1px;
background:var(--vibeui-features-002-line);
border:1px solid var(--vibeui-features-002-line);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="features-002"] [data-part="cell"]{background:var(--vibeui-features-002-cell);padding:1.5rem}
[data-vibeui-block="features-002"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-features-002-accent) 12%,transparent);
color:var(--vibeui-features-002-accent);
}
[data-vibeui-block="features-002"] h3{margin:1rem 0 0;font-size:1rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="features-002"] [data-part="cell"] p{
margin:0.5rem 0 0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-features-002-muted);text-wrap:pretty;
}
@container (min-width: 34rem){
[data-vibeui-block="features-002"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="features-002"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="features-002"] [data-part="cell"]{padding:2rem}
[data-vibeui-block="features-002"] [data-part="head"]{margin-bottom:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-002"] *{animation:none!important;transition:none!important}}
`

const PATHS: Record<Features002Item["icon"], string> = {
  bolt: "M11 2 4 12h5l-1 8 7-10h-5z",
  shield: "M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6z",
  layers: "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5",
  chat: "M4 5h16v10H9l-5 4z",
  chart: "M4 20V9M10 20V4M16 20v-7M22 20H2",
  plug: "M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3",
}

const DEFAULT_ITEMS: Features002Item[] = [
  {
    icon: "bolt",
    title: "Мгновенная установка",
    description:
      "Одна команда — и секция лежит в проекте вместе со стилями, без правок конфигов.",
  },
  {
    icon: "shield",
    title: "Своя палитра",
    description:
      "Секция не читает вашу тему и не ломается от чужих токенов: цвета живут внутри файла.",
  },
  {
    icon: "layers",
    title: "Один файл",
    description:
      "Ни соседних компонентов, ни утилит: переносится копированием в любой проект.",
  },
  {
    icon: "chat",
    title: "Инструкция для агента",
    description:
      "Copy for AI отдаёт список того, что нельзя ломать, и того, что можно менять.",
  },
  {
    icon: "chart",
    title: "Раскладка от блока",
    description:
      "Container queries считают ширину секции, а не окна: в сайдбаре вёрстка честная.",
  },
  {
    icon: "plug",
    title: "Ноль зависимостей",
    description:
      "Никаких иконочных пакетов и motion-библиотек — только React и CSS.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/** Сетка из шести возможностей с иконками: три колонки, ячейки на зазорах-линиях. */
export function Features002({
  eyebrow = "Возможности",
  title = "Шесть причин не верстать секции руками",
  lede = "Каждая возможность работает сама по себе — включать их по очереди не нужно.",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Features002Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <ul data-part="grid">
            {items.slice(0, 6).map((item) => (
              <li key={item.title} data-part="cell">
                <span data-part="icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path
                      d={PATHS[item.icon]}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
