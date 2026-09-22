import type { ComponentProps, CSSProperties } from "react"

export type Card138Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  mode?: string
  icon?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS: Record<string, string> = {
  car: "M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v5H4zM7 18v2M17 18v2M7.5 15.5h.01M16.5 15.5h.01",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  taxi: "M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v5H4zM7 18v2M17 18v2M9 7V5h6v2",
  train: "M6 4h12a1 1 0 0 1 1 1v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1zM5 10h14M8 18l-2 3M16 18l2 3M9 14h.01M15 14h.01",
}

// Часть блока map-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-138"]){
--vibeui-card-138-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-138-card:light-dark(#fffaf3,#242424);
--vibeui-card-138-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-138-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-card-138-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-card-138-plum:var(--vibeui-card-138-fg);
--vibeui-card-138-sage:#8a9a7b;
--vibeui-card-138-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-138"]{color-scheme:dark}
[data-vibeui-block="card-138"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-138"] *{box-sizing:border-box}
[data-vibeui-block="card-138"]{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.9rem;padding:1.2rem;border:1px solid var(--vibeui-card-138-line);border-radius:1rem;background:var(--vibeui-card-138-card);transition:transform .25s,border-color .25s}
[data-vibeui-block="card-138"]:hover{transform:translateY(-2px);border-color:var(--vibeui-card-138-accent)}
[data-vibeui-block="card-138"] svg{width:2.6rem;height:2.6rem;padding:.6rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-card-138-sage) 18%,transparent);color:var(--vibeui-card-138-plum);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="card-138"] h3{margin:0 0 .2rem;font-family:var(--vibeui-card-138-display);font-size:1.35rem;font-weight:500;line-height:1.15}
[data-vibeui-block="card-138"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-138-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-138"] *{animation:none!important;transition:none!important}}
`

/** Строка «как добраться»: иконка транспорта, заголовок и время в пути. */
export function Card138({
  mode = "На машине",
  icon = "Способ добраться",
  text = "45 минут от МКАД по Дмитровскому шоссе. Парковка у ворот усадьбы, бесплатно.",
  accent,
  className,
  style,
  ...props
}: Card138Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-138-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-138" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-138"
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={ICONS[icon ?? ""] ?? ICONS.car} />
        </svg>
        <div>
          <h3>{mode}</h3>
          <p>{text}</p>
        </div>
      </li>
    </>
  )
}
