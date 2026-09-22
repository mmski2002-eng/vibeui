import type { ComponentProps, CSSProperties } from "react"

export type Card132Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  date?: string
  image?: string
  imageAlt?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-132"]){
--vibeui-card-132-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-132-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-132-card:light-dark(#ffffff,#242424);
--vibeui-card-132-display:"Cormorant Garamond",Georgia,serif;
--vibeui-card-132-line:light-dark(color-mix(in oklab,var(--vibeui-card-132-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-card-132-fg) 22%,transparent));
--vibeui-card-132-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-card-132-silver:#9fb0c8;
--vibeui-card-132-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-132"]{color-scheme:dark}
[data-vibeui-block="card-132"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-132"] *{box-sizing:border-box}
[data-vibeui-block="card-132"]{position:relative;opacity:.45;transform:translateY(.6rem);transition:opacity .7s,transform .7s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="card-132"][data-lit="true"]{opacity:1;transform:none}
[data-vibeui-block="card-132"] [data-part="dot"]{position:absolute;left:-1.6rem;top:.45rem;width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-card-132-bg);border:1px solid var(--vibeui-card-132-silver);transition:background .6s,border-color .6s,box-shadow .6s}
[data-vibeui-block="card-132"][data-lit="true"] [data-part="dot"]{background:var(--vibeui-card-132-accent);border-color:var(--vibeui-card-132-accent)}
[data-vibeui-block="card-132"][data-now="true"] [data-part="dot"]{box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-card-132-accent) 25%,transparent)}
[data-vibeui-block="card-132"] [data-part="date"]{display:block;margin:0 0 .5rem;font-family:var(--vibeui-card-132-display);font-style:italic;font-size:1rem;font-weight:500;letter-spacing:.02em;color:var(--vibeui-card-132-accent)}
[data-vibeui-block="card-132"] figure{position:relative;margin:0 0 .8rem;aspect-ratio:3/2;overflow:hidden;border-radius:.5rem;background:var(--vibeui-card-132-card);border:1px solid var(--vibeui-card-132-line)}
[data-vibeui-block="card-132"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.85) brightness(.9);transition:filter .7s}
[data-vibeui-block="card-132"][data-lit="true"] img{filter:none}
[data-vibeui-block="card-132"] figure::after{content:"";position:absolute;inset:0;background:radial-gradient(35% 30% at 0 100%,rgb(242 238 230 / .3),transparent 70%),radial-gradient(30% 25% at 100% 0,rgb(242 238 230 / .2),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="card-132"] h3{margin:0;font-family:var(--vibeui-card-132-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="card-132"] p{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-card-132-muted)}
@container (min-width:56rem){
[data-vibeui-block="card-132"] [data-part="dot"]{left:0;top:-2.68rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-132"]{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-132"] *{animation:none!important;transition:none!important}}
`

/** Событие таймлайна: точка, дата, заголовок и текст; подсвечено по data-lit и data-now. */
export function Card132({
  title = "Кадр таймлайна",
  date = "Декабрь 2023",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  text = "Кадр таймлайна",
  accent,
  className,
  style,
  ...props
}: Card132Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-132-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-132" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-132"
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="date">{date}</span>
        <figure>{image ? <img src={image} alt={imageAlt ?? ""} loading="lazy" /> : null}</figure>
        <h3>{title}</h3>
        {text ? <p>{text}</p> : null}
      </li>
    </>
  )
}
