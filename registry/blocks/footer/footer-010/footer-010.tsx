import type { CSSProperties } from "react"

type Footer010Link = {
  label: string
  href: string
}

type Footer010Column = {
  title: string
  links: Footer010Link[]
}

export type Footer010Props = {
  brand?: string
  tagline?: string
  columns?: Footer010Column[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с огромным полупрозрачным wordmark внизу: колонки ссылок сверху,
// под ними имя бренда во всю ширину блока, целиком, до нижней кромки. Приём
// работает как подпись под письмом — последнее, что видит посетитель,
// это имя. Wordmark набран через цвет-с-прозрачностью от чернил, а не
// отдельным серым: так он остаётся читаемым на любой подложке и в обеих
// темах без второй пары значений.
const STYLES = `
:where([data-vibeui-block="footer-010"]){
--vibeui-footer-010-bg:transparent;
--vibeui-footer-010-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-010-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-010-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-010-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-footer-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-010"]{color-scheme:dark}
[data-vibeui-block="footer-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;overflow:hidden;
background:var(--vibeui-footer-010-bg);color:var(--vibeui-footer-010-ink);
font-family:var(--vibeui-footer-010-font);
}
[data-vibeui-block="footer-010"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem 0;
}
[data-vibeui-block="footer-010"] [data-part="top"]{
display:grid;gap:2rem;padding-bottom:2.25rem;
}
[data-vibeui-block="footer-010"] [data-part="tagline"]{
margin:0;max-width:36ch;color:var(--vibeui-footer-010-muted);
font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="footer-010"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-010"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-010"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-010"] [data-part="column"] a{
color:var(--vibeui-footer-010-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-010"] [data-part="column"] a:hover{color:var(--vibeui-footer-010-accent)}
[data-vibeui-block="footer-010"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-010-border);
color:var(--vibeui-footer-010-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-010"] [data-part="copyright"]{margin:0}
[data-vibeui-block="footer-010"] [data-part="wordmark"]{
display:block;margin:0.5rem 0 0;padding-bottom:0.06em;
font-size:clamp(4rem,19.5cqi,15rem);font-weight:800;line-height:0.9;
letter-spacing:-0.04em;text-transform:uppercase;text-align:center;white-space:nowrap;
color:color-mix(in oklab,var(--vibeui-footer-010-ink) 9%,transparent);
user-select:none;pointer-events:none;
}
[data-vibeui-block="footer-010"] a:focus-visible{
outline:2px solid var(--vibeui-footer-010-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-010"] [data-part="shell"]{padding:4rem 2rem 0}
[data-vibeui-block="footer-010"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
}
@container (min-width: 64rem){
[data-vibeui-block="footer-010"] [data-part="top"]{grid-template-columns:minmax(0,1fr) 2.2fr;gap:4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer010Column[] = [
  {
    title: "Продукт",
    links: [
      { label: "Возможности", href: "#features" },
      { label: "Тарифы", href: "#pricing" },
      { label: "Что нового", href: "#changelog" },
    ],
  },
  {
    title: "Материалы",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Примеры", href: "#examples" },
      { label: "Блог", href: "#blog" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Вакансии", href: "#jobs" },
      { label: "Контакты", href: "#contacts" },
    ],
  },
  {
    title: "Правовое",
    links: [
      { label: "Условия", href: "#terms" },
      { label: "Конфиденциальность", href: "#privacy" },
      { label: "Cookie", href: "#cookies" },
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

/** Подвал с гигантским полупрозрачным wordmark во всю ширину внизу. */
export function Footer010({
  brand = "Формат",
  tagline = "Секции для сайтов, которые собирают своими руками: скопировал файл в проект — и вёрстка готова.",
  columns = DEFAULT_COLUMNS,
  copyright = "© 2026 ООО «Формат». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer010Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-010" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="top">
            <p data-part="tagline">{tagline}</p>
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
            <p data-part="copyright">{copyright}</p>
          </div>
          <span data-part="wordmark" aria-hidden="true">
            {brand}
          </span>
        </div>
      </footer>
    </>
  )
}
