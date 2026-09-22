import type { ComponentProps, CSSProperties } from "react"

export type Card044Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  point?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-044"]){

}
[data-vibeui-block="card-044"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-044"] *{box-sizing:border-box}
[data-vibeui-block="card-044"]{display:flex;gap:0.625rem;align-items:baseline;
font-size:0.9375rem;line-height:1.5;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-044"] *{animation:none!important;transition:none!important}}
`

/** Строка списка сравнения «было — стало»: метка-маркер и текст; тон маркера задаёт колонка. */
export function Card044({
  point = "Пункт «до / после»",
  accent,
  className,
  style,
  ...props
}: Card044Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-044-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-044" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-044"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          —
        </span>
        {point}
      </li>
    </>
  )
}
