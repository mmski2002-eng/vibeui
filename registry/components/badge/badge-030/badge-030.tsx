import type { ComponentProps, CSSProperties } from "react"

export type Badge030Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  styleKey?: string
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока logocloud-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-030"]){
--vibeui-badge-030-dur-2:180ms;
--vibeui-badge-030-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-030"]{color-scheme:dark}
[data-vibeui-block="badge-030"]{box-sizing:border-box}
[data-vibeui-block="badge-030"] *{box-sizing:border-box}
[data-vibeui-block="badge-030"]{color:var(--vibeui-badge-030-logo);
font-size:1.375rem;line-height:1;white-space:nowrap;
transition:color var(--vibeui-badge-030-dur-2) ease;
font-weight:750;letter-spacing:-0.035em;}
[data-vibeui-block="badge-030"][data-style="serif"]{font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;}
[data-vibeui-block="badge-030"][data-style="mono"]{font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;}
[data-vibeui-block="badge-030"][data-style="wide"]{font-size:1.0625rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;}
[data-vibeui-block="badge-030"][data-style="slab"]{font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-030"] *{animation:none!important;transition:none!important}}
`

/** Название бренда для бегущей строки логотипов: гарнитура по data-style. */
export function Badge030({
  styleKey,
  name = "Nordwind",
  accent,
  className,
  style,
  ...props
}: Badge030Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-030-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-030" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-030" data-style={styleKey ?? "sans"}
        className={className}
        style={palette}
      >
        {name}
      </span>
    </>
  )
}
