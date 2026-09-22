import type { ComponentProps, CSSProperties } from "react"

export type Cell001Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  value?: string
  columns?: readonly string[]
  column?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока comparison-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="cell-001"]){
--vibeui-cell-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cell-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cell-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-cell-001-muted:color-mix(in oklab,var(--vibeui-cell-001-fg) 60%,var(--vibeui-cell-001-bg));
--vibeui-cell-001-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cell-001"]{color-scheme:dark}
[data-vibeui-block="cell-001"]{box-sizing:border-box}
[data-vibeui-block="cell-001"] *{box-sizing:border-box}
[data-vibeui-block="cell-001"]{font-family:var(--vibeui-cell-001-mono);font-size:.82rem;color:var(--vibeui-cell-001-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="cell-001"][data-us]{color:var(--vibeui-cell-001-fg);font-weight:600;display:block}
[data-vibeui-block="cell-001"][data-us]::before{content:"";display:inline-block;width:.4rem;height:.4rem;margin-right:.45rem;border-radius:50%;background:var(--vibeui-cell-001-accent);box-shadow:0 0 6px var(--vibeui-cell-001-accent);vertical-align:.1em}
[data-vibeui-block="cell-001"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cell-001"] *{animation:none!important;transition:none!important}}
`

/** Значение в строке сравнения со скрытой подписью колонки для читалок; «мы» по data-us. */
export function Cell001({
  value = "99,9 %",
  columns = ["Мы", "Другие"],
  column = 0,
  accent,
  className,
  style,
  ...props
}: Cell001Props) {
  const palette = {
    ...(accent ? { "--vibeui-cell-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cell-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="typography"
        data-vibeui-block="cell-001"
        className={className}
        style={palette}
      >
        <span data-part="sr">{columns[column]}: </span>
        {value}
      </span>
    </>
  )
}
