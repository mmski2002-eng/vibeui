import type { ComponentProps, CSSProperties } from "react"

export type Card134Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  alt?: string
  role?: string
  quote?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-134"]){
--vibeui-card-134-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-134-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-card-134-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-134-line:color-mix(in oklab,var(--vibeui-card-134-fg) 16%,transparent);
--vibeui-card-134-muted:color-mix(in oklab,var(--vibeui-card-134-fg) 62%,var(--vibeui-card-134-bg));
--vibeui-card-134-paper:color-mix(in oklab,var(--vibeui-card-134-fg) 5%,var(--vibeui-card-134-bg));
--vibeui-card-134-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-134"]{color-scheme:dark}
[data-vibeui-block="card-134"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-134"] *{box-sizing:border-box}
@keyframes vibeui-card-134-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-134"]{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.2rem;align-items:start}
[data-vibeui-block="card-134"] [data-part="polaroid"]{margin:0;padding:.4rem .4rem 1.8rem;background:var(--vibeui-card-134-bg);box-shadow:0 14px 30px -18px rgb(0 0 0 / .5);border:1px solid var(--vibeui-card-134-line);transform:rotate(var(--vibeui-card-134-r));transition:transform .4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-134"]:hover [data-part="polaroid"]{transform:rotate(0) scale(1.03)}
[data-vibeui-block="card-134"] [data-part="polaroid"] div{aspect-ratio:4/5;overflow:hidden;background:var(--vibeui-card-134-paper)}
[data-vibeui-block="card-134"] [data-part="polaroid"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="card-134"] [data-part="polaroid"] figcaption{margin:.4rem 0 -1.4rem;font-family:var(--vibeui-card-134-hand);font-size:1.15rem;line-height:1;text-align:center}
[data-vibeui-block="card-134"] [data-part="who"]{margin:0;font-family:var(--vibeui-card-134-display);font-weight:600;font-size:1.4rem;line-height:1.1}
[data-vibeui-block="card-134"] [data-part="role"]{margin:.2rem 0 .6rem;font-size:.82rem;color:var(--vibeui-card-134-muted)}
[data-vibeui-block="card-134"] [data-part="quote"]{margin:0;font-family:var(--vibeui-card-134-display);font-style:italic;font-size:1.2rem;line-height:1.3}
[data-vibeui-block="card-134"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-134"] [data-part="quote"]::after{content:"»"}
@supports (animation-timeline: view()){
[data-vibeui-block="card-134"]{animation:vibeui-card-134-in linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-134"] *{animation:none!important;transition:none!important}}
`

/** Карточка человека: полароид с именем, имя, роль и цитата; наклон через переменную. */
export function Card134({
  name = "Вера Лапина",
  image = "/demo/flowers/florist-01.webp",
  alt = "Карточка с полароидом",
  role = "основатель, флорист",
  quote = "Букет должен пахнуть садом, а не магазином.",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card134Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-134-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-134" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-134"
        className={className}
        style={palette}
      >
        <figure data-part="polaroid" style={{ ["--vibeui-card-134-r" as string]: `${index % 2 ? 2.5 : -2.5}deg` }}>
          <div>
            <img src={image} alt={alt ?? name} loading="lazy" />
          </div>
          <figcaption>{name.split(" ")[0]}</figcaption>
        </figure>
        <div>
          <p data-part="who">{name}</p>
          <p data-part="role">{role}</p>
          <p data-part="quote">{quote}</p>
        </div>
      </li>
    </>
  )
}
