import type { ComponentProps, CSSProperties } from "react"

export type Button091Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока language-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-091"]){
--vibeui-button-091-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-091-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-091-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-091-line:color-mix(in oklab,var(--vibeui-button-091-fg) 12%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-091"]{color-scheme:dark}
[data-vibeui-block="button-091"]{box-sizing:border-box}
[data-vibeui-block="button-091"] *{box-sizing:border-box}
[data-vibeui-block="button-091"]{display:inline-flex;align-items:center;padding:.45rem .85rem;border-radius:999px;border:1.5px solid var(--vibeui-button-091-line);background:transparent;color:var(--vibeui-button-091-fg);font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;transition:transform .18s,border-color .2s,background .2s,color .2s}
[data-vibeui-block="button-091"]:hover{transform:translateY(-1px);border-color:var(--vibeui-button-091-fg)}
[data-vibeui-block="button-091"][aria-pressed="true"]{background:var(--vibeui-button-091-fg);color:var(--vibeui-button-091-bg);border-color:transparent}
[data-vibeui-block="button-091"]:focus-visible{outline:2px solid var(--vibeui-button-091-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-091"] *{animation:none!important;transition:none!important}}
`

/** Чип-переключатель языка или уровня; активен через aria-pressed. */
export function Button091({
  label = "Английский",
  accent,
  className,
  style,
  ...props
}: Button091Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-091-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-091" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-091" type="button"
        className={className}
        style={palette}
      >
        {label}
      </button>
    </>
  )
}
