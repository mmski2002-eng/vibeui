import type { ComponentProps, CSSProperties } from "react"

export type Card136Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  image?: string
  name?: string
  note?: string
  price?: string
  count?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока map-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-136"]){
--vibeui-card-136-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-136-canvas:light-dark(#e7dfd2,#2a2a2a);
--vibeui-card-136-card:light-dark(#fffdf9,#242424);
--vibeui-card-136-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-136-line:color-mix(in oklab,var(--vibeui-card-136-fg) 14%,var(--vibeui-card-136-bg));
--vibeui-card-136-muted:color-mix(in oklab,var(--vibeui-card-136-fg) 62%,var(--vibeui-card-136-bg));
--vibeui-card-136-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-136-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-136"]{color-scheme:dark}
[data-vibeui-block="card-136"]{box-sizing:border-box}
[data-vibeui-block="card-136"] *{box-sizing:border-box}
[data-vibeui-block="card-136"]{display:grid;grid-template-columns:4rem minmax(0,1fr) auto;gap:.9rem;align-items:center;padding:.6rem .9rem .6rem .6rem;border-radius:.9rem;background:var(--vibeui-card-136-card);border:1px solid var(--vibeui-card-136-line);color:inherit;text-decoration:none;transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
[data-vibeui-block="card-136"]:hover,[data-vibeui-block="card-136"][data-active="true"]{transform:translateX(4px);border-color:var(--vibeui-card-136-accent);box-shadow:0 18px 30px -24px rgb(20 33 27 / .5)}
[data-vibeui-block="card-136"]:focus-visible{outline:2px solid var(--vibeui-card-136-accent);outline-offset:2px}
[data-vibeui-block="card-136"] [data-part="thumb"]{width:4rem;height:3rem;border-radius:.5rem;object-fit:cover;background:var(--vibeui-card-136-canvas)}
[data-vibeui-block="card-136"] [data-part="name"]{display:block;font-weight:600}
[data-vibeui-block="card-136"] [data-part="note"]{display:block;font-size:.78rem;color:var(--vibeui-card-136-muted)}
[data-vibeui-block="card-136"] [data-part="price"]{text-align:right}
[data-vibeui-block="card-136"] [data-part="price"] b{display:block;font-family:var(--vibeui-card-136-display);font-size:1.35rem;font-weight:600;line-height:1;color:var(--vibeui-card-136-accent)}
[data-vibeui-block="card-136"] [data-part="price"] span{display:block;font-size:.72rem;color:var(--vibeui-card-136-muted);margin-top:.2rem;white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-136"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-карточка объекта рядом с картой: миниатюра, название с заметкой, цена и число; активна по data-active. */
export function Card136({
  href,
  image,
  name = "Петроградская",
  note,
  price = "285 тыс ₽",
  count,
  accent,
  className,
  style,
  ...props
}: Card136Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-136-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-136" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="card"
        data-vibeui-block="card-136"
        href={href ?? "#"}
        className={className}
        style={palette}
      >
        {image ? <img data-part="thumb" src={image} alt="" loading="lazy" /> : <span data-part="thumb" />}
        <span>
          <span data-part="name">{name}</span>
          {note ? <span data-part="note">{note}</span> : null}
        </span>
        <span data-part="price">
          <b>{price}</b>
          {count ? <span>{count}</span> : null}
        </span>
      </a>
    </>
  )
}
