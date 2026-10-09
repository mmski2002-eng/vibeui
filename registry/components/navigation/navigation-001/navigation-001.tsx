"use client"

import {
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"

type Icon =
  | "home"
  | "user"
  | "folder"
  | "chart"
  | "message"
  | "bell"
  | "settings"
  | "logout"

export type Navigation001Item =
  | { icon: Icon; label: string; href: string; current?: boolean }
  | { divider: true }

export type Navigation001Props = Omit<ComponentProps<"aside">, "children"> & {
  title?: string
  searchLabel?: string
  items?: Navigation001Item[]
  collapseLabel?: string
  expandLabel?: string
  defaultCollapsed?: boolean
  accent?: string
  /** Фон за стеклом. Пусто — тёмная сцена с акцентными пятнами, иначе стеклу нечего размывать. */
  background?: string
}

// Идея: боковая панель пользователя из матового стекла, которая
// сворачивается в узкую колонку иконок. Свёрнутая панель прячет подписи, но
// не теряет их: у каждой ссылки остаётся aria-label и title, поэтому меню
// читается диктором и подсказывает при наведении. Стекло держится на
// backdrop-filter, а размывать ему нужно что-то яркое — поэтому у компонента
// своя сцена с пятнами акцента; свой фон отдаётся через background.
const STYLES = `
:where([data-vibeui-block="navigation-001"]){
--vibeui-navigation-001-accent:oklch(0.6803 0.2144 39.8);
--vibeui-navigation-001-stage:radial-gradient(60% 50% at 15% 20%,oklch(from var(--vibeui-navigation-001-accent) l c h / 0.75),transparent 70%),radial-gradient(55% 45% at 85% 85%,oklch(from var(--vibeui-navigation-001-accent) calc(l - 0.12) c calc(h - 18) / 0.7),transparent 70%),oklch(0.16 0.006 50);
--vibeui-navigation-001-fg:oklch(0.98 0 0);
--vibeui-navigation-001-muted:oklch(1 0 0 / 0.68);
--vibeui-navigation-001-glass:oklch(1 0 0 / 0.1);
--vibeui-navigation-001-line:oklch(1 0 0 / 0.2);
--vibeui-navigation-001-hover:oklch(1 0 0 / 0.1);
--vibeui-navigation-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navigation-001"]{
display:flex;justify-content:center;width:100%;box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-navigation-001-stage);color:var(--vibeui-navigation-001-fg);
font-family:var(--vibeui-navigation-001-font);border-radius:1.25rem;
}
[data-vibeui-block="navigation-001"] *{box-sizing:border-box}
[data-vibeui-block="navigation-001"] [data-part="panel"]{
width:min(100%,20.5rem);min-height:33rem;padding:1.6rem;overflow:hidden;
border:1px solid var(--vibeui-navigation-001-line);border-radius:1.4rem;
background:var(--vibeui-navigation-001-glass);
backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
box-shadow:0 20px 50px oklch(0 0 0 / 0.3);
transition:width .4s ease,padding .4s ease;
}
[data-vibeui-block="navigation-001"] [data-part="header"]{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:1.4rem}
[data-vibeui-block="navigation-001"] h2{margin:0;font-size:1.6rem;font-weight:600;white-space:nowrap}
[data-vibeui-block="navigation-001"] [data-part="toggle"]{
width:2.25rem;height:2.25rem;flex:none;display:grid;place-items:center;appearance:none;border:0;border-radius:50%;
background:transparent;color:inherit;cursor:pointer;transition:background-color .2s ease;
}
[data-vibeui-block="navigation-001"] [data-part="toggle"]:hover{background:var(--vibeui-navigation-001-hover)}
[data-vibeui-block="navigation-001"] svg{width:1.05rem;height:1.05rem;flex:none}
[data-vibeui-block="navigation-001"] [data-part="search"]{
display:flex;align-items:center;gap:.8rem;height:3rem;padding:0 1rem;margin-bottom:1.4rem;
border:1px solid var(--vibeui-navigation-001-line);border-radius:999px;background:oklch(1 0 0 / 0.08);
}
[data-vibeui-block="navigation-001"] [data-part="search"]:focus-within{border-color:var(--vibeui-navigation-001-accent)}
[data-vibeui-block="navigation-001"] [data-part="search"] input{
width:100%;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:.875rem;
}
[data-vibeui-block="navigation-001"] [data-part="search"] input::placeholder{color:var(--vibeui-navigation-001-muted)}
[data-vibeui-block="navigation-001"] ul{display:flex;flex-direction:column;gap:.3rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="navigation-001"] a{
display:flex;align-items:center;gap:1rem;padding:.8rem .65rem;border-radius:.75rem;
color:var(--vibeui-navigation-001-fg);text-decoration:none;font-size:.875rem;white-space:nowrap;
transition:background-color .25s ease,color .25s ease;
}
[data-vibeui-block="navigation-001"] a:hover{background:var(--vibeui-navigation-001-hover)}
[data-vibeui-block="navigation-001"] a:hover svg,
[data-vibeui-block="navigation-001"] a[aria-current="page"] svg{color:var(--vibeui-navigation-001-accent)}
[data-vibeui-block="navigation-001"] a[aria-current="page"]{background:oklch(from var(--vibeui-navigation-001-accent) l c h / 0.18)}
[data-vibeui-block="navigation-001"] [data-part="divider"]{height:1px;margin:.6rem 0;background:var(--vibeui-navigation-001-line)}
[data-vibeui-block="navigation-001"] :is(a,button,input):focus-visible{outline:2px solid var(--vibeui-navigation-001-accent);outline-offset:2px}
[data-vibeui-block="navigation-001"][data-collapsed] [data-part="panel"]{width:5rem;padding:1.5rem .85rem}
[data-vibeui-block="navigation-001"][data-collapsed] [data-part="header"]{justify-content:center}
[data-vibeui-block="navigation-001"][data-collapsed] :is(h2,[data-part="search"] input,a span){display:none}
[data-vibeui-block="navigation-001"][data-collapsed] [data-part="search"]{width:2.85rem;height:2.85rem;padding:0;margin-inline:auto;justify-content:center}
[data-vibeui-block="navigation-001"][data-collapsed] a{justify-content:center;padding:.8rem 0}
[data-vibeui-block="navigation-001"][data-collapsed] [data-part="divider"]{margin:.6rem .3rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navigation-001"] *{transition:none!important}}
`

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const

const ICONS: Record<Icon | "search" | "close" | "menu", ReactNode> = {
  home: (
    <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  folder: (
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 6-7" />,
  message: <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />,
  bell: (
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  logout: (
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
}

const DEFAULT_ITEMS: Navigation001Item[] = [
  { icon: "home", label: "Обзор", href: "#", current: true },
  { icon: "user", label: "Профиль", href: "#" },
  { divider: true },
  { icon: "folder", label: "Проекты", href: "#" },
  { icon: "chart", label: "Аналитика", href: "#" },
  { icon: "message", label: "Сообщения", href: "#" },
  { icon: "bell", label: "Уведомления", href: "#" },
  { divider: true },
  { icon: "settings", label: "Настройки", href: "#" },
  { icon: "logout", label: "Выйти", href: "#" },
]

/**
 * Боковая панель пользователя из матового стекла: поиск, разделы с
 * разделителями и сворачивание в колонку иконок.
 */
export function Navigation001({
  title = "Кабинет",
  searchLabel = "Поиск",
  items = DEFAULT_ITEMS,
  collapseLabel = "Свернуть панель",
  expandLabel = "Развернуть панель",
  defaultCollapsed = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Navigation001Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const palette = {
    ...(accent ? { "--vibeui-navigation-001-accent": accent } : null),
    ...(background ? { "--vibeui-navigation-001-stage": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navigation-001" precedence="medium">
        {STYLES}
      </style>
      <aside
        {...props}
        data-vibeui-block="navigation-001"
        data-slot="navigation"
        data-collapsed={collapsed || undefined}
        className={className}
        style={palette}
      >
        <div data-part="panel">
          <div data-part="header">
            <h2>{title}</h2>
            <button
              type="button"
              data-part="toggle"
              aria-expanded={!collapsed}
              aria-label={collapsed ? expandLabel : collapseLabel}
              onClick={() => setCollapsed((value) => !value)}
            >
              <svg {...ICON_PROPS}>{collapsed ? ICONS.menu : ICONS.close}</svg>
            </button>
          </div>
          <label data-part="search">
            <svg {...ICON_PROPS}>{ICONS.search}</svg>
            <input
              type="search"
              placeholder={searchLabel}
              aria-label={searchLabel}
            />
          </label>
          <nav aria-label={title}>
            <ul>
              {items.map((item, index) =>
                "divider" in item ? (
                  <li
                    key={`divider-${index}`}
                    data-part="divider"
                    role="separator"
                  />
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      <svg {...ICON_PROPS}>{ICONS[item.icon]}</svg>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
