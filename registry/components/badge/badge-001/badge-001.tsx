import type { ComponentProps, CSSProperties } from "react"

export type Badge001Tone = "neutral" | "success" | "warning" | "danger" | "info"

export type Badge001Props = ComponentProps<"span"> & {
  tone?: Badge001Tone
  /** Точка-индикатор слева. Без неё остаётся просто плашка с текстом. */
  dot?: boolean
  size?: "sm" | "md"
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: цвет несёт точка, а не вся плашка. В таблице из двадцати
// строк пять разноцветных заливок читаются как авария; нейтральная плашка с
// цветной точкой оставляет статус заметным, но не кричащим.
const STYLES = `
:where([data-vibeui-block="badge-001"]){
--vibeui-badge-001-fg:light-dark(oklch(0.32 0 265),oklch(0.92 0 265));
--vibeui-badge-001-bg:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-badge-001-border:light-dark(oklch(0.89 0 265),oklch(0.39 0 265));
--vibeui-badge-001-dot:light-dark(oklch(0.62 0 265),oklch(0.7 0 265));
--vibeui-badge-001-radius:9999px;
--vibeui-badge-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-001"]{color-scheme:dark}
[data-vibeui-block="badge-001"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-001-border);
border-radius:var(--vibeui-badge-001-radius);
background:var(--vibeui-badge-001-bg);color:var(--vibeui-badge-001-fg);
font-family:var(--vibeui-badge-001-font);font-size:0.75rem;font-weight:500;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-001"][data-size="sm"]{height:1.25rem;padding:0 0.5rem;font-size:0.6875rem;gap:0.375rem}
[data-vibeui-block="badge-001"] [data-part="dot"]{
width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-badge-001-dot);
}
[data-vibeui-block="badge-001"][data-size="sm"] [data-part="dot"]{width:0.3125rem;height:0.3125rem}
[data-vibeui-block="badge-001"][data-tone="success"]{--vibeui-badge-001-dot:light-dark(oklch(0.63 0.17 152),oklch(0.76 0.16 152))}
[data-vibeui-block="badge-001"][data-tone="warning"]{--vibeui-badge-001-dot:light-dark(oklch(0.75 0.16 75),oklch(0.83 0.15 75))}
[data-vibeui-block="badge-001"][data-tone="danger"]{--vibeui-badge-001-dot:light-dark(oklch(0.58 0.2 25),oklch(0.71 0.19 25))}
[data-vibeui-block="badge-001"][data-tone="info"]{--vibeui-badge-001-dot:light-dark(oklch(0.58 0.18 262),oklch(0.73 0.16 262))}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-001"] *{animation:none!important;transition:none!important}}
`

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
 * Статусная плашка, в которой цвет несёт только точка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge001({
  tone = "success",
  dot = true,
  size = "md",
  background = "",
  className,
  style,
  children = "Опубликовано",
  ...props
}: Badge001Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-001"
        data-tone={tone}
        data-size={size}
        className={className}
        style={palette}
      >
        {dot ? <span data-part="dot" aria-hidden="true" /> : null}
        {children}
      </span>
    </>
  )
}
