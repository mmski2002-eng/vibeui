import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tabbar001Item = {
  label: string
  href?: string
  /** Число на значке: непрочитанные, заказы, уведомления. */
  count?: number
}

export type Tabbar001Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Tabbar001Item[]
  activeLabel?: string
  accent?: string
}

// Идея компонента: нижняя панель навигации для телефона. Высота панели
// считается вместе с safe-area-inset-bottom, иначе на iPhone нижний пункт
// попадает под системную полосу. Активный пункт отмечен цветом и точкой
// сверху: одного цвета мало, когда экран на солнце.
const STYLES = `
:where([data-vibeui-block="tabbar-001"]){
--vibeui-tabbar-001-bg:oklch(1 0 0);
--vibeui-tabbar-001-fg:oklch(0.24 0.014 265);
--vibeui-tabbar-001-muted:oklch(0.56 0.014 265);
--vibeui-tabbar-001-border:oklch(0.91 0.006 265);
--vibeui-tabbar-001-accent:oklch(0.55 0.2 262);
--vibeui-tabbar-001-badge:oklch(0.56 0.19 25);
--vibeui-tabbar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tabbar-001"]{
display:flex;align-items:stretch;
width:100%;max-width:24rem;box-sizing:border-box;
padding-bottom:env(safe-area-inset-bottom,0px);
background:var(--vibeui-tabbar-001-bg);
border:1px solid var(--vibeui-tabbar-001-border);border-radius:1rem;
font-family:var(--vibeui-tabbar-001-font);
}
[data-vibeui-block="tabbar-001"] [data-part="item"]{
position:relative;flex:1 1 0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
min-height:3.25rem;padding:0.5rem 0.25rem;
color:var(--vibeui-tabbar-001-muted);text-decoration:none;
font-size:0.6875rem;line-height:1.1;
}
[data-vibeui-block="tabbar-001"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-tabbar-001-accent);outline-offset:-3px;border-radius:0.875rem}
[data-vibeui-block="tabbar-001"] [data-part="item"][aria-current="page"]{color:var(--vibeui-tabbar-001-accent);font-weight:650}
/* Точка сверху: активный пункт виден и когда цвет на солнце не читается. */
[data-vibeui-block="tabbar-001"] [data-part="item"][aria-current="page"]::before{
content:"";position:absolute;top:0.375rem;
width:0.25rem;height:0.25rem;border-radius:9999px;
background:var(--vibeui-tabbar-001-accent);
}
[data-vibeui-block="tabbar-001"] [data-part="glyph"]{
position:relative;
width:1.25rem;height:1.25rem;border-radius:0.4375rem;
border:1.5px solid currentColor;
}
[data-vibeui-block="tabbar-001"] [data-part="item"]:nth-child(2) [data-part="glyph"]{border-radius:9999px}
[data-vibeui-block="tabbar-001"] [data-part="item"]:nth-child(3) [data-part="glyph"]{border-radius:0.1875rem;transform:rotate(45deg)}
/* Значок вынесен из фигуры: иначе он поворачивается вместе с ней. */
[data-vibeui-block="tabbar-001"] [data-part="count"]{
position:absolute;top:0.5rem;left:calc(50% + 0.125rem);
min-width:1rem;height:1rem;padding:0 0.25rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border-radius:9999px;background:var(--vibeui-tabbar-001-badge);
color:oklch(1 0 0);font-size:0.625rem;font-weight:650;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabbar-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabbar001Item[] = [
  { label: "Каталог", href: "#" },
  { label: "Поиск", href: "#" },
  { label: "Заказы", href: "#", count: 3 },
  { label: "Профиль", href: "#" },
]

/**
 * Нижняя панель навигации: safe area учтена, активный пункт помечен точкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabbar001({
  items = DEFAULT_ITEMS,
  activeLabel = "Каталог",
  accent,
  className,
  style,
  ...props
}: Tabbar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-tabbar-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tabbar-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="tabbar-001"
        aria-label="Основная навигация"
        className={className}
        style={palette}
      >
        {items.map((item) => (
          <a
            key={item.label}
            data-part="item"
            href={item.href ?? "#"}
            aria-current={item.label === activeLabel ? "page" : undefined}
            aria-label={
              item.count ? `${item.label}, новых: ${item.count}` : undefined
            }
          >
            <span data-part="glyph" aria-hidden="true" />
            {item.count ? (
              <span data-part="count" aria-hidden="true">
                {item.count}
              </span>
            ) : null}
            {item.label}
          </a>
        ))}
      </nav>
    </>
  )
}
