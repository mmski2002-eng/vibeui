import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollarea001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  height?: string
}

// Идея компонента: область прокрутки с подтёртыми краями. Тень у границы —
// единственный честный признак, что список продолжается; без неё обрезанная
// строка читается как последняя. Полоса прокрутки остаётся видимой: спрятать
// её значит убрать второй признак и возможность тащить мышью.
const STYLES = `
:where([data-vibeui-block="scrollarea-001"]){
--vibeui-scrollarea-001-bg:oklch(1 0 0);
--vibeui-scrollarea-001-fg:oklch(0.24 0.014 265);
--vibeui-scrollarea-001-muted:oklch(0.56 0.014 265);
--vibeui-scrollarea-001-border:oklch(0.9 0.006 265);
--vibeui-scrollarea-001-height:12rem;
--vibeui-scrollarea-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollarea-001"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-001-bg);
border:1px solid var(--vibeui-scrollarea-001-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-001-font);color:var(--vibeui-scrollarea-001-fg);
}
[data-vibeui-block="scrollarea-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-scrollarea-001-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-001"] [data-part="count"]{font-weight:500;color:var(--vibeui-scrollarea-001-muted);font-size:0.75rem}
/* Края подтёрты маской: обрезанная строка иначе читается как последняя. */
[data-vibeui-block="scrollarea-001"] [data-part="area"]{
height:var(--vibeui-scrollarea-001-height);overflow-y:auto;overscroll-behavior:contain;
scrollbar-width:thin;
mask:linear-gradient(to bottom,transparent,oklch(0 0 0) 0.75rem,oklch(0 0 0) calc(100% - 0.75rem),transparent);
}
[data-vibeui-block="scrollarea-001"] ul{margin:0;padding:0.375rem;list-style:none}
[data-vibeui-block="scrollarea-001"] li{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="scrollarea-001"] li:nth-child(odd){background:oklch(0.975 0.002 265)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="scrollarea-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "button-001 · Action Button",
  "button-013 · Segmented Control",
  "calendar-002 · Range Picker",
  "card-004 · Product Card",
  "carousel-004 · Logo Marquee",
  "checkbox-003 · Parent Checkbox",
  "chart-007 · Gauge",
  "menu-003 · Menubar",
  "input-005 · Phone Field",
  "toast-002 · Undo Toast",
]

/**
 * Область прокрутки с подтёртыми краями и видимой полосой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea001({
  title = "Последние компоненты",
  items = DEFAULT_ITEMS,
  height = "12rem",
  className,
  style,
  ...props
}: Scrollarea001Props) {
  const palette = {
    "--vibeui-scrollarea-001-height": height,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollarea-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <span data-part="count">{items.length}</span>
        </div>
        <div data-part="area" tabIndex={0} role="group" aria-label={title}>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
