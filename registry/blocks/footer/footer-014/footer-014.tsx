import type { CSSProperties } from "react"

type Footer014Link = {
  label: string
  href: string
}

type Footer014Column = {
  title: string
  links: Footer014Link[]
}

type Footer014Post = {
  title: string
  href: string
  date: string
  dateLabel: string
}

export type Footer014Props = {
  columns?: Footer014Column[]
  blogTitle?: string
  posts?: Footer014Post[]
  blogLinkLabel?: string
  blogHref?: string
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с последними статьями: обычные колонки ссылок плюс широкая
// колонка «В блоге» с тремя свежими материалами и датами. Даты размечены
// <time datetime>: машиночитаемая дата остаётся в разметке, даже когда
// подпись человеку — «12 августа». Свежие даты в подвале работают как
// сигнал живости проекта: заброшенный блог с датой двухлетней давности
// говорит о компании больше, чем любой слоган.
const STYLES = `
:where([data-vibeui-block="footer-014"]){
--vibeui-footer-014-bg:transparent;
--vibeui-footer-014-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-014-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-014-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-014-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-014"]{color-scheme:dark}
[data-vibeui-block="footer-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-014-bg);color:var(--vibeui-footer-014-ink);
font-family:var(--vibeui-footer-014-font);
}
[data-vibeui-block="footer-014"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-014"] [data-part="top"]{
display:grid;gap:2.25rem;padding-bottom:2.25rem;
}
[data-vibeui-block="footer-014"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-014"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-014"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-014"] [data-part="column"] a{
color:var(--vibeui-footer-014-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-014"] [data-part="column"] a:hover{color:var(--vibeui-footer-014-accent)}
[data-vibeui-block="footer-014"] [data-part="blog"] ul{
margin:0;padding:0;list-style:none;display:grid;gap:0.875rem;
}
[data-vibeui-block="footer-014"] [data-part="post"]{
display:grid;gap:0.1875rem;
color:inherit;text-decoration:none;
}
[data-vibeui-block="footer-014"] [data-part="post-date"]{
color:var(--vibeui-footer-014-muted);font-size:0.75rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="footer-014"] [data-part="post-title"]{
font-size:0.9375rem;line-height:1.4;font-weight:560;
transition:color .16s ease;
}
[data-vibeui-block="footer-014"] [data-part="post"]:hover [data-part="post-title"]{
color:var(--vibeui-footer-014-accent);
}
[data-vibeui-block="footer-014"] [data-part="blog-link"]{
display:inline-block;margin-top:1rem;
color:var(--vibeui-footer-014-accent);text-decoration:none;
font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="footer-014"] [data-part="blog-link"]:hover{opacity:0.8}
[data-vibeui-block="footer-014"] [data-part="bottom"]{
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-014-border);
}
[data-vibeui-block="footer-014"] [data-part="copyright"]{
margin:0;color:var(--vibeui-footer-014-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-014"] a:focus-visible{
outline:2px solid var(--vibeui-footer-014-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-014"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-014"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
}
@container (min-width: 64rem){
[data-vibeui-block="footer-014"] [data-part="top"]{grid-template-columns:2fr minmax(18rem,1.1fr);gap:3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer014Column[] = [
  {
    title: "Продукт",
    links: [
      { label: "Возможности", href: "#features" },
      { label: "Тарифы", href: "#pricing" },
      { label: "Интеграции", href: "#integrations" },
      { label: "Что нового", href: "#changelog" },
    ],
  },
  {
    title: "Материалы",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Примеры", href: "#examples" },
      { label: "Вебинары", href: "#webinars" },
      { label: "Справка", href: "#help" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Вакансии", href: "#jobs" },
      { label: "Партнёрам", href: "#partners" },
      { label: "Контакты", href: "#contacts" },
    ],
  },
]

const DEFAULT_POSTS: Footer014Post[] = [
  {
    title: "Как мы ускорили сборку каталога в три раза",
    href: "#post-build",
    date: "2026-08-28",
    dateLabel: "28 августа 2026",
  },
  {
    title: "Дизайн-система без дизайн-системы: приёмы для маленьких команд",
    href: "#post-design",
    date: "2026-08-12",
    dateLabel: "12 августа 2026",
  },
  {
    title: "Почему секции лучше шаблонов: разбор на пяти лендингах",
    href: "#post-sections",
    date: "2026-07-30",
    dateLabel: "30 июля 2026",
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

/** Подвал с колонками ссылок и колонкой последних статей блога с датами. */
export function Footer014({
  columns = DEFAULT_COLUMNS,
  blogTitle = "В блоге",
  posts = DEFAULT_POSTS,
  blogLinkLabel = "Все статьи →",
  blogHref = "#blog",
  copyright = "© 2026 ООО «Абзац». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer014Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-014" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="top">
            <div data-part="columns">
              {columns.map((column) => (
                <nav
                  key={column.title}
                  data-part="column"
                  aria-label={column.title}
                >
                  <p data-part="column-title">{column.title}</p>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
            <nav data-part="blog" aria-label={blogTitle}>
              <p data-part="column-title">{blogTitle}</p>
              <ul>
                {posts.map((post) => (
                  <li key={post.href}>
                    <a data-part="post" href={post.href}>
                      <time data-part="post-date" dateTime={post.date}>
                        {post.dateLabel}
                      </time>
                      <span data-part="post-title">{post.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a data-part="blog-link" href={blogHref}>
                {blogLinkLabel}
              </a>
            </nav>
          </div>
          <div data-part="bottom">
            <p data-part="copyright">{copyright}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
