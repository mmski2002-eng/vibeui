import type { CSSProperties, ReactNode } from "react"

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
--vibeui-footer-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-footer-009-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-footer-009-accent-fg:oklch(from var(--vibeui-footer-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-footer-009-dur-2:180ms;
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
transition:filter var(--vibeui-footer-009-dur-2) ease;
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
transition:color var(--vibeui-footer-009-dur-2) ease;
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
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-footer-009-border);
color:var(--vibeui-footer-009-muted);text-decoration:none;
font-size:0.8125rem;font-weight:600;
transition:color var(--vibeui-footer-009-dur-2) ease,border-color var(--vibeui-footer-009-dur-2) ease;
}
[data-vibeui-block="footer-009"] [data-part="social"] a svg{width:1rem;height:1rem;flex:none}
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

// Значок соцсети подбирается по подписи ссылки: список приходит строками, а
// ряд одинаковых текстовых ссылок в подвале читается как обычное меню.
// Telegram, GitHub и YouTube рисуются своими знаками; точный логотип VK,
// Яндекса и Дзена — товарный знак, поэтому там буквенная монограмма.
const SOCIAL_ICONS: Record<string, ReactNode> = {
  telegram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.7 3.3c-.3-.3-.8-.3-1.3-.1L2.9 10.1c-.6.2-.9.7-.9 1.2s.4.9 1 1.1l4.2 1.3 1.6 5c.1.4.4.7.8.8h.3c.3 0 .6-.1.8-.4l2.3-2.4 4.3 3.2c.2.2.5.2.8.2.1 0 .3 0 .4-.1.4-.1.7-.5.8-.9l3-14.5c.1-.5 0-.9-.3-1.2zM9.7 13.9l-.5 3.2-1-3.1 8.4-5.3-6.9 5.2z"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"
      />
    </svg>
  ),
  vk: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        VK
      </text>
    </svg>
  ),
  дзен: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        Д
      </text>
    </svg>
  ),
  хабр: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        Х
      </text>
    </svg>
  ),
}

function socialIcon(label: string): ReactNode {
  const key = label.toLowerCase()
  const known = Object.keys(SOCIAL_ICONS).find((social) => key.includes(social))

  return known ? SOCIAL_ICONS[known] : null
}

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
                      <a href={link.href}>
                        {socialIcon(link.label)}
                        {link.label}
                      </a>
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
                  <a href={link.href}>
                    {socialIcon(link.label)}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
