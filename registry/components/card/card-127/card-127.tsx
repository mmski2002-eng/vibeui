import type { ComponentProps, CSSProperties } from "react"

export type Card127Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  src?: string
  span?: "big" | "wide" | "tall"
  alt?: string
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока portfolio-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-127"]){
--vibeui-card-127-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-127-hand:"Caveat",cursive;
--vibeui-card-127-panel:color-mix(in oklab,var(--vibeui-card-127-fg) 6%,var(--vibeui-card-127-bg));
--vibeui-card-127-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-127-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-127"]{color-scheme:dark}
[data-vibeui-block="card-127"]{box-sizing:border-box;position:relative;min-height:12rem}
[data-vibeui-block="card-127"] *{box-sizing:border-box}
@keyframes vibeui-card-127-in{from{opacity:0;translate:0 2.5rem;scale:.94}to{opacity:1;translate:0 0;scale:1}}
@keyframes vibeui-card-127-drift{from{translate:0 -5%}to{translate:0 5%}}
[data-vibeui-block="card-127"]{position:relative;margin:0;border-radius:1.2rem;overflow:clip;background:var(--vibeui-card-127-panel);transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s;z-index:0}
[data-vibeui-block="card-127"] img{position:absolute;left:0;right:0;top:-7%;width:100%;height:114%;object-fit:cover;display:block;transition:scale .8s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-127"]:hover{transform:scale(1.04);z-index:2;box-shadow:0 30px 60px -30px color-mix(in oklab,var(--vibeui-card-127-accent) 40%,rgb(0 0 0 / .7))}
[data-vibeui-block="card-127"]:hover img{scale:1.08}
[data-vibeui-block="card-127"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(60% 60% at 30% 20%,rgb(255 255 255 / .18),transparent 70%);opacity:0;transition:opacity .45s}
[data-vibeui-block="card-127"]:hover::after{opacity:1}
[data-vibeui-block="card-127"] figcaption{position:absolute;left:.8rem;bottom:.7rem;font-family:var(--vibeui-card-127-hand);font-size:1.3rem;color:#fff;text-shadow:0 1px 10px rgb(0 0 0 / .55);transform:rotate(-3deg) translateY(.4rem);opacity:0;transition:opacity .3s,transform .3s}
[data-vibeui-block="card-127"]:hover figcaption{opacity:1;transform:rotate(-3deg)}
[data-vibeui-block="card-127"][data-span="big"]{grid-column:span 2;grid-row:span 2}
[data-vibeui-block="card-127"][data-span="wide"]{grid-column:span 2}
[data-vibeui-block="card-127"][data-span="tall"]{grid-row:span 2}
@supports (animation-timeline: view()){
[data-vibeui-block="card-127"]{animation:vibeui-card-127-in linear both;animation-timeline:view();animation-range:entry 0% entry 55%}
[data-vibeui-block="card-127"] img{animation:vibeui-card-127-drift linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
}
@media (hover:none){
[data-vibeui-block="card-127"] figcaption{opacity:1;transform:rotate(-3deg)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-127"] *{animation:none!important;transition:none!important}}
`

/** Кадр с фото на всю плитку и подписью; размер плитки по data-span. */
export function Card127({
  src = "/demo/bakery/hands-flour.webp",
  span = "big",
  alt = "Кадр bento-портфолио",
  note = "5:40, формовка",
  accent,
  className,
  style,
  ...props
}: Card127Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-127-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-127" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-127" data-span={span}
        className={className}
        style={palette}
      >
        <img src={src} alt={alt ?? ""} loading="lazy" />
        {note ? <figcaption>{note}</figcaption> : null}
      </figure>
    </>
  )
}
