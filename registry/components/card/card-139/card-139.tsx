import type { ComponentProps, CSSProperties } from "react"

export type Card139Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  code?: string
  title?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока map-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-139"]){
--vibeui-card-139-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-card-139-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-card-139-paper:light-dark(#fffaf0,#1a1a1a);
--vibeui-card-139-sea:#2aa7a0;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-139"]{color-scheme:dark}
[data-vibeui-block="card-139"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-139"] *{box-sizing:border-box}
[data-vibeui-block="card-139"]{display:grid;grid-template-columns:3.2rem minmax(0,1fr);gap:.1rem .9rem;padding:.8rem .9rem;border-radius:.7rem;background:var(--vibeui-card-139-paper)}
[data-vibeui-block="card-139"] b{grid-row:1 / span 2;align-self:center;font-family:var(--vibeui-card-139-display);font-size:1.15rem;font-weight:700;letter-spacing:.08em;color:var(--vibeui-card-139-sea)}
[data-vibeui-block="card-139"] h3{margin:0;font-family:var(--vibeui-card-139-display);font-size:1.05rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
[data-vibeui-block="card-139"] p{margin:0;font-size:.88rem;color:var(--vibeui-card-139-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-139"] *{animation:none!important;transition:none!important}}
`

/** Карточка точки: код, название, адрес и часы. */
export function Card139({
  code = "CYO",
  title = "Отель на Кайо-Ларго",
  text = "Бунгало у воды, все номера наши на две ночи",
  accent,
  className,
  style,
  ...props
}: Card139Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-139-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-139" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-139"
        className={className}
        style={palette}
      >
        <b>{code}</b>
        <h3>{title}</h3>
        <p>{text}</p>
      </li>
    </>
  )
}
