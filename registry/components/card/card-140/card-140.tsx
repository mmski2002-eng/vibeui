import type { ComponentProps, CSSProperties } from "react"

export type Card140Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  icon?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS: Record<string, string> = {
  car: "M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM6 17v2M18 17v2M7 14h.01M17 14h.01",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6a1 1 0 0 1 1-1h4v4M13 9V5h4a1 1 0 0 1 1 1v3",
  parking: "M6 4h7a4 4 0 0 1 0 8H9v8H6zM9 7v2h4a1 1 0 0 0 0-2z",
}

// Часть блока map-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-140"]){
--vibeui-card-140-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-140-card:light-dark(#ffffff,#242424);
--vibeui-card-140-display:"Cormorant Garamond",Georgia,serif;
--vibeui-card-140-line:light-dark(color-mix(in oklab,var(--vibeui-card-140-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-card-140-fg) 24%,transparent));
--vibeui-card-140-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-card-140-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-140"]{color-scheme:dark}
[data-vibeui-block="card-140"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-140"] *{box-sizing:border-box}
[data-vibeui-block="card-140"]{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.2rem 1rem;padding:1.2rem 1.3rem;border:1px solid var(--vibeui-card-140-line);border-radius:.9rem;background:var(--vibeui-card-140-card);transition:border-color .3s,box-shadow .3s}
[data-vibeui-block="card-140"]:hover{border-color:rgb(242 182 79 / .4);box-shadow:0 0 30px -12px rgb(242 182 79 / .5)}
[data-vibeui-block="card-140"] svg{grid-row:span 2;width:2.6rem;height:2.6rem;padding:.6rem;border-radius:50%;border:1px solid var(--vibeui-card-140-line);color:var(--vibeui-card-140-accent);fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;box-shadow:0 0 14px -4px var(--vibeui-card-140-accent)}
[data-vibeui-block="card-140"] b{font-family:var(--vibeui-card-140-display);font-size:1.3rem;font-weight:500;line-height:1.15}
[data-vibeui-block="card-140"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-140-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-140"] *{animation:none!important;transition:none!important}}
`

/** Строка «как добраться»: иконка, заголовок и подпись. */
export function Card140({
  title = "На машине",
  icon,
  text = "Час от центра без пробок. Точка в навигаторе — по кнопке выше. Въезд через ворота, охрана знает про свадьбу.",
  accent,
  className,
  style,
  ...props
}: Card140Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-140-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-140" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-140"
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={ICONS[icon ?? ""] ?? ICONS.car} />
        </svg>
        <b>{title}</b>
        <p>{text}</p>
      </li>
    </>
  )
}
