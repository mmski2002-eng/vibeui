import type { CSSProperties } from "react"

type Navbar013Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar013Props = {
  brand?: string
  utilities?: Navbar013Link[]
  sections?: Navbar013Link[]
  subsections?: Navbar013Link[]
  actionLabel?: string
  actionHref?: string
  /** Подпись служебной полосы для скринридера: компонент несёт русскую. */
  utilitiesLabel?: string
  /** Подпись ряда основных разделов для скринридера: компонент несёт русскую. */
  sectionsLabel?: string
  /** Подпись ряда подразделов для скринридера: компонент несёт русскую. */
  subsectionsLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Двухуровневая шапка для сайтов с большим деревом разделов: сверху узкая
// служебная полоса (для кого сайт, вход, язык), снизу основные разделы и
// подразделы текущего. Третий ряд появляется только тогда, когда у раздела
// действительно есть подразделы — пустая полоса выглядит как ошибка вёрстки.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не выкладывает под себя собственную плашку.
const STYLES = `
:where([data-vibeui-block="navbar-013"]){
--vibeui-navbar-013-bg:transparent;
--vibeui-navbar-013-strip:light-dark(oklch(0.97 0.004 245),oklch(0.26 0.014 245));
--vibeui-navbar-013-ink:light-dark(oklch(0.22 0.014 245),oklch(0.94 0.006 245));
--vibeui-navbar-013-muted:light-dark(oklch(0.53 0.014 245),oklch(0.71 0.012 245));
--vibeui-navbar-013-border:light-dark(oklch(0.9 0.006 245),oklch(0.36 0.012 245));
--vibeui-navbar-013-accent:light-dark(oklch(0.45 0.15 250),oklch(0.75 0.13 250));
--vibeui-navbar-013-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 250));
--vibeui-navbar-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-013"]{
display:block;background:var(--vibeui-navbar-013-bg);color:var(--vibeui-navbar-013-ink);
border-bottom:1px solid var(--vibeui-navbar-013-border);
font-family:var(--vibeui-navbar-013-font);
}
[data-vibeui-block="navbar-013"] [data-part="top"]{
background:var(--vibeui-navbar-013-strip);
border-bottom:1px solid var(--vibeui-navbar-013-border);
}
[data-vibeui-block="navbar-013"] [data-part="top-inner"]{
display:flex;align-items:center;justify-content:flex-end;gap:1rem;
max-width:82rem;margin:0 auto;padding:0.375rem 1rem;
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-013"] [data-part="top-inner"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-013"] [data-part="top-inner"] a{
color:var(--vibeui-navbar-013-muted);text-decoration:none;white-space:nowrap;
font-size:0.75rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-013"] [data-part="top-inner"] a:hover{color:var(--vibeui-navbar-013-ink)}
[data-vibeui-block="navbar-013"] [data-part="main"]{
display:flex;align-items:center;gap:1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}
[data-vibeui-block="navbar-013"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:700;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-013"] [data-part="mark"]{
width:1.875rem;height:1.875rem;border-radius:0.375rem;flex:none;
background:var(--vibeui-navbar-013-accent);
mask-image:conic-gradient(from 45deg at 50% 50%,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
mask-size:0.9375rem 0.9375rem;
}
[data-vibeui-block="navbar-013"] [data-part="sections"]{display:none;align-items:center;gap:1.5rem;margin-inline:auto}
[data-vibeui-block="navbar-013"] [data-part="sections"] a{
position:relative;padding:0.25rem 0;
color:var(--vibeui-navbar-013-ink);text-decoration:none;font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-013"] [data-part="sections"] a::after{
content:"";position:absolute;left:0;right:0;bottom:-0.25rem;height:2px;border-radius:2px;
background:var(--vibeui-navbar-013-accent);
transform:scaleX(0);transform-origin:left;
transition:transform .18s ease;
}
[data-vibeui-block="navbar-013"] [data-part="sections"] a:hover::after,
[data-vibeui-block="navbar-013"] [data-part="sections"] a[aria-current="page"]::after{transform:scaleX(1)}
[data-vibeui-block="navbar-013"] [data-part="sections"] a[aria-current="page"]{color:var(--vibeui-navbar-013-accent)}
[data-vibeui-block="navbar-013"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.375rem;padding:0 1.0625rem;margin-left:auto;flex:none;
border-radius:0.5rem;background:var(--vibeui-navbar-013-accent);color:var(--vibeui-navbar-013-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-013"] [data-part="sub"]{
border-top:1px solid var(--vibeui-navbar-013-border);
background:var(--vibeui-navbar-013-bg);
}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"]{
display:flex;align-items:center;gap:1.25rem;
max-width:82rem;margin:0 auto;padding:0.5rem 1rem;
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"] a{
color:var(--vibeui-navbar-013-muted);text-decoration:none;white-space:nowrap;
font-size:0.8125rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"] a:hover{color:var(--vibeui-navbar-013-accent)}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"] a[aria-current="page"]{color:var(--vibeui-navbar-013-ink);font-weight:640}
[data-vibeui-block="navbar-013"] a:focus-visible{outline:2px solid var(--vibeui-navbar-013-accent);outline-offset:3px}
@container (min-width: 52rem){
[data-vibeui-block="navbar-013"] [data-part="top-inner"]{padding-inline:2rem}
[data-vibeui-block="navbar-013"] [data-part="main"]{padding:1rem 2rem}
[data-vibeui-block="navbar-013"] [data-part="sections"]{display:flex}
[data-vibeui-block="navbar-013"] [data-part="action"]{margin-left:0}
[data-vibeui-block="navbar-013"] [data-part="sub-inner"]{padding-inline:2rem;overflow:visible}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_UTILITIES: Navbar013Link[] = [
  { label: "Абитуриентам", href: "#applicants" },
  { label: "Студентам", href: "#students" },
  { label: "Выпускникам", href: "#alumni" },
  { label: "Личный кабинет", href: "#account" },
]

const DEFAULT_SECTIONS: Navbar013Link[] = [
  { label: "Об институте", href: "#about" },
  { label: "Обучение", href: "#education", current: true },
  { label: "Наука", href: "#science" },
  { label: "Партнёрам", href: "#partners" },
]

const DEFAULT_SUBSECTIONS: Navbar013Link[] = [
  { label: "Бакалавриат", href: "#bachelor", current: true },
  { label: "Магистратура", href: "#master" },
  { label: "Аспирантура", href: "#phd" },
  { label: "Дополнительное образование", href: "#extra" },
  { label: "Расписание", href: "#schedule" },
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

/** Двухуровневая шапка: служебная полоса, разделы и подразделы текущего. */
export function Navbar013({
  brand = "Институт связи",
  utilities = DEFAULT_UTILITIES,
  sections = DEFAULT_SECTIONS,
  subsections = DEFAULT_SUBSECTIONS,
  actionLabel = "Подать заявку",
  actionHref = "#apply",
  utilitiesLabel = "Служебные разделы",
  sectionsLabel = "Основные разделы",
  subsectionsLabel = "Подразделы текущего раздела",
  background = "",
  accent,
  className,
  style,
}: Navbar013Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-013" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-013"
        className={className}
        style={palette}
      >
        <div data-part="top">
          <nav data-part="top-inner" aria-label={utilitiesLabel}>
            {utilities.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div data-part="main">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="sections" aria-label={sectionsLabel}>
            {sections.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        {subsections.length > 0 ? (
          <div data-part="sub">
            <nav data-part="sub-inner" aria-label={subsectionsLabel}>
              {subsections.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  )
}
