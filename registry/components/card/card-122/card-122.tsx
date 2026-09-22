import type { ComponentProps, CSSProperties } from "react"

export type Card122Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  time?: string
  title?: string
  place?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-122"]){
--vibeui-card-122-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-122-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-card-122-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-122-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-card-122-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-card-122-sea:#2aa7a0;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-122"]{color-scheme:dark}
[data-vibeui-block="card-122"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-122"] *{box-sizing:border-box}
[data-vibeui-block="card-122"]{display:grid;grid-template-columns:4.2rem minmax(0,1fr);gap:.2rem 1rem;padding:.9rem 0;border-bottom:1px dashed var(--vibeui-card-122-line)}
[data-vibeui-block="card-122"]:last-child{border-bottom:0}
[data-vibeui-block="card-122"] time{font-family:var(--vibeui-card-122-display);font-size:1.2rem;font-weight:600;letter-spacing:.04em;color:var(--vibeui-card-122-sea);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-122"] h3{margin:0;font-family:var(--vibeui-card-122-display);font-size:1.3rem;font-weight:600;line-height:1.15;text-transform:uppercase}
[data-vibeui-block="card-122"] h3 span{margin-left:.6rem;font-family:var(--vibeui-card-122-font);font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-card-122-accent)}
[data-vibeui-block="card-122"] p{grid-column:2;margin:0;font-size:.92rem;color:var(--vibeui-card-122-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-122"] *{animation:none!important;transition:none!important}}
`

/** Строка расписания дня: время, заголовок и подпись. */
export function Card122({
  time,
  title,
  place,
  text,
  accent,
  className,
  style,
  ...props
}: Card122Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-122-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-122" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-122"
        className={className}
        style={palette}
      >
        <time>{time}</time>
        <h3>
          {title}
          {place ? <span>{place}</span> : null}
        </h3>
        {text ? <p>{text}</p> : null}
      </li>
    </>
  )
}
