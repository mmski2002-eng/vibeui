import type { ComponentProps, CSSProperties } from "react"

export type Button092Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  label?: string
  count?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока market-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-092"]){
--vibeui-button-092-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-092-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-092-line:color-mix(in oklab,var(--vibeui-button-092-fg) 12%,transparent);
--vibeui-button-092-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-button-092-soft:color-mix(in oklab,var(--vibeui-button-092-fg) 5%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-092"]{color-scheme:dark}
[data-vibeui-block="button-092"]{box-sizing:border-box}
[data-vibeui-block="button-092"] *{box-sizing:border-box}
[data-vibeui-block="button-092"]{height:2.2rem;padding:0 .95rem;border-radius:999px;border:1px solid var(--vibeui-button-092-line);background:transparent;color:var(--vibeui-button-092-fg);font:inherit;font-size:.86rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="button-092"]:hover{background:var(--vibeui-button-092-soft)}
[data-vibeui-block="button-092"][aria-pressed="true"]{background:var(--vibeui-button-092-fg);color:var(--vibeui-button-092-bg);border-color:var(--vibeui-button-092-fg)}
[data-vibeui-block="button-092"] small{margin-left:.4rem;font-family:var(--vibeui-button-092-mono);font-size:.66rem;opacity:.6}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-092"] *{animation:none!important;transition:none!important}}
`

/** Чип фильтра категории с числом товаров; активен через aria-pressed. */
export function Button092({
  label = "Figma",
  count,
  accent,
  className,
  style,
  ...props
}: Button092Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-092-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-092" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-092" type="button"
        className={className}
        style={palette}
      >
        {label}
        <small>{count}</small>
      </button>
    </>
  )
}
