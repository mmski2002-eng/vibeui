import type { ComponentProps, CSSProperties } from "react"

export type Card124Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  who?: string
  image?: string
  imageAlt?: string
  title?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-124"]){
--vibeui-card-124-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-124-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-card-124-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-card-124-sand:light-dark(#f4f4f4,#242424);
--vibeui-card-124-script:"Lobster","Brush Script MT",cursive;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-124"]{color-scheme:dark}
[data-vibeui-block="card-124"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-124"] *{box-sizing:border-box}
[data-vibeui-block="card-124"]{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1rem;align-items:center}
[data-vibeui-block="card-124"] figure{position:relative;margin:0;padding:.4rem .4rem 1.2rem;background:#fffaf0;box-shadow:0 16px 30px -22px rgb(18 58 75 / .6);transform:rotate(-3deg)}
[data-vibeui-block="card-124"]:nth-child(even) figure{transform:rotate(2.5deg)}
[data-vibeui-block="card-124"] figure::before{content:"";position:absolute;top:-.5rem;left:50%;width:3.2rem;height:1rem;margin-left:-1.6rem;background:rgb(255 255 255 / .6);box-shadow:0 1px 2px rgb(0 0 0 / .1);transform:rotate(-4deg)}
[data-vibeui-block="card-124"] span{display:block;aspect-ratio:4/5;overflow:hidden;background:var(--vibeui-card-124-sand)}
[data-vibeui-block="card-124"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="card-124"] small{display:block;font-family:var(--vibeui-card-124-script);font-size:1.15rem;color:var(--vibeui-card-124-accent)}
[data-vibeui-block="card-124"] h3{margin:.1rem 0 .3rem;font-family:var(--vibeui-card-124-display);font-size:1.4rem;font-weight:600;line-height:1.1;text-transform:uppercase}
[data-vibeui-block="card-124"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-124-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-124"] *{animation:none!important;transition:none!important}}
`

/** Карточка образа: фото, кому и название. */
export function Card124({
  who = "Ей",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  title = "Лён, миди, плоская подошва",
  text = "Платье или комбинезон в песке, мяте или коралле. Каблуки утонут — сандалии или босиком.",
  accent,
  className,
  style,
  ...props
}: Card124Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-124-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-124" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-124"
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
