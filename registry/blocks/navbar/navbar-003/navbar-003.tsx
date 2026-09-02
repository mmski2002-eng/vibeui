import type { CSSProperties } from "react"

type Navbar003Item = {
  label: string
  href: string
  hint: string
}

type Navbar003Section = {
  label: string
  items: Navbar003Item[]
}

export type Navbar003Props = {
  brand?: string
  sections?: Navbar003Section[]
  plainLabel?: string
  plainHref?: string
  actionLabel?: string
  actionHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка с выпадающими разделами без JS: панель раскрывается по :hover и по
// :focus-within, поэтому она одинаково доступна мышью и с клавиатуры —
// табуляция по ссылкам внутри панели держит её открытой. Каждый пункт несёт
// поясняющую строку: разделы верхнего уровня редко объясняют сами себя.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-003"]){
--vibeui-navbar-003-bg:transparent;
--vibeui-navbar-003-ink:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-navbar-003-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-navbar-003-border:light-dark(oklch(0.91 0.005 265),oklch(0.34 0.011 265));
--vibeui-navbar-003-panel:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.014 265));
--vibeui-navbar-003-accent:light-dark(oklch(0.53 0.2 292),oklch(0.74 0.15 292));
--vibeui-navbar-003-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 292));
--vibeui-navbar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-003"]{
display:block;background:var(--vibeui-navbar-003-bg);color:var(--vibeui-navbar-003-ink);
border-bottom:1px solid var(--vibeui-navbar-003-border);
font-family:var(--vibeui-navbar-003-font);
}
[data-vibeui-block="navbar-003"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:80rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-003"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-003"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:0.5rem;
background:conic-gradient(from 210deg,var(--vibeui-navbar-003-accent),color-mix(in oklab,var(--vibeui-navbar-003-accent) 40%,white),var(--vibeui-navbar-003-accent));
}
[data-vibeui-block="navbar-003"] [data-part="menu"]{
display:none;align-items:center;gap:0.125rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="navbar-003"] [data-part="section"]{position:relative}
[data-vibeui-block="navbar-003"] [data-part="trigger"]{
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;font-weight:520;color:var(--vibeui-navbar-003-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-003"] [data-part="trigger"]::after{
content:"";width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:translateY(-1px) rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="navbar-003"] [data-part="section"]:hover [data-part="trigger"],
[data-vibeui-block="navbar-003"] [data-part="section"]:focus-within [data-part="trigger"]{
color:var(--vibeui-navbar-003-ink);background:color-mix(in oklab,var(--vibeui-navbar-003-border) 45%,transparent);
}
[data-vibeui-block="navbar-003"] [data-part="section"]:hover [data-part="trigger"]::after,
[data-vibeui-block="navbar-003"] [data-part="section"]:focus-within [data-part="trigger"]::after{transform:translateY(1px) rotate(225deg)}
[data-vibeui-block="navbar-003"] [data-part="panel"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:30;
width:min(24rem,80cqi);padding:0.5rem;
border:1px solid var(--vibeui-navbar-003-border);border-radius:0.875rem;
background:var(--vibeui-navbar-003-panel);
box-shadow:0 26px 60px -32px light-dark(oklch(0.2 0.03 265 / 55%),oklch(0 0 0 / 65%));
opacity:0;visibility:hidden;transform:translateY(-0.375rem);
transition:opacity .18s ease,transform .18s ease,visibility .18s;
}
[data-vibeui-block="navbar-003"] [data-part="section"]:hover [data-part="panel"],
[data-vibeui-block="navbar-003"] [data-part="section"]:focus-within [data-part="panel"]{
opacity:1;visibility:visible;transform:none;
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a{
display:block;padding:0.5rem 0.625rem;border-radius:0.625rem;
color:var(--vibeui-navbar-003-ink);text-decoration:none;
font-size:0.875rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-003-accent) 9%,transparent)}
[data-vibeui-block="navbar-003"] [data-part="hint"]{
display:block;margin-top:0.125rem;color:var(--vibeui-navbar-003-muted);
font-size:0.8125rem;font-weight:420;line-height:1.35;
}
[data-vibeui-block="navbar-003"] [data-part="plain"]{
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-003-muted);text-decoration:none;font-size:0.875rem;font-weight:520;
}
[data-vibeui-block="navbar-003"] [data-part="plain"]:hover{color:var(--vibeui-navbar-003-ink)}
[data-vibeui-block="navbar-003"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;margin-left:auto;flex:none;
border-radius:0.625rem;background:var(--vibeui-navbar-003-accent);color:var(--vibeui-navbar-003-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;
}
[data-vibeui-block="navbar-003"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-003-accent) 88%,black)}
[data-vibeui-block="navbar-003"] a:focus-visible,
[data-vibeui-block="navbar-003"] button:focus-visible{outline:2px solid var(--vibeui-navbar-003-accent);outline-offset:2px}
@container (min-width: 50rem){
[data-vibeui-block="navbar-003"] [data-part="shell"]{padding:0.75rem 2rem;gap:1.25rem}
[data-vibeui-block="navbar-003"] [data-part="menu"]{display:flex}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Navbar003Section[] = [
  {
    label: "Продукт",
    items: [
      {
        label: "Конструктор страниц",
        href: "#builder",
        hint: "Собирайте секции из готовых блоков",
      },
      {
        label: "Дизайн-система",
        href: "#tokens",
        hint: "Токены, темы и типографика в одном месте",
      },
      {
        label: "Интеграции",
        href: "#integrations",
        hint: "CRM, аналитика и платежи из коробки",
      },
    ],
  },
  {
    label: "Решения",
    items: [
      {
        label: "Для маркетинга",
        href: "#marketing",
        hint: "Лендинги и посадочные под кампании",
      },
      {
        label: "Для продуктовых команд",
        href: "#product",
        hint: "Общая библиотека компонентов",
      },
      {
        label: "Для агентств",
        href: "#agency",
        hint: "Несколько брендов в одном аккаунте",
      },
    ],
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/** Шапка с выпадающими разделами: панель держится на :hover и :focus-within. */
export function Navbar003({
  brand = "Слой",
  sections = DEFAULT_SECTIONS,
  plainLabel = "Тарифы",
  plainHref = "#pricing",
  actionLabel = "Попробовать",
  actionHref = "#start",
  navLabel = "Основная навигация",
  background = "",
  accent,
  className,
  style,
}: Navbar003Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-003" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav aria-label={navLabel}>
            <ul data-part="menu">
              {sections.map((section) => (
                <li key={section.label} data-part="section">
                  <button data-part="trigger" type="button">
                    {section.label}
                  </button>
                  <div data-part="panel">
                    {section.items.map((item) => (
                      <a key={item.href} href={item.href}>
                        {item.label}
                        <span data-part="hint">{item.hint}</span>
                      </a>
                    ))}
                  </div>
                </li>
              ))}
              <li>
                <a data-part="plain" href={plainHref}>
                  {plainLabel}
                </a>
              </li>
            </ul>
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </header>
    </>
  )
}
