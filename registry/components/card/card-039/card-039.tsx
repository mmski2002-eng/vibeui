import type { ComponentProps, CSSProperties } from "react"

export type Card039Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  text?: string
  name?: string
  note?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-020, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-039"]){
--vibeui-card-039-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-039-brass:#c9a35a;
--vibeui-card-039-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-039-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-039-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-card-039-note:light-dark(#fffdf8,#3a3a3a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-039"]{color-scheme:dark}
[data-vibeui-block="card-039"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-039"] *{box-sizing:border-box}
@keyframes vibeui-card-039-pin{from{opacity:0;transform:rotate(var(--vibeui-card-039-tilt,0deg)) scale(1.3) translateY(-1rem)}}
[data-vibeui-block="card-039"]{position:relative;padding:1.6rem 1rem 1rem;background:var(--vibeui-card-039-note);box-shadow:0 14px 24px -16px rgb(43 26 36 / .7);transform:rotate(var(--vibeui-card-039-tilt,0deg));transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="card-039"]:hover{transform:rotate(0) scale(1.03);box-shadow:0 22px 34px -18px rgb(43 26 36 / .7);z-index:1}
[data-vibeui-block="card-039"][data-fresh="true"]{animation:vibeui-card-039-pin .6s cubic-bezier(.2,.9,.3,1.3) both}
[data-vibeui-block="card-039"] [data-part="pin"]{position:absolute;top:-.45rem;left:50%;width:.95rem;height:.95rem;margin-left:-.475rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2dca6,var(--vibeui-card-039-brass) 55%,#8a6a2a);box-shadow:0 3px 6px -2px rgb(0 0 0 / .5)}
[data-vibeui-block="card-039"] p{margin:0;font-family:var(--vibeui-card-039-display);font-size:1.15rem;line-height:1.35;color:var(--vibeui-card-039-fg)}
[data-vibeui-block="card-039"] footer{margin-top:.8rem;font-size:.78rem;color:var(--vibeui-card-039-muted)}
[data-vibeui-block="card-039"] footer b{display:block;font-weight:600;color:var(--vibeui-card-039-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-039"] *{animation:none!important;transition:none!important}}
`

/** Карточка-записка с канцелярской кнопкой: текст пожелания, имя и пометка; наклон задаёт блок через переменную. */
export function Card039({
  text,
  name,
  note,
  accent,
  className,
  style,
  ...props
}: Card039Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-039-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-039" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-039"
        className={className}
        style={palette}
      >
        <span data-part="pin" aria-hidden="true" />
        <p>{text}</p>
        <footer>
          <b>{name}</b>
          {note}
        </footer>
      </article>
    </>
  )
}
