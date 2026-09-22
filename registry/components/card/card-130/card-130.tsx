import type { ComponentProps, CSSProperties } from "react"

export type Card130Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  image?: string
  imageAlt?: string
  date?: string
  text?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-130"]){
--vibeui-card-130-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-130-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-130-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-130-film:light-dark(var(--vibeui-card-130-fg),#0c0c0c);
--vibeui-card-130-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-card-130-plum:var(--vibeui-card-130-fg);
--vibeui-card-130-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-card-130-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-130"]{color-scheme:dark}
[data-vibeui-block="card-130"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-130"] *{box-sizing:border-box}
[data-vibeui-block="card-130"]{flex:0 0 min(78cqi,20rem);scroll-snap-align:center;transform:rotate(var(--vibeui-card-130-tilt,0deg));transition:transform .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="card-130"]:nth-child(odd){--vibeui-card-130-tilt:-2deg}
[data-vibeui-block="card-130"]:nth-child(even){--vibeui-card-130-tilt:1.6deg}
[data-vibeui-block="card-130"]:nth-child(3n){--vibeui-card-130-tilt:-1deg}
[data-vibeui-block="card-130"]:hover{transform:rotate(0) translateY(-.35rem)}
[data-vibeui-block="card-130"] [data-part="film"]{position:relative;padding:1.1rem .6rem;border-radius:.4rem;background:var(--vibeui-card-130-film);box-shadow:0 24px 40px -24px rgb(43 26 36 / .6),0 0 0 1px rgb(255 255 255 / .06)}
[data-vibeui-block="card-130"] [data-part="film"]::before,[data-vibeui-block="card-130"] [data-part="film"]::after{content:"";position:absolute;left:.6rem;right:.6rem;height:.5rem;background:repeating-linear-gradient(90deg,var(--vibeui-card-130-bg) 0 .55rem,transparent .55rem 1.1rem);border-radius:2px;opacity:.85}
[data-vibeui-block="card-130"] [data-part="film"]::before{top:.3rem}
[data-vibeui-block="card-130"] [data-part="film"]::after{bottom:.3rem}
[data-vibeui-block="card-130"] [data-part="picture"]{display:block;aspect-ratio:3/2;overflow:hidden;background:var(--vibeui-card-130-sand)}
[data-vibeui-block="card-130"] [data-part="picture"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.02)}
[data-vibeui-block="card-130"] [data-part="stamp"]{position:absolute;right:.9rem;bottom:1.4rem;font-family:var(--vibeui-card-130-display);font-size:.8rem;letter-spacing:.1em;color:var(--vibeui-card-130-accent);text-transform:uppercase;mix-blend-mode:screen}
[data-vibeui-block="card-130"] [data-part="caption"]{padding:1rem .35rem 0}
[data-vibeui-block="card-130"] [data-part="date"]{display:block;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-card-130-accent)}
[data-vibeui-block="card-130"] [data-part="name"]{display:block;margin:.3rem 0 .2rem;font-family:var(--vibeui-card-130-display);font-size:1.5rem;font-weight:500;line-height:1.15;color:var(--vibeui-card-130-plum)}
[data-vibeui-block="card-130"] [data-part="text"]{margin:0;font-size:.92rem;color:var(--vibeui-card-130-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-130"] *{animation:none!important;transition:none!important}}
`

/** Кадр фотоплёнки: фото в перфорированной рамке, подпись с годом, заголовок и текст. */
export function Card130({
  title = "Кофе у окна",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  date = "Октябрь 2021",
  text = "Кадр плёнки",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card130Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-130-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-130" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-130"
        className={className}
        style={palette}
      >
        <div data-part="film">
          <span data-part="picture">{image ? <img src={image} alt={imageAlt ?? ""} loading="lazy" /> : null}</span>
          <span data-part="stamp" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}A
          </span>
        </div>
        <div data-part="caption">
          <span data-part="date">{date}</span>
          <span data-part="name">{title}</span>
          {text ? <p data-part="text">{text}</p> : null}
        </div>
      </li>
    </>
  )
}
