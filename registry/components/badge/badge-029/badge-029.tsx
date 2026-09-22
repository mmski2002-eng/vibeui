import type { ComponentProps, CSSProperties } from "react"

export type Badge029Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  styleKey?: string
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока logocloud-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-029"]){
--vibeui-badge-029-dur-2:180ms;
--vibeui-badge-029-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-029"]{color-scheme:dark}
[data-vibeui-block="badge-029"]{box-sizing:border-box}
[data-vibeui-block="badge-029"] *{box-sizing:border-box}
[data-vibeui-block="badge-029"]{color:var(--vibeui-badge-029-logo);
font-size:1.25rem;line-height:1;white-space:nowrap;
transition:color var(--vibeui-badge-029-dur-2) ease;
font-weight:750;letter-spacing:-0.035em;}
[data-vibeui-block="badge-029"][data-style="serif"]{font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;}
[data-vibeui-block="badge-029"][data-style="mono"]{font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;}
[data-vibeui-block="badge-029"][data-style="wide"]{font-size:1rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;}
[data-vibeui-block="badge-029"][data-style="slab"]{font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-029"] *{animation:none!important;transition:none!important}}
`

/** Название бренда как логотип: гарнитура по data-style (гротеск, антиква, моно, дисплей). */
export function Badge029({
  styleKey,
  name = "Nordwind",
  accent,
  className,
  style,
  ...props
}: Badge029Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-029-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-029" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-029" data-style={styleKey ?? "sans"}
        className={className}
        style={palette}
      >
        {name}
      </span>
    </>
  )
}
