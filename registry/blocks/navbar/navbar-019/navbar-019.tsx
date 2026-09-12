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
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Матовое стекло вместо плотной поверхности: панель поверх контента. */
  glass?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мобильная навигация у нижнего края: 3–5 подписанных направлений,
// выбранное лежит на пилюле, а не помечено одной лишь полоской сверху —
// на маленьком экране цель пальца должна быть видна как объект. Панель
// может стоять на плотной поверхности или на матовом стекле, если ей
// предстоит висеть поверх ленты.
//
// Панель показывает навигацию, а не рекламное действие; маршруты и
// активное состояние приходят от проекта. Блок не фиксирует себя сам:
// пример закрепления (position:fixed + safe-area + резерв контента)
// описан в docs и задаётся принимающим проектом. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-019"]){
--vibeui-navbar-019-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-019-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-019-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-019-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-019-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-019-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-019-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-019-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-019-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-019-on-accent:oklch(from var(--vibeui-navbar-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-019-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-019-pill:light-dark(color-mix(in oklab,light-dark(#1a1a1a,#f2f2f2) 14%,transparent),color-mix(in oklab,light-dark(#1a1a1a,#f2f2f2) 22%,transparent));
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-019"]{color-scheme:dark}
:where([data-vibeui-block="navbar-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-019"]{
display:block;min-width:min(100%,16rem);max-width:32rem;margin:0 auto;
background:var(--vibeui-navbar-019-bg);color:var(--vibeui-navbar-019-ink);
border-top:1px solid var(--vibeui-navbar-019-line);
box-shadow:inset 0 1px 0 var(--vibeui-navbar-019-sheen);
padding-bottom:env(safe-area-inset-bottom,0);
font-family:var(--vibeui-navbar-019-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-019"][data-glass="on"]{
background:color-mix(in oklab,var(--vibeui-navbar-019-bg) 72%,transparent);
-webkit-backdrop-filter:blur(1.25rem) saturate(180%);
backdrop-filter:blur(1.25rem) saturate(180%);
}
[data-vibeui-block="navbar-019"] *{box-sizing:border-box}
[data-vibeui-block="navbar-019"] [data-part="rail"]{
display:flex;align-items:stretch;gap:0.125rem;padding:0.375rem 0.375rem 0.4375rem;
}
[data-vibeui-block="navbar-019"] [data-part="item"]{
flex:1 1 0;min-width:0;position:relative;
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:0.4375rem 0.25rem 0.5rem;border-radius:0.875rem;
color:var(--vibeui-navbar-019-muted);text-decoration:none;
font-size:0.6875rem;font-weight:560;
transition:color .14s ease,background-color .2s ease;
}
[data-vibeui-block="navbar-019"] [data-part="item"]:hover{color:var(--vibeui-navbar-019-ink)}
[data-vibeui-block="navbar-019"] [data-part="item"][aria-current="page"]{
color:var(--vibeui-navbar-019-ink);font-weight:620;
background:var(--vibeui-navbar-019-pill);
}
[data-vibeui-block="navbar-019"] [data-part="item"] svg{
width:1.375rem;height:1.375rem;
transition:transform .28s var(--vibeui-navbar-019-ease);
}
[data-vibeui-block="navbar-019"] [data-part="item"][aria-current="page"] svg{
color:var(--vibeui-navbar-019-accent);transform:scale(1.08);
}
[data-vibeui-block="navbar-019"] [data-part="item"]:active svg{transform:scale(.92)}
[data-vibeui-block="navbar-019"] [data-part="label"]{
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-019"] [data-part="badge"]{
position:absolute;top:0.1875rem;left:calc(50% + 0.3125rem);
min-width:1.0625rem;height:1.0625rem;padding:0 0.1875rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-navbar-019-accent);color:oklch(from var(--vibeui-navbar-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-radius:999px;font-size:0.625rem;font-weight:700;
box-shadow:0 0 0 2px var(--vibeui-navbar-019-bg);
}
[data-vibeui-block="navbar-019"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-019-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-019"] *{animation:none!important;transition:none!important}}
`

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
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

/** Нижняя мобильная навигация: подписанные направления, выбранное на пилюле. */
export function Navbar019({
  items = DEFAULT_ITEMS,
  navLabel = "Основные разделы",
  tone = "auto",
  glass = false,
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
        data-tone={tone === "auto" ? undefined : tone}
        data-glass={glass ? "on" : undefined}
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
                <span
                  data-part="badge"
                  aria-label={`${item.label}: ${item.badge}`}
                >
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
