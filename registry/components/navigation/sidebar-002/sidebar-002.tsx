import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar002Item = {
  label: string
  href?: string
  count?: number
}

export type Sidebar002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Sidebar002Item[]
  activeLabel?: string
  title?: string
  accent?: string
}

// Идея компонента: сворачиваемая боковая навигация без JS. Состояние держит
// чекбокс, ширина меняется одной переменной, а подписи не прячутся display:none
// — они сжимаются до нуля с overflow:hidden, поэтому остаются в дереве
// доступности и находятся поиском по странице.
const STYLES = `
:where([data-vibeui-block="sidebar-002"]){
--vibeui-sidebar-002-width:12.5rem;
--vibeui-sidebar-002-bg:oklch(0.985 0.002 265);
--vibeui-sidebar-002-fg:oklch(0.24 0.014 265);
--vibeui-sidebar-002-muted:oklch(0.56 0.014 265);
--vibeui-sidebar-002-border:oklch(0.91 0.006 265);
--vibeui-sidebar-002-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-sidebar-002-active:oklch(0.55 0.02 265 / 13%);
--vibeui-sidebar-002-accent:oklch(0.55 0.2 262);
--vibeui-sidebar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
font-size:0.75rem;color:var(--vibeui-sidebar-002-muted);
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
color:inherit;text-decoration:none;font-size:0.8125rem;
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
flex:none;font-size:0.6875rem;color:var(--vibeui-sidebar-002-muted);
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
 * Сворачиваемая боковая навигация на чекбоксе: ширина в одной переменной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar002({
  items = DEFAULT_ITEMS,
  activeLabel = "Компоненты",
  title = "Свернуть",
  accent,
  className,
  style,
  ...props
}: Sidebar002Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
        <nav aria-label="Разделы">
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
