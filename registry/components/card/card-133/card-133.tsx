import type { ComponentProps, CSSProperties } from "react"

export type Card133Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  value?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-133"]){
--vibeui-card-133-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-133-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-133-muted:color-mix(in oklab,var(--vibeui-card-133-fg) 60%,var(--vibeui-card-133-bg));
--vibeui-card-133-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-133-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-133"]{color-scheme:dark}
[data-vibeui-block="card-133"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-133"] *{box-sizing:border-box}
[data-vibeui-block="card-133"] b{display:block;font-family:var(--vibeui-card-133-display);font-weight:800;font-size:clamp(1.8rem,4cqi,2.8rem);letter-spacing:-.04em;line-height:1;color:var(--vibeui-card-133-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-133"] small{display:block;margin-top:.3rem;font-size:.82rem;color:var(--vibeui-card-133-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-133"] *{animation:none!important;transition:none!important}}
`

/** Факт о студии: крупное значение и подпись; появление по прокрутке задаёт блок. */
export function Card133({
  label = "лет в продуктах",
  value = "7",
  accent,
  className,
  style,
  ...props
}: Card133Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-133-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-133" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-133" data-rise=""
        className={className}
        style={palette}
      >
        <b>{value}</b>
        <small>{label}</small>
      </li>
    </>
  )
}
