import type { ComponentProps, CSSProperties } from "react"

export type Button102Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  src?: string
  shape?: "rect" | "arch" | "tall"
  caption?: string
  alt?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока portfolio-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-102"]){
--vibeui-button-102-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-102-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-button-102-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-button-102-sand:light-dark(#d9c5a5,#5a4a3a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-102"]{color-scheme:dark}
[data-vibeui-block="button-102"]{box-sizing:border-box}
[data-vibeui-block="button-102"] *{box-sizing:border-box}
[data-vibeui-block="button-102"]{display:block;width:100%;margin:0 0 1rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:zoom-in;break-inside:avoid;text-align:left}
[data-vibeui-block="button-102"]:focus-visible{outline:2px solid var(--vibeui-button-102-accent);outline-offset:4px;border-radius:.6rem}
[data-vibeui-block="button-102"] [data-part="pic"]{display:block;overflow:hidden;border-radius:.6rem;background:var(--vibeui-button-102-sand);aspect-ratio:4/3;transition:transform .45s cubic-bezier(.2,.9,.3,1),box-shadow .45s}
[data-vibeui-block="button-102"][data-shape="arch"] [data-part="pic"]{aspect-ratio:4/5;border-radius:50% 50% .6rem .6rem / 36% 36% .6rem .6rem}
[data-vibeui-block="button-102"][data-shape="tall"] [data-part="pic"]{aspect-ratio:3/4}
[data-vibeui-block="button-102"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.35) saturate(.85) contrast(1.02);transition:filter .6s,transform .6s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="button-102"]:hover [data-part="pic"],[data-vibeui-block="button-102"]:focus-visible [data-part="pic"]{transform:translateY(-.3rem);box-shadow:0 24px 40px -24px rgb(43 26 36 / .6)}
[data-vibeui-block="button-102"]:hover img,[data-vibeui-block="button-102"]:focus-visible img{filter:none;transform:scale(1.04)}
[data-vibeui-block="button-102"] [data-part="cap"]{display:block;padding:.5rem .2rem 0;font-family:var(--vibeui-button-102-display);font-style:italic;font-size:1.05rem;color:var(--vibeui-button-102-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-102"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-плитка галереи: фото и подпись; форма по data-shape. */
export function Button102({
  src = "",
  shape,
  caption,
  alt,
  accent,
  className,
  style,
  ...props
}: Button102Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-102-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-102" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-102" type="button" data-shape={shape ?? "rect"}
        className={className}
        style={palette}
      >
        <span data-part="pic">{src ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null}</span>
        {caption ? <span data-part="cap">{caption}</span> : null}
      </button>
    </>
  )
}
