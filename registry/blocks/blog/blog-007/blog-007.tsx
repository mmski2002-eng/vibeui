import type { CSSProperties } from "react"

type Blog007Post = {
  issue: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  href?: string
}

export type Blog007Props = {
  eyebrow?: string
  title?: string
  /** Подпись рядом с номером на обложке: «Выпуск». */
  issueLabel?: string
  posts?: Blog007Post[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточки выпусков с обложками из фирменного оранжевого градиента.
// Вместо иллюстраций — крупный номер выпуска: сериальность видна сразу,
// а к публикации не нужен дизайнер. Номер вдавлен в заливку полупрозрачной
// тёмной краской, поэтому обложки различаются, оставаясь одной системой.
const STYLES = `
:where([data-vibeui-block="blog-007"]){
--vibeui-blog-007-bg:transparent;
--vibeui-blog-007-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-blog-007-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-007-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-007-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-007-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-blog-007-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-blog-007-fill-ink:oklch(0.15 0.02 39.8);
--vibeui-blog-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-007"]{color-scheme:dark}
[data-vibeui-block="blog-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-007-bg);color:var(--vibeui-blog-007-ink);
font-family:var(--vibeui-blog-007-font);
}
[data-vibeui-block="blog-007"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-007"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-007-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-007"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-007"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="blog-007"] [data-part="card"]{
position:relative;min-inline-size:0;
display:flex;flex-direction:column;
border:1px solid var(--vibeui-blog-007-border);border-radius:1.125rem;overflow:hidden;
background:var(--vibeui-blog-007-card);
transition:border-color .18s ease,transform .18s ease;
}
[data-vibeui-block="blog-007"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-blog-007-accent) 45%,var(--vibeui-blog-007-border));
transform:translateY(-2px);
}
[data-vibeui-block="blog-007"] [data-part="card"]:focus-within{
outline:2px solid var(--vibeui-blog-007-accent);outline-offset:2px;
}
[data-vibeui-block="blog-007"] [data-part="cover"]{
display:flex;align-items:flex-end;justify-content:space-between;gap:0.75rem;
aspect-ratio:16/9;padding:1rem 1.25rem;
background:linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-blog-007-fill) 72%,oklch(1 0 0)) 0%,
var(--vibeui-blog-007-fill) 55%,
color-mix(in oklab,var(--vibeui-blog-007-fill) 74%,oklch(0.15 0.02 39.8)) 100%);
color:var(--vibeui-blog-007-fill-ink);
}
[data-vibeui-block="blog-007"] [data-part="issue"]{
font-size:clamp(3rem,14cqi,4.75rem);line-height:0.85;font-weight:800;letter-spacing:-0.04em;
opacity:0.34;
}
[data-vibeui-block="blog-007"] [data-part="issue-label"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
opacity:0.72;
}
[data-vibeui-block="blog-007"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.5rem;flex:1 1 auto;padding:1.25rem;
}
[data-vibeui-block="blog-007"] [data-part="post-title"]{
margin:0;font-size:1.125rem;line-height:1.3;letter-spacing:-0.01em;font-weight:700;
}
[data-vibeui-block="blog-007"] [data-part="link"]{
color:inherit;text-decoration:none;outline:none;
}
/* Ссылка растянута на карточку: в списке ссылок читается заголовок,
   а кликается любое место. */
[data-vibeui-block="blog-007"] [data-part="link"]::after{
content:"";position:absolute;inset:0;
}
[data-vibeui-block="blog-007"] [data-part="excerpt"]{
margin:0;flex:1 1 auto;color:var(--vibeui-blog-007-muted);
font-size:0.875rem;line-height:1.55;
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;
}
[data-vibeui-block="blog-007"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;
margin-top:0.5rem;padding-top:0.75rem;border-top:1px solid var(--vibeui-blog-007-border);
color:var(--vibeui-blog-007-muted);font-size:0.75rem;font-weight:600;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-007"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="blog-007"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="blog-007"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POSTS: Blog007Post[] = [
  {
    issue: "№12",
    title: "Секции, которые собираются сами",
    excerpt:
      "Как каталог отдаёт агенту не картинку, а готовый файл: палитра, раскладка и инструкция в одном месте.",
    date: "21 февраля 2026",
    readingTime: "6 мин",
  },
  {
    issue: "№13",
    title: "Один акцент на всю библиотеку",
    excerpt:
      "Почему бренд держится на одном оранжевом и десяти нейтралях — и что это даёт полутора тысячам блоков.",
    date: "7 марта 2026",
    readingTime: "8 мин",
  },
  {
    issue: "№14",
    title: "Блок без зависимостей",
    excerpt:
      "Что должно лежать в одном файле, чтобы компонент пережил переезд в любой чужой проект без правок.",
    date: "20 марта 2026",
    readingTime: "7 мин",
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

/** Сетка выпусков журнала: обложка — оранжевый градиент с номером выпуска. */
export function Blog007({
  eyebrow = "Журнал VibeUI",
  title = "Выпуски о сборке сайтов",
  issueLabel = "Выпуск",
  posts = DEFAULT_POSTS,
  background = "",
  accent,
  className,
  style,
}: Blog007Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-007-accent": accent, "--vibeui-blog-007-fill": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="blog-007" className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {posts.map((post) => (
              <article key={post.issue} data-part="card">
                <div data-part="cover" aria-hidden="true">
                  <span data-part="issue">{post.issue}</span>
                  <span data-part="issue-label">{issueLabel}</span>
                </div>
                <div data-part="body">
                  <h3 data-part="post-title">
                    <a data-part="link" href={post.href ?? "#"}>
                      {post.title}
                    </a>
                  </h3>
                  <p data-part="excerpt">{post.excerpt}</p>
                  <p data-part="meta">
                    <span>{post.issue}</span>
                    <time>{post.date}</time>
                    <span>{post.readingTime}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
