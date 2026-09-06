import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea001Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  height?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: область прокрутки с подтёртыми краями. Тень у границы —
// единственный честный признак, что список продолжается; без неё обрезанная
// строка читается как последняя. Полоса прокрутки остаётся видимой: спрятать
// её значит убрать второй признак и возможность тащить мышью.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="scrollarea-001"]){
--vibeui-scrollarea-001-bg:transparent;
--vibeui-scrollarea-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-scrollarea-001-muted:color-mix(in oklab,var(--vibeui-scrollarea-001-fg) 68%,transparent);
--vibeui-scrollarea-001-border:light-dark(oklch(0.9 0 265),oklch(0.33 0 265));
--vibeui-scrollarea-001-stripe:light-dark(oklch(0.975 0 265),oklch(0.255 0 265));
--vibeui-scrollarea-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-scrollarea-001-height:12rem;
--vibeui-scrollarea-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-001"]{color-scheme:dark}
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
/* Область получает фокус с клавиатуры, значит обязана его показывать. */
[data-vibeui-block="scrollarea-001"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-001-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-001"] ul{margin:0;padding:0.375rem;list-style:none}
[data-vibeui-block="scrollarea-001"] li{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="scrollarea-001"] li:nth-child(odd){background:var(--vibeui-scrollarea-001-stripe)}
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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Область прокрутки с подтёртыми краями и видимой полосой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea001({
  title = "Последние компоненты",
  items = DEFAULT_ITEMS,
  height = "12rem",
  background = "",
  className,
  style,
  ...props
}: Scrollarea001Props) {
  const palette = {
    "--vibeui-scrollarea-001-height": height,
    ...(background
      ? {
          "--vibeui-scrollarea-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <span data-part="count">{items.length}</span>
        </div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
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
