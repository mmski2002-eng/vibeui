import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge001Tone = "neutral" | "success" | "warning" | "danger" | "info"

export type Badge001Props = ComponentPropsWithoutRef<"span"> & {
  tone?: Badge001Tone
  /** Точка-индикатор слева. Без неё остаётся просто плашка с текстом. */
  dot?: boolean
  size?: "sm" | "md"
}

// Идея компонента: цвет несёт точка, а не вся плашка. В таблице из двадцати
// строк пять разноцветных заливок читаются как авария; нейтральная плашка с
// цветной точкой оставляет статус заметным, но не кричащим.
const STYLES = `
:where([data-vibeui-block="badge-001"]){
--vibeui-badge-001-fg:oklch(0.32 0.014 265);
--vibeui-badge-001-bg:oklch(0.96 0.004 265);
--vibeui-badge-001-border:oklch(0.89 0.006 265);
--vibeui-badge-001-dot:oklch(0.62 0.014 265);
--vibeui-badge-001-radius:9999px;
--vibeui-badge-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="badge-001"][data-tone="success"]{--vibeui-badge-001-dot:oklch(0.63 0.17 152)}
[data-vibeui-block="badge-001"][data-tone="warning"]{--vibeui-badge-001-dot:oklch(0.75 0.16 75)}
[data-vibeui-block="badge-001"][data-tone="danger"]{--vibeui-badge-001-dot:oklch(0.58 0.2 25)}
[data-vibeui-block="badge-001"][data-tone="info"]{--vibeui-badge-001-dot:oklch(0.58 0.18 262)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Статусная плашка, в которой цвет несёт только точка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge001({
  tone = "success",
  dot = true,
  size = "md",
  className,
  style,
  children = "Опубликовано",
  ...props
}: Badge001Props) {
  return (
    <>
      <style href="vibeui-badge-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-001"
        data-tone={tone}
        data-size={size}
        className={className}
        style={style as CSSProperties}
      >
        {dot ? <span data-part="dot" aria-hidden="true" /> : null}
        {children}
      </span>
    </>
  )
}
