import type { CSSProperties } from "react"

export type Blog001Post = {
  title: string
  excerpt: string
  topic: string
  date: string
  readingTime: string
  author: string
  href?: string
  hue?: number
}

export type Blog001Props = {
  eyebrow?: string
  title?: string
  description?: string
  posts?: Blog001Post[]
  moreLabel?: string
  moreHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: лента статей, в которой карточка обещает ровно то, что внутри.
// Обложка нарисована градиентом от оттенка статьи, а не картинкой: блок
// остаётся одним файлом без ассетов, а редакция не обязана рисовать баннер
// к каждой заметке. Оттенок берётся из имени рубрики — одинаковые рубрики
// красятся одинаково сами собой, без таблицы соответствий.
//
// Ссылка растянута псевдоэлементом на всю карточку: кликается любое место,
// но в разметке остаётся одна ссылка с осмысленным текстом — заголовком.
// Дата размечена <time>, чтобы её понимали агрегаторы и поиск.
const STYLES = `
:where([data-vibeui-block="blog-001"]){
--vibeui-blog-001-bg:oklch(0.99 0.002 265);
--vibeui-blog-001-card:oklch(1 0 0);
--vibeui-blog-001-fg:oklch(0.2 0.014 265);
--vibeui-blog-001-muted:oklch(0.52 0.014 265);
--vibeui-blog-001-border:oklch(0.91 0.006 265);
--vibeui-blog-001-accent:oklch(0.52 0.17 262);
--vibeui-blog-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="blog-001"]{
background:var(--vibeui-blog-001-bg);color:var(--vibeui-blog-001-fg);
font-family:var(--vibeui-blog-001-sans);
}
[data-vibeui-block="blog-001"] *{box-sizing:border-box}
[data-vibeui-block="blog-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.75rem;
}
[data-vibeui-block="blog-001"] [data-part="intro"]{display:grid;gap:0.5rem}
[data-vibeui-block="blog-001"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-blog-001-accent);
}
[data-vibeui-block="blog-001"] h2{
margin:0;max-width:20ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.375rem);line-height:1.12;
}
[data-vibeui-block="blog-001"] [data-part="lede"]{
margin:0;max-width:52ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-blog-001-muted);
}
[data-vibeui-block="blog-001"] [data-part="grid"]{display:grid;gap:1.125rem}
[data-vibeui-block="blog-001"] article{
position:relative;display:grid;gap:0;overflow:hidden;
border:1px solid var(--vibeui-blog-001-border);border-radius:1.125rem;
background:var(--vibeui-blog-001-card);
transition:border-color .16s ease,transform .16s ease;
}
[data-vibeui-block="blog-001"] article:hover{
transform:translateY(-2px);
border-color:color-mix(in oklab,var(--vibeui-blog-001-accent) 40%,var(--vibeui-blog-001-border));
}
/* Обложка — градиент от оттенка рубрики: ноль ассетов, ноль баннеров. */
[data-vibeui-block="blog-001"] [data-part="cover"]{
aspect-ratio:16 / 9;position:relative;overflow:hidden;
}
[data-vibeui-block="blog-001"] [data-part="cover"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(120% 100% at 15% 15%,oklch(1 0 0 / 34%),transparent 60%);
}
[data-vibeui-block="blog-001"] [data-part="body"]{display:grid;gap:0.5rem;padding:1rem 1.125rem 1.125rem}
[data-vibeui-block="blog-001"] [data-part="topic"]{
justify-self:start;padding:0.125rem 0.5rem;border-radius:9999px;
border:1px solid var(--vibeui-blog-001-border);
font-size:0.6875rem;font-weight:620;color:var(--vibeui-blog-001-muted);
}
[data-vibeui-block="blog-001"] h3{margin:0;font-size:1.0625rem;line-height:1.3;font-weight:660;letter-spacing:-0.01em}
/* Ссылка растянута на карточку: кликается всё, а текст ссылки — заголовок. */
[data-vibeui-block="blog-001"] h3 a{color:inherit;text-decoration:none}
[data-vibeui-block="blog-001"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="blog-001"] h3 a:focus-visible{outline:none}
[data-vibeui-block="blog-001"] article:focus-within{outline:2px solid var(--vibeui-blog-001-accent);outline-offset:2px}
[data-vibeui-block="blog-001"] [data-part="excerpt"]{
margin:0;font-size:0.875rem;line-height:1.6;color:var(--vibeui-blog-001-muted);
display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="blog-001"] [data-part="meta"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;margin-top:0.125rem;
font-size:0.75rem;color:var(--vibeui-blog-001-muted);
}
[data-vibeui-block="blog-001"] [data-part="sep"]{opacity:.5}
[data-vibeui-block="blog-001"] [data-part="more"]{
justify-self:start;display:inline-flex;align-items:center;gap:0.4375rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;text-decoration:none;
border:1px solid var(--vibeui-blog-001-border);color:inherit;
font-size:0.875rem;font-weight:640;
}
[data-vibeui-block="blog-001"] [data-part="more"]:hover{border-color:var(--vibeui-blog-001-accent);color:var(--vibeui-blog-001-accent)}
[data-vibeui-block="blog-001"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-blog-001-accent);outline-offset:2px}
@container (min-width: 40rem){
[data-vibeui-block="blog-001"] [data-part="frame"]{padding:3.75rem 2rem}
[data-vibeui-block="blog-001"] [data-part="grid"]{grid-template-columns:1fr 1fr}
}
@container (min-width: 64rem){
[data-vibeui-block="blog-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POSTS: Blog001Post[] = [
  {
    title: "Почему мы отказались от библиотеки иконок",
    excerpt:
      "Двести килобайт ради восьми иконок — плохая сделка. Рассказываем, как перешли на инлайновые SVG и что при этом сломалось.",
    topic: "Разработка",
    date: "12 марта 2025",
    readingTime: "7 мин",
    author: "Аня Соколова",
  },
  {
    title: "Контейнерные запросы вместо брейкпоинтов",
    excerpt:
      "Компонент должен знать свою ширину, а не ширину окна. Разбираем, как это меняет вёрстку карточек и что делать со старыми медиазапросами.",
    topic: "Вёрстка",
    date: "4 марта 2025",
    readingTime: "11 мин",
    author: "Кирилл Дёмин",
  },
  {
    title: "Форма, которую заполняют до конца",
    excerpt:
      "Семь полей вместо восемнадцати, понятные ошибки и ни одной звёздочки. Что мы поменяли в заявке и как это отразилось на отказах.",
    topic: "Продукт",
    date: "26 февраля 2025",
    readingTime: "6 мин",
    author: "Марина Лебедева",
  },
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

/**
 * Лента статей карточками с градиентной обложкой от оттенка рубрики.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Blog001({
  eyebrow = "Журнал",
  title = "Как мы делаем интерфейсы",
  description = "Разборы решений, ошибок и переделок. Пишем только о том, что уже стоит в продакшене.",
  posts = DEFAULT_POSTS,
  moreLabel = "Все статьи",
  moreHref = "#",
  accent,
  className,
  style,
}: Blog001Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header data-part="intro">
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </header>

          <div data-part="grid">
            {posts.map((post) => {
              const tone = post.hue ?? hue(post.topic)
              return (
                <article key={post.title}>
                  <div
                    data-part="cover"
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.72 0.16 ${tone}), oklch(0.5 0.19 ${tone + 40}))`,
                    }}
                  />
                  <div data-part="body">
                    <span data-part="topic">{post.topic}</span>
                    <h3>
                      <a href={post.href ?? "#"}>{post.title}</a>
                    </h3>
                    <p data-part="excerpt">{post.excerpt}</p>
                    <p data-part="meta">
                      <span>{post.author}</span>
                      <span data-part="sep">·</span>
                      <time>{post.date}</time>
                      <span data-part="sep">·</span>
                      <span>{post.readingTime}</span>
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <a href={moreHref} data-part="more">
            {moreLabel}
          </a>
        </div>
      </section>
    </>
  )
}
