import type { CSSProperties } from "react"

type Navbar019Item = {
  label: string
  href: string
  icon: "home" | "search" | "heart" | "cart" | "user" | "grid"
  current?: boolean
  /** Число на бейдже; ноль скрывает. */
  badge?: number
}

export type Navbar019Props = {
  items?: Navbar019Item[]
  navLabel?: string
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мобильная навигация у нижнего края: 3–5 подписанных направлений в
// белой или графитовой панели, оранжевый отмечает выбранное. Панель
// показывает навигацию, а не рекламное действие; маршруты и активное
// состояние приходят от проекта. Блок не фиксирует себя сам: пример
// закрепления (position:fixed + safe-area + резерв контента) описан в
// docs и задаётся принимающим проектом. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-019"]){
--vibeui-navbar-019-bg:#ffffff;
--vibeui-navbar-019-ink:#000000;
--vibeui-navbar-019-muted:color-mix(in oklab,#000000 52%,#ffffff);
--vibeui-navbar-019-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-019-accent:#ff5900;
--vibeui-navbar-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-019"][data-tone="dark"]){
--vibeui-navbar-019-bg:#1a1a1a;
--vibeui-navbar-019-ink:#ffffff;
--vibeui-navbar-019-muted:color-mix(in oklab,#ffffff 58%,#1a1a1a);
--vibeui-navbar-019-line:color-mix(in oklab,#ffffff 14%,transparent);
}
[data-vibeui-block="navbar-019"]{
display:block;min-width:min(100%,16rem);max-width:32rem;margin:0 auto;
background:var(--vibeui-navbar-019-bg);color:var(--vibeui-navbar-019-ink);
border-top:1px solid var(--vibeui-navbar-019-line);
padding-bottom:env(safe-area-inset-bottom,0);
font-family:var(--vibeui-navbar-019-font);
}
[data-vibeui-block="navbar-019"] *{box-sizing:border-box}
[data-vibeui-block="navbar-019"] [data-part="rail"]{
display:flex;align-items:stretch;
}
[data-vibeui-block="navbar-019"] [data-part="item"]{
flex:1 1 0;min-width:0;position:relative;
display:flex;flex-direction:column;align-items:center;gap:0.1875rem;
padding:0.5rem 0.25rem 0.5625rem;
color:var(--vibeui-navbar-019-muted);text-decoration:none;
font-size:0.6875rem;font-weight:560;
transition:color .16s ease;
}
[data-vibeui-block="navbar-019"] [data-part="item"]:hover{color:var(--vibeui-navbar-019-ink)}
[data-vibeui-block="navbar-019"] [data-part="item"][aria-current="page"]{
color:var(--vibeui-navbar-019-ink);
}
[data-vibeui-block="navbar-019"] [data-part="item"][aria-current="page"]::before{
content:"";position:absolute;top:0;left:25%;right:25%;height:2.5px;
background:var(--vibeui-navbar-019-accent);
}
[data-vibeui-block="navbar-019"] [data-part="item"] svg{
width:1.375rem;height:1.375rem;
}
[data-vibeui-block="navbar-019"] [data-part="item"][aria-current="page"] svg{
color:var(--vibeui-navbar-019-accent);
}
[data-vibeui-block="navbar-019"] [data-part="label"]{
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-019"] [data-part="badge"]{
position:absolute;top:0.25rem;left:calc(50% + 0.25rem);
min-width:1rem;height:1rem;padding:0 0.1875rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-navbar-019-accent);color:#000000;
border-radius:999px;font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="navbar-019"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-019-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-019"] *{animation:none!important;transition:none!important}}
`

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5S4 15.5 4 9.9C4 7.2 6.1 5 8.7 5c1.4 0 2.6.6 3.3 1.7C12.7 5.6 14 5 15.3 5 17.9 5 20 7.2 20 9.9c0 5.6-8 10.6-8 10.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 10V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
} as const

const DEFAULT_ITEMS: Navbar019Item[] = [
  { label: "Главная", href: "#home", icon: "home", current: true },
  { label: "Каталог", href: "#catalog", icon: "grid" },
  { label: "Поиск", href: "#search", icon: "search" },
  { label: "Корзина", href: "#cart", icon: "cart", badge: 2 },
  { label: "Профиль", href: "#profile", icon: "user" },
]

/** Нижняя мобильная навигация: подписанные направления с оранжевым активным. */
export function Navbar019({
  items = DEFAULT_ITEMS,
  navLabel = "Основные разделы",
  tone = "light",
  accent,
  className,
  style,
}: Navbar019Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-019" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navbar-019"
        data-tone={tone === "dark" ? "dark" : undefined}
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <div data-part="rail">
          {items.map((item) => (
            <a
              data-part="item"
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
            >
              {ICONS[item.icon]}
              <span data-part="label">{item.label}</span>
              {item.badge ? (
                <span data-part="badge" aria-label={`${item.label}: ${item.badge}`}>
                  {item.badge}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
