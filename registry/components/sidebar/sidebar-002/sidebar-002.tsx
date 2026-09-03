import type { ComponentProps, CSSProperties } from "react"

export type Sidebar002Item = {
  label: string
  href?: string
  count?: number
}

export type Sidebar002Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Sidebar002Item[]
  activeLabel?: string
  title?: string
  /** Подпись списка разделов для скринридера. */
  navLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сворачиваемая боковая навигация без JS. Состояние держит
// чекбокс, ширина меняется одной переменной, а подписи не прячутся display:none
// — они сжимаются до нуля с overflow:hidden, поэтому остаются в дереве
// доступности и находятся поиском по странице.
const STYLES = `
:where([data-vibeui-block="sidebar-002"]){
--vibeui-sidebar-002-width:12.5rem;
--vibeui-sidebar-002-bg:transparent;
--vibeui-sidebar-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-sidebar-002-muted:color-mix(in oklab,var(--vibeui-sidebar-002-fg) 68%,transparent);
--vibeui-sidebar-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-sidebar-002-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 11%));
--vibeui-sidebar-002-active:light-dark(oklch(0.55 0.02 265 / 13%),oklch(0.85 0.02 265 / 18%));
--vibeui-sidebar-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.17 262));
--vibeui-sidebar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-002"]{color-scheme:dark}
[data-vibeui-block="sidebar-002"]{
display:flex;flex-direction:column;gap:0.25rem;
width:var(--vibeui-sidebar-002-width);box-sizing:border-box;padding:0.5rem;
background:var(--vibeui-sidebar-002-bg);
border:1px solid var(--vibeui-sidebar-002-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-002-font);color:var(--vibeui-sidebar-002-fg);
transition:width .16s ease;
}
/* Свёрнутое состояние — одна переменная ширины, а не второй набор правил. */
[data-vibeui-block="sidebar-002"]:has([data-part="toggle"]:checked){--vibeui-sidebar-002-width:3.5rem}
[data-vibeui-block="sidebar-002"] [data-part="toggle"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="sidebar-002"] [data-part="switch"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
font-size:0.875rem;color:var(--vibeui-sidebar-002-muted);
}
[data-vibeui-block="sidebar-002"] [data-part="switch"]:hover{background:var(--vibeui-sidebar-002-hover)}
[data-vibeui-block="sidebar-002"] [data-part="toggle"]:focus-visible + [data-part="switch"]{outline:2px solid var(--vibeui-sidebar-002-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-002"] [data-part="bars"]{
flex:none;width:1rem;height:0.625rem;
border-top:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
}
[data-vibeui-block="sidebar-002"] nav{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-002"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
color:inherit;text-decoration:none;font-size:0.9375rem;
}
[data-vibeui-block="sidebar-002"] [data-part="row"]:hover{background:var(--vibeui-sidebar-002-hover)}
[data-vibeui-block="sidebar-002"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-sidebar-002-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-002"] [data-part="row"][aria-current="page"]{background:var(--vibeui-sidebar-002-active);font-weight:650}
/* Заливка, а не рамка: пустой квадрат с рамкой читается как чекбокс. */
[data-vibeui-block="sidebar-002"] [data-part="glyph"]{
flex:none;width:1rem;height:1rem;border-radius:0.3125rem;
background:var(--vibeui-sidebar-002-muted);opacity:.35;
}
[data-vibeui-block="sidebar-002"] [data-part="row"][aria-current="page"] [data-part="glyph"]{background:var(--vibeui-sidebar-002-accent);opacity:1}
/* Подпись сжимается до нуля, а не скрывается: она остаётся доступной. */
[data-vibeui-block="sidebar-002"] [data-part="text"]{
flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;
transition:opacity .12s ease;
}
[data-vibeui-block="sidebar-002"] [data-part="count"]{
flex:none;font-size:0.875rem;color:var(--vibeui-sidebar-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sidebar-002"]:has([data-part="toggle"]:checked) [data-part="text"],
[data-vibeui-block="sidebar-002"]:has([data-part="toggle"]:checked) [data-part="count"]{
flex-basis:0;width:0;opacity:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar002Item[] = [
  { label: "Обзор", href: "#" },
  { label: "Компоненты", href: "#", count: 225 },
  { label: "Блоки", href: "#", count: 12 },
  { label: "Настройки", href: "#" },
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
 * Сворачиваемая боковая навигация на чекбоксе: ширина в одной переменной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar002({
  items = DEFAULT_ITEMS,
  activeLabel = "Компоненты",
  title = "Свернуть",
  navLabel = "Разделы",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar002Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-002"
        className={className}
        style={palette}
      >
        <label>
          <input data-part="toggle" type="checkbox" />
          <span data-part="switch">
            <span data-part="bars" aria-hidden="true" />
            <span data-part="text">{title}</span>
          </span>
        </label>
        <nav aria-label={navLabel}>
          {items.map((item) => (
            <a
              key={item.label}
              data-part="row"
              href={item.href ?? "#"}
              aria-current={item.label === activeLabel ? "page" : undefined}
            >
              <span data-part="glyph" aria-hidden="true" />
              <span data-part="text">{item.label}</span>
              {item.count ? <span data-part="count">{item.count}</span> : null}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
