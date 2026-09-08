import type { CSSProperties } from "react"

type Blog014Item = {
  topic: string
  title: string
  readingTime: string
  href?: string
}

export type Blog014Props = {
  title?: string
  items?: Blog014Item[]
  allLabel?: string
  allHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// «Читать дальше» горизонтальными строками: рубрика, заголовок, время
// чтения и стрелка у правого края. Строка вместо карточки — блок стоит под
// дочитанной статьёй, где вертикальное место дорого: три строки занимают
// меньше экрана, чем один ряд обложек. Стрелка на hover уезжает вправо.
const STYLES = `
:where([data-vibeui-block="blog-014"]){
--vibeui-blog-014-bg:transparent;
--vibeui-blog-014-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-014-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-014-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-014-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-blog-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-014"]{color-scheme:dark}
[data-vibeui-block="blog-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-014-bg);color:var(--vibeui-blog-014-ink);
font-family:var(--vibeui-blog-014-font);
}
[data-vibeui-block="blog-014"] [data-part="shell"]{
max-width:52rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-014"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem 1rem;
margin:0 0 1.25rem;
}
[data-vibeui-block="blog-014"] [data-part="title"]{
margin:0;font-size:clamp(1.25rem,3.5cqi,1.625rem);line-height:1.15;letter-spacing:-0.02em;font-weight:750;
}
[data-vibeui-block="blog-014"] [data-part="all"]{
color:var(--vibeui-blog-014-accent);text-decoration:none;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="blog-014"] [data-part="all"]:hover{text-decoration:underline}
[data-vibeui-block="blog-014"] [data-part="all"]:focus-visible{
outline:2px solid var(--vibeui-blog-014-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="blog-014"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
border-top:1px solid var(--vibeui-blog-014-border);
}
[data-vibeui-block="blog-014"] [data-part="row"]{
position:relative;min-inline-size:0;
display:flex;align-items:center;gap:1rem;
padding:1rem 0.25rem;border-bottom:1px solid var(--vibeui-blog-014-border);
}
[data-vibeui-block="blog-014"] [data-part="row"]:focus-within{
outline:2px solid var(--vibeui-blog-014-accent);outline-offset:2px;border-radius:0.5rem;
}
[data-vibeui-block="blog-014"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.25rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="blog-014"] [data-part="row-topic"]{
color:var(--vibeui-blog-014-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="blog-014"] [data-part="row-title"]{
margin:0;font-size:1rem;line-height:1.35;font-weight:650;letter-spacing:-0.01em;
transition:color .15s ease;
}
[data-vibeui-block="blog-014"] [data-part="row"]:hover [data-part="row-title"]{
color:var(--vibeui-blog-014-accent);
}
[data-vibeui-block="blog-014"] [data-part="link"]{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="blog-014"] [data-part="link"]::after{
content:"";position:absolute;inset:0;
}
[data-vibeui-block="blog-014"] [data-part="time"]{
flex:none;color:var(--vibeui-blog-014-muted);font-size:0.75rem;white-space:nowrap;
}
[data-vibeui-block="blog-014"] [data-part="arrow"]{
flex:none;color:var(--vibeui-blog-014-accent);
font-size:1.125rem;line-height:1;
transition:transform .18s ease;
}
[data-vibeui-block="blog-014"] [data-part="row"]:hover [data-part="arrow"]{
transform:translateX(0.25rem);
}
@container (min-width: 40rem){
[data-vibeui-block="blog-014"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="blog-014"] [data-part="row"]{gap:1.5rem;padding:1.125rem 0.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Blog014Item[] = [
  {
    topic: "Вёрстка",
    title: "Container queries: блок меряет себя, а не окно",
    readingTime: "7 мин",
  },
  {
    topic: "Работа с ИИ",
    title: "Что агент читает в metadata перед установкой блока",
    readingTime: "5 мин",
  },
  {
    topic: "Компоненты",
    title: "Зачем каждому блоку собственная палитра",
    readingTime: "6 мин",
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

/** «Читать дальше»: три горизонтальные строки со стрелкой и ссылка на все статьи. */
export function Blog014({
  title = "Читать дальше",
  items = DEFAULT_ITEMS,
  allLabel = "Все статьи журнала",
  allHref = "#",
  background = "",
  accent,
  className,
  style,
}: Blog014Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-014" precedence="medium">
        {STYLES}
      </style>
      <aside
        data-vibeui-block="blog-014"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2 data-part="title">{title}</h2>
            <a data-part="all" href={allHref}>
              {allLabel}
            </a>
          </div>
          <ul data-part="list">
            {items.map((item) => (
              <li key={item.title} data-part="row">
                <div data-part="text">
                  <span data-part="row-topic">{item.topic}</span>
                  <h3 data-part="row-title">
                    <a data-part="link" href={item.href ?? "#"}>
                      {item.title}
                    </a>
                  </h3>
                </div>
                <span data-part="time">{item.readingTime}</span>
                <span data-part="arrow" aria-hidden="true">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
