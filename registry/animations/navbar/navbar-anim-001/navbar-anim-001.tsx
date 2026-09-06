import type { CSSProperties } from "react"

type NavbarAnim001Link = {
  label: string
  href: string
}

export type NavbarAnim001Props = {
  brand?: string
  links?: NavbarAnim001Link[]
  /**
   * Показать мобильную панель развёрнутой в потоке страницы: витрина,
   * скриншот, отладка. В этом режиме popover не используется, поэтому Esc
   * и клик мимо не работают.
   */
  open?: boolean
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Подпись кнопки меню для скринридера. */
  menuLabel?: string
  /** Идентификатор мобильного меню: связывает кнопку и панель. */
  id?: string
  accent?: string
  /** false — шапка стоит в развёрнутом состоянии, без цикла сжатия. */
  animate?: boolean
  className?: string
  style?: CSSProperties
}

// Полноценная шапка сайта: лого слева, навигация по центру, действия справа.
// У живой страницы такая шапка сжимается при прокрутке — здесь настоящей
// прокрутки нет, поэтому эффект показан зацикленной демонстрацией на чистом
// CSS: паддинг рамки периодически уменьшается, фон становится плотнее и
// снизу проступает тень, затем шапка возвращается в исходный развёрнутый вид.
//
// Мобильное меню — HTML popover: кнопка объявляет цель через popovertarget,
// браузер сам даёт закрытие по Esc и клику мимо. Ни строки JS, ни состояния.
// container-type делает шапку собственным query-контейнером: раскладка
// считается от ширины блока, а не окна.
const STYLES = `
:where([data-vibeui-block="navbar-anim-001"]){
--vibeui-navbar-anim-001-bg-flat:transparent;
--vibeui-navbar-anim-001-bg-scrolled:light-dark(oklch(1 0 0 / 86%),oklch(0.16 0 265 / 86%));
--vibeui-navbar-anim-001-ink:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navbar-anim-001-muted:light-dark(oklch(0.5 0 265),oklch(0.7 0 265));
--vibeui-navbar-anim-001-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-navbar-anim-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.72 0.16 265));
--vibeui-navbar-anim-001-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0 265));
--vibeui-navbar-anim-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-anim-001"]{color-scheme:dark}
[data-vibeui-block="navbar-anim-001"]{
min-width:min(100%,18rem);
color:var(--vibeui-navbar-anim-001-ink);
font-family:var(--vibeui-navbar-anim-001-sans);
}
[data-vibeui-block="navbar-anim-001"] [data-part="frame"]{
display:flex;align-items:center;gap:1rem;
max-width:80rem;margin:0 auto;
padding:1.375rem clamp(1.25rem,4cqi,2rem);
background:var(--vibeui-navbar-anim-001-bg-flat);
backdrop-filter:saturate(1.4) blur(10px);
border-bottom:1px solid transparent;
box-shadow:none;
animation:vibeui-navbar-anim-001-scroll 8s ease-in-out infinite;
}
[data-vibeui-block="navbar-anim-001"][data-animate="false"] [data-part="frame"]{animation:none}
[data-vibeui-block="navbar-anim-001"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;
font-size:1rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="navbar-anim-001"] [data-part="mark"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;flex:none;
background:linear-gradient(140deg,var(--vibeui-navbar-anim-001-accent),color-mix(in oklab,var(--vibeui-navbar-anim-001-accent) 55%,white));
}
[data-vibeui-block="navbar-anim-001"] [data-part="links"]{display:none;align-items:center;justify-content:center;gap:0.25rem;flex:1 1 auto}
[data-vibeui-block="navbar-anim-001"] [data-part="links"] a{
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-anim-001-muted);text-decoration:none;
font-size:0.875rem;font-weight:500;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-anim-001"] [data-part="links"] a:hover{color:var(--vibeui-navbar-anim-001-ink);background:color-mix(in oklab,var(--vibeui-navbar-anim-001-border) 45%,transparent)}
[data-vibeui-block="navbar-anim-001"] [data-part="actions"]{display:none;align-items:center;gap:0.5rem;flex:none;margin-left:auto}
[data-vibeui-block="navbar-anim-001"] [data-part="secondary"]{
color:var(--vibeui-navbar-anim-001-muted);text-decoration:none;
font-size:0.875rem;font-weight:550;padding:0.4375rem 0.5rem;
}
[data-vibeui-block="navbar-anim-001"] [data-part="secondary"]:hover{color:var(--vibeui-navbar-anim-001-ink)}
[data-vibeui-block="navbar-anim-001"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.25rem 1rem;flex:none;
border-radius:0.5rem;
background:var(--vibeui-navbar-anim-001-accent);color:var(--vibeui-navbar-anim-001-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-anim-001"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-anim-001-accent) 88%,black)}
[data-vibeui-block="navbar-anim-001"] [data-part="burger"]{
appearance:none;cursor:pointer;margin-left:auto;flex:none;
display:inline-flex;flex-direction:column;justify-content:center;gap:0.25rem;
width:2.25rem;height:2.25rem;padding:0 0.5rem;
border:1px solid var(--vibeui-navbar-anim-001-border);border-radius:0.5rem;
background:transparent;
}
[data-vibeui-block="navbar-anim-001"] [data-part="burger"] span{display:block;height:1.5px;background:var(--vibeui-navbar-anim-001-ink)}
[data-vibeui-block="navbar-anim-001"] a:focus-visible,
[data-vibeui-block="navbar-anim-001"] button:focus-visible{outline:2px solid var(--vibeui-navbar-anim-001-accent);outline-offset:2px}
/* Мобильная панель живёт в верхнем слое, поэтому стилизуется по атрибуту. */
[data-vibeui-navbar-anim-001-menu]{
position:fixed;inset:auto 0.75rem 0.75rem;margin:0;
padding:0.625rem;
border:1px solid var(--vibeui-navbar-anim-001-border,light-dark(oklch(0.9 0 265),oklch(0.34 0 265)));
border-radius:1rem;
background:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
font-family:var(--vibeui-navbar-anim-001-sans,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -28px light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 70%));
opacity:0;transform:translateY(0.75rem);
transition:opacity .2s ease,transform .2s ease,display .2s allow-discrete,overlay .2s allow-discrete;
}
[data-vibeui-navbar-anim-001-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-navbar-anim-001-menu]:popover-open{opacity:0;transform:translateY(0.75rem)}}
[data-vibeui-navbar-anim-001-menu] a{
display:block;padding:0.625rem 0.75rem;border-radius:0.625rem;
color:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
text-decoration:none;font-size:0.9375rem;font-weight:500;
}
[data-vibeui-navbar-anim-001-menu] a:hover{background:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%))}
[data-vibeui-navbar-anim-001-menu] [data-part="action"]{
display:flex;justify-content:center;margin-top:0.375rem;
background:var(--vibeui-navbar-anim-001-accent,light-dark(oklch(0.52 0.19 265),oklch(0.72 0.16 265)));
color:var(--vibeui-navbar-anim-001-accent-fg,light-dark(oklch(0.99 0 0),oklch(0.18 0 265)));
}
/* Цикл имитации sticky-scroll: рамка проседает по паддингу, набирает фон
   и тень, потом плавно возвращается в развёрнутый вид. */
@keyframes vibeui-navbar-anim-001-scroll{
0%,15%{padding-block:1.375rem;background:var(--vibeui-navbar-anim-001-bg-flat);border-bottom-color:transparent;box-shadow:none}
30%,70%{padding-block:0.75rem;background:var(--vibeui-navbar-anim-001-bg-scrolled);border-bottom-color:var(--vibeui-navbar-anim-001-border);box-shadow:0 12px 30px -20px oklch(0.2 0 265 / 45%)}
85%,100%{padding-block:1.375rem;background:var(--vibeui-navbar-anim-001-bg-flat);border-bottom-color:transparent;box-shadow:none}
}
/* От 52rem собственной ширины — десктопная шапка. */
@container (min-width: 52rem){
[data-vibeui-block="navbar-anim-001"] [data-part="frame"]{gap:2rem}
[data-vibeui-block="navbar-anim-001"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-anim-001"] [data-part="actions"]{display:flex}
[data-vibeui-block="navbar-anim-001"] [data-part="burger"]{display:none}
}
/* Развёрнутый режим: панель встаёт в потоке под шапкой во всю её ширину. */
[data-vibeui-navbar-anim-001-menu][data-open="true"]{
position:static;inset:auto;width:100%;margin:0.75rem 0 0;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-anim-001"] [data-part="frame"]{animation:none}
[data-vibeui-navbar-anim-001-menu]{transition:none!important}
}
`

const DEFAULT_LINKS: NavbarAnim001Link[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Примеры", href: "#cases" },
  { label: "Документация", href: "#docs" },
]

/**
 * Шапка сайта с центрированной навигацией: раскладка от собственной ширины,
 * мобильное меню без JS, сжатие при прокрутке показано зацикленной
 * демонстрацией на чистом CSS. Один файл, ноль зависимостей, своя палитра.
 */
export function NavbarAnim001({
  brand = "Полёт",
  links = DEFAULT_LINKS,
  open = false,
  actionLabel = "Начать бесплатно",
  actionHref = "#start",
  secondaryLabel = "Войти",
  secondaryHref = "#login",
  navLabel = "Основная навигация",
  menuLabel = "Открыть меню",
  id = "vibeui-navbar-anim-001-menu",
  accent,
  animate = true,
  className,
  style,
}: NavbarAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-anim-001" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-anim-001"
        data-animate={animate ? undefined : "false"}
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
          <div data-part="actions">
            {secondaryLabel ? (
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            ) : null}
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
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
          popover={open ? undefined : "auto"}
          data-vibeui-navbar-anim-001-menu=""
          data-open={open || undefined}
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
