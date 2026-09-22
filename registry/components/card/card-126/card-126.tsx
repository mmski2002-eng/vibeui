import type { ComponentProps, CSSProperties } from "react"

export type Card126Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  who?: string
  image?: string
  imageAlt?: string
  title?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-126"]){
--vibeui-card-126-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-126-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-126-card:light-dark(#ffffff,#242424);
--vibeui-card-126-display:"Cormorant Garamond",Georgia,serif;
--vibeui-card-126-line:light-dark(color-mix(in oklab,var(--vibeui-card-126-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-card-126-fg) 24%,transparent));
--vibeui-card-126-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-card-126-script:"Marck Script","Segoe Script",cursive;
--vibeui-card-126-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-126"]{color-scheme:dark}
[data-vibeui-block="card-126"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-126"] *{box-sizing:border-box}
[data-vibeui-block="card-126"]{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.1rem;align-items:center}
[data-vibeui-block="card-126"] figure{position:relative;margin:0;padding:.35rem;border:1px solid var(--vibeui-card-126-line);border-radius:.4rem;background:var(--vibeui-card-126-card);box-shadow:0 20px 40px -28px rgb(0 0 0 / .8),inset 0 0 0 1px rgb(242 238 230 / .05)}
[data-vibeui-block="card-126"] span{position:relative;display:block;aspect-ratio:4/5;overflow:hidden;border-radius:.2rem;background:var(--vibeui-card-126-bg)}
[data-vibeui-block="card-126"] span::after{content:"";position:absolute;inset:0;background:radial-gradient(40% 30% at 0 100%,rgb(242 238 230 / .4),transparent 70%),radial-gradient(35% 25% at 100% 0,rgb(242 238 230 / .3),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="card-126"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="card-126"] small{display:block;font-family:var(--vibeui-card-126-script);font-size:1.2rem;color:var(--vibeui-card-126-accent)}
[data-vibeui-block="card-126"] h3{margin:.1rem 0 .3rem;font-family:var(--vibeui-card-126-display);font-size:1.5rem;font-weight:500;line-height:1.1}
[data-vibeui-block="card-126"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-126-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-126"] *{animation:none!important;transition:none!important}}
`

/** Карточка образа: фото, кому и название. */
export function Card126({
  who = "Ей",
  image,
  imageAlt,
  title = "Длинное и тёплое",
  text = "Бархат, шерсть, плотный шёлк — в ночи, бордо или хвое. Шаль дадим на террасе. Каблук можно: в доме паркет.",
  accent,
  className,
  style,
  ...props
}: Card126Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-126-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-126" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-126"
        className={className}
        style={palette}
      >
        <figure>
          <span>{image ? <img src={image} alt={imageAlt ?? ""} loading="lazy" /> : null}</span>
        </figure>
        <div>
          <small>{who}</small>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      </li>
    </>
  )
}
