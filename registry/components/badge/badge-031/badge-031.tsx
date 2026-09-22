import type { ComponentProps, CSSProperties } from "react"

export type Badge031Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  styleKey?: string
  highlight?: boolean
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока logocloud-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-031"]){
--vibeui-badge-031-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-badge-031-dur-2:180ms;
--vibeui-badge-031-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-031"]{color-scheme:dark}
[data-vibeui-block="badge-031"]{box-sizing:border-box}
[data-vibeui-block="badge-031"] *{box-sizing:border-box}
[data-vibeui-block="badge-031"]{color:var(--vibeui-badge-031-logo);
font-size:1.1875rem;line-height:1;white-space:nowrap;
transition:color var(--vibeui-badge-031-dur-2) ease;
font-weight:750;letter-spacing:-0.035em;}
[data-vibeui-block="badge-031"][data-style="serif"]{font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;}
[data-vibeui-block="badge-031"][data-style="mono"]{font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;}
[data-vibeui-block="badge-031"][data-style="wide"]{font-size:0.9375rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;}
[data-vibeui-block="badge-031"][data-style="slab"]{font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;}
[data-vibeui-block="badge-031"][data-highlight]{color:var(--vibeui-badge-031-accent);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-031"] *{animation:none!important;transition:none!important}}
`

/** Название бренда с гарнитурой по data-style и выделением по data-highlight. */
export function Badge031({
  styleKey,
  highlight,
  name = "Nordwind",
  accent,
  className,
  style,
  ...props
}: Badge031Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-031" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-031"
        data-style={styleKey ?? "sans"}
        data-highlight={highlight || undefined}
        className={className}
        style={palette}
      >
        {name}
      </span>
    </>
  )
}
