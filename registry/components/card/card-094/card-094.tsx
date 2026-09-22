import type { ComponentProps, CSSProperties } from "react"

export type Card094Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  text?: string
  time?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока realty-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-094"]){
--vibeui-card-094-accent:#f2f2f2;
--vibeui-card-094-bg:light-dark(#1a1a1a,#0f0f0f);
--vibeui-card-094-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-094-muted:color-mix(in oklab,var(--vibeui-card-094-fg) 68%,transparent);
--vibeui-card-094-fg:#f2f2f2;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-094"]{color-scheme:dark}
[data-vibeui-block="card-094"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-094"] *{box-sizing:border-box}
[data-vibeui-block="card-094"]{position:relative}
[data-vibeui-block="card-094"] [data-part="num"]{position:absolute;left:-2.5rem;top:-.35rem;width:1.8rem;height:1.8rem;display:grid;place-items:center;border-radius:50%;background:var(--vibeui-card-094-bg);border:1px solid var(--vibeui-card-094-accent);font-family:var(--vibeui-card-094-display);font-size:1rem;font-weight:600;color:var(--vibeui-card-094-accent)}
[data-vibeui-block="card-094"] h3{margin:0 0 .35rem;font-family:var(--vibeui-card-094-display);font-size:1.5rem;font-weight:600;line-height:1.1}
[data-vibeui-block="card-094"] p{margin:0;color:var(--vibeui-card-094-muted);max-width:26rem}
[data-vibeui-block="card-094"] [data-part="time"]{display:inline-block;margin-top:.6rem;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-card-094-accent)}
@container (min-width: 60rem){
[data-vibeui-block="card-094"] [data-part="num"]{position:static;width:1.8rem;height:1.8rem;margin:-3.9rem 0 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-094"] *{animation:none!important;transition:none!important}}
`

/** Шаг сделки с недвижимостью: номер, заголовок и описание. */
export function Card094({
  title = "Разговор",
  text = "Слушаем, зачем вам квартира и на сколько лет. Согласуем бюджет и районы.",
  time = "Шаг сделки",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card094Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-094-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-094" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-094"
        className={className}
        style={palette}
      >
        <span data-part="num" aria-hidden="true">
          {index + 1}
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
        {time ? <span data-part="time">{time}</span> : null}
      </li>
    </>
  )
}
