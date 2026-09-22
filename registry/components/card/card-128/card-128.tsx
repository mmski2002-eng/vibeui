import type { ComponentProps, CSSProperties } from "react"

export type Card128Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  value?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-128"]){
--vibeui-card-128-accent-ink:light-dark(var(--vibeui-card-128-accent),color-mix(in oklab,var(--vibeui-card-128-accent) 55%,var(--vibeui-card-128-fg)));
--vibeui-card-128-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-card-128-muted:light-dark(color-mix(in oklab,var(--vibeui-card-128-fg) 60%,var(--vibeui-card-128-bg)),color-mix(in oklab,var(--vibeui-card-128-fg) 58%,var(--vibeui-card-128-bg)));
--vibeui-card-128-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-128-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-128-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-128"]{color-scheme:dark}
[data-vibeui-block="card-128"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-128"] *{box-sizing:border-box}
[data-vibeui-block="card-128"] b{display:block;font-family:var(--vibeui-card-128-display);font-size:2rem;font-weight:400;line-height:1;color:var(--vibeui-card-128-accent-ink)}
[data-vibeui-block="card-128"] span{display:block;margin-top:.3rem;font-size:.78rem;color:var(--vibeui-card-128-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-128"] *{animation:none!important;transition:none!important}}
`

/** Короткий факт о компании: крупное значение и подпись под ним. */
export function Card128({
  label = "лет на кухне",
  value = "18",
  accent,
  className,
  style,
  ...props
}: Card128Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-128-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-128" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-128"
        className={className}
        style={palette}
      >
        <b>{value}</b>
        <span>{label}</span>
      </li>
    </>
  )
}
