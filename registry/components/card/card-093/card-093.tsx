import type { ComponentProps, CSSProperties } from "react"

export type Card093Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  note?: string
  count?: string
  price?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока realty-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-093"]){
--vibeui-card-093-accent:#b8925a;
--vibeui-card-093-card:light-dark(#fffdf9,#1b2c24);
--vibeui-card-093-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-093-line:light-dark(color-mix(in oklab,#173b2e 14%,#f3ede3),color-mix(in oklab,#eef0ea 14%,#14211b));
--vibeui-card-093-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-card-093-water:light-dark(#d8e2e0,#1f3a3a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-093"]{color-scheme:dark}
[data-vibeui-block="card-093"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-093"] *{box-sizing:border-box}
[data-vibeui-block="card-093"]{display:grid;grid-template-columns:4.5rem minmax(0,1fr) auto;gap:1rem;align-items:center;padding:.75rem;border-radius:.9rem;border:1px solid var(--vibeui-card-093-line);background:var(--vibeui-card-093-card);cursor:pointer;transition:border-color .2s,transform .25s}
[data-vibeui-block="card-093"][data-active],[data-vibeui-block="card-093"]:hover{border-color:var(--vibeui-card-093-accent);transform:translateX(4px)}
[data-vibeui-block="card-093"] [data-part="thumb"]{width:4.5rem;height:3.25rem;border-radius:.5rem;object-fit:cover;background:var(--vibeui-card-093-water)}
[data-vibeui-block="card-093"] b{display:block;font-weight:600}
[data-vibeui-block="card-093"] small{display:block;color:var(--vibeui-card-093-muted);font-size:.8rem}
[data-vibeui-block="card-093"] [data-part="rate"]{text-align:right}
[data-vibeui-block="card-093"] [data-part="rate"] b{font-family:var(--vibeui-card-093-display);font-size:1.35rem;font-weight:600;line-height:1}
[data-vibeui-block="card-093"] [data-part="rate"] small{display:block;color:var(--vibeui-card-093-muted);font-size:.72rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-093"] *{animation:none!important;transition:none!important}}
`

/** Строка списка районов: миниатюра, название с заметкой и цена за м² с числом объектов; активна по data-active. */
export function Card093({
  name = "Петроградская",
  image,
  note,
  count = "164 объекта",
  price = "285 тыс ₽",
  accent,
  className,
  style,
  ...props
}: Card093Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-093-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-093" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-093"
        className={className}
        style={palette}
      >
        {image ? <img data-part="thumb" src={image} alt="" loading="lazy" /> : <span data-part="thumb" aria-hidden="true" />}
        <span>
          <b>{name}</b>
          <small>{note ?? count}</small>
        </span>
        <span data-part="rate">
          <b>{price}</b>
          <small>за м² · {count}</small>
        </span>
      </li>
    </>
  )
}
