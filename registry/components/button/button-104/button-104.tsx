import type { ComponentProps, CSSProperties } from "react"

export type Button104Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  src?: string
  shape?: "rect" | "tall" | "square" | "wide"
  caption?: string
  alt?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока portfolio-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-104"]){
--vibeui-button-104-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-104-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-104-card:light-dark(#ffffff,#242424);
--vibeui-button-104-line:light-dark(color-mix(in oklab,var(--vibeui-button-104-fg) 20%,transparent),color-mix(in oklab,var(--vibeui-button-104-fg) 35%,transparent));
--vibeui-button-104-script:"Marck Script","Segoe Script",cursive;
--vibeui-button-104-silver:#9fb0c8;
--vibeui-button-104-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-104"]{color-scheme:dark}
[data-vibeui-block="button-104"]{box-sizing:border-box}
[data-vibeui-block="button-104"] *{box-sizing:border-box}
[data-vibeui-block="button-104"]{position:relative;display:block;width:100%;margin:0;padding:.4rem;border:1px solid var(--vibeui-button-104-line);border-radius:.5rem;background:var(--vibeui-button-104-card);color:inherit;font:inherit;text-align:left;cursor:pointer;box-shadow:0 24px 44px -34px rgb(0 0 0 / .9);transition:transform .45s cubic-bezier(.2,.9,.3,1),box-shadow .45s,border-color .45s}
[data-vibeui-block="button-104"]:hover{transform:translateY(-.25rem);border-color:rgb(242 182 79 / .5);box-shadow:0 30px 50px -30px rgb(242 182 79 / .35)}
[data-vibeui-block="button-104"]:focus-visible{outline:2px solid var(--vibeui-button-104-accent);outline-offset:3px}
[data-vibeui-block="button-104"][data-shape="wide"]{grid-column:span 2}
[data-vibeui-block="button-104"] [data-part="pic"]{position:relative;display:block;aspect-ratio:3/2;overflow:hidden;border-radius:.25rem;background:var(--vibeui-button-104-bg)}
[data-vibeui-block="button-104"][data-shape="tall"] [data-part="pic"]{aspect-ratio:4/5}
[data-vibeui-block="button-104"][data-shape="square"] [data-part="pic"]{aspect-ratio:1}
[data-vibeui-block="button-104"][data-shape="wide"] [data-part="pic"]{aspect-ratio:2/1}
[data-vibeui-block="button-104"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;transform:scale(1);transition:transform .8s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="button-104"]:hover img{transform:scale(1.06)}
[data-vibeui-block="button-104"] [data-part="cap"]{display:block;padding:.6rem .3rem .2rem;font-family:var(--vibeui-button-104-script);font-size:1.15rem;color:var(--vibeui-button-104-silver);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.75;transition:opacity .35s}
[data-vibeui-block="button-104"]:hover [data-part="cap"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-104"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-плитка мозаики: фото и подпись; форма по data-shape. */
export function Button104({
  src = "/demo/realty/object-03.webp",
  shape = "rect",
  caption = "Плитка мозаики фото",
  alt = "Плитка мозаики фото",
  accent,
  className,
  style,
  ...props
}: Button104Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-104-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-104" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-104" type="button" data-shape={shape ?? "rect"}
        className={className}
        style={palette}
      >
        <span data-part="pic">
          {src ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null}
        </span>
        {caption ? <span data-part="cap">{caption}</span> : null}
      </button>
    </>
  )
}
