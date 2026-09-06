import type { CSSProperties } from "react"

type Footer012Link = {
  label: string
  href: string
}

type Footer012Column = {
  title: string
  links: Footer012Link[]
}

export type Footer012Props = {
  statusText?: string
  uptime?: string
  statusLinkLabel?: string
  statusHref?: string
  columns?: Footer012Column[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал со строкой состояния сервиса: плашка «Все системы работают» с
// зелёной точкой стоит первой, над колонками ссылок. В подвал спускаются
// в двух случаях — что-то ищут или что-то сломалось; вторым статус нужен
// сразу, а не мелкой ссылкой в углу. Зелёный здесь семантический: он
// означает «работает», и на другие роли в блоке не тратится.
const STYLES = `
:where([data-vibeui-block="footer-012"]){
--vibeui-footer-012-bg:transparent;
--vibeui-footer-012-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-012-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-012-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-012-field:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-footer-012-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-012-ok:light-dark(oklch(0.55 0.15 150),oklch(0.75 0.17 150));
--vibeui-footer-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-012"]{color-scheme:dark}
[data-vibeui-block="footer-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-012-bg);color:var(--vibeui-footer-012-ink);
font-family:var(--vibeui-footer-012-font);
}
[data-vibeui-block="footer-012"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:2.5rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-012"] [data-part="statusbar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem 1rem;
margin-bottom:2.25rem;padding:0.875rem 1.125rem;
border:1px solid color-mix(in oklab,var(--vibeui-footer-012-ok) 32%,var(--vibeui-footer-012-border));
border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-footer-012-ok) 8%,var(--vibeui-footer-012-field));
}
[data-vibeui-block="footer-012"] [data-part="dot"]{
width:0.5625rem;height:0.5625rem;flex:none;border-radius:999px;
background:var(--vibeui-footer-012-ok);
box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-footer-012-ok) 65%,transparent);
animation:vibeui-footer-012-pulse 2.4s ease-out infinite;
}
@keyframes vibeui-footer-012-pulse{
70%{box-shadow:0 0 0 0.4375rem transparent}
100%{box-shadow:0 0 0 0 transparent}
}
[data-vibeui-block="footer-012"] [data-part="status-text"]{
margin:0;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="footer-012"] [data-part="uptime"]{
margin:0;color:var(--vibeui-footer-012-muted);font-size:0.8125rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="footer-012"] [data-part="status-link"]{
margin-left:auto;
color:var(--vibeui-footer-012-accent);text-decoration:none;
font-size:0.875rem;font-weight:650;white-space:nowrap;
transition:opacity .16s ease;
}
[data-vibeui-block="footer-012"] [data-part="status-link"]:hover{opacity:0.8}
[data-vibeui-block="footer-012"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
padding-bottom:2.25rem;
}
[data-vibeui-block="footer-012"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-012"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-012"] [data-part="column"] a{
color:var(--vibeui-footer-012-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-012"] [data-part="column"] a:hover{color:var(--vibeui-footer-012-accent)}
[data-vibeui-block="footer-012"] [data-part="bottom"]{
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-012-border);
}
[data-vibeui-block="footer-012"] [data-part="copyright"]{
margin:0;color:var(--vibeui-footer-012-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-012"] :is(a):focus-visible{
outline:2px solid var(--vibeui-footer-012-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-012"] [data-part="shell"]{padding:3.5rem 2rem 1.75rem}
[data-vibeui-block="footer-012"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer012Column[] = [
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
    title: "Разработчикам",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "API", href: "#api" },
      { label: "Примеры", href: "#examples" },
      { label: "Журнал изменений", href: "#release-notes" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Блог", href: "#blog" },
      { label: "Вакансии", href: "#jobs" },
      { label: "Контакты", href: "#contacts" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { label: "Справка", href: "#help" },
      { label: "Сообщество", href: "#community" },
      { label: "Сообщить о сбое", href: "#report" },
      { label: "Условия сервиса", href: "#terms" },
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

/** Подвал со строкой состояния сервиса над колонками ссылок. */
export function Footer012({
  statusText = "Все системы работают",
  uptime = "99,98 % за последние 90 дней",
  statusLinkLabel = "Страница статуса →",
  statusHref = "#status",
  columns = DEFAULT_COLUMNS,
  copyright = "© 2026 ООО «Импульс». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer012Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-012" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="statusbar">
            <span data-part="dot" aria-hidden="true" />
            <p data-part="status-text">{statusText}</p>
            <p data-part="uptime">{uptime}</p>
            <a data-part="status-link" href={statusHref}>
              {statusLinkLabel}
            </a>
          </div>
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
          <div data-part="bottom">
            <p data-part="copyright">{copyright}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
