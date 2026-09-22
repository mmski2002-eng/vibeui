import type { ComponentProps, CSSProperties } from "react"

export type Card097Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  text?: string
  name?: string
  from?: string
  slotIndex?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const ANGLES = [-2, 1.5, 2, -1.2]

// Часть блока writer-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-097"]){
--vibeui-card-097-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-097-font:"PT Serif",Georgia,"Times New Roman",serif;
--vibeui-card-097-hand:"Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-card-097-muted:color-mix(in oklab,var(--vibeui-card-097-fg) 60%,var(--vibeui-card-097-bg));
--vibeui-card-097-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-097-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-097"]{color-scheme:dark}
[data-vibeui-block="card-097"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-097"] *{box-sizing:border-box}
@keyframes vibeui-card-097-in{from{opacity:0;transform:rotate(var(--vibeui-card-097-r,0deg)) translateY(.6rem)}}
[data-vibeui-block="card-097"]{position:relative;padding:.4rem .6rem .4rem 1.4rem;font-family:var(--vibeui-card-097-hand);font-size:1.45rem;line-height:1.2;color:var(--vibeui-card-097-accent);transform:rotate(var(--vibeui-card-097-r,0deg));animation:vibeui-card-097-in .7s cubic-bezier(.2,.8,.2,1) both;transition:opacity .4s,transform .4s}
[data-vibeui-block="card-097"][data-leaving="true"]{opacity:0;transform:rotate(var(--vibeui-card-097-r,0deg)) translateY(-.4rem)}
[data-vibeui-block="card-097"]::before{content:"";position:absolute;left:.2rem;top:.6rem;bottom:.6rem;width:2px;background:var(--vibeui-card-097-accent);opacity:.5;border-radius:2px}
[data-vibeui-block="card-097"] q{quotes:none}
[data-vibeui-block="card-097"] small{display:block;margin-top:.3rem;font-family:var(--vibeui-card-097-font);font-size:.75rem;font-style:italic;color:var(--vibeui-card-097-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-097"] *{animation:none!important;transition:none!important}}
`

/** Рукописная заметка читателя на полях: цитата и подпись с именем и городом; наклон через переменную. */
export function Card097({
  text,
  name,
  from,
  slotIndex,
  accent,
  className,
  style,
  ...props
}: Card097Props) {
  const palette = {
    ["--vibeui-card-097-r" as string]: `${ANGLES[slotIndex % ANGLES.length]}deg`,
    ...(accent ? { "--vibeui-card-097-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-097" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-097"
        className={className}
        style={palette}
      >
        <q>{text}</q>
        <small>
          — {name}
          {from ? `, ${from}` : ""}
        </small>
      </li>
    </>
  )
}
