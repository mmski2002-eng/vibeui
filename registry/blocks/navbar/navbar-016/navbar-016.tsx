import type { CSSProperties } from "react"

type Navbar016Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar016Props = {
  brand?: string
  /** Пилюля рядом с логотипом; пусто — пилюли нет. */
  badgeLabel?: string
  badgeHref?: string
  links?: Navbar016Link[]
  loginLabel?: string
  loginHref?: string
  actionLabel?: string
  actionHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Светлая шапка: белая подложка, волосяная нижняя граница и одна аккуратная
// кнопка справа. Палитра задана явно светлой и не зависит от color-scheme:
// светлый фон здесь — сама идея блока, а не ветка темы, поэтому шапка
// остаётся светлой и на тёмной странице. Тому, кому нужна пара веток темы,
// подойдут соседние блоки категории.
const STYLES = `
:where([data-vibeui-block="navbar-016"]){
--vibeui-navbar-016-bg:oklch(0.995 0 265);
--vibeui-navbar-016-ink:oklch(0.21 0 265);
--vibeui-navbar-016-muted:oklch(0.51 0 265);
--vibeui-navbar-016-border:oklch(0.915 0 265);
--vibeui-navbar-016-tile:oklch(0.965 0 265);
--vibeui-navbar-016-accent:oklch(0.52 0.16 39.8);
--vibeui-navbar-016-accent-fg:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
color-scheme:light;
}
[data-vibeui-block="navbar-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-016-bg);color:var(--vibeui-navbar-016-ink);
border-bottom:1px solid var(--vibeui-navbar-016-border);
font-family:var(--vibeui-navbar-016-font);
}
[data-vibeui-block="navbar-016"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.625rem 1rem;
max-width:80rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-016"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:var(--vibeui-navbar-016-ink);text-decoration:none;
font-size:1rem;font-weight:660;letter-spacing:-0.015em;
}
[data-vibeui-block="navbar-016"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:0.5rem;
background:linear-gradient(150deg,var(--vibeui-navbar-016-accent),color-mix(in oklab,var(--vibeui-navbar-016-accent) 40%,white));
}
[data-vibeui-block="navbar-016"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.3125rem;flex:none;
min-height:1.5rem;padding:0.125rem 0.5rem;border-radius:999px;
border:1px solid var(--vibeui-navbar-016-border);background:var(--vibeui-navbar-016-tile);
color:var(--vibeui-navbar-016-muted);text-decoration:none;
font-size:0.75rem;font-weight:580;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="badge"]::before{
content:"";width:0.375rem;height:0.375rem;border-radius:999px;flex:none;
background:var(--vibeui-navbar-016-accent);
}
[data-vibeui-block="navbar-016"] [data-part="badge"]:hover{
color:var(--vibeui-navbar-016-ink);border-color:color-mix(in oklab,var(--vibeui-navbar-016-accent) 45%,var(--vibeui-navbar-016-border));
}
[data-vibeui-block="navbar-016"] [data-part="menu"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.125rem;
margin:0;padding:0;list-style:none;min-inline-size:0;
}
[data-vibeui-block="navbar-016"] [data-part="link"]{
display:inline-flex;align-items:center;min-height:2rem;padding:0.25rem 0.625rem;border-radius:0.5rem;
color:var(--vibeui-navbar-016-muted);text-decoration:none;font-size:0.875rem;font-weight:530;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="link"]:hover{color:var(--vibeui-navbar-016-ink);background:var(--vibeui-navbar-016-tile)}
[data-vibeui-block="navbar-016"] [data-part="link"][aria-current="page"]{color:var(--vibeui-navbar-016-ink);font-weight:600}
[data-vibeui-block="navbar-016"] [data-part="end"]{
display:flex;align-items:center;gap:0.25rem 0.75rem;flex-wrap:wrap;margin-left:auto;
}
[data-vibeui-block="navbar-016"] [data-part="login"]{
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.25rem 0.25rem;
color:var(--vibeui-navbar-016-muted);text-decoration:none;font-size:0.875rem;font-weight:560;
transition:color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="login"]:hover{color:var(--vibeui-navbar-016-ink)}
/* Кнопка на светлой подложке держится не заливкой во всю силу, а мягкой
   тенью того же тона: без неё она выглядит наклейкой. */
[data-vibeui-block="navbar-016"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.3125rem 1rem;flex:none;
border-radius:0.625rem;background:var(--vibeui-navbar-016-accent);color:var(--vibeui-navbar-016-accent-fg);
box-shadow:0 1px 2px oklch(0.2 0 265 / 18%),0 10px 20px -14px var(--vibeui-navbar-016-accent);
text-decoration:none;font-size:0.875rem;font-weight:620;
transition:background-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-navbar-016-accent) 88%,black);
box-shadow:0 1px 2px oklch(0.2 0 265 / 22%),0 14px 26px -14px var(--vibeui-navbar-016-accent);
}
[data-vibeui-block="navbar-016"] a:focus-visible{outline:2px solid var(--vibeui-navbar-016-accent);outline-offset:2px}
@container (min-width: 52rem){
[data-vibeui-block="navbar-016"] [data-part="shell"]{padding:0.8125rem 2rem;gap:1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-016"] [data-part="menu"]{flex-wrap:nowrap;gap:0.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar016Link[] = [
  { label: "Возможности", href: "#features", current: true },
  { label: "Тарифы", href: "#pricing" },
  { label: "Клиенты", href: "#customers" },
  { label: "Документация", href: "#docs" },
]

/** Светлая шапка: белая подложка, тонкая граница и одна кнопка действия. */
export function Navbar016({
  brand = "Ясность",
  badgeLabel = "Версия 2.0",
  badgeHref = "#release",
  links = DEFAULT_LINKS,
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Попробовать бесплатно",
  actionHref = "#start",
  navLabel = "Основная навигация",
  accent,
  className,
  style,
}: Navbar016Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-016" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-016"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          {badgeLabel ? (
            <a data-part="badge" href={badgeHref}>
              {badgeLabel}
            </a>
          ) : null}
          <nav aria-label={navLabel}>
            <ul data-part="menu">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    data-part="link"
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-part="end">
            <a data-part="login" href={loginHref}>
              {loginLabel}
            </a>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
