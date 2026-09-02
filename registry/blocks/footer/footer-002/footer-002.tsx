import type { CSSProperties } from "react"

type Footer002Link = {
  label: string
  href: string
}

type Footer002Column = {
  title: string
  links: Footer002Link[]
}

export type Footer002Props = {
  brand?: string
  tagline?: string
  columns?: Footer002Column[]
  legal?: string
  status?: string
  /** Пусто — остаётся собственная тёмная подложка блока. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Тёмный подвал в четыре колонки ссылок. Каждая колонка — отдельный <nav>
// со своей подписью: иначе скринридер читает двадцать ссылок подряд одной
// кашей. Строка состояния сервиса стоит в нижнем ряду с живой точкой —
// в подвале её ищут те, у кого что-то не работает.
//
// Палитра намеренно одноцветная: тёмная плита — это и есть дизайн блока,
// светлого варианта у него нет, поэтому light-dark() здесь не применяется.
const STYLES = `
:where([data-vibeui-block="footer-002"]){
--vibeui-footer-002-bg:oklch(0.19 0.016 265);
--vibeui-footer-002-ink:oklch(0.97 0.004 265);
--vibeui-footer-002-muted:oklch(0.72 0.012 265);
--vibeui-footer-002-border:oklch(0.3 0.018 265);
--vibeui-footer-002-accent:oklch(0.74 0.15 155);
--vibeui-footer-002-accent-fg:oklch(0.2 0.04 155);
--vibeui-footer-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-002"]{
display:block;background:var(--vibeui-footer-002-bg);color:var(--vibeui-footer-002-ink);
font-family:var(--vibeui-footer-002-font);
}
[data-vibeui-block="footer-002"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-002"] [data-part="top"]{
display:grid;gap:2rem;padding-bottom:2.5rem;
}
[data-vibeui-block="footer-002"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;
color:inherit;text-decoration:none;font-size:1.125rem;font-weight:720;letter-spacing:-0.03em;
}
[data-vibeui-block="footer-002"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;border-radius:0.5625rem;
background:var(--vibeui-footer-002-accent);
mask-image:radial-gradient(circle at 30% 30%,transparent 26%,black 27%);
}
[data-vibeui-block="footer-002"] [data-part="tagline"]{
margin:0.75rem 0 0;max-width:34ch;
color:var(--vibeui-footer-002-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="footer-002"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-002"] [data-part="column-title"]{
margin:0 0 0.75rem;color:var(--vibeui-footer-002-ink);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-002"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-002"] [data-part="column"] a{
color:var(--vibeui-footer-002-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-002"] [data-part="column"] a:hover{color:var(--vibeui-footer-002-accent)}
[data-vibeui-block="footer-002"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-002-border);
color:var(--vibeui-footer-002-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-002"] [data-part="legal"]{margin:0}
[data-vibeui-block="footer-002"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin-left:auto;
color:var(--vibeui-footer-002-muted);text-decoration:none;
transition:color .16s ease;
}
[data-vibeui-block="footer-002"] [data-part="status"]:hover{color:var(--vibeui-footer-002-ink)}
[data-vibeui-block="footer-002"] [data-part="pulse"]{
width:0.5rem;height:0.5rem;border-radius:999px;flex:none;
background:var(--vibeui-footer-002-accent);
box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-footer-002-accent) 70%,transparent);
animation:vibeui-footer-002-pulse 2.4s ease-out infinite;
}
@keyframes vibeui-footer-002-pulse{
70%{box-shadow:0 0 0 0.5rem transparent}
100%{box-shadow:0 0 0 0 transparent}
}
[data-vibeui-block="footer-002"] a:focus-visible{outline:2px solid var(--vibeui-footer-002-accent);outline-offset:3px}
@container (min-width: 44rem){
[data-vibeui-block="footer-002"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-002"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
}
@container (min-width: 64rem){
[data-vibeui-block="footer-002"] [data-part="top"]{grid-template-columns:minmax(0,1fr) 2.4fr;gap:4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer002Column[] = [
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
    title: "Решения",
    links: [
      { label: "Для маркетинга", href: "#marketing" },
      { label: "Для продукта", href: "#product" },
      { label: "Для агентств", href: "#agency" },
      { label: "Для образования", href: "#education" },
    ],
  },
  {
    title: "Материалы",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Примеры", href: "#examples" },
      { label: "Блог", href: "#blog" },
      { label: "Вебинары", href: "#webinars" },
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

/** Тёмный подвал в четыре колонки: каждая группа ссылок — отдельный nav. */
export function Footer002({
  brand = "Контур",
  tagline = "Библиотека секций для сайтов, которые собирают своими руками. Копируется в проект одним файлом и не тянет зависимостей.",
  columns = DEFAULT_COLUMNS,
  legal = "© 2026 ООО «Контур». Все права защищены.",
  status = "Все системы работают",
  background = "",
  accent,
  className,
  style,
}: Footer002Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-002-accent": accent } : null),
    ...(background ? { "--vibeui-footer-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-002" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="top">
            <div>
              <a data-part="brand" href="#top">
                <span data-part="mark" aria-hidden="true" />
                {brand}
              </a>
              <p data-part="tagline">{tagline}</p>
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
          </div>
          <div data-part="bottom">
            <p data-part="legal">{legal}</p>
            <a data-part="status" href="#status">
              <span data-part="pulse" aria-hidden="true" />
              {status}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
