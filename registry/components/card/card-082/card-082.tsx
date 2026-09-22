import type { ComponentProps, CSSProperties } from "react"

export type Card082Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  city?: string
  note?: string
  count?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока charity-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-082"]){
--vibeui-card-082-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-082-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-card-082-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-082-soft:color-mix(in oklab,var(--vibeui-card-082-fg) 5%,var(--vibeui-card-082-bg));
--vibeui-card-082-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-082-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-082"]{color-scheme:dark}
[data-vibeui-block="card-082"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-082"] *{box-sizing:border-box}
[data-vibeui-block="card-082"]{display:grid;grid-template-columns:1.6rem minmax(0,1fr) auto;align-items:center;gap:.6rem;padding:.55rem .7rem;border-radius:.7rem;opacity:.35;transform:translateX(-6px);transition:opacity .4s,transform .4s,background .2s;cursor:default}
[data-vibeui-block="card-082"][data-lit="true"]{opacity:1;transform:none}
[data-vibeui-block="card-082"]:hover{background:var(--vibeui-card-082-soft)}
[data-vibeui-block="card-082"] i{width:.6rem;height:.6rem;margin:0 auto;border-radius:50%;background:var(--vibeui-card-082-accent)}
[data-vibeui-block="card-082"] span{font-weight:500}
[data-vibeui-block="card-082"] span small{margin-left:.5rem;font-family:var(--vibeui-card-082-hand);font-size:1.1rem;color:var(--vibeui-card-082-accent)}
[data-vibeui-block="card-082"] b{font-family:var(--vibeui-card-082-display);font-weight:700;font-size:1.15rem;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-082"]{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-082"] *{animation:none!important;transition:none!important}}
`

/** Строка списка точек на карте: индикатор, город и заметка; подсветка по data-lit. */
export function Card082({
  city = "Тверь",
  note,
  count = 96,
  accent,
  className,
  style,
  ...props
}: Card082Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-082-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-082" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-082"
        className={className}
        style={palette}
      >
        <i aria-hidden="true" />
        <span>
          {city}
          {note ? <small>{note}</small> : null}
        </span>
        <b>{count}</b>
      </li>
    </>
  )
}
