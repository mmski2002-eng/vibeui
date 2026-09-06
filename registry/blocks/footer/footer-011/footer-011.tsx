import type { CSSProperties } from "react"

type Footer011Link = {
  label: string
  href: string
}

type Footer011Column = {
  title: string
  links: Footer011Link[]
}

export type Footer011Props = {
  brand?: string
  columns?: Footer011Column[]
  languageLabel?: string
  languages?: string[]
  currencyLabel?: string
  currencies?: string[]
  themeLabel?: string
  themeOptions?: string[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с переключателями региона: колонки ссылок плюс панель с селектами
// языка и валюты и переключателем темы. Панель собрана в правой колонке —
// там её ищут по привычке из крупных магазинов. Селекты — нативные
// <select>: свои выпадашки ломают клавиатуру и мобильные пикеры ради
// косметики. Переключатель темы декоративный, без клиентского JS: блок
// остаётся серверным компонентом, а логику вешает проект.
const STYLES = `
:where([data-vibeui-block="footer-011"]){
--vibeui-footer-011-bg:transparent;
--vibeui-footer-011-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-011-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-011-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-011-field:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-footer-011-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-footer-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-011"]{color-scheme:dark}
[data-vibeui-block="footer-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-011-bg);color:var(--vibeui-footer-011-ink);
font-family:var(--vibeui-footer-011-font);
}
[data-vibeui-block="footer-011"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-011"] [data-part="top"]{
display:grid;gap:2.25rem;padding-bottom:2.25rem;
}
[data-vibeui-block="footer-011"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-011"] [data-part="column-title"]{
margin:0 0 0.75rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-011"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footer-011"] [data-part="column"] a{
color:var(--vibeui-footer-011-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-011"] [data-part="column"] a:hover{color:var(--vibeui-footer-011-accent)}
[data-vibeui-block="footer-011"] [data-part="prefs"]{
display:grid;gap:1rem;align-content:start;
padding:1.25rem;border:1px solid var(--vibeui-footer-011-border);border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-footer-011-accent) 6%,var(--vibeui-footer-011-field));
}
[data-vibeui-block="footer-011"] [data-part="pref"]{display:grid;gap:0.375rem}
[data-vibeui-block="footer-011"] [data-part="pref-label"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-footer-011-muted);
}
[data-vibeui-block="footer-011"] [data-part="select"]{
appearance:none;width:100%;cursor:pointer;
padding:0.5rem 2.25rem 0.5rem 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-footer-011-border);
background-color:var(--vibeui-footer-011-field);
/* Стрелка двумя градиентами: своей выпадашки нет, а нативная стрелка
   в разных браузерах разная — рисуем одинаковый шеврон сами. */
background-image:linear-gradient(45deg,transparent 50%,var(--vibeui-footer-011-muted) 50%),linear-gradient(135deg,var(--vibeui-footer-011-muted) 50%,transparent 50%);
background-position:right 1.0625rem center,right 0.75rem center;
background-size:0.3125rem 0.3125rem;
background-repeat:no-repeat;
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="footer-011"] [data-part="theme"]{
display:flex;gap:0.25rem;
padding:0.25rem;border:1px solid var(--vibeui-footer-011-border);border-radius:0.75rem;
background:var(--vibeui-footer-011-field);
}
[data-vibeui-block="footer-011"] [data-part="theme"] button{
flex:1 1 0;cursor:pointer;
padding:0.375rem 0.5rem;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-footer-011-muted);
font:inherit;font-size:0.8125rem;font-weight:600;
transition:background .16s ease,color .16s ease;
}
[data-vibeui-block="footer-011"] [data-part="theme"] button:hover{color:var(--vibeui-footer-011-ink)}
[data-vibeui-block="footer-011"] [data-part="theme"] button[aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-footer-011-accent) 14%,var(--vibeui-footer-011-field));
color:var(--vibeui-footer-011-accent);
}
[data-vibeui-block="footer-011"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-011-border);
color:var(--vibeui-footer-011-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-011"] [data-part="copyright"]{margin:0}
[data-vibeui-block="footer-011"] [data-part="brand"]{
margin:0 0 0 auto;font-weight:720;letter-spacing:-0.02em;color:var(--vibeui-footer-011-ink);
}
[data-vibeui-block="footer-011"] :is(a,button,select):focus-visible{
outline:2px solid var(--vibeui-footer-011-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-011"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-011"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
[data-vibeui-block="footer-011"] [data-part="prefs"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
}
@container (min-width: 64rem){
[data-vibeui-block="footer-011"] [data-part="top"]{grid-template-columns:2.2fr minmax(16rem,1fr);gap:3rem}
[data-vibeui-block="footer-011"] [data-part="prefs"]{grid-template-columns:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer011Column[] = [
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
]

const DEFAULT_LANGUAGES = ["Русский", "English", "Deutsch", "Español"]
const DEFAULT_CURRENCIES = ["₽ Рубль", "$ Доллар", "€ Евро"]
const DEFAULT_THEME_OPTIONS = ["Светлая", "Тёмная", "Авто"]

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

/** Подвал с колонками ссылок и панелью переключателей языка, валюты и темы. */
export function Footer011({
  brand = "Компас",
  columns = DEFAULT_COLUMNS,
  languageLabel = "Язык",
  languages = DEFAULT_LANGUAGES,
  currencyLabel = "Валюта",
  currencies = DEFAULT_CURRENCIES,
  themeLabel = "Тема",
  themeOptions = DEFAULT_THEME_OPTIONS,
  copyright = "© 2026 ООО «Компас». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer011Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-011" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-011"
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
            <div data-part="prefs">
              <label data-part="pref">
                <span data-part="pref-label">{languageLabel}</span>
                <select
                  data-part="select"
                  name="language"
                  defaultValue={languages[0]}
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
              <label data-part="pref">
                <span data-part="pref-label">{currencyLabel}</span>
                <select
                  data-part="select"
                  name="currency"
                  defaultValue={currencies[0]}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <div data-part="pref">
                <span data-part="pref-label" id="vibeui-footer-011-theme">
                  {themeLabel}
                </span>
                <div
                  data-part="theme"
                  role="group"
                  aria-labelledby="vibeui-footer-011-theme"
                >
                  {themeOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={index === themeOptions.length - 1}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div data-part="bottom">
            <p data-part="copyright">{copyright}</p>
            <p data-part="brand">{brand}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
