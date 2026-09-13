import type { CSSProperties } from "react"

type Blog009Link = {
  label: string
  href?: string
}

type Blog009Article = {
  title: string
  date: string
  readingTime: string
  href?: string
}

export type Blog009Props = {
  eyebrow?: string
  name?: string
  /** Фото автора. Без него в кружке остаются инициалы. */
  avatarImage?: string
  role?: string
  bio?: string
  links?: Blog009Link[]
  articlesTitle?: string
  articles?: Blog009Article[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточка автора для страницы «кто пишет»: аватар из инициалов на тёплой
// оранжевой заливке, роль, биография и соцссылки слева, три последних
// статьи справа. Список статей нужен здесь же: доверие к автору проверяют
// его текстами, а не фотографией.
const STYLES = `
:where([data-vibeui-block="blog-009"]){
--vibeui-blog-009-bg:transparent;
--vibeui-blog-009-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-blog-009-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-009-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-009-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-blog-009-tint:color-mix(in oklab,var(--vibeui-blog-009-accent) 12%,light-dark(oklch(1 0 0),oklch(0.22 0 0)));
--vibeui-blog-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-blog-009-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-009"]{color-scheme:dark}
[data-vibeui-block="blog-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-009-bg);color:var(--vibeui-blog-009-ink);
font-family:var(--vibeui-blog-009-font);
}
[data-vibeui-block="blog-009"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-009"] [data-part="card"]{
display:grid;gap:2rem;min-inline-size:0;
padding:1.75rem;border:1px solid var(--vibeui-blog-009-border);border-radius:1.25rem;
background:var(--vibeui-blog-009-card);
}
[data-vibeui-block="blog-009"] [data-part="person"]{display:flex;flex-direction:column;gap:1rem;min-width:0}
[data-vibeui-block="blog-009"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-blog-009-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-009"] [data-part="head"]{display:flex;align-items:center;gap:1rem}
[data-vibeui-block="blog-009"] [data-part="avatar"]{
position:relative;width:4rem;height:4rem;flex:none;border-radius:999px;
display:grid;place-items:center;
color:var(--vibeui-blog-009-accent);
font-size:1.25rem;font-weight:750;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="blog-009"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-blog-009-tint);}
[data-vibeui-block="blog-009"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="blog-009"] [data-part="name"]{
margin:0;font-size:clamp(1.25rem,3.5cqi,1.625rem);line-height:1.15;letter-spacing:-0.02em;font-weight:750;
}
[data-vibeui-block="blog-009"] [data-part="role"]{
margin:0.25rem 0 0;color:var(--vibeui-blog-009-muted);font-size:0.875rem;line-height:1.4;
}
[data-vibeui-block="blog-009"] [data-part="bio"]{
margin:0;color:var(--vibeui-blog-009-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="blog-009"] [data-part="links"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="blog-009"] [data-part="social"]{
display:inline-block;padding:0.375rem 0.875rem;border-radius:999px;
border:1px solid var(--vibeui-blog-009-border);
color:var(--vibeui-blog-009-ink);text-decoration:none;
font-size:0.8125rem;font-weight:600;
transition:border-color var(--vibeui-blog-009-dur-2) ease,color var(--vibeui-blog-009-dur-2) ease;
}
[data-vibeui-block="blog-009"] [data-part="social"]:hover{
border-color:color-mix(in oklab,var(--vibeui-blog-009-accent) 50%,var(--vibeui-blog-009-border));
color:var(--vibeui-blog-009-accent);
}
[data-vibeui-block="blog-009"] [data-part="social"]:focus-visible{
outline:2px solid var(--vibeui-blog-009-accent);outline-offset:2px;
}
[data-vibeui-block="blog-009"] [data-part="latest"]{min-width:0}
[data-vibeui-block="blog-009"] [data-part="latest-title"]{
margin:0 0 0.75rem;color:var(--vibeui-blog-009-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-009"] [data-part="articles"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="blog-009"] [data-part="article"]{
padding:0.875rem 0;border-top:1px solid var(--vibeui-blog-009-border);
display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="blog-009"] [data-part="article"]:first-of-type{border-top:0;padding-top:0}
[data-vibeui-block="blog-009"] [data-part="article-link"]{
color:inherit;text-decoration:none;
font-size:0.9375rem;font-weight:650;line-height:1.35;letter-spacing:-0.01em;
transition:color var(--vibeui-blog-009-dur-2) ease;
}
[data-vibeui-block="blog-009"] [data-part="article-link"]:hover{color:var(--vibeui-blog-009-accent)}
[data-vibeui-block="blog-009"] [data-part="article-link"]:focus-visible{
outline:2px solid var(--vibeui-blog-009-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="blog-009"] [data-part="article-meta"]{
display:flex;gap:0.75rem;color:var(--vibeui-blog-009-muted);font-size:0.75rem;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-009"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="blog-009"] [data-part="card"]{padding:2.25rem}
}
@container (min-width: 52rem){
[data-vibeui-block="blog-009"] [data-part="card"]{grid-template-columns:1.4fr 1fr;gap:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Blog009Link[] = [
  { label: "Телеграм" },
  { label: "GitHub" },
  { label: "RSS" },
]

const DEFAULT_ARTICLES: Blog009Article[] = [
  {
    title: "Отдайте вёрстку агенту: как «Copy for AI» переносит блок",
    date: "26 марта 2026",
    readingTime: "9 мин",
  },
  {
    title: "Container queries: блок меряет себя, а не окно",
    date: "20 марта 2026",
    readingTime: "7 мин",
  },
  {
    title: "Один оранжевый на полторы тысячи блоков",
    date: "7 марта 2026",
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Карточка автора: инициалы-аватар, биография, соцссылки и три последних статьи. */
export function Blog009({
  eyebrow = "Автор",
  name = "Вера Славина",
  avatarImage = "",
  role = "Редактор VibeUI. Пишет про интерфейсы, компоненты и сборку сайтов с ИИ",
  bio = "Семь лет верстала продуктовые интерфейсы, теперь объясняет, как собирать их из готовых блоков. Разбирает решения каталога изнутри: почему секция устроена так, а не иначе, и что в ней можно трогать.",
  links = DEFAULT_LINKS,
  articlesTitle = "Последние статьи",
  articles = DEFAULT_ARTICLES,
  background = "",
  accent,
  className,
  style,
}: Blog009Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="person">
              <p data-part="eyebrow">{eyebrow}</p>
              <div data-part="head">
                <span
                  data-part="avatar"
                  data-empty={avatarImage ? undefined : "true"}
                  aria-hidden="true"
                >
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {initials(name)}
                </span>
                <div>
                  <h2 data-part="name">{name}</h2>
                  <p data-part="role">{role}</p>
                </div>
              </div>
              <p data-part="bio">{bio}</p>
              <ul data-part="links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a data-part="social" href={link.href ?? "#"}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="latest">
              <h3 data-part="latest-title">{articlesTitle}</h3>
              <ul data-part="articles">
                {articles.map((article) => (
                  <li key={article.title} data-part="article">
                    <a data-part="article-link" href={article.href ?? "#"}>
                      {article.title}
                    </a>
                    <p data-part="article-meta">
                      <time>{article.date}</time>
                      <span>{article.readingTime}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
