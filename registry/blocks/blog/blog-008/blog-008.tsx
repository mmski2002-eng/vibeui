import type { CSSProperties } from "react"

type Blog008Featured = {
  topic: string
  title: string
  excerpt: string
  author: string
  date: string
  readingTime: string
  href?: string
}

type Blog008Item = {
  topic: string
  title: string
  date: string
  readingTime: string
  href?: string
}

export type Blog008Props = {
  eyebrow?: string
  title?: string
  featured?: Blog008Featured
  items?: Blog008Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Главная страница журнала: слева крупная featured-статья на тёплой
// оранжевой плашке, справа плотная вертикальная лента из четырёх строк.
// Иерархия честная — один материал получает всё внимание, остальные
// перечислены без обложек: строка списка стоит дешевле карточки.
const STYLES = `
:where([data-vibeui-block="blog-008"]){
--vibeui-blog-008-bg:transparent;
--vibeui-blog-008-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-blog-008-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-008-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-008-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-008-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-blog-008-tint:color-mix(in oklab,var(--vibeui-blog-008-accent) 10%,light-dark(oklch(1 0 0),oklch(0.22 0 0)));
--vibeui-blog-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-008"]{color-scheme:dark}
[data-vibeui-block="blog-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-008-bg);color:var(--vibeui-blog-008-ink);
font-family:var(--vibeui-blog-008-font);
}
[data-vibeui-block="blog-008"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-008"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-008-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-008"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-008"] [data-part="layout"]{display:grid;gap:1.5rem}
[data-vibeui-block="blog-008"] [data-part="featured"]{
position:relative;min-inline-size:0;
display:flex;flex-direction:column;gap:0.875rem;
padding:1.75rem;border:1px solid color-mix(in oklab,var(--vibeui-blog-008-accent) 26%,var(--vibeui-blog-008-border));
border-radius:1.25rem;background:var(--vibeui-blog-008-tint);
transition:border-color .18s ease;
}
[data-vibeui-block="blog-008"] [data-part="featured"]:hover{
border-color:color-mix(in oklab,var(--vibeui-blog-008-accent) 55%,var(--vibeui-blog-008-border));
}
[data-vibeui-block="blog-008"] [data-part="featured"]:focus-within{
outline:2px solid var(--vibeui-blog-008-accent);outline-offset:2px;
}
[data-vibeui-block="blog-008"] [data-part="topic"]{
align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-blog-008-accent) 16%,transparent);
color:var(--vibeui-blog-008-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="blog-008"] [data-part="featured-title"]{
margin:0;font-size:clamp(1.375rem,3.4cqi,1.875rem);line-height:1.15;letter-spacing:-0.02em;font-weight:750;
}
[data-vibeui-block="blog-008"] [data-part="link"]{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="blog-008"] [data-part="featured"] [data-part="link"]::after,
[data-vibeui-block="blog-008"] [data-part="row"] [data-part="link"]::after{
content:"";position:absolute;inset:0;
}
[data-vibeui-block="blog-008"] [data-part="featured-excerpt"]{
margin:0;flex:1 1 auto;color:var(--vibeui-blog-008-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="blog-008"] [data-part="featured-meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
padding-top:0.875rem;border-top:1px solid color-mix(in oklab,var(--vibeui-blog-008-accent) 20%,var(--vibeui-blog-008-border));
color:var(--vibeui-blog-008-muted);font-size:0.8125rem;
}
[data-vibeui-block="blog-008"] [data-part="featured-meta"] b{font-weight:650;color:var(--vibeui-blog-008-ink)}
[data-vibeui-block="blog-008"] [data-part="feed"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="blog-008"] [data-part="row"]{
position:relative;min-inline-size:0;
display:flex;flex-direction:column;gap:0.375rem;
padding:1rem 0.25rem;border-top:1px solid var(--vibeui-blog-008-border);
}
[data-vibeui-block="blog-008"] [data-part="row"]:first-child{border-top:0;padding-top:0.25rem}
[data-vibeui-block="blog-008"] [data-part="row"]:focus-within{
outline:2px solid var(--vibeui-blog-008-accent);outline-offset:2px;border-radius:0.5rem;
}
[data-vibeui-block="blog-008"] [data-part="row-topic"]{
color:var(--vibeui-blog-008-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="blog-008"] [data-part="row-title"]{
margin:0;font-size:1rem;line-height:1.35;font-weight:650;letter-spacing:-0.01em;
transition:color .15s ease;
}
[data-vibeui-block="blog-008"] [data-part="row"]:hover [data-part="row-title"]{
color:var(--vibeui-blog-008-accent);
}
[data-vibeui-block="blog-008"] [data-part="row-meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;
color:var(--vibeui-blog-008-muted);font-size:0.75rem;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-008"] [data-part="shell"]{padding:4.5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="blog-008"] [data-part="layout"]{grid-template-columns:1.5fr 1fr;gap:2.5rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FEATURED: Blog008Featured = {
  topic: "Практика",
  title: "Сайт за вечер: маркетолог собирает лендинг из готовых блоков",
  excerpt:
    "Пошаговый разбор без монтажа: выбор секций в каталоге, «Copy for AI», установка агентом и три правки текста. Считаем часы и смотрим, где вайбкодинг спотыкается на самом деле.",
  author: "Вера Славина",
  date: "26 марта 2026",
  readingTime: "9 мин",
}

const DEFAULT_ITEMS: Blog008Item[] = [
  {
    topic: "Вёрстка",
    title: "Container queries: блок меряет себя, а не окно",
    date: "20 марта 2026",
    readingTime: "7 мин",
  },
  {
    topic: "Работа с ИИ",
    title: "Что агент читает в metadata перед установкой",
    date: "14 марта 2026",
    readingTime: "5 мин",
  },
  {
    topic: "Компоненты",
    title: "Почему у каждого блока своя палитра, а не токены темы",
    date: "7 марта 2026",
    readingTime: "6 мин",
  },
  {
    topic: "Продукт",
    title: "Каталог на полторы тысячи блоков без базы данных",
    date: "28 февраля 2026",
    readingTime: "8 мин",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Главная журнала: крупная featured-статья слева и лента из четырёх строк справа. */
export function Blog008({
  eyebrow = "Свежее",
  title = "Главное за месяц",
  featured = DEFAULT_FEATURED,
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Blog008Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="layout">
            <article data-part="featured">
              <span data-part="topic">{featured.topic}</span>
              <h3 data-part="featured-title">
                <a data-part="link" href={featured.href ?? "#"}>
                  {featured.title}
                </a>
              </h3>
              <p data-part="featured-excerpt">{featured.excerpt}</p>
              <p data-part="featured-meta">
                <b>{featured.author}</b>
                <time>{featured.date}</time>
                <span>{featured.readingTime}</span>
              </p>
            </article>
            <ul data-part="feed">
              {items.map((item) => (
                <li key={item.title} data-part="row">
                  <span data-part="row-topic">{item.topic}</span>
                  <h3 data-part="row-title">
                    <a data-part="link" href={item.href ?? "#"}>
                      {item.title}
                    </a>
                  </h3>
                  <p data-part="row-meta">
                    <time>{item.date}</time>
                    <span>{item.readingTime}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
