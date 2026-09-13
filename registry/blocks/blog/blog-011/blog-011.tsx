import type { CSSProperties } from "react"

type Blog011Post = {
  title: string
  date: string
  readingTime: string
  href?: string
}

type Blog011Group = {
  month: string
  posts: Blog011Post[]
}

export type Blog011Props = {
  eyebrow?: string
  title?: string
  groups?: Blog011Group[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Архив-таймлайн: статьи сгруппированы по месяцам вдоль вертикальной оси,
// у каждого месяца оранжевая точка. Ось даёт то, чего нет у плоского
// списка, — ощущение регулярности: паузы и плотные месяцы видны без
// чтения дат.
const STYLES = `
:where([data-vibeui-block="blog-011"]){
--vibeui-blog-011-bg:transparent;
--vibeui-blog-011-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-011-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-011-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-011-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-blog-011-page:light-dark(oklch(1 0 0),oklch(0.17 0 0));
--vibeui-blog-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-blog-011-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-011"]{color-scheme:dark}
[data-vibeui-block="blog-011"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-011-bg);color:var(--vibeui-blog-011-ink);
font-family:var(--vibeui-blog-011-font);
}
[data-vibeui-block="blog-011"] [data-part="shell"]{
max-width:46rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-011"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-011-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-011"] [data-part="title"]{
margin:0 0 2.25rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-011"] [data-part="timeline"]{
margin:0;padding:0 0 0 1.25rem;list-style:none;
border-left:2px solid var(--vibeui-blog-011-border);
}
[data-vibeui-block="blog-011"] [data-part="group"]{
position:relative;padding:0 0 2rem;
}
[data-vibeui-block="blog-011"] [data-part="group"]:last-child{padding-bottom:0}
/* Точка сидит на оси: полкруга наружу, полкруга внутрь. Обводка цветом
   страницы отрывает её от линии. */
[data-vibeui-block="blog-011"] [data-part="group"]::before{
content:"";position:absolute;left:calc(-1.25rem - 2px - 0.34375rem + 1px);top:0.28125rem;
width:0.6875rem;height:0.6875rem;border-radius:999px;
background:var(--vibeui-blog-011-accent);
box-shadow:0 0 0 3px var(--vibeui-blog-011-page);color:oklch(from var(--vibeui-blog-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="blog-011"] [data-part="month"]{
margin:0 0 0.875rem;
font-size:0.8125rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-blog-011-accent);
}
[data-vibeui-block="blog-011"] [data-part="posts"]{
display:flex;flex-direction:column;gap:0.875rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="blog-011"] [data-part="post"]{
display:flex;flex-direction:column;gap:0.1875rem;min-width:0;
}
[data-vibeui-block="blog-011"] [data-part="post-link"]{
color:inherit;text-decoration:none;
font-size:1rem;font-weight:650;line-height:1.4;letter-spacing:-0.01em;
transition:color var(--vibeui-blog-011-dur-2) ease;
}
[data-vibeui-block="blog-011"] [data-part="post-link"]:hover{color:var(--vibeui-blog-011-accent)}
[data-vibeui-block="blog-011"] [data-part="post-link"]:focus-visible{
outline:2px solid var(--vibeui-blog-011-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="blog-011"] [data-part="post-meta"]{
display:flex;gap:0.75rem;color:var(--vibeui-blog-011-muted);font-size:0.75rem;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-011"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="blog-011"] [data-part="timeline"]{padding-left:1.75rem}
[data-vibeui-block="blog-011"] [data-part="group"]::before{left:calc(-1.75rem - 2px - 0.34375rem + 1px)}
[data-vibeui-block="blog-011"] [data-part="post"]{
flex-direction:row;align-items:baseline;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="blog-011"] [data-part="post-meta"]{flex:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Blog011Group[] = [
  {
    month: "Март 2026",
    posts: [
      {
        title: "Отдайте вёрстку агенту: как «Copy for AI» переносит блок",
        date: "26 марта",
        readingTime: "9 мин",
      },
      {
        title: "Container queries: блок меряет себя, а не окно",
        date: "20 марта",
        readingTime: "7 мин",
      },
      {
        title: "Один оранжевый на полторы тысячи блоков",
        date: "7 марта",
        readingTime: "6 мин",
      },
    ],
  },
  {
    month: "Февраль 2026",
    posts: [
      {
        title: "Каталог без базы данных: registry как источник истины",
        date: "28 февраля",
        readingTime: "8 мин",
      },
      {
        title: "Секции, которые собираются сами",
        date: "21 февраля",
        readingTime: "6 мин",
      },
    ],
  },
  {
    month: "Январь 2026",
    posts: [
      {
        title: "Зачем блоку собственная палитра",
        date: "30 января",
        readingTime: "5 мин",
      },
      {
        title: "Превью, которое не врёт: один файл для витрины и установки",
        date: "16 января",
        readingTime: "7 мин",
      },
    ],
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

/** Архив-таймлайн: статьи по месяцам вдоль оси с оранжевыми точками. */
export function Blog011({
  eyebrow = "Архив",
  title = "Журнал по месяцам",
  groups = DEFAULT_GROUPS,
  background = "",
  accent,
  className,
  style,
}: Blog011Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-011-bg": background,
          "--vibeui-blog-011-page": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="timeline">
            {groups.map((group) => (
              <li key={group.month} data-part="group">
                <h3 data-part="month">{group.month}</h3>
                <ul data-part="posts">
                  {group.posts.map((post) => (
                    <li key={post.title} data-part="post">
                      <a data-part="post-link" href={post.href ?? "#"}>
                        {post.title}
                      </a>
                      <p data-part="post-meta">
                        <time>{post.date}</time>
                        <span>{post.readingTime}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
