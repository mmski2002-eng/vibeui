import type { CSSProperties } from "react"
import { Button109 } from "@/registry/components/button/button-109/button-109"

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
--vibeui-navbar-019-dur-1:130ms;
--vibeui-navbar-019-dur-2:180ms;
--vibeui-navbar-019-dur-3:240ms;
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
[data-vibeui-block="navbar-019"] [data-part="item"]{flex:1 1 0;min-width:0}
[data-vibeui-block="navbar-019"] [data-part="rail"]{
display:flex;align-items:stretch;gap:0.125rem;padding:0.375rem 0.375rem 0.4375rem;
}
[data-vibeui-block="navbar-019"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-019-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-019"] *{animation:none!important;transition:none!important}}
`


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
            <Button109 key={item.href} data-part="item" href={item.href} current={item.current} icon={item.icon} label={item.label} badge={item.badge} accent={accent} />
          ))}
        </div>
      </nav>
    </>
  )
}
