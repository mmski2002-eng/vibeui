import type { CSSProperties } from "react"

type Footer009Link = {
  label: string
  href: string
}

type Footer009Column = {
  title: string
  links: Footer009Link[]
}

export type Footer009Props = {
  subscribeTitle?: string
  subscribeNote?: string
  emailPlaceholder?: string
  buttonLabel?: string
  columns?: Footer009Column[]
  social?: Footer009Link[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мега-подвал: строка подписки сверху, под ней карта сайта в пять колонок,
// внизу копирайт и соцссылки. Подписка стоит первой не для красоты — до
// низа страницы доходят самые вовлечённые посетители, и форма здесь
// конвертирует лучше, чем в середине. Каждая колонка — отдельный <nav>
// со своей подписью, иначе скринридер читает тридцать ссылок одной кашей.
const STYLES = `
:where([data-vibeui-block="footer-009"]){
--vibeui-footer-009-bg:transparent;
--vibeui-footer-009-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-009-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-009-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-009-field:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-footer-009-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-009-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-009-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-footer-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-009"]{color-scheme:dark}
[data-vibeui-block="footer-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-009-bg);color:var(--vibeui-footer-009-ink);
font-family:var(--vibeui-footer-009-font);
}
[data-vibeui-block="footer-009"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:2.5rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-009"] [data-part="subscribe"]{
display:grid;gap:1.25rem;align-items:center;
padding-bottom:2rem;margin-bottom:2.25rem;
border-bottom:1px solid var(--vibeui-footer-009-border);
}
[data-vibeui-block="footer-009"] [data-part="subscribe-title"]{
margin:0;font-size:1.25rem;font-weight:720;letter-spacing:-0.02em;line-height:1.2;
}
[data-vibeui-block="footer-009"] [data-part="subscribe-note"]{
margin:0.375rem 0 0;color:var(--vibeui-footer-009-muted);font-size:0.875rem;line-height:1.5;max-width:44ch;
}
[data-vibeui-block="footer-009"] [data-part="form"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="footer-009"] [data-part="email"]{
flex:1 1 12rem;min-width:0;
padding:0.625rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-footer-009-border);
background:var(--vibeui-footer-009-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="footer-009"] [data-part="email"]::placeholder{color:var(--vibeui-footer-009-muted)}
[data-vibeui-block="footer-009"] [data-part="submit"]{
flex:none;cursor:pointer;
padding:0.625rem 1.125rem;border:0;border-radius:0.625rem;
background:var(--vibeui-footer-009-accent-fill);color:var(--vibeui-footer-009-accent-fg);
font:inherit;font-size:0.9375rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="footer-009"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="footer-009"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
padding-bottom:2.25rem;
}
[data-vibeui-block="footer-009"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-009"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-009"] [data-part="column"] a{
color:var(--vibeui-footer-009-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-009"] [data-part="column"] a:hover{color:var(--vibeui-footer-009-accent)}
[data-vibeui-block="footer-009"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-009-border);
}
[data-vibeui-block="footer-009"] [data-part="copyright"]{
margin:0;color:var(--vibeui-footer-009-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-009"] [data-part="social"]{
margin:0 0 0 auto;padding:0;list-style:none;
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="footer-009"] [data-part="social"] a{
display:inline-block;padding:0.3125rem 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-footer-009-border);
color:var(--vibeui-footer-009-muted);text-decoration:none;
font-size:0.8125rem;font-weight:600;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="footer-009"] [data-part="social"] a:hover{
color:var(--vibeui-footer-009-accent);
border-color:color-mix(in oklab,var(--vibeui-footer-009-accent) 45%,var(--vibeui-footer-009-border));
}
[data-vibeui-block="footer-009"] :is(a,button,input):focus-visible{
outline:2px solid var(--vibeui-footer-009-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-009"] [data-part="shell"]{padding:3.5rem 2rem 1.75rem}
[data-vibeui-block="footer-009"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="footer-009"] [data-part="subscribe"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}
}
@container (min-width: 64rem){
[data-vibeui-block="footer-009"] [data-part="columns"]{grid-template-columns:repeat(5,minmax(0,1fr));gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer009Column[] = [
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
    title: "Сценарии",
    links: [
      { label: "Лендинги", href: "#landing" },
      { label: "Интернет-магазины", href: "#store" },
      { label: "Портфолио", href: "#portfolio" },
      { label: "Блоги", href: "#blog-sites" },
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
      { label: "Пресс-кит", href: "#press" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { label: "Справка", href: "#help" },
      { label: "Сообщество", href: "#community" },
      { label: "Статус сервиса", href: "#status" },
      { label: "Контакты", href: "#contacts" },
    ],
  },
]

const DEFAULT_SOCIAL: Footer009Link[] = [
  { label: "Telegram", href: "#telegram" },
  { label: "YouTube", href: "#youtube" },
  { label: "GitHub", href: "#github" },
  { label: "Дзен", href: "#dzen" },
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

/** Мега-подвал: подписка сверху, карта сайта в пять колонок, соцссылки внизу. */
export function Footer009({
  subscribeTitle = "Раз в месяц — письмо о новых секциях",
  subscribeNote = "Без спама и продаж: только новые блоки библиотеки, приёмы вёрстки и разборы чужих лендингов.",
  emailPlaceholder = "Ваша почта",
  buttonLabel = "Подписаться",
  columns = DEFAULT_COLUMNS,
  social = DEFAULT_SOCIAL,
  copyright = "© 2026 ООО «Атлас». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer009Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-footer-009-accent": accent,
          "--vibeui-footer-009-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-footer-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-009" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="subscribe">
            <div>
              <h2 data-part="subscribe-title">{subscribeTitle}</h2>
              <p data-part="subscribe-note">{subscribeNote}</p>
            </div>
            <form data-part="form">
              <input
                data-part="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={emailPlaceholder}
                aria-label={emailPlaceholder}
                required
              />
              <button data-part="submit" type="submit">
                {buttonLabel}
              </button>
            </form>
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
            <ul data-part="social">
              {social.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
