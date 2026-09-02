import type { CSSProperties } from "react"

type Navbar001Link = {
  label: string
  href: string
}

export type Navbar001Props = {
  brand?: string
  links?: Navbar001Link[]
  actionLabel?: string
  actionHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Подпись кнопки меню для скринридера. */
  menuLabel?: string
  /** Идентификатор мобильного меню: связывает кнопку и панель. */
  id?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает шапку собственным query-контейнером: раскладка
// считается от ширины блока, а не от ширины окна, поэтому миниатюра каталога
// показывает десктопный вариант, а не мобильный.
//
// Мобильное меню — HTML popover: кнопка объявляет цель через popovertarget,
// браузер сам даёт закрытие по Esc и клику мимо. Ни строки JS, ни состояния.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-001"]){
--vibeui-navbar-001-bg:transparent;
--vibeui-navbar-001-ink:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-navbar-001-muted:light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265));
--vibeui-navbar-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-navbar-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.72 0.16 265));
--vibeui-navbar-001-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 265));
--vibeui-navbar-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-001"]{
background:var(--vibeui-navbar-001-bg);
backdrop-filter:saturate(1.4) blur(10px);
border-bottom:1px solid var(--vibeui-navbar-001-border);
color:var(--vibeui-navbar-001-ink);
font-family:var(--vibeui-navbar-001-sans);
}
[data-vibeui-block="navbar-001"] [data-part="frame"]{
display:flex;align-items:center;gap:1rem;
max-width:80rem;margin:0 auto;padding:0.875rem 1.25rem;
}
[data-vibeui-block="navbar-001"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;
font-size:1rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="navbar-001"] [data-part="mark"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:linear-gradient(140deg,var(--vibeui-navbar-001-accent),color-mix(in oklab,var(--vibeui-navbar-001-accent) 55%,white));
}
[data-vibeui-block="navbar-001"] [data-part="links"]{display:none;align-items:center;gap:0.25rem;flex:1 1 auto}
[data-vibeui-block="navbar-001"] [data-part="links"] a{
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-001-muted);text-decoration:none;
font-size:0.875rem;font-weight:500;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-001"] [data-part="links"] a:hover{color:var(--vibeui-navbar-001-ink);background:color-mix(in oklab,var(--vibeui-navbar-001-border) 45%,transparent)}
[data-vibeui-block="navbar-001"] [data-part="action"]{
display:none;align-items:center;height:2.25rem;padding:0 1rem;flex:none;
border-radius:0.5rem;
background:var(--vibeui-navbar-001-accent);color:var(--vibeui-navbar-001-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-001"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-001-accent) 88%,black)}
[data-vibeui-block="navbar-001"] [data-part="burger"]{
appearance:none;cursor:pointer;margin-left:auto;flex:none;
display:inline-flex;flex-direction:column;justify-content:center;gap:0.25rem;
width:2.25rem;height:2.25rem;padding:0 0.5rem;
border:1px solid var(--vibeui-navbar-001-border);border-radius:0.5rem;
background:transparent;
}
[data-vibeui-block="navbar-001"] [data-part="burger"] span{display:block;height:1.5px;background:var(--vibeui-navbar-001-ink)}
[data-vibeui-block="navbar-001"] a:focus-visible,
[data-vibeui-block="navbar-001"] button:focus-visible{outline:2px solid var(--vibeui-navbar-001-accent);outline-offset:2px}
/* Мобильная панель живёт в верхнем слое, поэтому стилизуется по атрибуту. */
[data-vibeui-navbar-001-menu]{
position:fixed;inset:auto 0.75rem 0.75rem;margin:0;
padding:0.625rem;
border:1px solid var(--vibeui-navbar-001-border,light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265)));
border-radius:1rem;
background:light-dark(oklch(0.99 0.002 265),oklch(0.25 0.014 265));
font-family:var(--vibeui-navbar-001-sans,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -28px light-dark(oklch(0.2 0.03 265 / 50%),oklch(0 0 0 / 70%));
opacity:0;transform:translateY(0.75rem);
transition:opacity .2s ease,transform .2s ease,display .2s allow-discrete,overlay .2s allow-discrete;
}
[data-vibeui-navbar-001-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-navbar-001-menu]:popover-open{opacity:0;transform:translateY(0.75rem)}}
[data-vibeui-navbar-001-menu] a{
display:block;padding:0.625rem 0.75rem;border-radius:0.625rem;
color:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
text-decoration:none;font-size:0.9375rem;font-weight:500;
}
[data-vibeui-navbar-001-menu] a:hover{background:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 12%))}
[data-vibeui-navbar-001-menu] [data-part="action"]{
display:flex;justify-content:center;margin-top:0.375rem;
background:var(--vibeui-navbar-001-accent,light-dark(oklch(0.52 0.19 265),oklch(0.72 0.16 265)));
color:var(--vibeui-navbar-001-accent-fg,light-dark(oklch(0.99 0 0),oklch(0.18 0.02 265)));
}
/* От 52rem собственной ширины — десктопная шапка. */
@container (min-width: 52rem){
[data-vibeui-block="navbar-001"] [data-part="frame"]{padding:1rem 2rem;gap:2rem}
[data-vibeui-block="navbar-001"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-001"] [data-part="action"]{display:inline-flex}
[data-vibeui-block="navbar-001"] [data-part="burger"]{display:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-001"] *{animation:none!important;transition:none!important}
[data-vibeui-navbar-001-menu]{transition:none!important}
}
`

const DEFAULT_LINKS: Navbar001Link[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Примеры", href: "#cases" },
  { label: "Документация", href: "#docs" },
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

/**
 * Шапка сайта: раскладка от собственной ширины, мобильное меню без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Navbar001({
  brand = "Полёт",
  links = DEFAULT_LINKS,
  actionLabel = "Начать бесплатно",
  actionHref = "#start",
  navLabel = "Основная навигация",
  menuLabel = "Открыть меню",
  id = "vibeui-navbar-001-menu",
  background = "",
  accent,
  className,
  style,
}: Navbar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-001" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="links" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
          <button
            data-part="burger"
            type="button"
            popoverTarget={id}
            aria-label={menuLabel}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div
          id={id}
          popover="auto"
          data-vibeui-navbar-001-menu=""
          style={palette}
        >
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </header>
    </>
  )
}
