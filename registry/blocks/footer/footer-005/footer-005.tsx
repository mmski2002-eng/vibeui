import type { CSSProperties } from "react"

type Footer005Link = {
  label: string
  href: string
}

type Footer005Group = {
  title: string
  links: Footer005Link[]
}

type Footer005Locale = {
  code: string
  label: string
  href: string
}

export type Footer005Props = {
  brand?: string
  groups?: Footer005Group[]
  locales?: Footer005Locale[]
  currentLocale?: string
  /** Подпись ряда языковых версий для скринридера. */
  localesLabel?: string
  legal?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал-карта сайта: шесть групп ссылок и выбор языка. Каждая группа —
// раскрытый <details>: на телефоне её можно свернуть и не листать карту
// сайта длиной со страницу, а на широкой раскладке заголовок становится
// инертным (pointer-events:none) и стрелка прячется — группы просто стоят
// колонками. Разметка при этом одна и та же, без дублирования узлов.
//
// Тема берётся из color-scheme окружения через light-dark(): подвал темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="footer-005"]){
--vibeui-footer-005-bg:transparent;
--vibeui-footer-005-ink:light-dark(oklch(0.21 0.014 240),oklch(0.94 0.006 240));
--vibeui-footer-005-muted:light-dark(oklch(0.51 0.014 240),oklch(0.71 0.012 240));
--vibeui-footer-005-border:light-dark(oklch(0.9 0.007 240),oklch(0.35 0.014 240));
--vibeui-footer-005-accent:light-dark(oklch(0.47 0.15 240),oklch(0.73 0.13 240));
--vibeui-footer-005-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.17 0.03 240));
--vibeui-footer-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-005"]{
display:block;background:var(--vibeui-footer-005-bg);color:var(--vibeui-footer-005-ink);
border-top:1px solid var(--vibeui-footer-005-border);
font-family:var(--vibeui-footer-005-font);
}
[data-vibeui-block="footer-005"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:2.5rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-005"] [data-part="map"]{display:grid;gap:0}
[data-vibeui-block="footer-005"] [data-part="group"]{border-bottom:1px solid var(--vibeui-footer-005-border)}
[data-vibeui-block="footer-005"] [data-part="group"] summary{
cursor:pointer;list-style:none;position:relative;
padding:0.875rem 1.5rem 0.875rem 0;
font-size:0.8125rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="footer-005"] [data-part="group"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="footer-005"] [data-part="group"] summary::after{
content:"";position:absolute;right:0.25rem;top:1.125rem;width:0.5rem;height:0.5rem;
border-right:2px solid var(--vibeui-footer-005-accent);border-bottom:2px solid var(--vibeui-footer-005-accent);
transform:rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="footer-005"] [data-part="group"][open] summary::after{transform:rotate(-135deg)}
[data-vibeui-block="footer-005"] [data-part="group"] summary:focus-visible{outline:2px solid var(--vibeui-footer-005-accent);outline-offset:-2px}
[data-vibeui-block="footer-005"] [data-part="group"] ul{
margin:0;padding:0 0 1rem;list-style:none;display:grid;gap:0.5rem;
}
[data-vibeui-block="footer-005"] [data-part="group"] a{
color:var(--vibeui-footer-005-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-005"] [data-part="group"] a:hover{color:var(--vibeui-footer-005-accent)}
[data-vibeui-block="footer-005"] [data-part="langs"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
margin-top:1.5rem;
}
[data-vibeui-block="footer-005"] [data-part="lang"]{
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-footer-005-border);
color:var(--vibeui-footer-005-muted);text-decoration:none;
font-size:0.8125rem;font-weight:560;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="footer-005"] [data-part="lang"]:hover{color:var(--vibeui-footer-005-ink);border-color:var(--vibeui-footer-005-accent)}
[data-vibeui-block="footer-005"] [data-part="lang"][aria-current="true"]{
background:var(--vibeui-footer-005-accent);border-color:var(--vibeui-footer-005-accent);color:var(--vibeui-footer-005-accent-fg);
}
[data-vibeui-block="footer-005"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-005-border);
color:var(--vibeui-footer-005-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-005"] [data-part="brand"]{color:var(--vibeui-footer-005-ink);font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="footer-005"] a:focus-visible{outline:2px solid var(--vibeui-footer-005-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="footer-005"] [data-part="shell"]{padding:3.5rem 2rem 1.75rem}
[data-vibeui-block="footer-005"] [data-part="map"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.75rem 2rem}
[data-vibeui-block="footer-005"] [data-part="group"]{border-bottom:0}
[data-vibeui-block="footer-005"] [data-part="group"] summary{pointer-events:none;padding:0 0 0.75rem}
[data-vibeui-block="footer-005"] [data-part="group"] summary::after{display:none}
[data-vibeui-block="footer-005"] [data-part="group"] ul{padding-bottom:0}
}
@container (min-width: 68rem){
[data-vibeui-block="footer-005"] [data-part="map"]{grid-template-columns:repeat(6,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Footer005Group[] = [
  {
    title: "Продукт",
    links: [
      { label: "Обзор", href: "#overview" },
      { label: "Тарифы", href: "#pricing" },
      { label: "Безопасность", href: "#security" },
    ],
  },
  {
    title: "Решения",
    links: [
      { label: "Розница", href: "#retail" },
      { label: "Производство", href: "#industry" },
      { label: "Логистика", href: "#logistics" },
    ],
  },
  {
    title: "Разработчикам",
    links: [
      { label: "Документация", href: "#docs" },
      { label: "Справочник API", href: "#api" },
      { label: "Статус сервисов", href: "#status" },
    ],
  },
  {
    title: "Материалы",
    links: [
      { label: "Блог", href: "#blog" },
      { label: "Истории клиентов", href: "#cases" },
      { label: "Вебинары", href: "#webinars" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Вакансии", href: "#jobs" },
      { label: "Пресс-кит", href: "#press" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { label: "База знаний", href: "#help" },
      { label: "Написать нам", href: "#contact" },
      { label: "Сообщить об ошибке", href: "#bug" },
    ],
  },
]

const DEFAULT_LOCALES: Footer005Locale[] = [
  { code: "RU", label: "Русский", href: "/ru" },
  { code: "EN", label: "English", href: "/en" },
  { code: "DE", label: "Deutsch", href: "/de" },
  { code: "KK", label: "Қазақша", href: "/kk" },
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

/** Подвал-карта сайта: шесть групп и выбор языка; на телефоне группы свёрнуты. */
export function Footer005({
  brand = "Ориентир",
  groups = DEFAULT_GROUPS,
  locales = DEFAULT_LOCALES,
  currentLocale = "RU",
  localesLabel = "Язык сайта",
  legal = "© 2026 ООО «Ориентир». ИНН 7700000000",
  background = "",
  accent,
  className,
  style,
}: Footer005Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-005" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="map">
            {groups.map((group) => (
              <details key={group.title} data-part="group" open>
                <summary>{group.title}</summary>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <nav data-part="langs" aria-label={localesLabel}>
            {locales.map((locale) => (
              <a
                key={locale.code}
                data-part="lang"
                href={locale.href}
                lang={locale.code.toLowerCase()}
                aria-current={
                  locale.code === currentLocale ? "true" : undefined
                }
              >
                {locale.label}
              </a>
            ))}
          </nav>
          <div data-part="bottom">
            <span data-part="brand">{brand}</span>
            <span>{legal}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
