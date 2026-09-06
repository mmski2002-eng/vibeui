import type { CSSProperties } from "react"

type Navbar006Link = {
  label: string
  href: string
}

type Navbar006Locale = {
  code: string
  label: string
  region: string
  href: string
}

export type Navbar006Props = {
  brand?: string
  links?: Navbar006Link[]
  locales?: Navbar006Locale[]
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  currentLocale?: string
  actionLabel?: string
  actionHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Подпись кнопки языка; {locale} подставляет текущий код. */
  localeLabel?: string
  id?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка международного сайта: рядом с меню стоит переключатель языка,
// открывающий список ссылками на локализованные версии. Список — HTML
// popover, поэтому Esc и клик мимо работают без JS, а сами языки остаются
// ссылками: переключение языка — это переход, а не состояние интерфейса.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-006"]){
--vibeui-navbar-006-bg:transparent;
--vibeui-navbar-006-ink:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-navbar-006-muted:light-dark(oklch(0.54 0 265),oklch(0.7 0 265));
--vibeui-navbar-006-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-navbar-006-accent:light-dark(oklch(0.52 0.16 20),oklch(0.72 0.15 20));
--vibeui-navbar-006-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 20));
--vibeui-navbar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-006"]{color-scheme:dark}
[data-vibeui-block="navbar-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-006-bg);color:var(--vibeui-navbar-006-ink);
border-bottom:1px solid var(--vibeui-navbar-006-border);
font-family:var(--vibeui-navbar-006-font);
}
[data-vibeui-block="navbar-006"] [data-part="shell"]{
display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;
max-width:78rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-006"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;margin-right:auto;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-006"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:999px;
background:radial-gradient(circle at 32% 30%,color-mix(in oklab,var(--vibeui-navbar-006-accent) 45%,white),var(--vibeui-navbar-006-accent));
}
[data-vibeui-block="navbar-006"] [data-part="links"]{
order:4;flex:1 1 100%;display:flex;align-items:center;gap:1.125rem;
padding-top:0.625rem;border-top:1px solid var(--vibeui-navbar-006-border);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-006"] [data-part="links"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-006"] [data-part="links"] a{
color:var(--vibeui-navbar-006-muted);text-decoration:none;white-space:nowrap;
font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="links"] a:hover{color:var(--vibeui-navbar-006-ink)}
[data-vibeui-block="navbar-006"] [data-part="globe"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.4375rem;height:2.25rem;padding:0 0.75rem;
border:1px solid var(--vibeui-navbar-006-border);border-radius:0.625rem;background:transparent;
font:inherit;font-size:0.875rem;font-weight:560;color:var(--vibeui-navbar-006-ink);
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="globe"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-006-border) 40%,transparent)}
[data-vibeui-block="navbar-006"] [data-part="globe"]::before{
content:"";width:0.9375rem;height:0.9375rem;border-radius:999px;
border:1.5px solid currentColor;
background:linear-gradient(currentColor,currentColor) center/100% 1.5px no-repeat;
opacity:.75;
}
[data-vibeui-block="navbar-006"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;min-height:2.25rem;padding:0.25rem 1rem;
border-radius:0.625rem;background:var(--vibeui-navbar-006-accent);color:var(--vibeui-navbar-006-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-006"] a:focus-visible,
[data-vibeui-block="navbar-006"] button:focus-visible{outline:2px solid var(--vibeui-navbar-006-accent);outline-offset:2px}
[data-vibeui-navbar-006-locales]{
position:fixed;inset:3.5rem 1rem auto auto;margin:0;padding:0.375rem;min-width:14rem;
border:1px solid var(--vibeui-navbar-006-border,light-dark(oklch(0.9 0 265),oklch(0.34 0 265)));
border-radius:0.875rem;
background:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
font-family:var(--vibeui-navbar-006-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 56px -30px light-dark(oklch(0.2 0 265 / 55%),oklch(0 0 0 / 65%));
opacity:0;transform:translateY(-0.375rem);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-navbar-006-locales]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-navbar-006-locales]:popover-open{opacity:0;transform:translateY(-0.375rem)}}
[data-vibeui-navbar-006-locales] a{
display:flex;align-items:baseline;gap:0.5rem;padding:0.5rem 0.625rem;border-radius:0.625rem;
color:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
text-decoration:none;font-size:0.875rem;font-weight:560;
}
[data-vibeui-navbar-006-locales] a:hover{background:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%))}
[data-vibeui-navbar-006-locales] a[aria-current="true"]{background:light-dark(oklch(0.55 0 265 / 10%),oklch(0.85 0 265 / 16%))}
[data-vibeui-navbar-006-locales] [data-part="region"]{margin-left:auto;color:light-dark(oklch(0.54 0 265),oklch(0.7 0 265));font-size:0.75rem;font-weight:450}
/* Где есть якорное позиционирование — список встаёт прямо под кнопкой. */
@supports (anchor-name:--vibeui-navbar-006-globe){
[data-vibeui-block="navbar-006"] [data-part="globe"]{anchor-name:--vibeui-navbar-006-globe}
[data-vibeui-navbar-006-locales]{position-anchor:--vibeui-navbar-006-globe;position-area:bottom span-left;inset:auto;margin-top:0.5rem}
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-006"] [data-part="shell"]{padding:0.875rem 2rem;gap:1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-006"] [data-part="brand"]{margin-right:0}
[data-vibeui-block="navbar-006"] [data-part="links"]{order:0;flex:1 1 auto;padding-top:0;border-top:0;overflow:visible}
}
/* Развёрнутый режим: панель встаёт в потоке под шапкой во всю её ширину. */
[data-vibeui-navbar-006-locales][data-open="true"]{
position:static;inset:auto;width:100%;margin:0.75rem 0 0;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-006"] *{animation:none!important;transition:none!important}
[data-vibeui-navbar-006-locales]{transition:none!important}
}
`

const DEFAULT_LINKS: Navbar006Link[] = [
  { label: "О компании", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Офисы", href: "#offices" },
  { label: "Контакты", href: "#contacts" },
]

const DEFAULT_LOCALES: Navbar006Locale[] = [
  { code: "RU", label: "Русский", region: "Россия", href: "/ru" },
  { code: "EN", label: "English", region: "Global", href: "/en" },
  { code: "DE", label: "Deutsch", region: "Deutschland", href: "/de" },
  { code: "KK", label: "Қазақша", region: "Қазақстан", href: "/kk" },
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

/** Шапка с переключателем языка: список локалей открывается HTML popover. */
export function Navbar006({
  brand = "Ориентир",
  links = DEFAULT_LINKS,
  locales = DEFAULT_LOCALES,
  open = false,
  currentLocale = "RU",
  actionLabel = "Связаться",
  actionHref = "#contact",
  navLabel = "Основная навигация",
  localeLabel = "Язык сайта: {locale}. Выбрать другой",
  id = "vibeui-navbar-006-locales",
  background = "",
  accent,
  className,
  style,
}: Navbar006Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-006" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
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
          <button
            data-part="globe"
            type="button"
            popoverTarget={id}
            aria-label={localeLabel.replace("{locale}", currentLocale)}
          >
            {currentLocale}
          </button>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-navbar-006-locales=""
          data-open={open || undefined}
          style={palette}
        >
          {locales.map((locale) => (
            <a
              key={locale.code}
              href={locale.href}
              lang={locale.code.toLowerCase()}
              aria-current={locale.code === currentLocale ? "true" : undefined}
            >
              {locale.label}
              <span data-part="region">{locale.region}</span>
            </a>
          ))}
        </div>
      </header>
    </>
  )
}
