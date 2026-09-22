import type { ComponentProps, CSSProperties } from "react"

export type Card080Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  years?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-080"]){
--vibeui-card-080-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-080-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-080-font:"PT Serif",Georgia,"Times New Roman",serif;
--vibeui-card-080-line:color-mix(in oklab,var(--vibeui-card-080-fg) 14%,transparent);
--vibeui-card-080-muted:color-mix(in oklab,var(--vibeui-card-080-fg) 60%,var(--vibeui-card-080-bg));
--vibeui-card-080-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-080-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-080"]{color-scheme:dark}
[data-vibeui-block="card-080"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-080"] *{box-sizing:border-box}
[data-vibeui-block="card-080"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:.55rem 0;border-top:1px solid var(--vibeui-card-080-line);font-family:var(--vibeui-card-080-display);font-size:1.35rem;transition:padding-left .4s cubic-bezier(.2,.8,.2,1),color .3s}
[data-vibeui-block="card-080"]:hover{padding-left:.6rem;color:var(--vibeui-card-080-accent)}
[data-vibeui-block="card-080"] small{font-family:var(--vibeui-card-080-font);font-size:.8rem;font-style:italic;color:var(--vibeui-card-080-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-080"] *{animation:none!important;transition:none!important}}
`

/** Строка списка городов: название и годы, подсветка при наведении. */
export function Card080({
  name = "Петербург",
  years = "1991–2014",
  accent,
  className,
  style,
  ...props
}: Card080Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-080-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-080" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-080"
        className={className}
        style={palette}
      >
        <span>{name}</span>
        <small>{years}</small>
      </li>
    </>
  )
}
