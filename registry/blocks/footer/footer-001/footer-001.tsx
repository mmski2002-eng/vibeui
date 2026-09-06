import type { CSSProperties } from "react"

type Footer001Link = {
  label: string
  href: string
}

type Footer001Column = {
  title: string
  links: Footer001Link[]
}

export type Footer001Props = {
  brand?: string
  tagline?: string
  columns?: Footer001Column[]
  /** Строка внизу: копирайт, юридическое лицо, номер договора. */
  legal?: string
  /** Ссылки в нижней строке: политика, оферта. */
  legalLinks?: Footer001Link[]
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает подвал собственным query-контейнером: число колонок
// считается от ширины блока, а не окна, поэтому миниатюра каталога показывает
// настоящую раскладку.
//
// Идея блока: подвал лёгкий, а не тёмная плита в конце страницы. Тёмный
// подвал спорит с финальной секцией призыва — вместе они дают два тяжёлых
// пятна подряд, и взгляд теряет главное действие.
//
// Тема берётся из color-scheme окружения через light-dark(): подвал темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="footer-001"]){
--vibeui-footer-001-bg:transparent;
--vibeui-footer-001-ink:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-footer-001-muted:light-dark(oklch(0.52 0 265),oklch(0.69 0 265));
--vibeui-footer-001-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-footer-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.74 0.15 265));
--vibeui-footer-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-001"]{color-scheme:dark}
[data-vibeui-block="footer-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-footer-001-bg);color:var(--vibeui-footer-001-ink);
border-top:1px solid var(--vibeui-footer-001-border);
font-family:var(--vibeui-footer-001-sans);
}
[data-vibeui-block="footer-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:2.75rem 1.5rem 1.5rem;
display:grid;gap:2rem;
}
[data-vibeui-block="footer-001"] [data-part="brand"]{display:flex;flex-direction:column;gap:0.625rem;max-width:26rem}
[data-vibeui-block="footer-001"] [data-part="name"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:1rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="footer-001"] [data-part="mark"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:linear-gradient(140deg,var(--vibeui-footer-001-accent),color-mix(in oklab,var(--vibeui-footer-001-accent) 55%,white));
}
[data-vibeui-block="footer-001"] [data-part="tagline"]{
margin:0;font-size:0.875rem;line-height:1.6;color:var(--vibeui-footer-001-muted);
}
[data-vibeui-block="footer-001"] [data-part="columns"]{display:grid;gap:1.75rem;grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="footer-001"] [data-part="column-title"]{
display:block;margin-bottom:0.625rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-footer-001-muted);
}
[data-vibeui-block="footer-001"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="footer-001"] a{
color:var(--vibeui-footer-001-ink);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-001"] a:hover{color:var(--vibeui-footer-001-accent)}
[data-vibeui-block="footer-001"] a:focus-visible{outline:2px solid var(--vibeui-footer-001-accent);outline-offset:3px;border-radius:0.25rem}
[data-vibeui-block="footer-001"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-001-border);
font-size:0.8125rem;color:var(--vibeui-footer-001-muted);
}
[data-vibeui-block="footer-001"] [data-part="legal-links"]{display:flex;flex-wrap:wrap;gap:1.25rem;margin-left:auto}
[data-vibeui-block="footer-001"] [data-part="legal-links"] a{font-size:0.8125rem;color:var(--vibeui-footer-001-muted)}
@container (min-width: 44rem){
[data-vibeui-block="footer-001"] [data-part="columns"]{grid-template-columns:repeat(3,1fr)}
}
@container (min-width: 60rem){
[data-vibeui-block="footer-001"] [data-part="frame"]{
grid-template-columns:20rem 1fr;gap:4rem;padding:4rem 3rem 1.75rem;
}
[data-vibeui-block="footer-001"] [data-part="bottom"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer001Column[] = [
  {
    title: "Продукт",
    links: [
      { label: "Компоненты", href: "#components" },
      { label: "Блоки", href: "#blocks" },
      { label: "Тарифы", href: "#pricing" },
      { label: "Обновления", href: "#changelog" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Как работает установка", href: "#install" },
      { label: "Частые вопросы", href: "#faq" },
      { label: "Поддержка", href: "#support" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Блог", href: "#blog" },
      { label: "Контакты", href: "#contact" },
    ],
  },
]

const DEFAULT_LEGAL_LINKS: Footer001Link[] = [
  { label: "Политика конфиденциальности", href: "#privacy" },
  { label: "Оферта", href: "#terms" },
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

/**
 * Подвал сайта: колонки ссылок, подпись бренда и нижняя строка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Footer001({
  brand = "Полёт",
  tagline = "Готовые блоки интерфейса для тех, кто собирает сайты вместе с ИИ-агентом.",
  columns = DEFAULT_COLUMNS,
  legal = "© 2026 Студия «Полёт»",
  legalLinks = DEFAULT_LEGAL_LINKS,
  background = "",
  accent,
  className,
  style,
}: Footer001Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-001" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="brand">
            <span data-part="name">
              <span data-part="mark" aria-hidden="true" />
              {brand}
            </span>
            {tagline ? <p data-part="tagline">{tagline}</p> : null}
          </div>
          <div data-part="columns">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <span data-part="column-title">{column.title}</span>
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
          <div data-part="bottom">
            <span>{legal}</span>
            {legalLinks.length ? (
              <div data-part="legal-links">
                {legalLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
