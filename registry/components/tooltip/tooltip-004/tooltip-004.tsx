import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip004Action = { glyph: string; label: string }

export type Tooltip004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  actions?: Tooltip004Action[]
  /** С какой стороны панели всплывают подсказки. */
  side?: "top" | "bottom"
  /** Имя панели для скринридера. */
  toolbarLabel?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: панель иконок, где подсказка — не украшение, а единственная
// подпись. Каждая кнопка несёт aria-label, а видимая подсказка привязана
// к своей ячейке, поэтому соседние подсказки не перекрывают друг друга.
const STYLES = `
:where([data-vibeui-block="tooltip-004"]){
--vibeui-tooltip-004-bg:transparent;
--vibeui-tooltip-004-fg:light-dark(oklch(0.26 0.014 265),oklch(0.92 0.006 265));
--vibeui-tooltip-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-tooltip-004-hover:light-dark(oklch(0.95 0.004 265),oklch(0.32 0.012 265));
--vibeui-tooltip-004-tip:light-dark(oklch(0.24 0.014 265),oklch(0.35 0.014 265));
--vibeui-tooltip-004-accent:light-dark(oklch(0.57 0.17 265),oklch(0.72 0.16 265));
--vibeui-tooltip-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-004"]{
display:inline-flex;align-items:center;gap:0.125rem;
padding:0.3125rem;box-sizing:border-box;
border:1px solid var(--vibeui-tooltip-004-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-004-bg);color:var(--vibeui-tooltip-004-fg);
font-family:var(--vibeui-tooltip-004-font);
box-shadow:0 14px 30px -24px oklch(0.2 0.02 265 / 55%);
}
/* Подсказка привязана к своей ячейке: соседние не перекрываются. */
[data-vibeui-block="tooltip-004"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-004"] [data-part="button"]{
appearance:none;cursor:pointer;border:0;background:transparent;
display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;border-radius:0.625rem;
color:inherit;font:inherit;font-size:0.9375rem;line-height:1;
transition:background-color .14s ease;
}
[data-vibeui-block="tooltip-004"] [data-part="button"]:hover{background:var(--vibeui-tooltip-004-hover)}
[data-vibeui-block="tooltip-004"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-004-accent);outline-offset:2px}
[data-vibeui-block="tooltip-004"] [data-part="divider"]{
width:1px;height:1.25rem;margin:0 0.25rem;background:var(--vibeui-tooltip-004-border);
}
[data-vibeui-block="tooltip-004"] [data-part="tip"]{
position:absolute;left:50%;z-index:30;
width:max-content;max-width:12rem;
padding:0.3125rem 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tooltip-004-tip);color:oklch(0.98 0.002 265);
font-size:0.6875rem;font-weight:560;line-height:1.35;text-align:center;
pointer-events:none;opacity:0;
transform:translate(-50%,0.1875rem);
transition:opacity .12s ease,transform .12s ease;
}
[data-vibeui-block="tooltip-004"][data-side="top"] [data-part="tip"]{bottom:calc(100% + 0.5rem)}
[data-vibeui-block="tooltip-004"][data-side="bottom"] [data-part="tip"]{top:calc(100% + 0.5rem);transform:translate(-50%,-0.1875rem)}
[data-vibeui-block="tooltip-004"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-004"] [data-part="item"]:focus-within [data-part="tip"]{opacity:1;transform:translate(-50%,0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Tooltip004Action[] = [
  { glyph: "↩", label: "Отменить действие" },
  { glyph: "↪", label: "Вернуть действие" },
  { glyph: "⧉", label: "Дублировать слой" },
  { glyph: "🗑", label: "Удалить слой" },
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
 * Панель иконок-кнопок, где подсказка служит единственной подписью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip004({
  actions = DEFAULT_ACTIONS,
  side = "top",
  toolbarLabel = "Действия над слоем",
  background = "",
  className,
  style,
  ...props
}: Tooltip004Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-004"
        data-side={side}
        role="toolbar"
        aria-label={toolbarLabel}
        className={className}
        style={palette}
      >
        {actions.map((action, index) => (
          <span data-part="item" key={action.label}>
            {index === actions.length - 1 ? (
              <span data-part="divider" aria-hidden="true" />
            ) : null}
            <button data-part="button" type="button" aria-label={action.label}>
              <span aria-hidden="true">{action.glyph}</span>
            </button>
            <span data-part="tip" aria-hidden="true">
              {action.label}
            </span>
          </span>
        ))}
      </div>
    </>
  )
}
