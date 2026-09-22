import type { ComponentProps, CSSProperties } from "react"

export type Button095Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  item?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока api-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-095"]){
--vibeui-button-095-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-095-line:color-mix(in oklab,var(--vibeui-button-095-fg) 12%,transparent);
--vibeui-button-095-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-button-095-muted:color-mix(in oklab,var(--vibeui-button-095-fg) 60%,var(--vibeui-button-095-bg));
--vibeui-button-095-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-095"]{color-scheme:dark}
[data-vibeui-block="button-095"]{box-sizing:border-box}
[data-vibeui-block="button-095"] *{box-sizing:border-box}
[data-vibeui-block="button-095"]{padding:.3rem .65rem;border:1px solid var(--vibeui-button-095-line);border-radius:999px;background:transparent;color:var(--vibeui-button-095-muted);font-family:var(--vibeui-button-095-mono);font-size:.7rem;cursor:pointer;transition:color .2s,border-color .2s}
[data-vibeui-block="button-095"]:hover{color:var(--vibeui-button-095-fg);border-color:var(--vibeui-button-095-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-095"] *{animation:none!important;transition:none!important}}
`

/** Чип-подсказка адреса для строки запроса. */
export function Button095({
  item,
  accent,
  className,
  style,
  ...props
}: Button095Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-095-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-095" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-095" type="button"
        className={className}
        style={palette}
      >
        {item}
      </button>
    </>
  )
}
