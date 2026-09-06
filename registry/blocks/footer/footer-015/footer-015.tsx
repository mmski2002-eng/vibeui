import type { CSSProperties } from "react"

type Footer015Link = {
  label: string
  href: string
}

type Footer015Column = {
  title: string
  links: Footer015Link[]
}

export type Footer015Props = {
  ctaTitle?: string
  ctaNote?: string
  ctaButtonLabel?: string
  ctaHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  columns?: Footer015Column[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с призывом: сверху плашка с последним CTA, ниже обычные колонки
// ссылок. Плашка стоит именно в подвале не случайно — это последний экран,
// и посетитель, долиставший сюда, уже прочитал аргументы; ему нужна не
// ещё одна выгода, а кнопка. Тёплый тинт плашки замешан из акцента через
// color-mix, поэтому при смене акцента подложка перекрашивается сама.
const STYLES = `
:where([data-vibeui-block="footer-015"]){
--vibeui-footer-015-bg:transparent;
--vibeui-footer-015-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-015-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-015-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-015-panel:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-footer-015-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-015-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-015-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-footer-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-015"]{color-scheme:dark}
[data-vibeui-block="footer-015"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-015-bg);color:var(--vibeui-footer-015-ink);
font-family:var(--vibeui-footer-015-font);
}
[data-vibeui-block="footer-015"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:2.5rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-015"] [data-part="cta"]{
display:grid;gap:1.25rem;align-items:center;
margin-bottom:2.5rem;padding:1.75rem 1.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-footer-015-accent) 24%,var(--vibeui-footer-015-border));
border-radius:1.25rem;
background:color-mix(in oklab,var(--vibeui-footer-015-accent) 9%,var(--vibeui-footer-015-panel));
}
[data-vibeui-block="footer-015"] [data-part="cta-title"]{
margin:0;font-size:clamp(1.375rem,3.6cqi,1.875rem);line-height:1.15;
letter-spacing:-0.02em;font-weight:720;
}
[data-vibeui-block="footer-015"] [data-part="cta-note"]{
margin:0.5rem 0 0;color:var(--vibeui-footer-015-muted);
font-size:0.9375rem;line-height:1.55;max-width:48ch;
}
[data-vibeui-block="footer-015"] [data-part="cta-actions"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
}
[data-vibeui-block="footer-015"] [data-part="cta-button"]{
display:inline-block;
padding:0.6875rem 1.375rem;border-radius:0.75rem;
background:var(--vibeui-footer-015-accent-fill);color:var(--vibeui-footer-015-accent-fg);
text-decoration:none;font-size:0.9375rem;font-weight:680;
transition:filter .16s ease,transform .16s ease;
}
[data-vibeui-block="footer-015"] [data-part="cta-button"]:hover{filter:brightness(1.06);transform:translateY(-1px)}
[data-vibeui-block="footer-015"] [data-part="cta-secondary"]{
color:var(--vibeui-footer-015-accent);text-decoration:none;
font-size:0.9375rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="footer-015"] [data-part="cta-secondary"]:hover{opacity:0.8}
[data-vibeui-block="footer-015"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
padding-bottom:2.25rem;
}
[data-vibeui-block="footer-015"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-015"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-015"] [data-part="column"] a{
color:var(--vibeui-footer-015-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-015"] [data-part="column"] a:hover{color:var(--vibeui-footer-015-accent)}
[data-vibeui-block="footer-015"] [data-part="bottom"]{
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-015-border);
}
[data-vibeui-block="footer-015"] [data-part="copyright"]{
margin:0;color:var(--vibeui-footer-015-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-015"] a:focus-visible{
outline:2px solid var(--vibeui-footer-015-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-015"] [data-part="shell"]{padding:3.5rem 2rem 1.75rem}
[data-vibeui-block="footer-015"] [data-part="cta"]{padding:2.25rem 2rem}
[data-vibeui-block="footer-015"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="footer-015"] [data-part="cta"]{grid-template-columns:minmax(0,1fr) auto;gap:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer015Column[] = [
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
  {
    title: "Правовое",
    links: [
      { label: "Условия", href: "#terms" },
      { label: "Конфиденциальность", href: "#privacy" },
      { label: "Cookie", href: "#cookies" },
      { label: "Оферта", href: "#offer" },
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

/** Подвал с CTA-плашкой над обычными колонками ссылок. */
export function Footer015({
  ctaTitle = "Соберите свой сайт из готовых секций",
  ctaNote = "Выберите блоки в каталоге, отдайте их своему AI-агенту — и получите работающую страницу, а не макет.",
  ctaButtonLabel = "Начать бесплатно",
  ctaHref = "#start",
  ctaSecondaryLabel = "Смотреть каталог",
  ctaSecondaryHref = "#catalog",
  columns = DEFAULT_COLUMNS,
  copyright = "© 2026 ООО «Вектор». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer015Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-footer-015-accent": accent,
          "--vibeui-footer-015-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-footer-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-015" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="cta">
            <div>
              <h2 data-part="cta-title">{ctaTitle}</h2>
              <p data-part="cta-note">{ctaNote}</p>
            </div>
            <div data-part="cta-actions">
              <a data-part="cta-button" href={ctaHref}>
                {ctaButtonLabel}
              </a>
              <a data-part="cta-secondary" href={ctaSecondaryHref}>
                {ctaSecondaryLabel}
              </a>
            </div>
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
